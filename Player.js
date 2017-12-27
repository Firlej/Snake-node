
class Player extends Entity {
    constructor (id) {
        super(id);
        this.pressing = {
            up: false,
            left: false,
            down: false,
            right: false,
        }
        this.health = 1;
    }
    shoot(angle) {
        //
    }

    getInitPack() {
        return {
            id: this.id,
            pos: this.pos,
            health: this.health,
        }
    }
    getUpdatePack() {
        return {
            id: this.id,
            pos: this.pos,
            health: this.health,
        }
    }
}

Player.list = {};

Player.onConnect = function(socket) {
    
    let player = new Player(socket.id);
    Player.list[socket.id] = player;
    initPacks.players.push(player.getInitPack());
    console.log("Client "+socket.id+" has connected");

    socket.on('mouseMove', onMouseMove);
    socket.on('sendMsgToServer', onSendMsgToServer);
    socket.on('shoot', onShoot);

    function onShoot(angle) {
        player.shoot(angle);
    }

    let packs = Entity.getAllInitPacks();
    packs.myId = socket.id;
    socket.emit('allInitPacks', packs);
}

Player.onDisconnect = function(socket) {
    delete Player.list[socket.id];
    removePack.players.push(socket.id);
}

Player.updateAll = function(socket) {
    for(let i in Player.list)
		Player.list[i].update();
}

Player.getAllUpdatePack = function() {
    let players = [];
	for(let i in Player.list)
		players.push(Player.list[i].getUpdatePack());
	return players;
}
Player.getAllInitPack = function() {
    let players = [];
	for(let i in Player.list)
		players.push(Player.list[i].getInitPack());
	return players;
}

module.exports = {
    Player
}