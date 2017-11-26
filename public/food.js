class Food {
	constructor(pos, color) {
		this.pos = vec(pos.x, pos.y);
		this.color = color;
	}
	draw() {
		fill(this.color);
		rect(this.pos.x*tile, this.pos.y*tile, tile, tile);
		strokeRect(this.pos.x*tile, this.pos.y*tile, tile, tile);
	}
}

function addFood(pos, color) {
    let food = new Food(pos, color)
	foods.push(food);
	return food;
}

function drawAllFoods() {
    for (let i in foods) {
        foods[i].draw();
    }
}