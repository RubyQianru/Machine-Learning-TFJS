const fs = require('fs');
				
const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/questions', (req, res) => {
    res.sendFile(__dirname + '/data.json');
});

const https = require('https');

const options = {
	key: fs.readFileSync('/etc/letsencrypt/live/qz2432.itp.io/privkey.pem'), 
	cert: fs.readFileSync('/etc/letsencrypt/live/qz2432.itp.io/cert.pem') 
};

const httpServer = https.createServer(options, app);

httpServer.listen(443);

let peers = [];
let questionIndex = 0;

const io = require('socket.io')(httpServer);

const gestureCounts = {
    "heart": 0,
    "raiseHand": 0,
    "yay": 0,
    "thumb": 0
};

io.sockets.on('connection', 

	function (socket) {
	
		peers.push({socket: socket});
		console.log("We have a new client: " + socket.id + " peers length: " + peers.length);
		
		socket.on('list', function() {
			let ids = [];
			for (let i = 0; i < peers.length; i++) {
				ids.push(peers[i].socket.id);
			}
			console.log("ids length: " + ids.length);
			socket.emit('listresults', ids);			
		});
		
		socket.on('signal', (to, from, data) => {
			console.log("SIGNAL", to, data);
			let found = false;
			for (let i = 0; i < peers.length; i++) {
				console.log(peers[i].socket.id, to);
				if (peers[i].socket.id == to) {
					console.log("Found Peer, sending signal");
					peers[i].socket.emit('signal', to, from, data);
					found = true;
					break;
				}				
			}	
			if (!found) {
				console.log("never found peer");
			}
		});

		socket.on('heart', function(data){
			handleGesture('heart', data, io);
		})

		socket.on('raiseHand', function(data){
			handleGesture('raiseHand', data, io);
		})

		socket.on('yay', function(data){
			handleGesture('yay', data, io);
		})

		socket.on('thumb', function(data){
			handleGesture('thumb', data, io);
		})

		// Question socket
		// setTimeout(() => {
		// 	setInterval(() => {
		// 		io.emit("question", { question: questionIndex});
		// 	}, 10000);
		// }, 5000);
		
		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		    io.emit('peer_disconnect', socket.id);
			for (let i = 0; i < peers.length; i++) {
				if (peers[i].socket.id == socket.id) {
					peers.splice(i,1);
				}
			}			
		});
	}
);

function handleGesture(gesture, data) {
    gestureCounts[gesture] += 1;
    io.emit(gesture, {...data, count: gestureCounts[gesture]}); 

    if (gestureCounts[gesture] % 5 == 0) {
        io.emit('gestureLimitReached', { gesture: gesture, message: `5 ${gesture} gestures received!` });
    }
}