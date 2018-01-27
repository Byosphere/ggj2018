class GameScene {

    preload() {
        game.stage.backgroundColor = SCENE_BACKGROUND;
    }

    create() {
        this.map = game.add.tilemap('level1chou');

        this.map.addTilesetImage('decor');

        this.layer = this.map.createLayer('Walls');
        this.layer.resizeWorld();

        this.map.setCollisionBetween(3, 4, true, 'Walls');

        this.character = game.add.sprite(256, 512, 'fleur');
        this.character.anchor.setTo(0, 1);

        game.physics.arcade.enable(this.character);

        this.character.body.setSize(64, 64, 0, 0);
        this.initAnimations();
        game.input.gamepad.start();
        this.pad = game.input.gamepad.pad1;
    }

    update() {
        game.physics.arcade.collide(this.character, this.layer);

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

}
