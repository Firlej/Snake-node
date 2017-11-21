var socket;

var players = [];
var playerids = [];
var me;

var tile = 30;
var gridsize = 20;

var ptx=pty=tx=ty=0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(31);

	socket = io.connect('http://localhost:3000');
	socketEvents();

	me = addPlayer("eee", {x: 5, y: 5}, {x: 1, y: 0}, {r: 100, g: 250, b: 100})

	//frameRate(5);

	noLoop();
}

function draw() {
	background(31);

	if (me==undefined) {
		//todo show loading screen
		return;
	}

	updateAllPlayers();
	push();
		tx = lerp(ptx, width/2-me.tail[0].x*tile, 0.1);
		ty = lerp(pty, height/2-me.tail[0].y*tile, 0.1);
		ptx=tx; pty=ty;
		translate(tx, ty);
		drawBorders();
		drawAllPlayers();
	pop();

}

function keyPressed() {
	//socket.emit('keyPressed', keyCode);
	switch(keyCode) {
		case 37: me.setDir(-1, 0); break;
		case 38: me.setDir(0, -1); break;
		case 39: me.setDir(1, 0); break;
		case 40: me.setDir(0, 1); break;
	}
}

function mousePressed() {
	redraw();
}

// socket.emit('mouse', data);

function drawBorders() {
	var gridsizepx = gridsize*tile;
	fill(255, 0, 0, 100);
	noStroke();
	rect(-tile/2, -tile/2, gridsizepx+tile, tile/2);
	rect(gridsizepx, -tile/2, tile/2, gridsizepx+tile);
	rect(-tile/2, gridsizepx, gridsizepx+tile, tile/2);
	rect(-tile/2, -tile/2, tile/2, gridsizepx+tile);
}