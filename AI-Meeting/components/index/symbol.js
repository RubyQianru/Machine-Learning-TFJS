import React, { useEffect } from 'react';
import { SymbolHandler, keys, threshold } from './SymbolHandler'; 

const symbols = ["heart", "raiseHand", "yay", "thumb"];

const SymbolComponent = () => {
  useEffect(() => {
    const symbolHandlers = symbols.map((symbol, index) => new SymbolHandler(symbol, index));

    // Assuming `mlsocket` is your WebSocket instance
    symbolHandlers.forEach(handler => {
      mlsocket.on(handler.socket, data => {
        console.log("Receiving data");
        handler.handler(data);
      });
    });

    return () => {
      symbolHandlers.forEach(handler => {
        mlsocket.off(handler.socket);
      });
    };
  }, []); 

  return (
    <div id="panel">
      {/* Render your symbols and other UI elements here */}
      {symbols.map(symbol => (
        <div key={symbol} id={symbol}>{keys[symbol]}</div>
      ))}
    </div>
  );
};

export default SymbolComponent;
