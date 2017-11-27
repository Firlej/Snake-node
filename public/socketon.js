function socketEvents() {
	
	socket.on('connect', function(){
		myId = drawId = socket.id;
		socket.emit('play');
		ping();
	});
	function ping() {
		socket.emit('latency', Date.now(), function(startTime) {
			latency = Date.now() - startTime;
			ping();
		});
	}
	socket.on('message', onMessage);
	socket.on('update', onMessage);
	socket.on('allPlayerData', onAllPlayerData);
	socket.on('allFoodData', onAllFoodData);
	socket.on('death', onDeath);

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
			player = addPlayer(user.id);
			player.color1 = user.color1;
			player.color2 = user.color2;
			player.dead = user.dead;
			player.playing = user.playing;
			
			player.tail = [];
			for (let j in user.tail) {
				player.tail.push(vec(user.tail[j].x, user.tail[j].y));
			}
		}
		if (players[myId].playing) {
			me = players[myId];
		}
	}

	function onAllFoodData(data) {
		foods = [];
		for (let i in data) {
			addFood(data[i].pos, data[i].color);
		}
	}

	function onDeath(data) {
		console.log("death: "+data);
	}

	// update changes
	// disconnect
	// chat msgs
}