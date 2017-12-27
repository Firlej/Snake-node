function socketEvents() {
	
	socket.on('connect', function(){
		myId = drawId = socket.id;
		//socket.emit('play');
		ping();
		//console.log('hey?');
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
	socket.on('allPlayerUpdatedData', onAllPlayerUpdatedData);
	socket.on('allFoodData', onAllFoodData);
	socket.on('death', onDeath);

	function onMessage(data) {
		console.log(data);
	}

	function onAllPlayerUpdatedData(data) {
		//
	}
	function onAllPlayerData(data) {
		//
	}

	function onAllFoodData(data) {
		//
	}

	function onDeath(data) {
		//
	}

	// update changes
	// disconnect
	// chat msgs
}