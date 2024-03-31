const keys = {
  "heart": "❤️",
  "raiseHand": "✋",
  "yay":"🎉",
  "thumb":"👍"
}

const threshold = {
  0: 0.58,
  1: 0.6,
  2: 0.33,
  3: 0.44
}

export class SymbolHandler {
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

  sendSymbol = () => {
    this.symbol.className = 'visible'
    setTimeout(() => {
      this.symbol.classList.remove('visible')
    }, 2000)
  }    

  symbolToggle = () => {
    this.toggle = true
    setTimeout(() => {
        this.toggle = false
      }, 2001)
  }

  updatePanel = (data) => {
    const message = document.createElement('div')
    message.style.padding = '5px'
    message.innerText = `${data} sends ${keys[this.socket]}`
    this.panel.appendChild(message)
  }
}

export class HandposeModel {

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
        inputs.push(landmarks[i][0]/505);
        inputs.push(landmarks[i][1]/505);
        inputs.push(landmarks[i][2]/505);
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

export async function initModel() {
  // for (let i = 0; i < symbols.length; i++) {
  //   const symbolHandler = new SymbolHandler(symbols[i], i)
  //   symbolHandlers.push(symbolHandler)
  // }

  let mlModel = new HandposeModel()
  await mlModel.tfmodelInit()
  await mlModel.graphModelInit("./tfjsmodel-graph/model.json")

  return mlModel

  // for (let symbolHandler of symbolHandlers) {
  //   mlsocket.on(symbolHandler.socket, function(data){
  //     console.log("Receiving data")
  //     symbolHandler.handler(data)
  //   })
  // }
}

export async function makePrediction(target) {
  const maxi = await mlModel.predict(target)
  console.log(maxi)
  // if ( maxi !== null && symbolHandlers[maxi].toggle == false ) {
  //   symbolHandlers[maxi].symbolToggle()
  //   mlsocket.emit(symbolHandlers[maxi].socket, getSocketId())
  // }
}

