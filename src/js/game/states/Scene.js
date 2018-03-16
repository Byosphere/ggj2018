class Scene extends Phaser.State {

    /**
     * Initialisation de la scene avec l'id du player et le niveau dans lequel il va jouer
     * @param {int} heros
     * @param {int} level 
     */
    init(heros, level, debug) {
        this.debug = debug || false;

        if (this.debug) {
            this.characterName = debug.heros;
        } else {
            this.characterName = heros;
        }
        this.currentLevel = level || { level: 1, world: 1 };
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
        this.infoText = null;
        this.hud = new SceneHud(this.game);
        this.exitMessage = false;
    }

    /**
     * Initialise le niveau
     */
    create() {
        this.game.controlsManager.disableControls();
        this.generateLevel(this.currentLevel);
    }

    onBackToMenu() {
        this.game.state.start('levelhub');
    }

    /**
     * Lance le niveau
     */
    onStartLevel() {
        this.loadGroup.destroy();
        this.hud.start(this.currentLevel, () => {
            this.displayMessage(this.currentLevel);
            this.game.controlsManager.enableControls();
            this.game.audioManager.playMusic('game');
        });
    }

    displayMessage(level) {

        let texts = null;
        if (WORLDS_DATA[level.world - 1] && WORLDS_DATA[level.world - 1].story_texts) {
            let storyTexts = WORLDS_DATA[level.world - 1].story_texts;
            storyTexts.forEach(levelText => {
                if (levelText.level === level.level) {
                    texts = levelText.text;
                }
            });
        }
        if (texts)
            this.showText(texts);
    }

    showText(texts, index) {
        let i = index || 0;

        this.infoText.show(8000, this.game.translate(texts[i]), this.game.translate(texts[i + 1])).then(() => {
            i += 2;
            if (texts[i]) {
                this.showText(texts, i);
            }
        });
    }

    onInExit(player) {
        if (!this.infoText.isShowing() && !this.exitMessage) {
            this.exitMessage = true;
            if (this.characterName === COLI_HEROS) {
                this.infoText.show(null, this.game.translate('EXIT_FLEUR'), '', true);
            } else {
                this.infoText.show(null, this.game.translate('EXIT_COLI'), '', true);
            }
        }
    }

    onOutExit(player) {
        if (this.infoText.isShowing() && this.exitMessage) {
            this.infoText.hide().then(() => {
                this.exitMessage = false;
            });
        }
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
        loadBack.drawRect(0, 0, this.game.world.width, this.game.world.height);
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

        this.map.setCollisionBetween(16, 51, true, 'Walls');

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
            if (mapObjects[i].properties.Type == 'character') {
                this.character = new Character(this.game, mapObjects[i], this.characterName, this);
                this.characterGroup.add(this.character);
            }
        }
        for (let i = 0; i < mapObjects.length; i++) {
            this.createObject(mapObjects[i]);
        }

        this.foreground = this.map.createLayer('Foreground');
        this.foreground.resizeWorld();

        this.loadGroup = this.game.add.group();
        this.loadGroup.add(loadBack);
        this.loadGroup.add(preload);

        this.pauseScreen = new PauseScreen(this.game, this);
        this.disconnectScreen = new DisconnectScreen(this.game);
        this.infoText = new TextMessage(this.game);
        this.game.serverManager.getSocket().emit('levelready', this.debug);
    }

    /**
     * Factory pour les différents objets possibles à instancier pour la scene
     * @param {Object} obj : objet à instancier
     */
    createObject(obj) {
        const type = obj.properties.Type;
        switch (type) {
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
                this.exitGroup.add(new Exit(this.game, obj));
                break;
            default:
                console.warn(type);
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

        if (this.game.parameters.debugMode.value) {
            this.layer.debug = true;
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
            this.character.resetPosition();
            this.gameOverScreen.display(() => {
                this.gameOverScreen.destroy();
                this.game.camera.fade('#000000', 200);
                this.game.camera.onFadeComplete.add(() => {
                    this.game.state.start('scene', true, false, this.characterName, this.currentLevel);
                }, this);
            });
        } else {
            this.game.camera.fade('#000000', 200);
            this.game.camera.onFadeComplete.add(() => {
                this.game.state.start('scene', true, false, this.characterName, this.currentLevel);
            }, this);
        }
    }

    actionButtonReleased() {
        if (this.character.hasItem()) {
            this.character.dropItem(this.rocksGroup);
        }
    }

    cancelButtonReleased() {

        if (this.disconnectScreen.isDisconnected()) {
            this.game.state.start('menu');
        } else {
            this.game.audioManager.playSound('back');
            this.pauseScreen.display();
            this.hud.hideHud();
            this.hud.pauseTime();
            this.character.stop();
        }

    }

    leftButtonDown() {
        this.character.move(LEFT);
    }

    rightButtonDown() {
        this.character.move(RIGHT);
    }

    upButtonDown() {
        this.character.move(UP);
    }

    downButtonDown() {
        this.character.move(DOWN);
    }

    leftButtonReleased() {
        this.character.stop(LEFT);
    }

    rightButtonReleased() {
        this.character.stop(RIGHT);
    }

    downButtonReleased() {
        this.character.stop(DOWN);
    }

    upButtonReleased() {
        this.character.stop(UP);
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

    onLevelCompleted() {
        this.infoText.hide();
        this.hud.stopTime();
        this.game.controlsManager.disableControls();
        this.character.alpha = 0;
        this.game.camera.flash();
        this.exitGroup.children[0].animateSuccess();
        setTimeout(() => {
            this.game.audioManager.stopCurrentMusic();
            this.game.state.start('endlevel', true, false, { level: this.currentLevel.level, world: this.currentLevel.world, num: getLevelNumFromWorldLevel(this.currentLevel.world, this.currentLevel.level), finished: true, highScore: this.hud.getTime() }, this.characterName);
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
        this.hud.resetTime();
        this.hud = null;
        this.disconnectScreen.destroy();
        this.layer.destroy();
        this.background.destroy();
        this.foreground.destroy();
    }
}
