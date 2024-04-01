import { useEffect, useRef, useState } from 'react';
import { initModel, makePrediction } from '../helpers/mlhelper';

const Video = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [ prediction, setPrediction ] = useState(null);

  useEffect(() => {

    const initCapture = async () => {

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const mlModel = await initModel();

      if (video && canvas) {

        const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
        video.srcObject = stream;

        video.onloadedmetadata = () => {
          video.play();
          setInterval(async () => {
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const predictMaxi = await makePrediction(mlModel, canvas); 
            console.log(predictMaxi)
            setPrediction(predictMaxi);
          }, 200);
        };
      }
    };

    initCapture().catch(console.error);
  
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <>
      <div>
        <canvas ref={canvasRef} width="200" height="150" hidden></canvas>
        <section id="videos">
          <video ref={videoRef} width="400" height="300" muted></video>
        </section>
      </div>
    </>
  );
};

export default Video;
