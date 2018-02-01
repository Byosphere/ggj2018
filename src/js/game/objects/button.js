class Button {

    constructor(obj, group, game) {
        this.sprite = game.add.sprite(obj.x, obj.y, 'button');
        group.add(this.sprite);
        this.sprite.anchor.setTo(0, 1);
        this.sprite.body.setSize(32, 32, 0, 0);
        this.sprite.colorParam = obj.properties.Color;
        this.setColor(this.sprite.colorParam);
    }

    setColor(color) {
        switch (color) {
            case ORANGE: this.sprite.frame = BUTTON_ANIMATIONS.ORANGE_BUTTON.FRAMES;
                break;
            case GREEN: this.sprite.frame = BUTTON_ANIMATIONS.GREEN_BUTTON.FRAMES;
                break;
            case RED: this.sprite.frame = BUTTON_ANIMATIONS.RED_BUTTON.FRAMES;
                break;
            case WHITE: this.sprite.frame = BUTTON_ANIMATIONS.WHITE_BUTTON.FRAMES;
                break;
        }
    }

    getSprite() {
        return this.sprite;
    }
}