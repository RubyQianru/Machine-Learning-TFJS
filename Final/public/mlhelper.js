const keys = {
  "heart": "❤️",
  "raiseHand": "✋",
  "yay":"🎉",
  "thumb":"👍"
}

const threshold = {
  0: 0.6,
  1: 0.9,
  2: 0.33,
  3: 0.8
}

class SymbolHandler {
  constructor(id, index) {
    this.toggle = false
    this.symbol = document.getElementById(id)
    this.index = index
    this.socket = id
    this.panel = document.getElementById("panel")
  }

  handler(data) {
    this.sendSymbol()
    this.symbolToggle()
    this.updatePanel(data)
  }

  reachedLimitHandler(data) {
    if (data.gesture == "heart") {
      animationInit("heart");
    } else if (data.gesture == "yay") {
      animationInit("yay");
    }
  }

  sendSymbol = () => {
    this.symbol.className = 'visible'
    setTimeout(() => {
      this.symbol.classList.remove('visible')
    }, 3000)
  }   
  
  symbolToggle = () => {
    this.toggle = true
    setTimeout(() => {
        this.toggle = false
      }, 3001)
  }

  updatePanel = (data) => {
    const message = document.createElement('li')
    message.innerText = `${data.username} sends ${keys[this.socket]}`
    this.panel.appendChild(message)
  }
}

class HandposeModel {

  async graphModelInit(path) {
    const modelURL = path
    this.model = await tf.loadGraphModel(modelURL)
    if (this.model) {
      console.log("Model is loaded!")
    }
  }

  async tfmodelInit() {
    this.tfmodel = await handpose.load()
  }

  async getResult(inputArr) {
    let maxValue = Math.max(...inputArr);
    let maxIndex = inputArr.indexOf(maxValue);
    return maxIndex
  }

  async predict(target) {
    let maxi, inputs
    const skeleton = await this.tfmodel.estimateHands(target)

    if (skeleton.length > 0) {
      const landmarks = skeleton[0].landmarks
      inputs = [];

      for (let i = 0; i < landmarks.length; i++) {
        inputs.push(landmarks[i][0]/640);
        inputs.push(landmarks[i][1]/640);
        inputs.push(landmarks[i][2]/640);
      }
      const output = tf.tidy(() => {
        return this.model.predict(tf.tensor(inputs, [1, 63]));
      });

      const result = await output.array()
      maxi = await this.getResult(result[0])

      if (result[0][maxi] > threshold[maxi]) {
        return maxi
      }
      
      return null 
    }
  }

}