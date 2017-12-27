
class Entity {
    constructor (id = Math.random()) {
        this.id = id;
        this.pos = vec(0, 0);
        this.vel = vec(0, 0);
    }
    update() {
        this.pos.add(this.vel);
    }
}
Entity.getFrameUpdateData = function() {
    let packs = {
        players: Player.getAllUpdatePack(),
        bullets: Bullet.getAllUpdatePack(),
        foods: Food.getAllUpdatePack(),
    }
    return packs;
}
Entity.getAllInitPacks = function() {
    let packs = {
        players: Player.getAllInitPack(),
        bullets: Bullet.getAllInitPack(),
        foods: Food.getAllInitPack(),
    }
    return packs;
}
console.log("rlo");
Entity.updateAll = function() {
    Player.updateAll();
    Bullet.updateAll();
    Food.updateAll();
}

module.exports = {
    Entity
}