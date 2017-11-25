let socket;

let players = playerids = [];
let foods = [];
let me = null;
let myId = null;

const tile = 40;
let gridsize = 20;

let ptx=pty=tx=ty=0;

function setup(callback) {
	resizeCanvas(windowWidth, windowHeight);

	background('black');

	socket = io.connect('http://localhost:3000');
	
	socketEvents();

	textAlign('center');
	font(tile/3+'px Arial');

	addFood({x: 5, y: 5});
	addFood({x: 5, y: 5});
	addFood({x: 5, y: 5});
	
	callback();
}

function draw() {
	background('black');

	if (me==null || myId==null) {
		fill('white');
		text("LOADING", width/2, height/2);
		return;
	}

	push();
		tx = lerp(ptx, width/2-me.tail[0].x*tile, 0.01);
		ty = lerp(pty, height/2-me.tail[0].y*tile, 0.01);
		ptx=tx; pty=ty;
		translate(tx, ty);
		drawBorders();
		drawAllPlayers();
		drawAllFoods();
	pop();
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
		socket.emit('newDir', dir);
	}
}

function drawBorders() {
	var gridsizepx = gridsize*tile;
	fill(rgba(255, 0, 0, 100));
	rect(-tile/2, -tile/2, gridsizepx+tile, tile/2);
	rect(gridsizepx, -tile/2, tile/2, gridsizepx+tile);
	rect(-tile/2, gridsizepx, gridsizepx+tile, tile/2);
	rect(-tile/2, -tile/2, tile/2, gridsizepx+tile);
}

function mousePressed() {
	//
}