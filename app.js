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
	socket.on('latency', onLatency);
	socket.on('play', onPlay);

	function onPlay() {
		me.playing = true;
		io.emit('allPlayerData', getAllUserData());
	}

	function onLatency(startTime, cb) {
		cb(startTime);
		// console.log(cb.toString());
	} 

	function onNewDir(data) {
		me.setDir(data);
	}

	function onDisconnect() {
		removeUser(socket.id);
		io.emit('allPlayerData', getAllUserData());
		io.emit('allFoodData', getAllFoodData());
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
		for (let i in foods) {
			//console.log(foods[i]);
			let food = foods[i];
			grid[food.pos.x][food.pos.y] = foods[i];
		}
		for (let id of userids) {
			let user = users[id];
			for (let i in user.tail) {
				grid[user.tail[i].x][user.tail[i].y] = users[id];
			}
		}
		//console.log(grid);
	}

// MAIN DRAW LOOP

setInterval(updateAll, 512);

function updateAll() {
	clearGrid();

	updateAllUsers();
	killUsers();

	fillFoods();

	
	let data = [];
	for (let id of userids) {
		let user = users[id];
		let tempData = {
			id: user.id,
			tail: user.tail
		}
		if (user.dead) { tempData.dead = user.dead; }
		if (!user.playing) { tempData.playing = user.playing; }
		data.push(tempData);
	}
	io.emit('allPlayerUpdatedData', data);

	io.emit('allFoodData', getAllFoodData());
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
		this.dead = false;
		this.readyToRemove = false;
		this.playing = false;
	}
	update() {
		if (this.dead) {
			return;
		}
		this.dirUpdated = false;

		let newx = this.tail[0].x+this.dir.x;
		let newy = this.tail[0].y+this.dir.y;

		if (newx>=gridsize || newy>=gridsize || newx<0 || newy<0) {
			return;
		} else if (grid[newx][newy] != null && grid[newx][newy].constructor.name == "Food") {
			this.eat(newx, newy);
		} else if (grid[newx][newy] != null && grid[newx][newy].constructor.name == "User") {
			this.dead = true;
			let tempUser = this;
			setTimeout( function(){ tempUser.readyToRemove = true; }, 1500);
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

	eat(x, y) {
		foods.splice(foods.indexOf(grid[x][y]), 1);
		let last = this.tail[this.tail.length-1];
		this.tail.push(last.copy());
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
		socket.emit('allPlayerData', getAllUserData());
		socket.emit('allFoodData', getAllFoodData());
		socket.broadcast.emit('message', 'Welcome '+users[socket.id].shid+ ' to Snake!');
		return users[socket.id];
	}

	function updateAllUsers() {
		for (let id of userids) {
			users[id].update();
		}
	}

	function getAllUserData() {
		let data = [];
		for (let id of userids) {
			let user = users[id];
			let tempData = {
				id: user.id,
				tail: user.tail,
				color1: user.color1,
				color2: user.color2,
				playing : user.playing,
				dead: user.dead
			}
			data.push(tempData);
		}
		return data;
	}

	function removeUser(socketid) {
		users[socketid] = null;
		userids.splice(userids.indexOf(socketid), 1);
	}

	function killUsers() {
		for(let i=userids.length-1; i>=0; i--) {
			let user = users[userids[i]];
			if (user.readyToRemove) {
				user.playing = false;
				//removeUser(user.id);
			}
		}	
	}

// FOOD CLASS

	class Food {
		constructor(x = Math.floor(o.random(0, gridsize)), y = Math.floor(o.random(0, gridsize))) {
			this.pos = o.vec(x, y);
			this.color = o.randomRgb();
		}
	}

// FOOD FUNCTIONS

	function addFood() {
		let x, y;
		do {
			x = Math.floor(o.random(0, gridsize));
			y = Math.floor(o.random(0, gridsize));
		} while (grid[x][y]!=null)

		foods.push(new Food(x, y));
	}

	function getAllFoodData() {
		let data = [];
		for (let i in foods) {
			let food = foods[i];
			data.push({
				pos: {x: food.pos.x, y: food.pos.y},
				color: food.color
			})
		}
		return data;
	}

	function fillFoods() {
		while(foods.length < userids.length*3) {
			addFood();
		}
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