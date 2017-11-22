let socket;

let players = [];
let playerids = [];
let me;

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

	me = addPlayer("ABCD", vec(5, 5), vec(1, 0));
	
	callback();
}

function draw() {
	background('black');

	if (me==undefined) {
		fill('white');
		text("LOADING", width/2, height/2);
		console.log("fff");
		return;
	}

	push();
		tx = lerp(ptx, width/2-me.tail[0].x*tile, 0.03);
		ty = lerp(pty, height/2-me.tail[0].y*tile, 0.03);
		ptx=tx; pty=ty;
		translate(tx, ty);
		drawBorders();
		drawAllPlayers();
	pop();

	if (frameCount%30 == 0) {
		//updateAllPlayers();
	}
}

function keyPressed() {
	//console.log(keyCode);
	//socket.emit('keyPressed', keyCode);
	switch(keyCode) {
		case 97: me.setDir(-1, 0); break;
		case 119: me.setDir(0, -1); break;
		case 100: me.setDir(1, 0); break;
		case 115: me.setDir(0, 1); break;
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
	updateAllPlayers();
}