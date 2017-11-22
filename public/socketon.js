function socketEvents() {
	
	socket.on('message', onMessage);
	socket.on('update', onMessage);


	function onMessage(data) {
		console.log(data);
	}


	// update changes
	// disconnect
	// chat msgs
}