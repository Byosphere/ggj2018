class GameScene {

    constructor() {
        this.playerId = null;
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
    }

    init(playerId, level) {
        this.playerId = playerId;
        this.characterName = null;
        this.currentLevel = level || 1;
    }

    preload() {
        game.stage.backgroundColor = SCENE_BACKGROUND;
        this.music = this.add.audio('game');
        this.music.loop = true;
    }

    create() {
        let that = this;
        this.characterName = this.playerId === 0 ? 'fleur' : 'coli';
        this.map = game.add.tilemap('level' + this.currentLevel + this.characterName);
        this.map.addTilesetImage('decor');

        this.layer = this.map.createLayer('Walls');
        this.layer.resizeWorld();

        this.map.setCollisionBetween(3, 4, true, 'Walls');

        // Groups
        this.exitGroup = game.add.group();
        this.buttonsGroup = game.add.group();
        this.buttonsGroup.enableBody = true;
        this.rocksGroup = game.add.group();
        this.rocksGroup.enableBody = true;
        this.doorsGroup = game.add.group();
        this.doorsGroup.enableBody = true;
        this.characterGroup = game.add.group();
        this.noCollisionGroup = game.add.group();

        // Adding map objects
        const mapObjects = this.map.objects['Objects'];
        for (let i = 0; i < mapObjects.length; i++) {
            this.createObject(mapObjects[i]);
        }

        this.initAnimations();
        game.input.gamepad.start();
        this.pad = game.input.gamepad.pad1;
        this.music.play();

        game.socket.on('opendoor', function (color) {
            console.log('open door : ' + color);
            that.doorsGroup.forEach(function (door) {
                if (door.colorParam == color) {
                    //ouverture de la porte
                    door.animations.play('open');
                    that.animatedDoors.push(door);
                    door.animations.currentAnim.onComplete.add(function () {
                        // on stoppe la collision
                        that.noCollisionGroup.add(door);
                        that.doorsGroup.remove(door);
                        const idx = that.animatedDoors.findIndex((x) => x === door);
                        that.animatedDoors.splice(idx, idx + 1);
                    });
                }
            });
        });

        game.socket.on('closedoor', function (color) {
            console.log('close door : ' + color);
            that.animatedDoors.forEach(function (door) {
                if (door.colorParam == color) {
                    console.log('Reverse door animation');
                    const anim = door.animations.currentAnim;
                    const frame = anim.frame;
                    anim.onComplete.removeAll();
                    anim.reverseOnce();
                    const idx = that.animatedDoors.findIndex((x) => x === door);
                    that.animatedDoors.splice(idx, idx + 1);
                }
            });
            that.noCollisionGroup.forEach(function (door) {
                if (door.colorParam == color) {
                    //fermeture de la porte
                    door.animations.play('close');
                    door.animations.currentAnim.onComplete.add(function () {
                        // on stoppe la collision
                        that.doorsGroup.add(door);
                        that.noCollisionGroup.remove(door);
                    });
                }
            });
        });

        game.socket.on('success', function () {
            console.log('niveau terminé !');
            that.endScene();
        });
    }

    update() {
        game.physics.arcade.collide(this.character, this.layer);

        game.physics.arcade.collide(this.character, this.doorsGroup);

        game.physics.arcade.collide(this.character, this.rocksGroup);

        let overlap = game.physics.arcade.overlap(this.character, this.buttonsGroup, this.pressButton, null, this);
        if (!overlap && this.overlapedButton) {
            this.overlapedButton.frame -= 1;
            game.socket.emit('closedoor', this.overlapedButton.colorParam);
            this.overlapedButton = null;
        }

        let exit = game.physics.arcade.overlap(this.character, this.exitGroup, this.onExit, null, this);
        if (!exit && this.exitActive) {
            game.socket.emit('outexit');
            this.exitActive = false;
        }

        this.character.body.velocity.x = 0;
        this.character.body.velocity.y = 0;
        this.character.body.angularVelocity = 0;

        if (this.enableControls)
            this.handleControls();

        if (this.end && this.pad.justReleased(Phaser.Gamepad.XBOX360_A)) {
            game.state.start('scene', true, false, this.playerId, this.level + 1);
        }
    }

    initAnimations() {
        this.character.animations.add('walk_right', [13, 14, 15, 16], 12, false);
        this.character.animations.add('walk_left', [36, 37, 38, 39], 12, false);
        this.character.animations.add('walk_up', [32, 33, 34, 35], 12, false);
    }

    handleControls() {
        if (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
            this.character.body.velocity.x -= 200;
            this.character.animations.play('walk_left');
        }
        else if (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) {
            this.character.body.velocity.x += 200;
            this.character.animations.play('walk_right');
            this.character.scale.setTo(1, 1);
        }

        if (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1) {
            this.character.body.velocity.y -= 200;
            this.character.animations.play('walk_up');
            this.character.scale.setTo(1, 1);
        }
        else if (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) {
            this.character.body.velocity.y += 200;
            this.character.animations.play('walk_right');
            this.character.scale.setTo(1, 1);
        }

        if (this.pad.justReleased(Phaser.Gamepad.XBOX360_DPAD_LEFT)) {
            this.character.frame = 36;

        } else if (this.pad.justReleased(Phaser.Gamepad.XBOX360_DPAD_RIGHT)) {
            this.character.frame = 13;
        }

        if (this.pad.justReleased(Phaser.Gamepad.XBOX360_DPAD_DOWN)) {
            this.character.frame = 13;

        } else if (this.pad.justReleased(Phaser.Gamepad.XBOX360_DPAD_UP)) {
            this.character.frame = 32;
        }
    }

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

    createCharacter(posX, posY) {
        // Creating the character and placing it on the map
        this.character = game.add.sprite(posX, posY, this.characterName);
        this.characterGroup.add(this.character);
        this.character.anchor.setTo(0, 1);
        game.physics.arcade.enable(this.character);
        this.character.body.setSize(64, 64, 0, 0);
    }

    createButton(button) {
        let buttonSprite = new Button(button, this.buttonsGroup);
    }

    createDoor(door) {
        let doorSprite = new Door(door, this.doorsGroup);
    }

    createRock(rock) {
        let rockSprite = new Rock(rock, this.rocksGroup);
    }

    createExit(exit) {
        this.exitPosX = exit.x;
        this.exitPosY = exit.y;
        let exitSprite = game.add.sprite(exit.x, exit.y, 'exit');
        exitSprite.anchor.setTo(0, 1);
        exitSprite.animations.add('default', [0, 1, 2, 3, 4, 5, 6, 7], 4, true);
        exitSprite.animations.play('default');
        if (this.playerId === 1) {
            exitSprite.scale.setTo(-1, 1);
            exitSprite.x -= exitSprite.width;
        }

        game.physics.arcade.enable(exitSprite);
        this.exitGroup.add(exitSprite);
    }

    pressButton(playerSprite, buttonSprite) {
        if (!this.overlapedButton) {
            buttonSprite.frame += 1;
            this.overlapedButton = buttonSprite;
            console.log(buttonSprite);
            game.socket.emit('opendoor', buttonSprite.colorParam);
        }
    }

    onExit(playerSprite, exitSprite) {
        if (!this.exitActive) {
            game.socket.emit('inexit');
            this.exitActive = true;
        }
    }

    endScene() {
        this.enableControls = false;
        this.character.alpha = 0;
        this.exitPerso = game.add.sprite(this.exitPosX, this.exitPosY, 'exit_perso');
        this.exitPerso.anchor.setTo(0, 1);
        this.exitPerso.animations.add('default', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 8, true);
        this.exitPerso.animations.play('default');
        setTimeout(() => {
            this.music.stop();
            game.camera.flash();
            this.endTitle = game.add.sprite(game.world.centerX, game.world.centerY, 'victory');
            this.endTitle.anchor.setTo(0.5);
            this.endTitle.animations.add('default', [0, 1, 2, 3, 4, 5, 6, 7], 10, false);
            this.endTitle.animations.play('default');
            this.endText = game.add.text(game.world.centerX, game.world.centerY + 300, GAME_TEXT_NEXT_LEVEL, { font: GAME_TEXT_NEXT_LEVEL_FONT, fill: GAME_TEXT_NEXT_LEVEL_COLOR });
            this.endText.anchor.setTo(0.5);
            this.end = true;
        }, 3000);

    }
}
