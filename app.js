let express = require('express');
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

	addUser(socket);

	socket.on('disconnect', onDisconnect);

	function onDisconnect() {
		console.log("Client "+socket.id+" has disconnected");
	}
}

let users = userids = [];

setInterval(updateAll, 100);

function updateAll() {
	//
}
//

class User {
	constructor(socket) {
		this.id = socket.id;
		this.shid = this.id.substring(this.id.length-4);
	}
}

function addUser(socket) {
	users[socket.id] = new User(socket);
	userids.push(socket.id);
	console.log('Client '+socket.id+' has connected');
	socket.emit('message', 'Welcome to Snake!');

	socket.broadcast.emit('message', 'Welcome '+users[socket.id].shid+ ' to Snake!');
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