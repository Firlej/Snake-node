class Food {
	constructor(pos) {
		this.pos = vec(pos.x, pos.y);
	}
}

function addFood(pos) {
    let food = new Food(pos)
	foods.push(food);
	return food;
}

function drawAllFoods() {
    for (let iterator of foods) {
        //console.log(iterator);
    }
}