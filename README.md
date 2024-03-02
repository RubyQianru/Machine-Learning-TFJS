# Machine Learning
- This is the repo for the Machine Learning for TensorFlow, TensorFlowJS experiments in Computer Vision. This class features experiments with browser-based machine learning.
# AI Live Meeting
- What problem am I trying to address? I noticed the difficulty to **quickly interact with peers** during multi-user livestream videos (e.g. Zoom, Google meet). For example, in a online class scenario, if a user want to raise hand to ask a question, the user has to click the **emoji button -> select emoji -> deselect emoji (three steps)** to complete the user flow of interaction with the professor.
- How can AI help to solve this problem? An AI algorithm, potentially computer vision to classify users’ hand postures, and to directly emit signals to the peers.
- What data is needed to create an AI to help address the issue? A series of input data that is able to precisely conclude humans’ hand postures.
## Data Collection
- Prototype: [Link](https://editor.p5js.org/qz2432/sketches/dRK9sis7h)
- The prototype is based on [Daniel Shiffman's The Coding Train](https://thecodingtrain.com/Courses/ml5-beginners-guide/7.2-pose-classification.html). I reduced data collection wait time, and extended data collection time, so that the data collection system can automatically input more data samples at a time. This design upgraded the user experience of data collection.
## Model Training
- Deep Learning model trained with Jupyter Notebook: [Link](https://github.com/RubyQianru/Machine-Learning-TFJS/tree/main/Week5-Real-Time-Handpose-Recognition/ML)
- Model summary:
```
Model: "sequential"
_________________________________________________________________
 Layer (type)                Output Shape              Param #   
=================================================================
 dense (Dense)               (None, 32)                2048      
                                                                 
 dense_1 (Dense)             (None, 4)                 132       
                                                                 
=================================================================
Total params: 2180 (8.52 KB)
Trainable params: 2180 (8.52 KB)
Non-trainable params: 0 (0.00 Byte)
_________________________________________________________________
```


