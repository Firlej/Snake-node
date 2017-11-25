function socketEvents() {
	
	socket.on('connect', function(){
		myId = socket.id;
	});
	
	socket.on('message', onMessage);
	socket.on('update', onMessage);
	socket.on('allPlayerData', onAllPlayerData);
	socket.on('allFoodData', onAllFoodData);

	function onMessage(data) {
		console.log(data)
	}

	function onAllPlayerData(data) {
		players = [];
		playerids = [];
		//console.log(data.length, data);
		for (let i in data) {
			let user = data[i];
			let player = players[user.id]; 
			if (player == undefined) {
				player = addPlayer(user.id);
				//console.log(user.color1, user.color2);
				player.color1 = user.color1;
				player.color2 = user.color2;
			}
			player.tail = [];
			for (let j in user.tail) {
				player.tail.push(vec(user.tail[j].x, user.tail[j].y));
			}
		}
		me = players[myId];
		//updateAllPlayers();	
	}

	function onAllFoodData(data) {
		foods = [];
		for (let i in data) {
			addFood(data[i])
		}
	}

	

	// update changes
	// disconnect
	// chat msgs
}