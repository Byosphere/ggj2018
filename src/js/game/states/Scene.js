class Scene extends Phaser.State {

    /**
     * Initialisation de la scene avec l'id du player et le niveau dans lequel il va jouer
     * @param {int} player
     * @param {int} level 
     */
    init(player, level) {
        this.player = player;
        this.characterName = this.player.selectedHero;
        this.currentLevel = level || 1;
    }

    preload() {
        this.game.stage.backgroundColor = SCENE_BACKGROUND;
        this.music = this.game.add.audio('game');
        this.victoryMusic = this.game.add.audio('win');
        this.music.loop = true;
        this.buttonsGroup = null;
        this.doorsGroup = null;
        this.characterGroup = null;
        this.exitGroup = null;
        this.rocksGroup = null;
        this.overlapedButton = null;
        this.noCollisionGroup = null;
        this.animatedDoors = [];
        this.exitActive = false;
        this.enableControls = true;
        this.exitPosX = 0;
        this.exitPosY = 0;
        this.end = false;
        this.openedDoorsColors = [];
    }

    create() {
        this.generateLevel(this.currentLevel);
        this.initAnimations();
        this.connectServer();
        this.music.play();
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
                    door.animations.play('open');
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
                    door.animations.play('close');
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

        this.game.socket.on('success', () => {
            this.endScene();
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
    }

    update() {
        this.game.physics.arcade.collide(this.character, this.layer);
        this.game.physics.arcade.collide(this.character, this.doorsGroup);
        this.game.physics.arcade.collide(this.character, this.rocksGroup);

        let overlap = this.game.physics.arcade.overlap(this.character, this.buttonsGroup, this.pressButton, null, this);
        if (!overlap && this.overlapedButton) {
            this.overlapedButton.frame -= 1;
            this.game.socket.emit('closedoor', this.overlapedButton.colorParam);
            this.overlapedButton = null;
        }

        let exit = this.game.physics.arcade.overlap(this.character, this.exitGroup, this.onExit, null, this);
        if (!exit && this.exitActive) {
            this.game.socket.emit('outexit');
            this.exitActive = false;
        }

        this.character.body.velocity.x = 0;
        this.character.body.velocity.y = 0;
        this.character.body.angularVelocity = 0;

        if (this.enableControls)
            this.handleControls();

        if (this.end && this.game.controlsManager.actionButtonReleased()) {
            this.game.state.start('scene', true, false, this.player, this.currentLevel + 1);
        }
    }

    /**
     * initialise character animations
     */
    initAnimations() {
        this.character.animations.add('walk_right', [13, 14, 15, 16], 12, false);
        this.character.animations.add('walk_left', [36, 37, 38, 39], 12, false);
        this.character.animations.add('walk_up', [32, 33, 34, 35], 12, false);
    }

    /**
     * Gère les inputs du joueur
     */
    handleControls() {
        if (this.game.controlsManager.leftButtonDown()) {
            this.character.body.velocity.x -= 200;
            this.character.animations.play('walk_left');
        }
        else if (this.game.controlsManager.rightButtonDown()) {
            this.character.body.velocity.x += 200;
            this.character.animations.play('walk_right');
            this.character.scale.setTo(1, 1);
        }

        if (this.game.controlsManager.upButtonDown()) {
            this.character.body.velocity.y -= 200;
            this.character.animations.play('walk_up');
            this.character.scale.setTo(1, 1);
        }
        else if (this.game.controlsManager.downButtonDown()) {
            this.character.body.velocity.y += 200;
            this.character.animations.play('walk_right');
            this.character.scale.setTo(1, 1);
        }

        if (this.game.controlsManager.leftButtonReleased()) {
            this.character.frame = 36;

        } else if (this.game.controlsManager.rightButtonReleased()) {
            this.character.frame = 13;
        }

        if (this.game.controlsManager.downButtonReleased()) {
            this.character.frame = 13;

        } else if (this.game.controlsManager.upButtonReleased()) {
            this.character.frame = 32;
        }
    }

    /**
     * Factory pour les différents objets possibles à instancier pour la scene
     * @param {Object} obj : objet à instancier
     */
    createObject(obj) {
        const type = obj.properties.Type;
        switch (type) {
            case 'character': this.createCharacter(obj.x, obj.y);
                break;
            case 'button': this.createButton(obj);
                break;
            case 'door': this.createDoor(obj);
                break;
            case 'rock': this.createRock(obj);
                break;
            case 'exit': this.createExit(obj);
                break;
            default: break;
        }
    }

    /**
     * Créé le personnage et le place sur la scene
     * @param {int} posX : position en X
     * @param {int} posY : position en Y
     */
    createCharacter(posX, posY) {
        this.character = this.game.add.sprite(posX, posY, this.characterName);
        this.characterGroup.add(this.character);
        this.character.anchor.setTo(0, 1);
        this.game.physics.arcade.enable(this.character);
        this.character.body.setSize(64, 64, 0, 0);
    }

    /**
     * Créé un bouton
     * @param {Object} button 
     */
    createButton(button) {
        let buttonSprite = new Button(button, this.buttonsGroup, this.game);
    }

    /**
     * Créé une porte
     * @param {*Object} door 
     */
    createDoor(door) {
        let doorSprite = new Door(door, this.doorsGroup, this.game);
    }

    /**
     * Créé un rocher
     * @param {*Object} rock 
     */
    createRock(rock) {
        let rockSprite = new Rock(rock, this.rocksGroup, this.game);
    }

    /**
     * Créé la zone d'objectif
     * @param {*Object} exit 
     */
    createExit(exit) {
        this.exitPosX = exit.x;
        this.exitPosY = exit.y;
        let exitSprite = this.game.add.sprite(exit.x, exit.y, 'exit');
        exitSprite.anchor.setTo(0, 1);
        exitSprite.animations.add('default', [0, 1, 2, 3, 4, 5, 6, 7], 4, true);
        exitSprite.animations.play('default');
        if (this.player.id === 1) {
            exitSprite.scale.setTo(-1, 1);
            exitSprite.x -= exitSprite.width;
        }

        this.game.physics.arcade.enable(exitSprite);
        this.exitGroup.add(exitSprite);
    }

    /**
     * Action lorsqu'un bouton est pressé
     * @param {Phaser.Sprite} playerSprite 
     * @param {Phaser.Sprite} buttonSprite 
     */
    pressButton(playerSprite, buttonSprite) {
        if (!this.overlapedButton) {
            buttonSprite.frame += 1;
            this.overlapedButton = buttonSprite;
            this.game.socket.emit('opendoor', buttonSprite.colorParam);
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
        this.enableControls = false;
        this.character.alpha = 0;
        this.exitPerso = this.game.add.sprite(this.exitPosX, this.exitPosY, 'exit_perso');
        this.exitPerso.anchor.setTo(0, 1);
        this.exitPerso.animations.add('default', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 8, true);
        this.exitPerso.animations.play('default');
        setTimeout(() => {
            this.music.fadeOut(1000);
            this.victoryMusic.fadeIn(500, true);
            this.game.camera.flash();
            if (this.currentLevel < NB_LEVELS) {
                this.endTitle = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'victory');
                this.endTitle.anchor.setTo(0.5);
                this.endTitle.animations.add('default', [0, 1, 2, 3, 4, 5, 6, 7], 10, false);
                this.endTitle.animations.play('default');
                this.endText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 300, GAME_TEXT_NEXT_LEVEL + this.game.controlsManager.getActionButtonName(), { font: GAME_TEXT_NEXT_LEVEL_FONT, fill: GAME_TEXT_NEXT_LEVEL_COLOR });
                this.endText.anchor.setTo(0.5);
            } else {
                this.endTitle = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'felicitations');
                this.endTitle.anchor.setTo(0.5);
                this.endTitle.animations.add('default', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 10, false);
                this.endTitle.animations.play('default');
            }
            this.end = true;
        }, 3000);
    }

    /**
     * Fonction appelée au moment du changement de scene
     */
    shutdown() {
        this.music.destroy();
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
        this.enableControls = true;
        this.exitPosX = 0;
        this.exitPosY = 0;
        this.animatedDoors = [];
        this.openedDoorsColors = [];
        this.end = false;
    }

    /**
     * Init de la manette
     */
    initInputs() {
        this.game.input.gamepad.start();
        this.pad = this.game.input.gamepad.pad1;
    }
}