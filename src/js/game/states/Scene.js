class Scene extends Phaser.State {

    /**
     * Initialisation de la scene avec l'id du player et le niveau dans lequel il va jouer
     * @param {int} player
     * @param {int} level 
     */
    init(player, level) {
        if (DEBUG) {
            this.player = { id: 0, selectedHero: DEBUG_HEROS, position: DEBUG_HEROS };
            this.currentLevel = DEBUG_LEVEL;
        } else {
            this.player = player;
            this.currentLevel = level || 1;
        }
        this.characterName = this.player.selectedHero;
    }

    preload() {
        this.game.stage.backgroundColor = SCENE_BACKGROUND;
        this.game.controlsManager.setCallbackContext(this);
        this.game.serverManager.setCallbackContext(this);
        this.victoryMusic = this.game.add.audio('win');
        this.buttonsGroup = null;
        this.doorsGroup = null;
        this.characterGroup = null;
        this.exitGroup = null;
        this.rocksGroup = null;
        this.overlapedButton = null;
        this.exitActive = false;
        this.end = false;
        this.timer = new Timer(this.game);
    }

    /**
     * Initialise le niveau
     */
    create() {
        this.game.controlsManager.disableControls();
        this.generateLevel(this.currentLevel);
    }

    /**
     * Lance le niveau
     */
    onStartLevel() {
        this.loadGroup.destroy();
        this.timer.start(this.currentLevel, () => {
            this.game.controlsManager.enableControls();
            this.game.audioManager.playMusic('game');
        });
    }

    /**
     * Fonction pour animer les portes à ouvrir
     * @param {String} color : Couleur des portes à ouvrir
     */
    onOpenDoor(color) {
        this.doorsGroup.forEach(door => {
            if (door.colorParam == color)
                door.openDoor();
        });
    }

    /**
     * Fonction pour animer les portes à fermer
     * @param {String} color : Couleur des portes à ouvrir
     */
    onCloseDoor(color) {
        this.doorsGroup.forEach(door => {
            if (door.colorParam == color)
                door.closeDoor();
        });
    }

    /**
     * Génère l'environnement du niveau passé en paramètre
     * @param {*int} level : niveau à générer
     * @param {function} callback : fonction appelée une fois le niveau généré
     */
    generateLevel(level, callback) {

        let loadBack = this.game.add.graphics(0, 0);
        loadBack.beginFill(0x00000, 1);
        loadBack.drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        loadBack.endFill();
        let preload = this.game.add.sprite(this.game.world.width - 100, this.game.world.height - 100, 'preloadbar');
        preload.anchor.setTo(0.5);
        preload.animations.add('default', [0, 1, 2, 3], 10, true);
        preload.animations.play('default');

        this.map = this.game.add.tilemap('level' + level + this.characterName);
        this.map.addTilesetImage('decor');

        this.layer = this.map.createLayer('Walls');
        this.layer.resizeWorld();
        this.background = this.map.createLayer('Background');
        this.background.resizeWorld();

        this.map.setCollisionBetween(17, 50, true, 'Walls');

        // Groups
        this.exitGroup = this.game.add.group();
        this.buttonsGroup = this.game.add.group();
        this.buttonsGroup.enableBody = true;
        this.rocksGroup = this.game.add.group();
        this.rocksGroup.enableBody = true;
        this.doorsGroup = this.game.add.group();
        this.doorsGroup.enableBody = true;
        this.characterGroup = this.game.add.group();
        this.loadGroup = this.game.add.group();
        this.loadGroup.add(loadBack);
        this.loadGroup.add(preload);

        // Adding map objects
        const mapObjects = this.map.objects['Objects'];
        for (let i = 0; i < mapObjects.length; i++) {
            this.createObject(mapObjects[i]);
        }

        this.foreground = this.map.createLayer('Foreground');
        this.foreground.resizeWorld();

        this.pauseScreen = new PauseScreen(this.game);
        this.disconnectScreen = new DisconnectScreen(this.game);
        this.game.serverManager.getSocket().emit('levelready', DEBUG);
    }

    /**
     * Factory pour les différents objets possibles à instancier pour la scene
     * @param {Object} obj : objet à instancier
     */
    createObject(obj) {
        const type = obj.properties.Type;
        switch (type) {
            case 'character':
                this.character = new Character(this.game, obj, this.characterName);
                this.characterGroup.add(this.character);
                break;
            case 'button':
                this.buttonsGroup.add(new Button(this.game, obj));
                break;
            case 'door':
                this.doorsGroup.add(new Door(this.game, obj));
                break;
            case 'rock':
                this.rocksGroup.add(new Rock(this.game, obj));
                break;
            case 'exit':
                this.exitGroup.add(new Exit(this.game, obj, this.player.id));
                break;
            default:
                console.log(type);
                break;
        }
    }

    update() {
        this.game.physics.arcade.collide(this.character, this.layer);
        this.game.physics.arcade.collide(this.character, this.doorsGroup);
        this.game.physics.arcade.collide(this.character, this.rocksGroup);

        if (DEBUG) {
            this.game.debug.body(this.layer);
            this.game.debug.body(this.character);
            this.doorsGroup.forEach(door => {
                this.game.debug.body(door);
            });
            this.game.debug.body(this.exitGroup.children[0]);
            this.buttonsGroup.forEach(button => {
                this.game.debug.body(button);
            });

        }

        if (this.game.physics.arcade.overlap(this.character, this.doorsGroup)) {
            this.character.resetPosition();
        }

        let overlap = this.game.physics.arcade.overlap(this.character, this.buttonsGroup, this.pressButton, null, this);
        if (!overlap && this.overlapedButton) {
            this.overlapedButton.toggleOff();
            this.overlapedButton = null;
        }

        let exit = this.game.physics.arcade.overlap(this.character, this.exitGroup, this.onExit, null, this);
        if (!exit && this.exitActive) {
            this.game.serverManager.getSocket().emit('outexit');
            this.exitActive = false;
        }

    }

    /**
     * Si un joueur se déconnecte
     */
    onDisconnect() {
        this.disconnectScreen.display();
    }

    onResetLevel() {
        this.game.camera.fade('#000000', 200);
        this.game.camera.onFadeComplete.add(() => {
            this.game.state.start('scene', true, false, this.player, this.currentLevel);
        }, this);
    }

    actionButtonReleased() {
        if (this.end)
            this.game.state.start('scene', true, false, this.player, this.currentLevel + 1);
    }

    startButtonReleased() {
        if (this.pauseScreen.isOnPause()) {
            this.pauseScreen.hide();
        } else {
            this.pauseScreen.display();
        }
    }

    cancelButtonReleased() {
        if (this.pauseScreen.isOnPause()) {
            this.game.serverManager.getSocket().emit('reset');
            this.onResetLevel();
        }
        if (this.disconnectScreen.isDisconnected) {
            this.game.state.start('lobby');
        }
    }

    leftButtonDown() {
        this.character.moveLeft();
    }

    rightButtonDown() {
        this.character.moveRight();
    }

    upButtonDown() {
        this.character.moveUp();
    }

    downButtonDown() {
        this.character.moveDown();
    }

    leftButtonReleased() {
        this.character.stopLeft();
    }

    rightButtonReleased() {
        this.character.stopRight();
    }

    downButtonReleased() {
        this.character.stopDown();
    }

    upButtonReleased() {
        this.character.stopUp();
    }

    /**
     * Action lorsqu'un bouton est pressé
     * @param {Phaser.Sprite} playerSprite 
     * @param {Phaser.Sprite} buttonSprite 
     */
    pressButton(playerSprite, buttonSprite) {
        if (!this.overlapedButton) {
            buttonSprite.toggleOn();
            this.overlapedButton = buttonSprite;
        }
    }

    /**
     * Action lorsque la zone de sortie est atteinte
     * @param {Phaser.Sprite} playerSprite 
     * @param {Phaser.Sprite} exitSprite 
     */
    onExit(playerSprite, exitSprite) {
        if (!this.exitActive) {
            this.game.serverManager.getSocket().emit('inexit');
            this.exitActive = true;
        }
    }

    /**
     * Action lorsque le niveau est terminé
     */
    onLevelCompleted() {
        this.game.serverManager.getSocket().emit('finishlevel');
        this.game.controlsManager.disableControls([ACTION]);
        this.character.alpha = 0;
        this.exitGroup.children[0].animateSuccess();
        this.timer.stopTime();
        setTimeout(() => {
            this.timer.hideTimer();
            this.game.audioManager.stopCurrentMusic();
            this.victoryMusic.fadeIn(500, false);
            this.game.camera.flash();
            if (this.currentLevel < NB_LEVELS) {
                this.endTitle = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'victory');
                this.endTitle.anchor.setTo(0.5);
                this.endTitle.animations.add(VICTORY_TITLE.DISPLAY.NAME, VICTORY_TITLE.DISPLAY.FRAMES, 10, false).play();
                this.endText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 350, this.game.translate.GENERIC_PRESS_BUTTON + ' ' + this.game.controlsManager.getActionButtonName(), { font: GAME_TEXT_NEXT_LEVEL_FONT, fill: GAME_TEXT_NEXT_LEVEL_COLOR });
                this.endText.anchor.setTo(0.5);
                this.timerText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 300, this.game.translate.END_TIME + ' ' + this.timer.getFormatedTime(), { font: GAME_TEXT_NEXT_LEVEL_FONT, fill: GAME_TEXT_NEXT_LEVEL_COLOR });
                this.timerText.anchor.setTo(0.5);
            } else {
                this.endTitle = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'felicitations');
                this.endTitle.anchor.setTo(0.5);
                this.endTitle.animations.add('default', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 10, false).play();
            }
            this.end = true;
        }, 3000);
    }

    /**
     * Fonction appelée au moment du changement de scene
     */
    shutdown() {
        this.victoryMusic.stop();
        this.victoryMusic.destroy();
        this.map.destroy();
        this.doorsGroup.destroy();
        this.characterGroup.destroy();
        this.rocksGroup.destroy();
        this.buttonsGroup.destroy();
        this.exitGroup.destroy();
        this.overlapedButton = null;
        this.exitActive = false;
        this.game.controlsManager.enableControls();
        this.end = false;
        this.timer.resetTime();
        this.timer = null;
        this.disconnectScreen.destroy();
        this.pauseScreen.destroy();
    }
}
