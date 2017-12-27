let express = require('express');
let app = express();
let server = app.listen(process.env.PORT || 3000, function() {
	let host = server.address().address;
	let port = server.address().port;
	console.log('Example app listening at http://' + host + ':' + port);
});

app.use(express.static('public'));

// INCLUDES

let io = require('socket.io')(server);

let fs = require('fs');

let initPacks = { players: [], bullets: [], foods: [] }
let removePacks = { players: [], bullets: [], foods: [] }

require('./Entity');

const { Entity } = require('./Entity.js');
const { Player } = require('./Player.js');
const { Bullet } = require('./Bullet.js');
const { Food } = require('./Food.js');

// VARIABLES

let SOCKET_LIST = {};

// ON CONNECT

io.sockets.on('connection', function(socket) {
	SOCKET_LIST[socket.id] = socket;
	Player.onConnect(socket);

	socket.on('latency', onLatency);
	socket.on('disconnect', onDisconnect);

	function onLatency(startTime, cb) {
		cb(startTime);
		// console.log(cb.toString());
	}

	function onDisconnect(socket) {
		delete SOCKET_LIST[socket.id];
		Player.onDisconnect(socket);
		console.log("Client "+socket.id+" has disconnected");
	}
});

// MAIN DRAW LOOP

setInterval(updateAll, 512);

function updateAll() {
	Entity.updateAll();

	io.emit('initPacks', initPacks);
	initPacks = { players: [], bullets: [], foods: [] }
	io.emit('removePacks', removePacks);
	removePacks = { players: [], bullets: [], foods: [] }

	var updatePacks = Entity.getFrameUpdateData();
	io.emit('updatePacks', updatePacks);
}

// io.sockets.emit('allPlayersData', data);
// socket.emit('allPlayersData', data);

/*
	// sending to sender-client only
	socket.emit('message', "this is a test");

	// sending to all clients, include sender
	io.emit('message', "this is a test");

	// sending to all clients except sender
	socket.broadcast.emit('message', "this is a test");

	// sending to all clients in 'game' room(channel) except sender
	socket.broadcast.to('game').emit('message', 'nice game');

	// sending to all clients in 'game' room(channel), include sender
	io.in('game').emit('message', 'cool game');

	// sending to sender client, only if they are in 'game' room(channel)
	socket.to('game').emit('message', 'enjoy the game');

	// sending to all clients in namespace 'myNamespace', include sender
	io.of('myNamespace').emit('message', 'gg');

	// sending to individual socketid
	socket.broadcast.to(socketid).emit('message', 'for your eyes only');
*/