class GameScene {

    constructor() {
        this.playerId = null;
    }

    init(playerId) {
        this.playerId = playerId;
        this.characterName = null;
    }

    preload() {
        game.stage.backgroundColor = SCENE_BACKGROUND;
    }

    create() {
        this.characterName = this.playerId === 0 ? 'fleur' : 'coli';
        this.map = game.add.tilemap('level1' + this.characterName);

        this.map.addTilesetImage('decor');

        this.layer = this.map.createLayer('Walls');
        this.layer.resizeWorld();

        this.map.setCollisionBetween(3, 4, true, 'Walls');

        // Adding map objects
        const mapObjects = this.map.objects['Objects'];
        for (let i = 0; i < mapObjects.length; i++) {
            this.createObject(mapObjects[i]);
        }

        game.input.gamepad.start();
        this.pad = game.input.gamepad.pad1;
    }

    update() {
        game.physics.arcade.collide(this.character, this.layer);

        this.character.body.velocity.x = 0;
        this.character.body.velocity.y = 0;
        this.character.body.angularVelocity = 0;

        if (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1)
        {
            this.character.body.velocity.x -= 200;
        }
        else if (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1)
        {
            this.character.body.velocity.x += 200;
        }

        if (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1)
        {
            this.character.body.velocity.y -= 200;
        }
        else if (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1)
        {
            this.character.body.velocity.y += 200;
        }
    }

    createObject(obj) {
        const type = obj.properties.Type;
        switch(type) {
            case 'character': this.createCharacter(obj.x, obj.y);
                break;
            case 'button': this.createButton(obj);
                break;
            default: break;
        }
    }

    createCharacter(posX, posY) {
        // Creating the character and placing it on the map
        this.character = game.add.sprite(posX, posY, this.characterName);
        this.character.anchor.setTo(0, 1);
        game.physics.arcade.enable(this.character);
        this.character.body.setSize(64, 64, 0, 0);
    }

    createButton(button) {
        let buttonSprite = game.add.sprite(button.x, button.y, 'button');
        buttonSprite.anchor.setTo(0, 1);
        buttonSprite.frame = 0;
    }
}
