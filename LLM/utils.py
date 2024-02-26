import tensorflow as tf
import tensorflow_text as text
import numpy as np

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
    tokenized_corpus_strings = [' '.join(tokenized_sentence) for tokenized_sentence in tokenized_corpus]
    
    vocab = tf.keras.preprocessing.text.Tokenizer(filters='', oov_token="<OOV>")
    vocab.fit_on_texts(tokenized_corpus_strings)
    vocab_size = len(vocab.word_index) + 1

    return vocab, vocab_size

# Convert sentences to sequences
def converter(vocab, tokenized_corpus):
    sequences = vocab.texts_to_sequences(tokenized_corpus)
    return sequences

# Create input-output pairs for training
def preprecessData(sequences):
    input_sequences = [seq[:-1] for seq in sequences]
    output_sequences = [seq[1:] for seq in sequences]

    # Pad sequences for a consistent input size
    max_len = max(len(seq) for seq in sequences)
    input_sequences = tf.keras.preprocessing.sequence.pad_sequences(input_sequences, maxlen=max_len, padding='post')
    output_sequences = tf.keras.preprocessing.sequence.pad_sequences(output_sequences, maxlen=max_len, padding='post')

    return input_sequences, output_sequences

def buildModel(vocab_size, max_length=100):

    model = tf.keras.Sequential([
        tf.keras.layers.Embedding(input_dim=vocab_size, output_dim=256, input_length=max_len),
        tf.keras.layers.Transformer(num_heads=2, d_model=256, num_layers=2, activation='relu'),
        tf.keras.layers.Dense(vocab_size, activation='softmax')
    ])

    return model

def combileModel(model):

    model.compile(
        optimizer='adam', 
        loss='sparse_categorical_crossentropy', 
        metrics=['accuracy'])
    
    return model

# Train the model
def fitModel(model, input_sequences, output_sequences, epochs=10):
    model.fit(input_sequences, np.expand_dims(output_sequences, -1), epochs)
    return model

# Save the model
def saveModel(model):
    model.save("transformer_model")
