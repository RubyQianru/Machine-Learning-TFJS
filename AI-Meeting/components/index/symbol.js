import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { SymbolHandler, keys, threshold } from '../../helpers/symbolHander'; 

const symbols = ["heart", "raiseHand", "yay", "thumb"];

const Symbol = () => {
  const mlsocket = useRef(null); 

  useEffect(() => {
    mlsocket.current = io.connect();
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
    <div >
      {symbols.map(symbol => (
        <div key={symbol} id={symbol}>{keys[symbol]}</div>
      ))}
    </div>
  );
};

export default Symbol;
