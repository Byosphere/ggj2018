class Button extends Phaser.Sprite {

    constructor(game, data, char, rocks) {
        super(game, data.x, data.y, 'button', 0);
        this.game = game;
        this.character = char;
        this.rocksGroup = rocks;
        this.colorParam = data.properties.Color;
        this.anchor.setTo(0, 1);
        this.setColor(this.colorParam);
        this.game.physics.arcade.enable(this);
        this.body.setSize(40, 36, 12, 20);
        this.activated = false;
        this.herosTrigger = false;
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
        console.log(this.activated);
    }

    toggleOff() {
        if (this.activated) {
            this.frame--;
            this.activated = false;
            this.game.serverManager.getSocket().emit('releasebutton', this.colorParam);
        }
        console.log(this.activated);
    }

    update() {

        this.herosTrigger = this.game.physics.arcade.overlap(this.character, this, this.toggleOn, null, this);
        this.rockTrigger = this.game.physics.arcade.overlap(this.rocksGroup, this, this.toggleOn, null, this);

        if(!this.herosTrigger && !this.rockTrigger && this.activated) {
            this.toggleOff();
        }
    }
}
