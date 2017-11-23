function socketEvents() {
	
	socket.on('message', onMessage);
	socket.on('update', onMessage);
	socket.on('allPlayerData', onAllPlayerData);

	function onMessage(data) {
		console.log(data)
	}

	function onAllPlayerData(data) {
		players = [];
		playerids = [];
		console.log(data.length, data);
		for (var i in data) {
			let user = data[i];
			let player = players[user.id]; 
			if (player == undefined) {
				player = addPlayer(user.id);
				player.color1 = user.color1;
				player.color2 = user.color2;
				//console.log(user.id);
			}
			player.tail = [];
			for (var i in user.tail) {
				player.tail.push(vec(user.tail[i].x, user.tail[i].y));
			}
		}
		updateAllPlayers();		
	}

	

	// update changes
	// disconnect
	// chat msgs
}