export const keys = {
    "heart": "❤️",
    "raiseHand": "✋",
    "yay":"🎉",
    "thumb":"👍"
}
  
  
export class SymbolHandler {
    constructor(id, index) {
        this.toggle = false
        this.symbol = document.getElementById(id)
        this.index = index
        this.socket = id
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
        }, 2001)
    }    
  
    symbolToggle = () => {
        this.toggle = true
        setTimeout(() => {
            this.toggle = false
            }, 2001)
    }
  
    // updatePanel = (data) => {
    //     const message = document.createElement('div')
    //     message.style.padding = '5px'
    //     message.innerText = `${data} sends ${keys[this.socket]}`
    //     this.panel.appendChild(message)
    // }
  }

export function initHandler() {
    const symbolHandler = [];
    for (let i = 0; i < symbols.length; i++) {
        const symbolHandler = new SymbolHandler(symbols[i], i)
        symbolHandlers.push(symbolHandler)
    }

    for (let symbolHandler of symbolHandlers) {
        mlsocket.on(symbolHandler.socket, function(data){
        console.log("Receiving data")
        symbolHandler.handler(data)
        })
    } 

    return symbolHandler;
}