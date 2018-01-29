class MainMenu extends Phaser.State {

    preload() {
        this.self = { id: null, name: null, ready: false, sprite: null };
        this.other = { id: null, name: null, ready: false, sprite: null };
        this.sentReadyInfo = false;
        this.player1Sprite = null;
        this.player2Sprite = null;
        
        //musique
        this.music = this.add.audio('main_menu');
        this.music.loop = true;

        //sons
        this.soundColi = this.add.audio('sound_coli');
        this.soundColi.onStop.add(() => this.soundPlaying = false, this);
        this.soundFleur = this.add.audio('sound_fleur');
        this.soundFleur.onStop.add(() => this.soundPlaying = false, this);
        this.soundPlaying = false;

    }

    create() {
        this.createBackground();
        this.createTitle();
        this.createCharacters();
        this.createTexts();
        this.connectServer();

        //initialise les manettes
        

        this.music.onDecoded.add(() => {
            this.music.fadeIn(1000, true);
        });
    }

    update() {
        if (this.game.controlsManager.actionButtonReleased()) {
            if (!this.sentReadyInfo) {
                this.sentReadyInfo = true;
                this.activateHero(this.self);
                this.game.socket.emit('playerready');
            } else {
                if (!this.soundPlaying) {
                    this.soundPlaying = true;
                    if (this.self.id) {
                        this.soundFleur.play();
                    } else {
                        this.soundColi.play();
                    }
                }
            }
        }
    }

    /**
     * Fonction rassemblant tous les écouteurs de socket IO
     */
    connectServer() {
        this.game.socket.emit('newplayer');

        this.game.socket.on('selfplayer', (data) => {
            this.setPlayer(this.self, data.self);
            if (this.self.id === 1) {
                this.setPlayer(this.other, data.others[0]);
            }
        });

        this.game.socket.on('otherplayer', (player) => {
            this.setPlayer(this.other, player);
        });

        this.game.socket.on('playerready', (player) => {
            if (this.self.id === player.id) {
                this.activateHero(this.self);
            } else {
                this.activateHero(this.other);
            }
        });

        this.game.socket.on('startgame', () => {
            this.startGame();
        });

        this.game.socket.on('disconnect', () => {
            this.removePlayer();
        });
    }


    startGame() {
        this.game.camera.fade('#000000', 3000);
        this.music.fadeOut(3000);
        this.game.camera.onFadeComplete.add(() => {
            this.game.state.start('scene', true, false, this.self.id);
        }, this);
    }

    /**
     * Fonction permettant de définir un joueur
     * @param {Object} player : joueur à définir
     * @param {Object} playerData : données à utiliser
     */
    setPlayer(player, playerData) {
        player.id = playerData.id;
        player.name = player.id === 0 ? 'Fleur' : 'Coli';
        player.sprite = player.id === 0 ? this.player1Sprite : this.player2Sprite;
        player.ready = playerData.ready;
        if (player.ready) {
            this.activateHero(player, true);
        }
    }

    /**
     * Fonction permettant de supprimer un joueur s'il se déconnecte
     */
    removePlayer() {

        if (this.other.ready) {
            this.desactivateHero(this.other);
        }

    }

    /**
     * Fonction permettant de valider la séléction d'un heros sur le menu principal
     * @param {Object} player : joueur qui a validé
     * @param {boolean} skip : sauter les animations/sons
     */
    activateHero(player, skip) {
        player.ready = true;
        player.sprite.alpha = 1;

        switch (player.id) {

            case 0:
                if (skip) {
                    this.bulle1.alpha = 0;
                } else {
                    this.soundPlaying = true;
                    this.soundColi.play();
                    this.game.add.tween(this.bulle1).to({ alpha: 0 }, 500, "Quart.easeInOut").start();
                }
                break;

            case 1:
                if (skip) {
                    this.bulle2.alpha = 0;
                } else {
                    this.soundPlaying = true;
                    this.soundFleur.play();
                    this.game.add.tween(this.bulle2).to({ alpha: 0 }, 500, "Quart.easeInOut").start();
                }
                break;

            default:
                console.error('Player\'s ID is incorrect !');
        }

        // Animation of the hero
        player.sprite.animations.play('ready');
        player.sprite.animations.currentAnim.onComplete.add(function () {
            player.sprite.animations.play('walk');
        });

    }

    /**
     * Fonction permettant d'annuler la séléction d'un heros sur le menu principal
     * @param {Object} player : joueur qui se desactive
     */
    desactivateHero(player) {
        player.sprite.alpha = 0.6;
        this.other.ready = false;
        if (player.id === 0) {
            this.bulle1.alpha = 1;
        } else {
            this.bulle2.alpha = 1;
        }
        player.sprite.animations.stop();
        player.sprite.frame = 8;
    }

    /**
     * Créé le background
     */
    createBackground() {
        this.game.stage.backgroundColor = MENU_BACKGROUND_COLOR;
        this.background = this.game.add.sprite(0, 0, 'background_title');
        this.background.animations.add('default', [0, 1], 1, true).play();
    }

    /**
     * Créé les personnages Fleur et Coli + bulles
     */
    createCharacters() {
        this.player2Sprite = this.game.add.sprite(this.game.world.centerX + (this.game.world.centerX / 2) - (HEROS_WIDTH / 2), this.game.world.height - MENU_HEROS_POS_Y, 'coli');
        this.player1Sprite = this.game.add.sprite((this.game.world.centerX / 2) - (HEROS_WIDTH / 2), this.game.world.height - MENU_HEROS_POS_Y, 'fleur');
        this.player1Sprite.alpha = 0.6;
        this.player2Sprite.alpha = 0.6;
        this.player1Sprite.frame = HEROS_SITTING_FRAME;
        this.player2Sprite.frame = HEROS_SITTING_FRAME;
        this.player1Sprite.animations.add('ready', [2, 3, 4, 5, 6, 7], 10, false);
        this.player2Sprite.animations.add('ready', [2, 3, 4, 5, 6, 7], 10, false);
        this.player1Sprite.animations.add('walk', [13, 14, 15, 16], 10, true);
        this.player2Sprite.animations.add('walk', [13, 14, 15, 16], 10, true);

        this.bulle1 = this.game.add.sprite(this.player1Sprite.x + (this.player1Sprite.width / 2) - BULLE_SKEW, 0, 'bulle');
        this.bulle1.y = this.player1Sprite.y - this.bulle1.height;
        this.bulle1.anchor.set(0.5, 0);
        this.bulle1.scale.setTo(-1, 1);
        this.bulle1.animations.add('default', [0, 1], 4, true).play();

        this.bulle2 = this.game.add.sprite(this.player2Sprite.x + (this.player1Sprite.width / 2) + BULLE_SKEW, 0, 'bulle');
        this.bulle2.y = this.player2Sprite.y - this.bulle2.height;
        this.bulle2.anchor.set(0.5, 0);
        this.bulle2.animations.add('default', [0, 1], 4, true).play();

    }

    /**
     * Créé le titre
     */
    createTitle() {
        this.title = this.game.add.sprite(this.game.world.centerX, MENU_TITLE_HEIGHT, 'anim_title');
        this.title.anchor.set(0.5, 0);
        this.title.animations.add('default', [0, 1, 2, 3, 4, 5, 6, 7], 4, false).play();
    }

    /**
     * Créé les textes de l'écran titre
     */
    createTexts() {
        this.waitingText = this.game.add.text(this.game.world.centerX, 0, MENU_TEXT_WAITING, { font: DEFAULT_FONT, fill: MENU_TEXT_WAITING_COLOR });
        this.waitingText.y = this.game.world.centerY + this.waitingText.height;
        this.waitingText.anchor.set(0.5);
        this.game.add.tween(this.waitingText).to({ alpha: 0 }, 3000, "Quart.easeInOut", true, 0, true, true).loop();

        this.fleurText = this.game.add.text(this.player1Sprite.x + (this.player1Sprite.width / 2), this.player1Sprite.y + this.player1Sprite.height + 20, MENU_TEXT_FLEUR, { font: DEFAULT_FONT, fill: MENU_TEXT_FLEUR_COLOR });
        this.fleurText.anchor.set(0.5);
        this.ColiText = this.game.add.text(this.player2Sprite.x + (this.player2Sprite.width / 2), this.player2Sprite.y + this.player2Sprite.height + 20, MENU_TEXT_COLI, { font: DEFAULT_FONT, fill: MENU_TEXT_COLI_COLOR });
        this.ColiText.anchor.set(0.5);
    }

    shutdown() {

    }
}
