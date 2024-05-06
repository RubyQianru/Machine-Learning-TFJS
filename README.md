# Machine Learning
- This is the repo for the Machine Learning for TensorFlow, TensorFlowJS experiments in Computer Vision. This class features experiments with browser-based machine learning.

# AI Live Meeting

### Preview

<img src="https://github.com/RubyQianru/Machine-Learning-TFJS/assets/142470034/bcc99473-9c82-42c4-9361-49b62668165e" width="400">
<img src="https://github.com/RubyQianru/Machine-Learning-TFJS/assets/142470034/d6e65d93-d495-4b84-a860-ce1972063f38" width="400">
<img src="https://github.com/RubyQianru/Machine-Learning-TFJS/assets/142470034/b9fc581d-72ef-4297-b607-76cf77dcef4c" width="400">
<img src="https://github.com/RubyQianru/Machine-Learning-TFJS/assets/142470034/8222b9be-dd75-41dc-8157-1beedfaf1832" width="400">

User testings with two classes of 20+ students.

### Tech Stack
<a href="https://skillicons.dev" class="image-link"><img src="https://skillicons.dev/icons?i=js,python,html,css,p5js,express,nodejs,tensorflow"></a>
### Responsibility
- Spearheading real-time HTTPS communication for web and mobile, enabling live video transmission and AI prediction.
- Implemented neural networks leveraging TensorFlow hand pose recognition, achieving 80%+ accuracy in classification.
- Integrated automated data collection system, enhancing user experience, and boosting operational efficiency by 50%.
## Design Thinking
- **What problem am I trying to address❓** I noticed the difficulty to **quickly interact with peers** during multi-user livestream videos (e.g. Zoom, Google meet). For example, in a online class scenario, if a user want to raise hand to ask a question, the user has to click the **emoji button -> select emoji -> deselect emoji (three steps)** to complete the user flow of interaction with the professor.
- **How can AI help to solve this problem ❓** An AI algorithm, potentially computer vision to classify users’ hand postures, and to directly emit signals to the peers.
- **What data is needed to create an AI to help address the issue ❓** A series of input data that is able to precisely conclude humans’ hand postures.
## Data Collection

### First prototype

[Link](https://editor.p5js.org/qz2432/sketches/dRK9sis7h)

This prototype is based on [Daniel Shiffman's The Coding Train](https://thecodingtrain.com/Courses/ml5-beginners-guide/7.2-pose-classification.html). I reduced data collection wait time, and extended data collection time, so that the data collection system can automatically input more data samples at a time. This design upgraded the user experience of data collection.

<img src = "https://github.com/RubyQianru/Machine-Learning-TFJS/assets/142470034/5381bde6-7286-4604-a902-7aa780815508" width = 600>

### Second Prototype

[Link](https://github.com/RubyQianru/Machine-Learning-TFJS/tree/main/Data-Collector)

This prototype is based on TensorFlow Handpose and MediaPipe V2. It has higher performance and lower latency than the previous prototype.

<img src = "https://github.com/RubyQianru/Machine-Learning-TFJS/assets/142470034/8ed19f1a-1c9a-4524-b6b2-fe356d3175f6" width = 600>

## Model Training
- Deep Learning model trained with Jupyter Notebook: [Link](https://github.com/RubyQianru/Machine-Learning-TFJS/tree/main/Week5-Real-Time-Handpose-Recognition/ML)
- [util.py](https://github.com/RubyQianru/Machine-Learning-TFJS/blob/main/Week5-Real-Time-Handpose-Recognition/ML/utils.py): python funtions to load data (load json data into numpy arrays, shuffle data), preprocess data (slice X_train, y_train into train sets and validation sets), build model (establish neural networks), test model.
- [main.ipynb](https://github.com/RubyQianru/Machine-Learning-TFJS/blob/main/Week5-Real-Time-Handpose-Recognition/ML/main.ipynb_): main workflow to train machine learning model step by step.
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
- Model accuracy: 0.89552241563797
## Model Predictions: TensorFlowJS Usage on the Frontend
### Run Server
- Linux commands:
```
ssh root@qz2432.itp.io
root@qz2432.itp.io's password: 
```
```
root@ruby-zhang:~# cd ./live-web/week5
root@ruby-zhang:~/live-web/week5# node server.js
```
qz2432.itp.io: 

<img src="https://github.com/RubyQianru/Machine-Learning-TFJS/assets/142470034/087eac2e-59b9-41b5-ba6d-401f7ec1e96f" width=600>

- Full code examples: [Link](https://github.com/RubyQianru/Machine-Learning-TFJS/tree/main/Week5-Real-Time-Handpose-Recognition)
- Frontend code examples: [Link](https://github.com/RubyQianru/Machine-Learning-TFJS/tree/main/Week5-Real-Time-Handpose-Recognition/public)
### Realtime Communication: WebRTC
- Implementing a video chat application: Zoom, Microsoft Teams, Google Meets.
- Technology: WebRTC provides APIs for capturing audio and video streams from the user's camera and microphone. These streams can be transmitted in real-time between peers, enabling video and audio calls directly in the browser without the need for third-party plugins.
- Experience: Participants can join meetings via web browsers or dedicated applications on various devices.
- [Live Chatbox created using gsap library and DOM](https://github.com/RubyQianru/Live-Web/tree/main/Chatbox)
  
<img src="https://github.com/RubyQianru/Machine-Learning-TFJS/assets/142470034/4d47690f-2ffb-412c-b572-b7f2fa7b1608" width=600>

- [Live video prototype using WebSocket](https://github.com/RubyQianru/Live-Web/tree/main/Video)
- I tested the web application on webcams of my two laptops. This live video prototype is basing on HTML <canvas> and <image>. The web sockets receives canvas data and emit this data to all other clients. All clients update their src within <image>.
