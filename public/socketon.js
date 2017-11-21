function socketEvents() {
	socket.on('allPlayersData', allPlayersData);
	socket.on('allDirUpdates', allDirUpdates);
	socket.on('newPlayerConnected', newPlayerConnected);
	socket.on('redraw', function() { redraw(); });

	// update changes
	// disconnect
	// chat msgs
}

function allPlayersData(data) {
	console.log(data);
	players = [];
	playerids = [];

	for(var i=0; i<data.length; i++) {
		me = addPlayer(data[i].id, data[i].pos, data[i].pos.dir, data[i].color);
	}
	me = players[socket.id];
}
function allDirUpdates(data) {
	for(var i=0; i<data.length; i++) {
		players[data[i].id].dir.x  = data[i].dir.x;
		players[data[i].id].dir.y  = data[i].dir.y;
	}
}
function newPlayerConnected(data) {
	console.log("pff");
	addPlayer(data.id, data.pos, data.pos.dir, data.color);
	console.log("New connection: " + data.id);
}