function Player(id, pos, dir, c) {
	this.id = id;
	//this.sid = id.slice(id.length-4);
	this.tail = [
		createVector(pos.x, pos.y),
		createVector(pos.x-1, pos.y),
		createVector(pos.x-2, pos.y),
		createVector(pos.x-3, pos.y),
		createVector(pos.x-4, pos.y),
	]
	this.dir = createVector(0, 1)
	this.color = color(c.r, c.g, c.b);

	this.setDir = function(x, y) {
		this.dir.x = x;
		this.dir.y = y;
	}

	this.update = function(pos) {
		if (this.tail[0].x+this.dir.x>=gridsize || this.tail[0].y+this.dir.y>=gridsize ||
			this.tail[0].x+this.dir.x<0 || this.tail[0].y+this.dir.y<0) { this.dir = createVector(); }
		// todo is this check necessary?
		if (this.dir.x==0 && this.dir.y==0) { console.log('Tried to update snake with not set dir'); return; }

		for(var i=this.tail.length-1; i>=1; i--) {
			this.tail[i] = this.tail[i-1].copy();
		}
		this.tail[0].add(this.dir);
	}

	this.draw = function() {
		fill(this.color);
		for(var i=this.tail.length-1; i>=1; i--) {
			rect(this.tail[i].x*tile, this.tail[i].y*tile, tile, tile);
		}
		fill(255, 150, 100);
		rect(this.tail[0].x*tile, this.tail[0].y*tile, tile, tile);
	}
}

function addPlayer(id, pos, dir, color) {
	players[id] = new Player(id, pos, dir, color);
	playerids.push(id);
	return players[id];
}

function updateAllPlayers() {
	for(var i=0; i<playerids.length; i++) {
		players[playerids[i]].update();
	}
}

function drawAllPlayers() {
	for(var i=0; i<playerids.length; i++) {
		players[playerids[i]].draw();
	}
}