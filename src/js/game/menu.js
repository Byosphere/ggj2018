class GameMenu {

    constructor() {
        this.self = { id: null, name: null, ready: false, sprite: null };
        this.other = { id: null, name: null, ready: false, sprite: null };
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
        game.socket.on('playerready', function (player) {
            if (that.self.id === player.id) {
                that.activateHero(that.self);
            } else {
                that.activateHero(that.other);
            }
        });
        game.socket.on('startgame', function () {
            this.camera.fade('#000000', 4000);
            this.camera.onFadeComplete.add(function () {
                game.state.start('scene');
            }, this);
        });
    }

    // temp() {
    //     this.camera.fade('#000000', 4000);
    //     game.add.tween(this.player1Sprite).to({ x: this.player1Sprite.x + 200 }, 200, Phaser.Easing.Linear.None).start();
    //     game.add.tween(this.player2Sprite).to({ x: this.player2Sprite.x + 200 }, 200, Phaser.Easing.Linear.None).start();
    //     this.camera.onFadeComplete.add(function () {
    //         game.state.start('scene');
    //     }, this);
    // }

    update() {
        //this.temp();
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
        if(player.id === 0) {
            game.add.tween(this.bulle1).to({alpha:0}, 500, "Quart.easeInOut").start();
        } else {
            game.add.tween(this.bulle2).to({alpha:0}, 500, "Quart.easeInOut").start();
        }
        // Animation of the hero
        player.sprite.animations.play('ready');
        player.sprite.animations.currentAnim.onComplete.add(function () {
            player.sprite.animations.play('walk');
        });

    }

    createBackground() {
        game.stage.backgroundColor = MENU_BACKGROUND;
        this.background = game.add.sprite(0, 0, 'background_title');
        this.background.animations.add('default', [0, 1], 1, true).play();
    }

    createCharacters() {
        this.player2Sprite = game.add.sprite(game.world.centerX + (game.world.centerX / 2) - (HEROWIDTH / 2), game.world.height - MENU_HEROS_POS_Y, 'coli');
        this.player1Sprite = game.add.sprite((game.world.centerX / 2) - (HEROWIDTH / 2), game.world.height - MENU_HEROS_POS_Y, 'fleur');
        this.player1Sprite.alpha = 0.6;
        this.player2Sprite.alpha = 0.6;
        this.player1Sprite.frame = 8;
        this.player2Sprite.frame = 8;
        this.player1Sprite.animations.add('ready', [2, 3, 4, 5, 6, 7], 10, false);
        this.player2Sprite.animations.add('ready', [2, 3, 4, 5, 6, 7], 10, false);
        this.player1Sprite.animations.add('walk', [13, 14, 15, 16], 10, true);
        this.player2Sprite.animations.add('walk', [13, 14, 15, 16], 10, true);
        this.bulle1 = game.add.sprite(this.player1Sprite.x + (this.player1Sprite.width / 2) - BULLE_SKEW, this.player1Sprite.y - BULLE_HEIGHT, 'bulle');
        this.bulle1.anchor.set(0.5, 0);
        this.bulle1.scale.setTo(-1, 1);
        this.bulle2 = game.add.sprite(this.player2Sprite.x + (this.player1Sprite.width / 2) + BULLE_SKEW, this.player2Sprite.y - BULLE_HEIGHT, 'bulle');
        this.bulle2.anchor.set(0.5, 0);
        this.bulle1.animations.add('default', [0, 1], 4, true).play();
        this.bulle2.animations.add('default', [0, 1], 4, true).play();
    }

    createTitle() {
        this.title = game.add.sprite(game.world.centerX, MENU_TITLE_HEIGHT, 'anim_title');
        this.title.anchor.set(0.5, 0);
        this.title.animations.add('default', [0, 1, 2, 3, 4, 5, 6, 7], 4, false).play();
    }

    createTexts() {
        this.waitingText = game.add.text(game.world.centerX, game.world.centerY + MENU_TEXT_WAITING_HEIGHT, MENU_TEXT_WAITING, { font: MENU_TEXT_WAITING_FONT, fill: MENU_TEXT_WAITING_COLOR });
        this.waitingText.anchor.set(0.5);
        game.add.tween(this.waitingText).to({ alpha: 0 }, 3000, "Quart.easeInOut", true, 0, true, true).loop();

        this.readyText = game.add.text(16, 16, 'Press ?? to start !', { fontSize: '32px', fill: '#000' });
        this.readyText.alpha = 0;
    }

    initInputs() {
        game.input.gamepad.start();
        this.pad = game.input.gamepad.pad1;
        console.log('Pad initialized');
    }

}