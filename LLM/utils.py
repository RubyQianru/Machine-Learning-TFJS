import tensorflow as tf
import tensorflow_text as text
import numpy as np
from tensorflow import keras
from tensorflow.keras import layers


# Dummy dataset
corpus = [
    "This is the first sentence.",
    "Another example sentence.",
    "Yet another one."
]

# Tokenize the text
def tokenizer (corpus):
    
    tokenizer = text.WhitespaceTokenizer()
    tokenized_corpus = [tokenizer.tokenize(sentence) for sentence in corpus]

    return tokenized_corpus 

# Build vocabulary
def vocabularyBuilder(tokenized_corpus):
    # Convert EagerTensor to list of strings
    tokenized_corpus_strings = [tf.strings.reduce_join(tokenized_sentence, axis=-1, separator=' ').numpy().decode('utf-8') for tokenized_sentence in tokenized_corpus]
    
    vocab = tf.keras.preprocessing.text.Tokenizer(filters='', oov_token="<OOV>")
    vocab.fit_on_texts(tokenized_corpus_strings)
    vocab_size = len(vocab.word_index) + 1

    return vocab, vocab_size

# Convert sentences to sequences
def converter(vocab, tokenized_corpus):
    tokenized_corpus_strings = [tf.strings.reduce_join(tokenized_sentence, axis=-1, separator=' ').numpy().decode('utf-8') for tokenized_sentence in tokenized_corpus]
    sequences = vocab.texts_to_sequences(tokenized_corpus_strings)

    return sequences

# Create input-output pairs for training
def preprecessData(sequences):
    input_sequences = [seq[:-1] for seq in sequences]
    output_sequences = [seq[1:] for seq in sequences]

    # Pad sequences for a consistent input size
    max_len = max(len(seq) for seq in sequences)
    input_sequences = keras.preprocessing.sequence.pad_sequences(input_sequences, maxlen=max_len, padding='post')
    output_sequences = keras.preprocessing.sequence.pad_sequences(output_sequences, maxlen=max_len, padding='post')

    return input_sequences, output_sequences

def buildModel(vocab_size, max_len=249):

    inputs = tf.keras.Input(shape=(max_len,))
    x = layers.Embedding(input_dim=vocab_size, output_dim=256, input_length=max_len)(inputs)
    
    # Use Transformer layer from tf.keras.layers.experimental
    x = tf.keras.layers.MultiHeadAttention(num_heads=2, key_dim=256)(x, x)
    x = tf.keras.layers.Dropout(0.1)(x)
    x = tf.keras.layers.LayerNormalization(epsilon=1e-6)(x)

    outputs = layers.Dense(vocab_size, activation='softmax')(x)

    model = tf.keras.Model(inputs=inputs, outputs=outputs)
    return model

def compileModel(model):

    model.compile(
        optimizer='adam', 
        loss='sparse_categorical_crossentropy', 
        metrics=['accuracy'])
    
    return model

# Train the model
def fitModel(model, input_sequences, output_sequences, epochs=10):
    history = model.fit(
        input_sequences, 
        np.expand_dims(output_sequences, -1), 
        epochs)
    
    return history

# Save the model
def saveModel(model):
    model.save("transformer_model")

def generateText(model, tokenizer, seed_text, max_length=5, temperature=1.0):
    for _ in range(max_length):
        # Tokenize the seed text
        tokenized_seed = tokenizer.texts_to_sequences([seed_text])[0]
        # Pad the sequence
        tokenized_seed = tf.keras.preprocessing.sequence.pad_sequences([tokenized_seed], maxlen=max_length-1, padding='post')
        # Predict the next word probabilities
        predictions = model.predict(tokenized_seed)
        # Flatten the predictions
        predictions_flat = predictions[:, -1, :].flatten()  # Take the last time step and flatten
        # Normalize the probabilities
        predictions_flat /= np.sum(predictions_flat)
        # Sample the next word using the normalized predicted probabilities and temperature
        predicted_id = np.random.choice(len(predictions_flat), p=predictions_flat)
        # Map the predicted id to the word
        predicted_word = tokenizer.index_word.get(predicted_id, "<OOV>")
        # Update the seed text for the next iteration
        seed_text += " " + predicted_word
    return seed_text


    
