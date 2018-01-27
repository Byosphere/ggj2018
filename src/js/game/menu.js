class GameMenu {

    constructor() {
        this.player1 = {name: 'Fleur', data:null, ready:false, sprite: null};
        this.player2 = {name: 'Coli', data:null, ready:false, sprite: null};
    }

    preload() {

    }

    create() {
        this.createBackground();
        this.createTitle();
        this.createCharacters();
        this.createTexts();
        this.initInputs();
        let that = this;
        game.socket.emit('newplayer');
        game.socket.on('newplayer', function (data) {
            that.setNewPlayer(data);
        });
        game.socket.on('allplayers', function (data) {
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                that.setNewPlayer(data[i]);
            }
        });
    }

    update() {
        
    }

    setNewPlayer(data) {
        if (this.player1.data == null) {
            this.activateHero(this.player1, data);
        } else if (this.player2.data == null) {
            this.activateHero(this.player2, data);
        } else {
            console.log('error : 2 players are already connected');
        }
    }
    
    activateHero(player, data) {
        console.log('ajout de ' + player.name);
        player.data = data;
        player.ready = true;
        player.sprite.alpha = 1;
        // Animation of the hero
    }

    createBackground() {

    }

    createCharacters() {
        this.player1.sprite = game.add.sprite(game.world.centerX + (game.world.centerX / 2) - (HEROWIDTH / 2), game.world.height - MENU_HEROS_POS_Y, 'fleur');
        this.player2.sprite = game.add.sprite((game.world.centerX / 2) - (HEROWIDTH / 2), game.world.height - MENU_HEROS_POS_Y, 'coli');
        this.player1.sprite.alpha = 0.3;
        this.player2.sprite.alpha = 0.3;
    }

    createTitle() {
        game.add.sprite(0, 0, 'title');
    }

    createTexts() {
        this.waitingText = game.add.text(16, 16, 'Waiting for players...', { fontSize: '32px', fill: '#000'});
        this.readyText = game.add.text(16, 16, 'Press ?? to start !', { fontSize: '32px', fill: '#000' });
        this.readyText.alpha = 0;
    }

    initInputs() {
        this.pad = game.input.gamepad.pad1;
    }

}