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
	
	//console.log(me);

	socket.on('disconnect', onDisconnect);

	function onDisconnect() {
		users[socket.id] = null;
		userids.splice(userids.indexOf(socket.id), 1)
		console.log("Client "+socket.id+" has disconnected");
	}
}

let users = userids = [];

//

	let gridsize = 20;

//

setInterval(updateAll, 512);

function updateAll() {
	io.emit('update', 'frame');

	for (let i=0; i<userids.length; i++) {
		let user = users[userids[i]];
		//console.log(user);
		user.update();
		//console.log(user.tail[0].x, user.tail[0].y)
	}

	let data = [];
	for (var i = 0; i < userids.length; i++) {
		let user = users[userids[i]];
		//console.log(user);
		data.push({
			id: user.id,
			tail: user.tail,
			color1: user.color1,
			color2: user.color2
		});
	}
	io.emit('allPlayerData', data);
}
//

class User {
	constructor(socket, pos = o.vec(Math.floor(o.random(4, gridsize)), Math.floor(o.random(0, 10)))) {
		this.id = socket.id;
		this.shid = this.id.substring(this.id.length-4);
		this.tail = [
			o.vec(pos.x, pos.y),
			o.vec(pos.x-1, pos.y),
			o.vec(pos.x-2, pos.y),
			o.vec(pos.x-3, pos.y),
			o.vec(pos.x-4, pos.y)
		]
		this.dir = o.vec(0, 1);
		this.color1 = o.randomRgb();
		this.color2 = o.randomRgb();

		this.update = function() {
			if (this.tail[0].x+this.dir.x>=gridsize || this.tail[0].y+this.dir.y>=gridsize ||
				this.tail[0].x+this.dir.x<0 || this.tail[0].y+this.dir.y<0) { this.dir.set(0, 0); }
			// todo is this check necessary?
			if (this.dir.x==0 && this.dir.y==0) {
				//console.log('Tried to update snake with not set dir');
				return;
			}
	
			for(var i=this.tail.length-1; i>=1; i--) {
				this.tail[i].set(this.tail[i-1].x, this.tail[i-1].y);
			}
			this.tail[0].add(this.dir);
			//this.dir.set(0, 0)
		}
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