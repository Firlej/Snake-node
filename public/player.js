class Player {
	constructor(id) {
		this.id = id;
		this.shid = this.id.substring(this.id.length-4);
		this.tail = [];
		this.dir = vec(0, 0);
		this.color1 = randomRgb();
		this.color2 = randomRgb();
		this.dead = false;
		this.playing = false;
	}

	setDir(x, y) {
		this.dir.set(x, y);
	}

	draw() {
		if (!this.playing) { return; }
		fill(this.color1);
		stroke(this.color2);
		for(var i=this.tail.length-1; i>=1; i--) {
			rect(this.tail[i].x*tile, this.tail[i].y*tile, tile, tile);
			strokeRect(this.tail[i].x*tile, this.tail[i].y*tile, tile, tile);
		}
		fill(this.color2);
		rect(this.tail[0].x*tile, this.tail[0].y*tile, tile, tile);
		
		// darker if dead
		if(this.dead) {
			fill(rgba(0, 0, 0, 0.5));
			stroke(rgba(100, 100, 100, 0.8));
			for(let i in this.tail) {
				rect(this.tail[i].x*tile, this.tail[i].y*tile, tile, tile);
				strokeRect(this.tail[i].x*tile, this.tail[i].y*tile, tile, tile);
			}
		}
		textAlign('center');
		font(tile/3+'px Arial');
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
function isAnyonePlaying() {
	for (let id of playerids) {
		if (players[id].playing) {
			return true;
		}
	}
	return false;
}