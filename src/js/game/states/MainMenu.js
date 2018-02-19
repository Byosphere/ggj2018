class MainMenu extends Phaser.State {


    init(lobbyCode) {
        this.lobbyCode = lobbyCode;
    }
    /**
     * preload fonction du phaser state
     */
    preload() {
        this.game.controlsManager.setCallbackContext(this);
        this.game.serverManager.setCallbackContext(this);
        this.nbPlayers = 0;
        this.coli = this.game.add.sprite(this.game.world.centerX + (this.game.world.centerX / 2) - ((HEROS_WIDTH * CELL_SIZE) / 2), this.game.world.height - MENU_HEROS_POS_Y, 'coli');
        this.fleur = this.game.add.sprite((this.game.world.centerX / 2) - ((HEROS_WIDTH * CELL_SIZE) / 2), this.game.world.height - MENU_HEROS_POS_Y, 'fleur');
        this.coli.animations.add(HEROS_ANIMATIONS.HIGHLIGHT.NAME, HEROS_ANIMATIONS.HIGHLIGHT.FRAMES, 10, true).play();
        this.fleur.animations.add(HEROS_ANIMATIONS.HIGHLIGHT.NAME, HEROS_ANIMATIONS.HIGHLIGHT.FRAMES, 10, true).play();
    }

    /**
     * create fonction du phaser state
     */
    create() {
        this.createBackground();
        this.createTitle();
        this.createTexts();
        this.game.audioManager.playMusic('main_menu');
        this.game.serverManager.getSocket().emit('newplayer');
    }

    /**
     * 
     * @param {Object} self : si le player initialisé est soi meme
     * @param {array} playerList : liste des joueurs du lobby
     */
    onInitNewPlayer(playerList) {
        this.nbPlayers = 0;
        if (playerList[0]) this.nbPlayers++;
        if (playerList[1]) this.nbPlayers++;
        this.waitingText.text = this.game.translate('MENU_TEXT_WAITING') + '... (' + this.nbPlayers + '/2)';
    }

    /**
     * fonction lançant la partie (scene)
     */
    onStartGame() {
        this.game.camera.fade('#000000', 1000);
        this.game.audioManager.stopCurrentMusic(1000);
        this.game.camera.onFadeComplete.add(() => {
            this.game.state.start('levelhub');
        }, this);
    }

    /**
     * Fonction permettant de supprimer un joueur s'il se déconnecte
     */
    onDisconnect() {
        this.nbPlayers--;
        this.waitingText.text = this.game.translate('MENU_TEXT_WAITING') + '... (' + this.nbPlayers + '/2)';
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
        this.waitingText = this.game.add.text(this.game.world.centerX, 0, this.game.translate('MENU_TEXT_WAITING') + '... (' + this.nbPlayers + '/2)', { font: DEFAULT_FONT, fill: MENU_TEXT_WAITING_COLOR });
        this.waitingText.y = this.game.world.centerY + this.waitingText.height;
        this.waitingText.anchor.set(0.5);
        this.game.add.tween(this.waitingText).to({ alpha: 0 }, 3000, "Quart.easeInOut", true, 0, true, true).loop();
        this.codeMessage = this.game.add.text(250, 780, this.game.translate('MENU_TEXT_CODE') + ' : ' + this.lobbyCode, { font: DEFAULT_FONT, fill: '#000' });
        this.codeMessage.alpha = 0.7;
        this.fleurText = this.game.add.text(this.fleur.x + (this.fleur.width / 2), this.fleur.y + this.fleur.height + 20, this.game.translate('MENU_TEXT_FLEUR'), { font: DEFAULT_FONT, fill: MENU_TEXT_FLEUR_COLOR });
        this.fleurText.anchor.set(0.5);
        this.ColiText = this.game.add.text(this.coli.x + (this.coli.width / 2), this.coli.y + this.coli.height + 20, this.game.translate('MENU_TEXT_COLI'), { font: DEFAULT_FONT, fill: MENU_TEXT_COLI_COLOR });
        this.ColiText.anchor.set(0.5);
    }

    /**
     * fonction de shutdown de phaser.state
     */
    shutdown() {
    }
}
