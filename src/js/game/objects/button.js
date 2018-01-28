class Button {

    constructor(obj, group) {
        this.sprite = game.add.sprite(obj.x, obj.y, 'button');
        group.add(this.sprite);
        this.sprite.anchor.setTo(0, 1);
        this.sprite.body.setSize(32, 32, 0, 0);
        this.sprite.colorParam = obj.properties.Color;
        this.setColor(color);
    }

    setColor(color) {
        switch(color) {
            case ORANGE: this.sprite.frame = 2;
                break;
            case GREEN: this.sprite.frame = 4;
                break;
            case RED: this.sprite.frame = 0;
                break;
            case WHITE: this.sprite.frame = 6;
                break;
        }
    }

    getSprite() {
        return this.sprite;
    }
}