import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { SymbolHandler, HandposeModel, initModel, makePrediction } from '../../helpers/mlhelper'; 

const keys = {
  "heart": "❤️",
  "raiseHand": "✋",
  "yay": "🎉",
  "thumb": "👍"
};

const Symbol = () => {
  const [messages, setMessages] = useState([]);
  const [mlModel, setMlModel] = useState(null);
  const [symbolHandlers, setSymbolHandlers] = useState([]);

  useEffect(() => {
    mlsocket.current = io.connect();

    // Initialize model and symbol handlers
    (async () => {
      const model = new HandposeModel();
      await model.tfmodelInit();
      await model.graphModelInit("./tfjsmodel-graph/model.json");
      setMlModel(model);

      const handlers = Object.keys(keys).map((id, index) => {
        const handler = new SymbolHandler(id, index, setMessages); // Adjusted to use setState
        mlsocket.current.on(handler.socket, data => {
          console.log("Receiving data");
          handler.handler(data);
        });
        return handler;
      });
      
      setSymbolHandlers(handlers);
    })();
  }, []);

  // This function needs to be adapted to work with React state
  const handleMakePrediction = async () => {
    const canvas = document.createElement('canvas'); // Ideally, this should be a ref to an actual canvas in your component
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    await makePrediction(canvas, mlModel, symbolHandlers, mlsocket.current); // Adapt makePrediction to work with React state
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline muted></video>
      <button onClick={handleMakePrediction}>Predict</button>
      <div id="panel">
        {messages.map((msg, index) => (
          <div key={index} style={{ padding: '5px' }}>
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Symbol;
