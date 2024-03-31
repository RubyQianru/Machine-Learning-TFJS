import Head from 'next/head';
import { useEffect, useRef } from 'react';
import { initModel, makePrediction } from '../helpers/mlhelper';

const IndexPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const initCapture = async () => {

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas) {

        const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
        video.srcObject = stream;

        video.onloadedmetadata = () => {
          video.play();
          setInterval(async () => {
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            await makePrediction(canvas); 
          }, 200);
        };

      }
    };

    initCapture().catch(console.error);
    initModel().catch(console.error);

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>AI Meeting Room</title>
      </Head>
      <div>
        <canvas ref={canvasRef} width="200" height="150" hidden></canvas>
        <section id="videos">
          <video ref={videoRef} width="400" height="300" muted></video>
        </section>
      </div>
    </>
  );
};

export default IndexPage;
