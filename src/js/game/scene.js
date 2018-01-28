class GameScene {

    constructor() {
        this.playerId = null;
        this.buttonsGroup = null;
        this.doorsGroup = null;
        this.characterGroup = null;
        this.exitGroup = null;
        this.overlapedButton = null;
    }

    init(playerId) {
        this.playerId = playerId;
        this.characterName = null;
    }

    preload() {
        game.stage.backgroundColor = SCENE_BACKGROUND;
        this.music = this.add.audio('game');
        this.music.loop = true;
    }

    create() {
        this.characterName = this.playerId === 0 ? 'fleur' : 'coli';
        this.map = game.add.tilemap('level1' + this.characterName);

        this.map.addTilesetImage('decor');

        this.layer = this.map.createLayer('Walls');
        this.layer.resizeWorld();

        this.map.setCollisionBetween(3, 4, true, 'Walls');

        // Groups
        this.exitGroup = game.add.group();
        this.buttonsGroup = game.add.group();
        this.buttonsGroup.enableBody = true;
        this.doorsGroup = game.add.group();
        this.doorsGroup.enableBody = true;
        this.characterGroup = game.add.group();

        // Adding map objects
        const mapObjects = this.map.objects['Objects'];
        for (let i = 0; i < mapObjects.length; i++) {
            this.createObject(mapObjects[i]);
        }

        this.initAnimations();
        game.input.gamepad.start();
        this.pad = game.input.gamepad.pad1;
        this.music.play();
    }

    update() {
        game.physics.arcade.collide(this.character, this.layer);

        game.physics.arcade.collide(this.character, this.doorsGroup);
        
        let overlap = game.physics.arcade.overlap(this.character, this.buttonsGroup, this.pressButton, null, this);
        if (!overlap && this.overlapedButton) {
            this.overlapedButton.frame -= 1;
            this.overlapedButton = null;
        }

        this.character.body.velocity.x = 0;
        this.character.body.velocity.y = 0;
        this.character.body.angularVelocity = 0;

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

    initAnimations() {
        this.character.animations.add('walk_right', [13, 14, 15, 16], 12, false);
        this.character.animations.add('walk_left', [36, 37, 38, 39], 12, false);
        this.character.animations.add('walk_up', [32, 33, 34, 35], 12, false);
    }

    createObject(obj) {
        const type = obj.properties.Type;
        switch(type) {
            case 'character': this.createCharacter(obj.x, obj.y);
                break;
            case 'button': this.createButton(obj);
                break;
            case 'door': this.createDoor(obj);
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

    createExit(exit) {
        let exitSprite = game.add.sprite(exit.x, exit.y, 'exit');
        exitSprite.anchor.setTo(0, 1);
        this.exitGroup.add(exitSprite);
    }

    pressButton(playerSprite, buttonSprite) {
        if (!this.overlapedButton) {
            buttonSprite.frame += 1;
            this.overlapedButton = buttonSprite;
        }
    }
}
