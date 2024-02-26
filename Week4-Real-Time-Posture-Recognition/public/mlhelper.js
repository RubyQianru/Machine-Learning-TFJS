let socket = io.connect()

let model, tfmodel,  prediction
let heartToggle = false
let raiseToggle = false
let clapToggle = false 

const heart = document.getElementById('heart')
const raiseHand = document.getElementById('raiseHand')
const clap = document.getElementById('clap')

async function getResult(output) {
  let maxValue = Math.max(...output);
  let maxIndex = output.indexOf(maxValue);
  return maxIndex
}

async function predict(target) {
    const skeleton = await tfmodel.estimateHands(target)
    if (skeleton.length > 0) {
      const landmarks = skeleton[0].landmarks
      let inputs = [];
      for (let i = 0; i < landmarks.length; i++) {
        inputs.push(landmarks[i][0] / 640);
        inputs.push(landmarks[i][1] / 480);
        inputs.push((landmarks[i][2] + 80) / 80);
      }

      const output = tf.tidy(() => {
        return model.predict(tf.tensor(inputs, [1, 63]));
      });
   
      const result = await output.array()
      console.log(result)
      const maxi = await getResult(result[0])
      console.log(maxi)

      // if (maxi == 0 && heartToggle == false ) {
      //   socket.emit('heart')
      // }
  
      // else if (maxi == 1 && raiseToggle == false ) {
      //   socket.emit('raise')
      // }
  
    }
    
    // else if (prediction[2].probability >= 0.95 && raiseToggle == false ) {
    //   socket.emit('clap')
    // }
  }

  socket.on('heart', function(){
    sendSymbol(heart)
    symbolToggle(heartToggle)
  })

  socket.on('raise', function(){
    sendSymbol(raiseHand)
    symbolToggle(raiseToggle)
  })

  socket.on('clap', function(){
    sendSymbol(clap)
    symbolToggle(clapToggle)
  })

  function sendSymbol(symbol) {
    symbol.className = 'visible'

    setTimeout(() => {
      symbol.classList.remove('visible')
    }, 2000)
  }        

  function symbolToggle(toggle) {
    toggle = true
    setTimeout(() => {
        toggle = false
      }, 2001)
  }

  async function init() {
    const modelURL = "./tfjsmodel/model.json"
    model = await tf.loadGraphModel(modelURL)

    // tsjs handpose detection points
    tfmodel = await handpose.load()
  }
