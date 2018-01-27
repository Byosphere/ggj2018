class GameMenu {

    constructor() {
        this.self = {id: null, name: null, ready:false, sprite: null};
        this.other = {id: null, name: null, ready:false, sprite: null};
        this.pad = null;
        this.sentReadyInfo = false;
        this.player1Sprite = null;
        this.player2Sprite = null;
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
        game.socket.on('selfplayer', function (data) {
            console.log(data.self);
            that.setPlayer(that.self, data.self);
            if (that.self.id === 1) {
                that.setPlayer(that.other, data.others[0]);
            }
        });
        game.socket.on('otherplayer', function (player) {
            that.setPlayer(that.other, player);
        });
        game.socket.on('playerready', function(player) {
            if (that.self.id === player.id) {
                that.activateHero(that.self);
            } else {
                that.activateHero(that.other);
            }
        });
        game.socket.on('startgame', function() {
            game.state.start('scene');
        });
    }

    update() {
        if (!this.sentReadyInfo && this.pad.justReleased(Phaser.Gamepad.XBOX360_A)) {
            console.log('sent ready info !')
            this.sentReadyInfo = true;
            this.activateHero(this.self);
            game.socket.emit('playerready');
        }
    }

    setPlayer(player, playerData) {
        console.log(player);
        player.id = playerData.id;
        player.name = player.id === 0 ? 'Fleur' : 'Coli';
        player.sprite = player.id === 0 ? this.player1Sprite : this.player2Sprite;
        player.ready = playerData.ready;
        if (player.ready) {
            this.activateHero(player);
        }
    }
    
    activateHero(player) {
        console.log(player);
        player.ready = true;
        player.sprite.alpha = 1;
        // Animation of the hero

    }

    createBackground() {

    }

    createCharacters() {
        this.player1Sprite = game.add.sprite(game.world.centerX + (game.world.centerX / 2) - (HEROWIDTH / 2), game.world.height - MENU_HEROS_POS_Y, 'fleur');
        this.player2Sprite = game.add.sprite((game.world.centerX / 2) - (HEROWIDTH / 2), game.world.height - MENU_HEROS_POS_Y, 'coli');
        this.player1Sprite.alpha = 0.3;
        this.player2Sprite.alpha = 0.3;
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
        game.input.gamepad.start();
        this.pad = game.input.gamepad.pad1;
        console.log('Pad initialized');
    }

}