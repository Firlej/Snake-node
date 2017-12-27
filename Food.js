

class Food extends Entity {
    constructor(id) {
        super(id);
    }
    getInitPack() {
        return {
            id: this.id,
            pos: this.pos,
        }
    }
    getUpdatePack() {
        return {
            id: this.id,
            pos: this.pos,
        }
    }
}

Food.list = [];

Food.getAllUpdatePack = function() {
    let foods = [];
	for(let i in Food.list)
    foods.push(Food.list[i].getUpdatePack());
	return foods;
}
Food.getAllInitPack = function() {
    let foods = [];
	for(let i in Food.list)
    foods.push(Food.list[i].getInitPack());
	return foods;
}
Food.updateAll = function() {
    
}

module.exports = {
    Food
}