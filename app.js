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

	socket.on('disconnect', onDisconnect);
	socket.on('newDir', onNewDir);

	function onNewDir(data) {
		me.setDir(data);
	}

	function onDisconnect() {
		users[socket.id] = null;
		userids.splice(userids.indexOf(socket.id), 1)
		console.log("Client "+socket.id+" has disconnected");
	}
}



// VARIABLES

	let users = userids = [];
	let foods = [];
	let gridsize = 20;
	let grid = [];

	function setup() {

		clearGrid();
	}

	function clearGrid() {
		for (let i = 0; i < gridsize; i++) {
			grid[i] = [];
			for (let j = 0; j < gridsize; j++) {
				grid[i][j] = null;
			}
		}
	}
//

setInterval(updateAll, 512);

function updateAll() {
	//io.emit('update', 'frame');

	clearGrid();

	updateAllUsers();
	io.emit('allPlayerData', getAllPlayerData());

	//console.log(grid);

}

// USER CLASS

class User {
	constructor(socket) {
		this.id = socket.id;
		this.shid = this.id.substring(this.id.length-4);
		this.tail = [];
		this.tail[0] = o.vec(Math.floor(o.random(4, gridsize)), Math.floor(o.random(0, gridsize)));
		this.tail[1] = o.vec(this.tail[0].x-1, this.tail[0].y);
		this.tail[2] = o.vec(this.tail[0].x-2, this.tail[0].y);
		this.tail[3] = o.vec(this.tail[0].x-3, this.tail[0].y);
		this.dir = o.vec(1, 0);
		this.color1 = o.randomRgb();
		this.color2 = o.randomRgb();
		this.dirUpdated = false;
		this.currDir = null;
		this.nextDir = null;
	}
	update() {
		this.dirUpdated = false;
		let newIndex = {
			x: this.tail[0].x+this.dir.x,
			y: this.tail[0].y+this.dir.y
		}
		if (newIndex.x>=gridsize || newIndex.y>=gridsize || newIndex.x<0 || newIndex.y<0) {
			return;
		}

		for(var i=this.tail.length-1; i>=1; i--) {
			this.tail[i].set(this.tail[i-1].x, this.tail[i-1].y);
		}
		this.tail[0].add(this.dir);
		if (this.nextDir != null) {
			this.setDir(this.nextDir);
			this.nextDir = null;
		}
	}

	putOnGrid() {
		for (let i in this.tail) {
			let node = this.tail[i];
			grid[node.x][node.y] = this.id;
		}
	}

	setDir(data) {
		//io.emit('message', data);
		if (this.currDir == data) {
			return;
		}

		if (this.dirUpdated) {
			this.nextDir = data;
			return;
		}

		switch(data) {
			case "UP": this.dir.set(0, -1); break;
			case "LEFT": this.dir.set(-1, 0); break;
			case "DOWN": this.dir.set(0, 1); break;
			case "RIGHT": this.dir.set(1, 0); break;
		}
		this.currDir = data;

		this.dirUpdated = true;
	}

}

// USER FUNCTIONS

	function addUser(socket) {
		users[socket.id] = new User(socket);
		userids.push(socket.id);
		console.log('Client '+users[socket.id].id+' has connected');
		socket.emit('message', 'Welcome to Snake!');
		socket.emit('allPlayerData', getAllPlayerData());
		socket.broadcast.emit('message', 'Welcome '+users[socket.id].shid+ ' to Snake!');
		return users[socket.id];
	}

	function updateAllUsers() {
		for (let i=0; i<userids.length; i++) {
			let user = users[userids[i]];
			//console.log(user);
			user.update();
			//console.log(user.tail[0].x, user.tail[0].y)
		}
	}

	function getAllPlayerData() {
		let data = [];
		for (let i = 0; i < userids.length; i++) {
			let user = users[userids[i]];
			//console.log(user);
			data.push({
				id: user.id,
				tail: user.tail,
				color1: user.color1,
				color2: user.color2
			});
		}
		return data;
	}

// FOOD CLASS

class Food {
	constructor() {
		this.pos = o.vec(Math.floor(o.random(0, gridsize)), Math.floor(o.random(0, gridsize)));
	}
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