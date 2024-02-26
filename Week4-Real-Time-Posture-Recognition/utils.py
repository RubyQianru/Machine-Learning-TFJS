import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
import matplotlib.pyplot as plt
import json

def load_data(explore=True):
    # Load JSON data from the file
    with open("data.json", "r") as file:
        json_data = json.load(file)

    # Extract xs and ys from each dictionary
    x_data = [sample['xs'] for sample in json_data['data']]
    y_data = [sample['ys'] for sample in json_data['data']]

    # Assuming you want to convert 'r' to 1 and other values to 0
    y_data = [1 if label == 'r' else 0 for label in y_data]

    # Split the data into training and testing sets (you may need to adjust the split ratio)
    split_idx = int(len(x_data) * 0.8)
    x_train, y_train = x_data[:split_idx], y_data[:split_idx]
    x_test, y_test = x_data[split_idx:], y_data[split_idx:]

    return np.array(x_train), np.array(y_train), np.array(x_test), np.array(y_test)

def preprocess_data(x_train, y_train, x_test, y_test, val_size=10000):

    # Normalize the data to be within the range [0,1]

    x_train = x_train.reshape(-1, 28 * 28).astype("float32") / 255
    x_test = x_test.reshape(-1, 28 * 28).astype("float32") / 255

    y_train = y_train.astype("float32") 
    y_test = y_test.astype("float32") 
    
    # Slice the training data into train and validation sets, 
    # where the validation set is the same size as the test set
    x_train, x_val = x_train[:-val_size], x_train[-val_size:]
    y_train, y_val = y_train[:-val_size], y_train[-val_size:]


    return x_train, y_train, x_val, y_val, x_test, y_test

    pass # remove after completing code


def explore_data(x_train, y_train, x_test, y_test):

    # define the class names
    class_names = ['T-shirt/top', 'Trouser', 'Pullover', 'Dress', 'Coat',
                'Sandal', 'Shirt', 'Sneaker', 'Bag', 'Ankle boot']

    # plot the distribution of classes in the training, validation, and test sets
    fig, ax = plt.subplots(1, 2, figsize=(10, 5))

    # plot the distribution of classes in the training set
    train_class_counts = np.bincount(y_train)
    ax[0].bar(range(10), train_class_counts)
    ax[0].set_xticks(range(10))
    ax[0].set_xticklabels(class_names, rotation=45)
    ax[0].set_title('Training set')

    # plot the distribution of classes in the test set
    test_class_counts = np.bincount(y_test)
    ax[1].bar(range(10), test_class_counts)
    ax[1].set_xticks(range(10))
    ax[1].set_xticklabels(class_names, rotation=45)
    ax[1].set_title('Test set')

    plt.show()

    print(" ")  # add space between figures

    # plot a sample of the images
    plt.figure(figsize=(10,10))
    for i in range(25):
        plt.subplot(5,5,i+1)
        plt.xticks([])
        plt.yticks([])
        plt.grid(False)
        plt.imshow(x_train[i], cmap=plt.cm.binary)
        plt.xlabel(class_names[y_train[i]])
    plt.show()


def build_model():
    """
    Build a Keras sequential model using Dense layers, and compile it with an optimizer and a sparse_categorical_crossentropy loss.
    The model should have two layers, and the last layer should use a softmax activation and should have the correct output dimension. 
    Compile the model to use the adam optimizer and a sparse_categorical_crossentropy loss. Accuracy should be monitored during training.

    Returns:
    model (Sequential)

    """

    # YOUR CODE HERE

    model = keras.Sequential([
        layers.Dense(512, activation="relu"),
        layers.Dense(10, activation="softmax")
    ])

    model.compile(optimizer="adam",
              loss="sparse_categorical_crossentropy",
              metrics=["accuracy"])
    
    return model

    pass


def train_model(model, x_train, y_train, x_val, y_val, epochs=5, batch_size=32):
    # train the model using train and validation sets
    history = model.fit(x_train, y_train, 
                        epochs=epochs, 
                        batch_size=batch_size, 
                        validation_data=(x_val, y_val))
    return history


def plot_loss(history):
    # plot the training and validation loss side by side
    fig, ax = plt.subplots(1, 2, figsize=(10, 5))

    # plot the training and validation loss
    ax[0].plot(history.history['loss'], label='train')
    ax[0].plot(history.history['val_loss'], label='val')
    ax[0].set_xlabel('Epoch')
    ax[0].set_ylabel('Loss')
    ax[0].legend()

    # plot the training and validation accuracy
    ax[1].plot(history.history['accuracy'], label='train')
    ax[1].plot(history.history['val_accuracy'], label='val')
    ax[1].set_xlabel('Epoch')
    ax[1].set_ylabel('Accuracy')
    ax[1].legend()


def test_model(model, x_test, y_test):
    """
    Test the accuracy of a trained model on a given test set.

    Parameters:
    model (keras.engine.sequential.Sequential): A trained Keras sequential model.
    x_test (np.ndarray): The input test data.
    y_test (np.ndarray): The ground truth test labels.

    Returns:
    test_acc (float): The test accuracy.
    y_pred (np.ndarray): The predicted labels of the test set.

    """
    # YOUR CODE HERE

    # Make predictions using the model
    predictions = model.predict(x_test)
    # plt.imshow(predictions)

    # Convert the predicted probabilities to class labels
    y_pred = np.argmax(predictions, axis=1)

    # Calculate the accuracy by comparing the predicted labels with the ground truth labels and computing the mean
    test_loss, test_acc = model.evaluate(x_test, y_test)

    # Print the result
    return test_acc, y_pred

    pass


