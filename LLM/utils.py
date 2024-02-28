import tensorflow as tf
import numpy as np

Tokenizer = tf.keras.preprocessing.text.Tokenizer
pad_sequences = tf.keras.preprocessing.sequence.pad_sequences
Sequential = tf.keras.models.Sequential
Embedding = tf.keras.layers.Embedding
SimpleRNN = tf.keras.layers.SimpleRNN
Dense = tf.keras.layers.Dense
LSTM = tf.keras.layers.LSTM
Dropout = tf.keras.layers.Dropout

def tokenizer(data):
    tokenizer = Tokenizer(char_level=True, lower=True)
    tokenizer.fit_on_texts(data)
    return tokenizer 

# # Build vocabulary
# def vocabularyBuilder(tokenized_corpus):
#     # Convert EagerTensor to list of strings
#     tokenized_corpus_strings = [tf.strings.reduce_join(tokenized_sentence, axis=-1, separator=' ').numpy().decode('utf-8') for tokenized_sentence in tokenized_corpus]
    
#     vocab = tf.keras.preprocessing.text.Tokenizer(filters='', oov_token="<OOV>")
#     vocab.fit_on_texts(tokenized_corpus_strings)
#     vocab_size = len(vocab.word_index) + 1

#     return vocab, vocab_size

def vocabBuilder(tokenizer):

    vocab_size = len(tokenizer.word_index) + 1
    
    return vocab_size

# Convert sentences to sequences
def converter(tokenizer, data):

    sequences = tokenizer.texts_to_sequences(data)[0]

    return sequences

# Create input-output pairs for training
def preprecessData(sequences, sequence_length):

    input_sequences = []
    output_sequences = []

    for i in range(len(sequences) - sequence_length):
        input_sequences.append(sequences[i:i + sequence_length])
        output_sequences.append(sequences[i + sequence_length])

    input_sequences = np.array(input_sequences)
    output_sequences = np.array(output_sequences)

    return input_sequences, output_sequences

def buildModel(vocab_size, sequence_length):

    model = Sequential([
    Embedding(vocab_size, 32, input_length=sequence_length),
    LSTM(128, return_sequences=True, dropout=0.2, recurrent_dropout=0.2),
    LSTM(128, dropout=0.2, recurrent_dropout=0.2),
    Dense(vocab_size, activation="softmax"),
])
    
    return model

def compileModel(model):

    model.compile(
        optimizer='adam', 
        loss='sparse_categorical_crossentropy', 
        metrics=['accuracy'])
    
    return model

# Train the model
def fitModel(model, input_sequences, output_sequences, epochs=10, batch_size=32):

    history = model.fit(
        input_sequences, 
        output_sequences, 
        epochs=epochs, 
        batch_size=batch_size)
    
    return history

# Save the model
def saveModel(model):
    model.save("transformer_model")

def generate_text(seed_text, model, tokenizer, sequence_length, num_chars_to_generate):
    generated_text = seed_text

    for _ in range(num_chars_to_generate):
        token_list = tokenizer.texts_to_sequences([generated_text])
        token_list = pad_sequences(token_list, maxlen=sequence_length, padding="pre")
        predicted_probs = model.predict(token_list, verbose=0)
        predicted_token = np.argmax(predicted_probs, axis=-1)[0]  # Get the index of the predicted token

        output_word = ""
        for word, index in tokenizer.word_index.items():
            if index == predicted_token:
                output_word = word
                break

        generated_text += output_word

    return generated_text


    
