let express = require('express');
let o = require('./oskar-node.js');
let app = express();
let server = app.listen(process.env.PORT || 3000, function() {
	let host = server.address().address;
	let port = server.address().port;
	console.log('Example app listening at http://' + host + ':' + port);
});

app.use(express.static('public'));

let io = require('socket.io')(server);

io.sockets.on('connection', onConnection);

function onConnection(socket) {
	let me = addUser(socket);
	
	console.log(me);

	socket.on('disconnect', onDisconnect);

	function onDisconnect() {
		console.log("Client "+socket.id+" has disconnected");
	}
}

let users = userids = [];

setInterval(updateAll, 512);

function updateAll() {
	io.emit('update', 'frame');
}
//

class User {
	constructor(socket, pos = o.vec(5, 5)) {
		this.id = socket.id;
		this.shid = this.id.substring(this.id.length-4);
		this.tail = [
			o.vec(pos.x, pos.y),
			o.vec(pos.x-1, pos.y),
			o.vec(pos.x-2, pos.y),
			o.vec(pos.x-3, pos.y),
			o.vec(pos.x-3, pos.y)
		]
		console.log(this.tail[0]);
		this.dir = o.vec(0, 1);
		this.color = o.randomRgb();
		this.color2 = o.randomRgb();
	}
}

function addUser(socket) {
	users[socket.id] = new User(socket);
	userids.push(socket.id);
	console.log('Client '+socket.id+' has connected');
	socket.emit('message', 'Welcome to Snake!');
	socket.broadcast.emit('message', 'Welcome '+users[socket.id].shid+ ' to Snake!');
	return users[socket.id];
}

//

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