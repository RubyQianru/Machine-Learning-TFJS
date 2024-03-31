import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { initModel, makePrediction } from '../helpers/mlhelper';


const IndexPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [mlModel, setMlModel] = useState(null);

  useEffect(() => {

    initModel();

    return () => {
      // Cleanup logic
    };
  }, []);

  // Your event handlers and functions adapted for React
  // For example:
  // const initCapture = () => { ... };
  // const makePrediction = (target) => { ... };

  return (
    <>
      <Head>
        AI Meeting Room
      </Head>
      <div>
        {/* Your HTML structure adapted for React */}
        <canvas ref={canvasRef} width="200" height="150" hidden></canvas>
        <section id="videos">
          <video ref={videoRef} width="400" height="300" muted></video>
        </section>
        <section id="panel">
          <h4 id="header">Messages: </h4>
        </section>
        {/* Continue with the rest of your component structure */}
      </div>
    </>
  );
};

export default IndexPage;
