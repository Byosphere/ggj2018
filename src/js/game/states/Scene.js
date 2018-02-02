class Scene extends Phaser.State {

    /**
     * Initialisation de la scene avec l'id du player et le niveau dans lequel il va jouer
     * @param {int} player
     * @param {int} level 
     */
    init(player, level) {
        if (DEBUG) {
            this.player = { id: 0, selectedHero: FLEUR_HEROS, position: FLEUR_HEROS };
        } else {
            this.player = player;
        }
        this.characterName = this.player.selectedHero;
        this.currentLevel = level || 1;
    }

    preload() {
        this.game.stage.backgroundColor = SCENE_BACKGROUND;
        this.game.controlsManager.setCallbackContext(this);
        this.victoryMusic = this.game.add.audio('win');
        this.buttonsGroup = null;
        this.doorsGroup = null;
        this.characterGroup = null;
        this.exitGroup = null;
        this.rocksGroup = null;
        this.overlapedButton = null;
        this.noCollisionGroup = null;
        this.animatedDoors = [];
        this.exitActive = false;
        this.exitPosX = 0;
        this.exitPosY = 0;
        this.end = false;
        this.openedDoorsColors = [];
    }

    create() {
        this.generateLevel(this.currentLevel);
        this.connectServer();
        this.game.audioManager.playMusic('game');
    }

    /**
     * Fonction pour animer les portes à ouvrir
     * @param {String} color : Couleur des portes à ouvrir
     */
    openDoor(color) {
        if (!this.openedDoorsColors.includes(color)) {
            this.doorsGroup.forEach((door) => {
                if (door.colorParam == color) {
                    //ouverture de la porte
                    this.openedDoorsColors.push(door.colorParam);
                    door.animations.play(DOOR_ANIMATIONS.OPEN.NAME);
                    this.animatedDoors.push(door);
                    door.animations.currentAnim.onComplete.add(() => {
                        // on stoppe la collision
                        this.noCollisionGroup.add(door);
                        this.doorsGroup.remove(door);
                        const idx = this.animatedDoors.findIndex((x) => x === door);
                        this.animatedDoors.splice(idx, idx + 1);
                    });
                }
            });
        }
    }

    /**
     * Fonction pour animer les portes à fermer
     * @param {String} color : Couleur des portes à ouvrir
     */
    closeDoor(color) {
        if (this.openedDoorsColors.includes(color) && (!this.overlapedButton || (this.overlapedButton && this.overlapedButton.colorParam !== color))) {
            this.animatedDoors.forEach((door) => {
                if (door.colorParam == color) {
                    const anim = door.animations.currentAnim;
                    const frame = anim.frame;
                    anim.onComplete.removeAll();
                    anim.reverseOnce();
                    const idx = this.animatedDoors.findIndex((x) => x === door);
                    this.animatedDoors.splice(idx, idx + 1);
                }
            });
            this.noCollisionGroup.forEach((door) => {
                if (door.colorParam == color) {
                    //fermeture de la porte
                    door.animations.play(DOOR_ANIMATIONS.CLOSE.NAME);
                    door.animations.currentAnim.onComplete.add(() => {
                        // on stoppe la collision
                        this.doorsGroup.add(door);
                        this.noCollisionGroup.remove(door);
                    });
                }
            });
            const idx2 = this.openedDoorsColors.findIndex((x) => x === color);
            this.openedDoorsColors.splice(idx2, idx2 + 1);
        }
    }

    /**
     * Fonction rassemblant tous les écouteurs de socket IO
     */
    connectServer() {
        this.game.socket.on('opendoor', (color) => {
            this.openDoor(color);
        });

        this.game.socket.on('closedoor', (color) => {
            this.closeDoor(color);
        });

        this.game.socket.on('reset', () => {
            this.resetLevel();
        });

        this.game.socket.on('success', () => {
            this.endScene();
        });

        this.game.socket.on('disconnect', () => {
            console.log('player disconnected');
        });
    }

    /**
     * Génère l'environnement du niveau passé en paramètre
     * @param {*int} level : niveau à générer
     */
    generateLevel(level) {
        this.map = this.game.add.tilemap('level' + level + this.characterName);
        this.map.addTilesetImage('decor');

        this.layer = this.map.createLayer('Walls');
        this.layer.resizeWorld();

        this.map.setCollisionBetween(3, 4, true, 'Walls');

        // Groups
        this.exitGroup = this.game.add.group();
        this.buttonsGroup = this.game.add.group();
        this.buttonsGroup.enableBody = true;
        this.rocksGroup = this.game.add.group();
        this.rocksGroup.enableBody = true;
        this.doorsGroup = this.game.add.group();
        this.doorsGroup.enableBody = true;
        this.characterGroup = this.game.add.group();
        this.noCollisionGroup = this.game.add.group();

        // Adding map objects
        const mapObjects = this.map.objects['Objects'];
        for (let i = 0; i < mapObjects.length; i++) {
            this.createObject(mapObjects[i]);
        }

        this.pauseScreen = new PauseScreen(this.game);
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
            default: break;
        }
    }

    update() {
        this.game.physics.arcade.collide(this.character, this.layer);
        this.game.physics.arcade.collide(this.character, this.doorsGroup);
        this.game.physics.arcade.collide(this.character, this.rocksGroup);

        let overlap = this.game.physics.arcade.overlap(this.character, this.buttonsGroup, this.pressButton, null, this);
        if (!overlap && this.overlapedButton) {
            this.overlapedButton.toggleOff();
            this.overlapedButton = null;
        }

        let exit = this.game.physics.arcade.overlap(this.character, this.exitGroup, this.onExit, null, this);
        if (!exit && this.exitActive) {
            this.game.socket.emit('outexit');
            this.exitActive = false;
        }

    }

    resetLevel() {
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
            this.game.socket.emit('reset');
            this.resetLevel();
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
            this.game.socket.emit('inexit');
            this.exitActive = true;
        }
    }

    /**
     * Action lorsque le niveau est terminé
     */
    endScene() {
        this.game.socket.emit('resetexit');
        this.game.controlsManager.disableControls([ACTION]);
        this.character.alpha = 0;
        this.exitGroup.children[0].animateSuccess();
        setTimeout(() => {
            this.game.audioManager.stopCurrentMusic();
            this.victoryMusic.fadeIn(500, false);
            this.game.camera.flash();
            if (this.currentLevel < NB_LEVELS) {
                this.endTitle = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'victory');
                this.endTitle.anchor.setTo(0.5);
                this.endTitle.animations.add(VICTORY_TITLE.DISPLAY.NAME, VICTORY_TITLE.DISPLAY.FRAMES, 10, false).play();
                this.endText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 300, this.game.translate.GENERIC_PRESS_BUTTON + this.game.controlsManager.getActionButtonName(), { font: GAME_TEXT_NEXT_LEVEL_FONT, fill: GAME_TEXT_NEXT_LEVEL_COLOR });
                this.endText.anchor.setTo(0.5);
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
        this.noCollisionGroup.destroy();
        this.overlapedButton = null;
        this.exitActive = false;
        this.game.controlsManager.enableControls();
        this.exitPosX = 0;
        this.exitPosY = 0;
        this.animatedDoors = [];
        this.openedDoorsColors = [];
        this.end = false;
    }
}
