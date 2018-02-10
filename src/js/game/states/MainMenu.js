class MainMenu extends Phaser.State {


    init(lobbyCode) {
        if (lobbyCode) {
            this.codeMessage = this.game.add.text(250, 780, this.game.translate('MENU_TEXT_CODE') + ' : ' + lobbyCode, { font: DEFAULT_FONT, fill: '#000' });
            this.codeMessage.alpha = 0.7;
        }
    }
    /**
     * preload fonction du phaser state
     */
    preload() {
        this.heros = [];
        this.heros[FLEUR_HEROS] = { sprite: null, bulle: null, selected: false, sound: 'sound_fleur', name: FLEUR_HEROS };
        this.heros[COLI_HEROS] = { sprite: null, bulle: null, selected: false, sound: 'sound_coli', name: COLI_HEROS };

        this.self = { id: null, selectedHero: null, position: FLEUR_HEROS };
        this.other = { id: null, selectedHero: null, position: FLEUR_HEROS };

        this.game.controlsManager.setCallbackContext(this);
        this.game.serverManager.setCallbackContext(this);
    }

    /**
     * create fonction du phaser state
     */
    create() {
        this.createBackground();
        this.createTitle();
        this.createCharacters();
        this.createTexts();
        this.game.audioManager.playMusic('main_menu');
        this.game.serverManager.getSocket().emit('newplayer');
    }

    /**
     * 
     * @param {Object} self : si le player initialisé est soi meme
     * @param {array} playerList : liste des joueurs du lobby
     */
    onInitNewPlayer(self, playerList) {
        if (self) {
            this.self = self;
        }
        this.onUpdatePlayers(playerList);
    }


    actionButtonReleased() {
        if (!this.heros[this.self.position].selected) {
            this.game.serverManager.getSocket().emit('selecthero', this.heros[this.self.position].name);
        } else if (this.self.selectedHero === this.self.position) {
            if (!this.game.audioManager.isSoundPlaying) {
                this.game.audioManager.playSound(this.heros[this.self.selectedHero].sound);
            }
        }
    }

    cancelButtonReleased() {
        if (this.self.selectedHero === this.self.position) {
            this.game.serverManager.getSocket().emit('selecthero', null);
        }
    }

    leftButtonReleased() {
        if (this.self.position == COLI_HEROS && !this.self.selectedHero) {
            this.changePosition(this.self, FLEUR_HEROS);
            this.game.serverManager.getSocket().emit('updateposition', FLEUR_HEROS);
        }
    }

    rightButtonReleased() {
        if (this.self.position == FLEUR_HEROS && !this.self.selectedHero) {
            this.changePosition(this.self, COLI_HEROS);
            this.game.serverManager.getSocket().emit('updateposition', COLI_HEROS);
        }
    }

    /**
     * fonction lançant la partie (scene)
     */
    onStartGame() {
        this.game.camera.fade('#000000', 3000);
        this.game.audioManager.stopCurrentMusic(3000);
        this.game.camera.onFadeComplete.add(() => {
            this.game.state.start('levelhub', true, false, this.self);
        }, this);
    }

    /**
     * Fonction permettant de mettre à jour un joueur
     * @param {Object} player : joueur à définir
     * @param {Object} playerData : données à utiliser
     */
    onUpdatePlayers(playerList) {

        playerList.forEach(player => {
            if (player === null) return;

            if (this.self.id === player.id) {
                this.self = player;
                this.checkHeroActivation(player, true);
            } else {
                this.other = player;
                this.checkHeroActivation(player, false);
            }
            if (!player.selectedHero)
                this.changePosition(player, player.position);
        });
    }

    /**
     * Fonction qui gère l'activation de la séléction d'un personnage sur l'écran titre
     * @param {Object} player 
     * @param {Object} self 
     */
    checkHeroActivation(player, self) {
        if (player.selectedHero) {
            this.activateHero(player, !self);
        } else {
            this.desactivateHero(player);
        }
    }

    /**
     * Fonction permettant de supprimer un joueur s'il se déconnecte
     */
    onDisconnect() {

        if (this.other.selectedHero) {
            this.desactivateHero(this.other);
        }
        if (this.other.id === 0) {
            this.p1.alpha = 0;
        } else {
            this.p2.alpha = 0;
        }

    }

    /**
     * Fonction permettant de valider la séléction d'un heros sur le menu principal
     * @param {Object} player : joueur qui a validé
     * @param {boolean} skip : sauter les animations/sons
     */
    activateHero(player, skip) {

        let selectedHero = this.heros[player.selectedHero];
        selectedHero.selected = true;
        selectedHero.sprite.alpha = 1;
        let text = player.id === 0 ? this.p1 : this.p2;
        if (skip) {
            selectedHero.bulle.alpha = 0;
            text.alpha = 0;
        } else {
            this.game.audioManager.playSound(selectedHero.sound);
            this.game.add.tween(selectedHero.bulle).to({ alpha: 0 }, 500, "Quart.easeInOut").start();
            this.game.add.tween(text).to({ alpha: 0 }, 500, "Quart.easeInOut").start();
        }

        // Animation of the hero
        selectedHero.sprite.animations.play(HEROS_ANIMATIONS.JUMP.NAME);
        selectedHero.sprite.animations.currentAnim.onComplete.add(function () {
            selectedHero.sprite.animations.play(HEROS_ANIMATIONS.HIGHLIGHT.NAME);
        });

    }

    /**
     * Fonction qui gère le changement de position du curseur sur l'écran titre
     * @param {Object} player 
     * @param {string} position 
     */
    changePosition(player, position) {
        player.position = position;

        let pSprite = player.id === 0 ? this.p1 : this.p2;
        this.self.id === player.id ? pSprite.alpha = 1 : pSprite.alpha = 0.5;

        if (position === COLI_HEROS) {
            pSprite.x = this.displayPlayerColiX;
        } else {
            pSprite.x = this.displayPlayerFleurX;
        }
    }

    /**
     * Fonction permettant d'annuler la séléction d'un heros sur le menu principal
     * @param {Object} player : joueur qui se desactive
     */
    desactivateHero(player) {

        let selectedHero;
        if (!player.selectedHero) {
            selectedHero = this.heros[player.position];
        } else {
            selectedHero = this.heros[player.selectedHero];
        }

        if (selectedHero.name === this.self.selectedHero || selectedHero.name === this.other.selectedHero) return;
        selectedHero.alpha = 0.6;
        selectedHero.bulle.alpha = 1;
        selectedHero.sprite.animations.stop();
        selectedHero.sprite.frame = HEROS_ANIMATIONS.SIT.FRAMES;
        selectedHero.selected = false;
        player.id === 0 ? this.p1.alpha = 1 : this.p2.alpha = 1;
    }

    /**
     * Créé le background
     */
    createBackground() {
        this.game.stage.backgroundColor = MENU_BACKGROUND_COLOR;
        this.background = this.game.add.sprite(0, 0, 'background_title');
        this.background.animations.add(MENU_BACKGROUND_ANIMATIONS.DEFAULT.NAME, MENU_BACKGROUND_ANIMATIONS.DEFAULT.FRAMES, 1, true).play();
    }

    /**
     * Créé les personnages Fleur et Coli + bulles
     */
    createCharacters() {

        let coli = this.heros[COLI_HEROS];
        let fleur = this.heros[FLEUR_HEROS];

        coli.sprite = this.game.add.sprite(this.game.world.centerX + (this.game.world.centerX / 2) - ((HEROS_WIDTH * CELL_SIZE) / 2), this.game.world.height - MENU_HEROS_POS_Y, 'coli');
        coli.sprite.alpha = 0.6;
        coli.sprite.frame = HEROS_SITTING_FRAME;
        coli.sprite.animations.add(HEROS_ANIMATIONS.JUMP.NAME, HEROS_ANIMATIONS.JUMP.FRAMES, 10, false);
        coli.sprite.animations.add(HEROS_ANIMATIONS.HIGHLIGHT.NAME, HEROS_ANIMATIONS.HIGHLIGHT.FRAMES, 10, true);

        coli.bulle = this.game.add.sprite(coli.sprite.x + (coli.sprite.width / 2) + BULLE_SKEW, 0, 'bulle');
        coli.bulle.y = coli.sprite.y - coli.bulle.height;
        coli.bulle.anchor.set(0.5, 0);
        coli.bulle.animations.add(BULLE_ANIMATIONS.PUSH_BUTTON.NAME, BULLE_ANIMATIONS.PUSH_BUTTON.FRAMES, 4, true).play();

        fleur.sprite = this.game.add.sprite((this.game.world.centerX / 2) - ((HEROS_WIDTH * CELL_SIZE) / 2), this.game.world.height - MENU_HEROS_POS_Y, 'fleur');
        fleur.sprite.alpha = 0.6;
        fleur.sprite.frame = HEROS_SITTING_FRAME;
        fleur.sprite.animations.add(HEROS_ANIMATIONS.JUMP.NAME, HEROS_ANIMATIONS.JUMP.FRAMES, 10, false);
        fleur.sprite.animations.add(HEROS_ANIMATIONS.HIGHLIGHT.NAME, HEROS_ANIMATIONS.HIGHLIGHT.FRAMES, 10, true);

        fleur.bulle = this.game.add.sprite(fleur.sprite.x + (fleur.sprite.width / 2) - BULLE_SKEW, 0, 'bulle');
        fleur.bulle.y = fleur.sprite.y - fleur.bulle.height;
        fleur.bulle.anchor.set(0.5, 0);
        fleur.bulle.scale.setTo(-1, 1);
        fleur.bulle.animations.add(BULLE_ANIMATIONS.PUSH_BUTTON.NAME, BULLE_ANIMATIONS.PUSH_BUTTON.FRAMES, 4, true).play();
    }

    /**
     * Créé le titre
     */
    createTitle() {
        this.title = this.game.add.sprite(this.game.world.centerX, MENU_TITLE_HEIGHT, 'anim_title');
        this.title.anchor.set(0.5, 0);
        this.title.animations.add(TITLE_ANIMATIONS.DEFAULT.NAME, TITLE_ANIMATIONS.DEFAULT.FRAMES, 4, false).play();
    }

    /**
     * Créé les textes de l'écran titre
     */
    createTexts() {
        this.waitingText = this.game.add.text(this.game.world.centerX, 0, this.game.translate('MENU_TEXT_WAITING'), { font: DEFAULT_FONT, fill: MENU_TEXT_WAITING_COLOR });
        this.waitingText.y = this.game.world.centerY + this.waitingText.height;
        this.waitingText.anchor.set(0.5);
        this.game.add.tween(this.waitingText).to({ alpha: 0 }, 3000, "Quart.easeInOut", true, 0, true, true).loop();

        this.fleurText = this.game.add.text(this.heros[FLEUR_HEROS].sprite.x + (this.heros[FLEUR_HEROS].sprite.width / 2), this.heros[FLEUR_HEROS].sprite.y + this.heros[FLEUR_HEROS].sprite.height + 20, this.game.translate('MENU_TEXT_FLEUR'), { font: DEFAULT_FONT, fill: MENU_TEXT_FLEUR_COLOR });
        this.fleurText.anchor.set(0.5);
        this.ColiText = this.game.add.text(this.heros[COLI_HEROS].sprite.x + (this.heros[COLI_HEROS].sprite.width / 2), this.heros[COLI_HEROS].sprite.y + this.heros[COLI_HEROS].sprite.height + 20, this.game.translate('MENU_TEXT_COLI'), { font: DEFAULT_FONT, fill: MENU_TEXT_COLI_COLOR });
        this.ColiText.anchor.set(0.5);

        this.displayPlayerFleurX = this.heros[FLEUR_HEROS].sprite.x + this.heros[FLEUR_HEROS].sprite.width + 10;
        this.displayPlayerColiX = this.heros[COLI_HEROS].sprite.x + this.heros[COLI_HEROS].sprite.width + 10;

        this.p1 = this.game.add.text(this.displayPlayerFleurX, this.heros[FLEUR_HEROS].sprite.y, this.game.translate('P1'), { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
        this.p2 = this.game.add.text(this.displayPlayerFleurX, this.heros[FLEUR_HEROS].sprite.y + 30, this.game.translate('P2'), { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
        this.p1.alpha = 0;
        this.p2.alpha = 0;
    }

    /**
     * fonction de shutdown de phaser.state
     */
    shutdown() {
        this.game.audioManager.stop();
    }
}
