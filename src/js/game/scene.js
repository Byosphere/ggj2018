class GameScene {

    preload() {
        game.stage.backgroundColor = SCENE_BACKGROUND;
    }

    create() {
        this.map = game.add.tilemap('level1chou');

        this.map.addTilesetImage('decor');
        this.map.setCollisionBetween(1,10);

        this.layer = this.map.createLayer('Walls');
        this.layer.resizeWorld();

        this.character = game.add.sprite(256, 512, 'fleur');
        this.character.anchor.setTo(0, 1);

        game.physics.arcade.enable(this.character);

        this.character.body.setSize(64, 64, 64, 64);
        game.camera.follow(this.character);

        game.input.gamepad.start();
        this.pad = game.input.gamepad.pad1;
    }

    update() {
        game.physics.arcade.collide(this.character, this.layer);

        if (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1)
        {
            this.character.x -= 2;
        }
        else if (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1)
        {
            this.character.x += 2;
        }

        if (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1)
        {
            this.character.y -= 2;
        }
        else if (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1)
        {
            this.character.y += 2;
        }
    }

}
