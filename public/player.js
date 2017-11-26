class Player {
	constructor(id) {
		this.id = id;
		this.shid = this.id.substring(this.id.length-4);
		this.tail = [];
		this.dir = vec(0, 0);
		this.color1 = randomRgb();
		this.color2 = randomRgb();
	}

	setDir(x, y) {
		this.dir.set(x, y);
	}

	// update() {
	// 	if (this.tail[0].x+this.dir.x>=gridsize || this.tail[0].y+this.dir.y>=gridsize ||
	// 		this.tail[0].x+this.dir.x<0 || this.tail[0].y+this.dir.y<0) { this.dir.set(0, 0); }
	// 	// todo is this check necessary?
	// 	if (this.dir.x==0 && this.dir.y==0) {
	// 		//console.log('Tried to update snake with not set dir');
	// 		return;
	// 	}

	// 	for(var i=this.tail.length-1; i>=1; i--) {
	// 		this.tail[i].set(this.tail[i-1].x, this.tail[i-1].y);
	// 	}
	// 	this.tail[0].add(this.dir);
	// 	//this.dir.set(0, 0)
	// }

	draw() {
		fill(this.color1);
		stroke(this.color2);
		for(var i=this.tail.length-1; i>=1; i--) {
			rect(this.tail[i].x*tile, this.tail[i].y*tile, tile, tile);
			strokeRect(this.tail[i].x*tile, this.tail[i].y*tile, tile, tile);
		}
		fill(this.color2);
		rect(this.tail[0].x*tile, this.tail[0].y*tile, tile, tile);
		fill('red');
		text(this.shid, this.tail[0].x*tile+tile/2, this.tail[0].y*tile+tile/2);
	}
}

function addPlayer(id) {
	players[id] = new Player(id);//, pos, dir, color);
	playerids.push(id);
	return players[id];
}
function drawAllPlayers() {
	for (let id of playerids) {
		players[id].draw();
	}
}
