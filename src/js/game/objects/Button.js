class Button extends Phaser.Sprite {

    constructor(game, data) {
        super(game, data.x, data.y, 'button', 0);
        this.game = game;
        this.colorParam = data.properties.Color;
        this.anchor.setTo(0, 1);
        this.setColor(this.colorParam);
        this.game.physics.arcade.enable(this);
        this.body.setSize(32, 32, 0, 0);
        this.activated = false;
    }

    setColor(color) {
        switch (color) {
            case ORANGE: this.frame = BUTTON_ANIMATIONS.ORANGE_BUTTON.FRAMES;
                break;
            case GREEN: this.frame = BUTTON_ANIMATIONS.GREEN_BUTTON.FRAMES;
                break;
            case RED: this.frame = BUTTON_ANIMATIONS.RED_BUTTON.FRAMES;
                break;
            case WHITE: this.frame = BUTTON_ANIMATIONS.WHITE_BUTTON.FRAMES;
                break;
        }
    }

    toggleOn() {
        if (!this.activated) {
            this.frame++;
            this.activated = true;
            this.game.serverManager.getSocket().emit('pressbutton', this.colorParam);
        }
    }

    toggleOff() {
        if (this.activated) {
            this.frame--;
            this.activated = false;
            this.game.serverManager.getSocket().emit('releasebutton', this.colorParam);
        }
    }

}
