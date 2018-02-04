class Door extends Phaser.Sprite {

    constructor(game, data) {
        if (data.properties.Orientation === 'vertical') {
            super(game, data.x, data.y, 'door', 0);
        } else {
            super(game, data.x, data.y, 'door_horizontal', 0);
            this.key = 'door_horizontal';
        }
        this.game.physics.arcade.enable(this);
        this.body.immovable = true;
        this.anchor.setTo(0, 1);
        this.colorParam = data.properties.Color;
        this.setColor(this.colorParam);
        this.isAnimating = false;
    }

    openDoor() {
        if(this.body.enable) {
            this.animations.play(DOOR_ANIMATIONS.OPEN.NAME);
            this.isAnimating = true;
            this.animations.currentAnim.onComplete.add(() => {
                this.body.enable = false;
                this.isAnimating = false;
            });
        } else if (this.isAnimating) {
            this.animations.currentAnim.reverse();
            this.animations.currentAnim.onComplete.add(() => {
                this.body.enable = false;
                this.isAnimating = false;
            });
        }
    }

    closeDoor() {
        this.animations.play(DOOR_ANIMATIONS.CLOSE.NAME);
        this.isAnimating = true;
        this.animations.currentAnim.onComplete.add(() => {
            this.body.enable = true;
            this.isAnimating = false;
        });
    }

    setColor(color) {
        switch (color) {
            case GREEN:
                this.frame = DOOR_ANIMATIONS.GREEN_OPEN.FRAMES[0];
                this.animations.add(DOOR_ANIMATIONS.GREEN_OPEN.NAME, DOOR_ANIMATIONS.GREEN_OPEN.FRAMES, 14, false)
                this.animations.add(DOOR_ANIMATIONS.GREEN_CLOSE.NAME, DOOR_ANIMATIONS.GREEN_CLOSE.FRAMES, 14, false)
                break;
            case ORANGE:
                this.frame = DOOR_ANIMATIONS.ORANGE_OPEN.FRAMES[0];
                this.animations.add(DOOR_ANIMATIONS.ORANGE_OPEN.NAME, DOOR_ANIMATIONS.ORANGE_OPEN.FRAMES, 14, false)
                this.animations.add(DOOR_ANIMATIONS.ORANGE_CLOSE.NAME, DOOR_ANIMATIONS.ORANGE_CLOSE.FRAMES, 14, false)
                break;
            case RED:
                this.frame = DOOR_ANIMATIONS.RED_OPEN.FRAMES[0];
                this.animations.add(DOOR_ANIMATIONS.RED_OPEN.NAME, DOOR_ANIMATIONS.RED_OPEN.FRAMES, 14, false)
                this.animations.add(DOOR_ANIMATIONS.RED_CLOSE.NAME, DOOR_ANIMATIONS.RED_CLOSE.FRAMES, 14, false)
                break;
            case WHITE:
                this.frame = DOOR_ANIMATIONS.WHITE_OPEN.FRAMES[0];
                this.animations.add(DOOR_ANIMATIONS.WHITE_OPEN.NAME, DOOR_ANIMATIONS.WHITE_OPEN.FRAMES, 14, false)
                this.animations.add(DOOR_ANIMATIONS.WHITE_CLOSE.NAME, DOOR_ANIMATIONS.WHITE_CLOSE.FRAMES, 14, false)
                break;
        }
    }
}
