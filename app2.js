let express = require('express');
let app = express();
let server = app.listen(process.env.PORT || 3000, listen);

function listen() {
	let host = server.address().address;
	let port = server.address().port;
	console.log('Example app listening at http://' + host + ':' + port);
}
app.use(express.static('public'));
let io = require('socket.io')(server);

io.sockets.on('connection', onConnection);

function onConnection(socket) {
	addPlayer(socket);

	socket.on('keyPressed', onKeyPressed);
	socket.on('disconnect', onDisconnect);

	function onKeyPressed(keyCode) {
		let p = players[socket.id];
		switch(keyCode) {
			case 37: p.setDir(-1, 0); break;
			case 38: p.setDir(0, -1); break;
			case 39: p.setDir(1, 0); break;
			case 40: p.setDir(0, 1); break;
		}
		updatedDirIds.push(socket.id);
	}

	function onDisconnect() {
		let index = playerids.indexOf(socket.id);
		playerids.splice(index, 1);
		players[socket.id] = null;
		console.log("Client has disconnected");
	}

}

let players = playerids = [];

setInterval(updateAll, 100);

function updateAll() {
	for(let i=0; i<playerids.length; i++) {
		players[playerids[i]].update();
	}
	io.sockets.emit('redraw');
}

function addPlayer(socket) {
	console.log("New connection: "+socket.id);
}

//io.sockets.emit('allPlayersData', data);
//socket.emit('allPlayersData', data);

function player(socket) {
	this.id = socket.id;
	this.pos = {x: 5, }
}