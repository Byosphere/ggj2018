class MainMenu extends Phaser.State {

    init() {
        this.MENU_GENERAL_STATE = 1;
        this.MENU_CREATE_LOBBY = 2;
        this.MENU_JOIN_LOBBY = 3;
    }

    preload() {
        this.game.controlsManager.setCallbackContext(this);
        this.game.serverManager.setCallbackContext(this);
        this.game.stage.backgroundColor = MENU_BACKGROUND_COLOR;
        this.state = 0;
        this.playerIndex = 0;
        this.nbPlayers = 1;
        this.connected = false;
        this.input = this.game.add.inputField(this.game.world.centerX - 110, this.game.world.centerY + 70, {
            font: '44px uni0553',
            width: 220,
            height: 60,
            padding: 4,
            placeHolder: 'Code',
            blockInput: true
        });
        this.input.visible = false;
        this.joinLobbyGroup = this.game.add.group();
    }


    displayBackground() {

        this.title = this.game.add.sprite(this.game.world.centerX, -100, 'anim_title');
        this.title.anchor.set(0.5, 0);
        this.title.scale.setTo(0.2, 0.2);
        this.title.animations.add(TITLE_ANIMATIONS.DEFAULT.NAME, TITLE_ANIMATIONS.DEFAULT.FRAMES, 4, false).play();
        displayOverlay(this);
        this.game.add.tween(this.title).to({ y: MENU_TITLE_HEIGHT }, 1000, 'Quart.easeInOut', true, 1000);
        let lastTween = this.game.add.tween(this.title.scale).to({ x: 1, y: 1 }, 1000, 'Quart.easeInOut', true, 1000);
        lastTween.onComplete.add(() => {
            this.initMenu();
        }, this);
    }

    hideBackground() {
        return new Promise((resolve) => {
            this.infoText.hide();
            if (this.newLobbyGroup)
                this.newLobbyGroup.alpha = 0;
            this.joinLobbyGroup.alpha = 0;
            this.coli.alpha = 0;
            this.fleur.alpha = 0;
            this.input.visible = false;
            this.game.add.tween(this.title).to({ alpha: 0 }, 500, 'Quart.easeInOut', true, 0);
            hideOverlay(this).then(() => {
                resolve(true);
            });
        });
    }

    initMenu() {
        this.coli = this.game.add.sprite(this.game.world.centerX + (this.game.world.centerX / 2) - ((HEROS_WIDTH * CELL_SIZE) / 2), this.game.world.centerY, 'coli');
        this.fleur = this.game.add.sprite((this.game.world.centerX / 2) - ((HEROS_WIDTH * CELL_SIZE) / 2), this.game.world.centerY, 'fleur');
        this.coli.animations.add(HEROS_ANIMATIONS.HIGHLIGHT.NAME, HEROS_ANIMATIONS.HIGHLIGHT.FRAMES, 10, true).play();
        this.fleur.animations.add(HEROS_ANIMATIONS.HIGHLIGHT.NAME, HEROS_ANIMATIONS.HIGHLIGHT.FRAMES, 10, true).play();
        this.menuList = [];
        let elem1 = this.game.add.text(this.game.world.centerX, 450, this.game.translate('LOBBY_TEXT_CREATE'), { font: DEFAULT_FONT, fill: MENU_TEXT_WAITING_COLOR });
        elem1.anchor.setTo(0.5, 0);
        elem1.id = 0;
        this.game.controlsManager.clickable(elem1);
        this.menuList.push(elem1);
        let elem2 = this.game.add.text(this.game.world.centerX, elem1.y + 60, this.game.translate('LOBBY_TEXT_JOIN'), { font: DEFAULT_FONT, fill: MENU_TEXT_WAITING_COLOR });
        elem2.anchor.setTo(0.5, 0);
        elem2.alpha = 0.3;
        elem2.id = 1;
        this.game.controlsManager.clickable(elem2);
        this.menuList.push(elem2);
        let elem3 = this.game.add.text(this.game.world.centerX, elem2.y + 60, this.game.translate('PARAMETERS_TITLE'), { font: DEFAULT_FONT, fill: MENU_TEXT_WAITING_COLOR });
        elem3.anchor.setTo(0.5, 0);
        elem3.alpha = 0.3;
        elem3.id = 2;
        this.game.controlsManager.clickable(elem3);
        this.menuList.push(elem3);
        let elem4 = this.game.add.text(this.game.world.centerX, elem3.y + 60, this.game.translate('INSTRUCTIONS'), { font: DEFAULT_FONT, fill: MENU_TEXT_WAITING_COLOR });
        elem4.anchor.setTo(0.5, 0);
        elem4.alpha = 0.3;
        elem4.id = 3;
        this.game.controlsManager.clickable(elem4);
        this.menuList.push(elem4);
        let elem5 = this.game.add.text(this.game.world.centerX, elem4.y + 60, this.game.translate('QUIT'), { font: DEFAULT_FONT, fill: MENU_TEXT_WAITING_COLOR });
        elem5.anchor.setTo(0.5, 0);
        elem5.alpha = 0.3;
        elem5.id = 4;
        this.game.controlsManager.clickable(elem5);
        this.menuList.push(elem5);
        this.game.serverManager.getSocket().emit('init');
    }

    create() {
        this.displayBackground();
        this.game.controlsManager.enableControls();
        this.game.audioManager.playMusic('main_menu');
        this.infoText = new TextMessage(this.game);
        setTimeout(() => {
            if (!this.connected)
                this.infoText.show(null, this.game.translate('LOBBY_TEXT_ERROR'), this.game.translate('LOBBY_TEXT_ERROR2'));
        }, 5000);
    }

    onGameInit() {
        this.connected = true;
        this.infoText.show(null, this.game.translate('LOBBY_TEXT_CONNECTED'), this.game.translate('LOBBY_TEXT_INSTRUCTIONS'));
        this.state = this.MENU_GENERAL_STATE;
    }

    onNewLobby(code) {
        this.code = code;
        this.game.serverManager.getSocket().emit('newplayer');
        this.state = this.MENU_CREATE_LOBBY;
        this.infoText.show(null, this.game.translate('LOBBY_TEXT_CODE_INSTRUCTIONS_1'), this.game.translate('LOBBY_TEXT_CODE_INSTRUCTIONS_2'));
        this.menuList.forEach(el => {
            el.alpha = 0;
        });
        let waitingText = this.game.add.text(this.game.world.centerX, 0, this.game.translate('MENU_TEXT_WAITING') + '...', { font: DEFAULT_FONT, fill: MENU_TEXT_WAITING_COLOR });
        waitingText.y = this.game.world.centerY + waitingText.height;
        waitingText.anchor.set(0.5);
        waitingText.alpha = 0.7;
        this.game.add.tween(waitingText).to({ alpha: 0 }, 3000, "Quart.easeInOut", true, 0, true, true).loop();
        let codeMessage = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 130, this.game.translate('MENU_TEXT_CODE') + ' : ' + code, { font: HEAD_FONT, fill: DEFAULT_COLOR });
        codeMessage.anchor.setTo(0.5);
        this.newLobbyGroup = this.game.add.group();
        this.newLobbyGroup.add(waitingText);
        this.newLobbyGroup.add(codeMessage);
    }

    /**
     * fonction lançant la partie (scene)
     */
    onStartGame() {
        this.game.audioManager.stopCurrentMusic(1000);
        this.hideBackground().then(() => {
            this.game.state.start('levelhub');
        });
    }

    onJoinLobby(success) {
        if (success) {
            this.game.serverManager.getSocket().emit('newplayer');
        }
    }

    backFromJoinLobby() {
        this.state = this.MENU_GENERAL_STATE;
        this.infoText.show(null, this.game.translate('LOBBY_TEXT_CONNECTED'), this.game.translate('LOBBY_TEXT_INSTRUCTIONS'));
        this.menuList.forEach((el, i) => {
            if (i === this.playerIndex)
                el.alpha = 1;
            else
                el.alpha = 0.3;
        });
        this.input.visible = false;
        this.validateText.destroy();
    }

    backFromCreateLobby() {
        this.state = this.MENU_GENERAL_STATE;
        this.infoText.show(null, this.game.translate('LOBBY_TEXT_CONNECTED'), this.game.translate('LOBBY_TEXT_INSTRUCTIONS'));
        this.menuList.forEach((el, i) => {
            if (i === this.playerIndex)
                el.alpha = 1;
            else
                el.alpha = 0.3;
        });
        this.newLobbyGroup.destroy();
        this.game.serverManager.getSocket().emit('quit');
    }

    displayJoinLobby() {
        this.infoText.show(null, this.game.translate('LOBBY_TEXT_CODE_INSTRUCTIONS_3'), this.game.translate('LOBBY_TEXT_CODE_INSTRUCTIONS_4'));
        this.state = this.MENU_JOIN_LOBBY;
        this.menuList.forEach(el => {
            el.alpha = 0;
        });
        this.input.visible = true;
        this.input.startFocus();
        this.validateText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 190, this.game.translate('GENERIC_PRESS_BUTTON') + ' ' + this.game.controlsManager.getActionButtonName() + ' ' + this.game.translate('TO_JOIN_LOBBY'), { font: DEFAULT_FONT, fill: MENU_TEXT_WAITING_COLOR });
        this.validateText.anchor.set(0.5);
        this.joinLobbyGroup.add(this.validateText);
    }

    downButtonReleased() {
        switch (this.state) {
            case this.MENU_GENERAL_STATE:
                if (this.playerIndex < this.menuList.length - 1) {
                    this.game.audioManager.playSound('cursor');
                    this.menuList[this.playerIndex].alpha = 0.3;
                    this.playerIndex++;
                    this.menuList[this.playerIndex].alpha = 1;
                }
                break;
        }
    }

    upButtonReleased() {
        switch (this.state) {
            case this.MENU_GENERAL_STATE:
                if (this.playerIndex > 0) {
                    this.game.audioManager.playSound('cursor');
                    this.menuList[this.playerIndex].alpha = 0.3;
                    this.playerIndex--;
                    this.menuList[this.playerIndex].alpha = 1;
                }
                break;
        }
    }

    actionButtonReleased() {
        switch (this.state) {
            case this.MENU_GENERAL_STATE:
                switch (this.playerIndex) {
                    case 0:
                        this.game.audioManager.playSound('bip');
                        this.game.serverManager.getSocket().emit('newlobby');
                        break;
                    case 1:
                        this.game.audioManager.playSound('bip');
                        this.displayJoinLobby();
                        break;
                    case 2:
                        this.game.audioManager.playSound('bip');
                        this.menuList.forEach(el => {
                            el.alpha = 0;
                        });
                        this.game.controlsManager.disableControls();
                        this.hideBackground().then(() => {
                            this.game.state.start('param', true, false, 'menu');
                        });
                        break;
                    case 3:
                        this.game.state.start('htp');
                        break;
                    case 4:
                        if (this.game.isElectronApp) {
                            this.game.electronManager.quit();
                        } else {
                            window.location = './';
                        }
                        break;
                }
                break;
            case this.MENU_JOIN_LOBBY:
                if (this.input.text.text) {
                    this.game.serverManager.getSocket().emit('joinlobby', this.input.text.text);
                }
                break;
        }
    }

    mouseLeftClick() {
        this.actionButtonReleased();
    }

    mouseOver(obj) {
        if (this.playerIndex != obj.id && this.state === this.MENU_GENERAL_STATE) {
            this.playerIndex = obj.id;
            this.menuList.forEach(el => {
                el.alpha = 0.3;
            });
            this.menuList[this.playerIndex].alpha = 1;
            this.game.audioManager.playSound('cursor');
        }
    }

    cancelButtonReleased() {
        switch (this.state) {
            case this.MENU_JOIN_LOBBY:
                this.game.audioManager.playSound('back');
                this.backFromJoinLobby();
                break;
            case this.MENU_CREATE_LOBBY:
                this.game.audioManager.playSound('back');
                this.backFromCreateLobby();
                break;
        }
    }
}
