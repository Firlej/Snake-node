let socket;

let myId = undefined;

const tile = 4;
let gridsize = 200;

let ptx=pty=tx=ty=0;

let latency = 0;

function setup(callback) {
	resizeCanvas(windowWidth, windowHeight);

	background(rgba(31, 31, 31));

	socket = io.connect('http://localhost:3000');
	
	socketEvents();
	
	callback();
}

function draw() {
	background(rgba(31, 31, 31));

	drawPing();

	if (playerids.length==0 || !isAnyonePlaying()) {
		fill('white');
		textAlign('center');
		font(tile+'px Arial');
		text("LOADING", width/2, height/2);
		return;
	}
	
	push();
		tx = lerp(ptx, width/2-players[myId].tail[0].x*tile, 0.005);
		ty = lerp(pty, height/2-players[myId].tail[0].y*tile, 0.005);
		ptx=tx; pty=ty;
		translate(tx, ty);
		drawBorders();
		drawAllPlayers();
		drawAllFoods();
	pop();

	drawSpectatingScreen();
}

function keyPressed() {
	//console.log(keyCode);

	let dir = "";
	switch(keyCode) {
		case 119: dir = "UP"; break;
		case 97: dir = "LEFT"; break;
		case 115: dir = "DOWN"; break;
		case 100: dir = "RIGHT"; break;
	}
	if (dir != "") {
		socket.emit('newDir', dir, function(data){
			console.log(data)
		});
	}
}

function drawBorders() {
	var gridsizepx = gridsize*tile;
	fill(rgba(97, 65, 47, 0.8));
	rect(-tile/2, -tile/2, gridsizepx+tile, tile/2);
	rect(gridsizepx, -tile/2, tile/2, gridsizepx+tile);
	rect(-tile/2, gridsizepx, gridsizepx+tile, tile/2);
	rect(-tile/2, -tile/2, tile/2, gridsizepx+tile);
}

function drawSpectatingScreen() {
	if (drawSpectate) {
		background(rgba(31, 31, 31, 0.5));
		fill(rgba(100, 255, 100, 0.7));
		textAlign('center');
		font(tile + 'px Arial');
		text("SPECTATE", width / 2, height / 2);
	}
}

function drawPing() {
	textAlign('left');
	font(tile + 'px Arial');
	fill('rgb(100,100,200)');
	text("Ping: " + latency, tile / 5, tile);
}