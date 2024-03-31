export function initCapture(canvas, context) {				
    initModel()
    let video = document.getElementById('myvideo');

    let constraints = { audio: false, video: true }

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        mystream = stream;
        video.srcObject = stream;
        
        video.onloadedmetadata = function(e) {
            video.play();
            setInterval(() => {
                context.drawImage(video, 0, 0, canvas.width, canvas.height)
                makePrediction(canvas)
            }, 200);
        };
        setupSocket();
    })
    .catch(function(err) {
        alert(err);  
    });	
}