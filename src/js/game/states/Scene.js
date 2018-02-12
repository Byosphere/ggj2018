class Scene extends Phaser.State {

    /**
     * Initialisation de la scene avec l'id du player et le niveau dans lequel il va jouer
     * @param {int} player
     * @param {int} level 
     */
    init(player, level, debug) {
        this.debug = debug || false;

        if (this.debug) {
            this.player = { id: 0, selectedHero: debug.heros, position: debug.heros };
        } else {
            this.player = player;
        }
        this.currentLevel = level || { level: 1, world: 1 };
        this.characterName = this.player.selectedHero;
    }

    preload() {
        this.game.stage.backgroundColor = SCENE_BACKGROUND;
        this.game.controlsManager.setCallbackContext(this);
        this.game.serverManager.setCallbackContext(this);
        this.buttonsGroup = null;
        this.doorsGroup = null;
        this.characterGroup = null;
        this.exitGroup = null;
        this.rocksGroup = null;
        this.exitActive = false;
        this.end = false;
        this.hud = new SceneHud(this.game);
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
        this.hud.start(this.currentLevel, () => {
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
    generateLevel(currentLevel, callback) {

        let loadBack = this.game.add.graphics(0, 0);
        loadBack.beginFill(0x00000, 1);
        loadBack.drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        loadBack.endFill();
        let preload = this.game.add.sprite(this.game.world.width - 100, this.game.world.height - 100, 'preloadbar');
        preload.anchor.setTo(0.5);
        preload.animations.add('default', [0, 1, 2, 3], 10, true);
        preload.animations.play('default');

        this.map = this.game.add.tilemap('level' + currentLevel.level + '_world' + currentLevel.world + '_' + this.characterName);
        this.map.addTilesetImage('decor');

        this.layer = this.map.createLayer('Walls');
        this.layer.resizeWorld();
        this.background = this.map.createLayer('Background');
        this.background.resizeWorld();

        this.map.setCollisionBetween(16, 50, true, 'Walls');

        // Groups
        this.exitGroup = this.game.add.group();
        this.buttonsGroup = this.game.add.group();
        this.buttonsGroup.enableBody = true;
        this.rocksGroup = this.game.add.group();
        this.rocksGroup.enableBody = true;
        this.doorsGroup = this.game.add.group();
        this.doorsGroup.enableBody = true;
        this.characterGroup = this.game.add.group();

        // Adding map objects
        const mapObjects = this.map.objects['Objects'];
        for (let i = 0; i < mapObjects.length; i++) {
            this.createObject(mapObjects[i]);
        }

        this.foreground = this.map.createLayer('Foreground');
        this.foreground.resizeWorld();

        this.loadGroup = this.game.add.group();
        this.loadGroup.add(loadBack);
        this.loadGroup.add(preload);

        this.pauseScreen = new PauseScreen(this.game);
        this.disconnectScreen = new DisconnectScreen(this.game);
        this.game.serverManager.getSocket().emit('levelready', this.debug);
    }

    /**
     * Factory pour les différents objets possibles à instancier pour la scene
     * @param {Object} obj : objet à instancier
     */
    createObject(obj) {
        const type = obj.properties.Type;
        switch (type) {
            case 'character':
                this.character = new Character(this.game, obj, this.characterName, this.layer);
                this.characterGroup.add(this.character);
                break;
            case 'button':
                this.buttonsGroup.add(new Button(this.game, obj, this.character, this.rocksGroup));
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
        if (!this.character.carry) {
            this.game.physics.arcade.overlap(this.character, this.rocksGroup, (char, rock) => {
                char.catchItem(rock);
            });
        }

        if (this.debug) {
            this.game.debug.body(this.layer);
            this.game.debug.body(this.character);
            this.doorsGroup.forEach(door => {
                this.game.debug.body(door);
            });

            this.rocksGroup.forEach(rock => {
                this.game.debug.body(rock);
            });
            this.game.debug.body(this.exitGroup.children[0]);
            this.buttonsGroup.forEach(button => {
                this.game.debug.body(button);
            });

        }

        if (this.game.physics.arcade.overlap(this.character, this.doorsGroup)) {
            this.character.resetPosition();
            this.hud.removeLife(1);
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

    onResetLevel(gameover) {
        if (gameover) {
            this.gameOverScreen = new GameOverScreen(this.game);
            this.gameOverScreen.display(() => {
                this.gameOverScreen.destroy();
                this.game.camera.fade('#000000', 200);
                this.game.camera.onFadeComplete.add(() => {
                    this.game.state.start('scene', true, false, this.player, this.currentLevel);
                }, this);
            });
        } else {
            this.game.camera.fade('#000000', 200);
            this.game.camera.onFadeComplete.add(() => {
                this.game.state.start('scene', true, false, this.player, this.currentLevel);
            }, this);
        }
    }

    actionButtonReleased() {
        if (this.end) {
            this.currentLevel.level++;
            this.game.state.start('scene', true, false, this.player, this.currentLevel);
        } else if (this.character.hasItem()) {
            this.character.dropItem(this.rocksGroup);
        }
    }

    startButtonReleased() {
        if (this.pauseScreen.isOnPause()) {
            this.pauseScreen.hide();
            this.hud.resumeTime();
        } else {
            this.pauseScreen.display();
            this.hud.pauseTime();
        }
    }

    cancelButtonReleased() {
        if (this.pauseScreen.isOnPause()) {
            this.game.serverManager.getSocket().emit('reset');
            this.onResetLevel();
        }

        if (this.disconnectScreen.isDisconnected()) {
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
        this.hud.stopTime();
        setTimeout(() => {
            this.hud.hideHud();
            this.game.audioManager.stopCurrentMusic();
            this.game.audioManager.playSound('win');
            this.game.camera.flash();
            if (this.currentLevel.level < NB_LEVELS) {
                this.endTitle = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'victory');
                this.endTitle.anchor.setTo(0.5);
                this.endTitle.animations.add(VICTORY_TITLE.DISPLAY.NAME, VICTORY_TITLE.DISPLAY.FRAMES, 10, false).play();
                this.endText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 350, this.game.translate('GENERIC_PRESS_BUTTON') + ' ' + this.game.controlsManager.getActionButtonName(), { font: GAME_TEXT_NEXT_LEVEL_FONT, fill: GAME_TEXT_NEXT_LEVEL_COLOR });
                this.endText.anchor.setTo(0.5);
                this.timerText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 300, this.game.translate('END_TIME') + ' ' + this.hud.getFormatedTime(), { font: GAME_TEXT_NEXT_LEVEL_FONT, fill: GAME_TEXT_NEXT_LEVEL_COLOR });
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
        this.game.audioManager.stop();
        this.map.destroy();
        this.doorsGroup.destroy();
        this.characterGroup.destroy();
        this.rocksGroup.destroy();
        this.buttonsGroup.destroy();
        this.exitGroup.destroy();
        this.exitActive = false;
        this.game.controlsManager.enableControls();
        this.end = false;
        this.hud.resetTime();
        this.hud = null;
        this.disconnectScreen.destroy();
        this.pauseScreen.destroy();
        this.layer.destroy();
        this.background.destroy();
        this.foreground.destroy();
    }
}
