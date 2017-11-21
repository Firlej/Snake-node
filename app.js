var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 3000, listen);

function listen() {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Example app listening at http://' + host + ':' + port);
}
app.use(express.static('public'));
var io = require('socket.io')(server);

io.sockets.on('connection', onConnection);

function onConnection(socket) {
	addPlayer(socket);

	socket.on('keyPressed', onKeyPressed);
	socket.on('disconnect', onDisconnect);

	function onKeyPressed(keyCode) {
		var p = players[socket.id];
		switch(keyCode) {
			case 37: p.setDir(-1, 0); break;
			case 38: p.setDir(0, -1); break;
			case 39: p.setDir(1, 0); break;
			case 40: p.setDir(0, 1); break;
		}
		updatedDirIds.push(socket.id);
	}

	function onDisconnect() {
		var index = playerids.indexOf(socket.id);
		playerids.splice(index, 1);
		players[socket.id] = null;
		console.log("Client has disconnected");
	}

}

var players = playerids = [];

setInterval(updateAll, 100);

function updateAll() {
	for(var i=0; i<playerids.length; i++) {
		players[playerids[i]].update();
	}
	//emitAllDirUpdates();
	//sendAllPlayersToSocket();
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