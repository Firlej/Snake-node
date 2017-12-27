
class Bullet extends Entity {
    constructor(parentId, pos, angle) {
        super();
        this.parentId = parentId;
    }
    getInitPack() {
        return {
            id: this.id,
            pos: this.pos,
            vel: this.vel,
        }
    }
    getUpdatePack() {
        return {
            id: this.id,
            pos: this.pos,
            vel: this.vel,
        }
    }
}

Bullet.list = [];

Bullet.getAllUpdatePack = function() {
    let bullets = [];
	for(let i in Bullet.list)
    bullets.push(Bullet.list[i].getUpdatePack());
	return bullets;
}
Bullet.getAllInitPack = function() {
    let bullets = [];
	for(let i in Bullet.list)
    bullets.push(Bullet.list[i].getInitPack());
	return bullets;
}
Bullet.updateAll = function() {
    
}

module.exports = {
    Bullet
}