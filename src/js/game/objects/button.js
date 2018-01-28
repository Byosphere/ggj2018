class Button {

    constructor(obj, group) {
        this.sprite = game.add.sprite(obj.x, obj.y, 'button');
        group.add(this.sprite);
        this.sprite.anchor.setTo(0, 1);
        const color = obj.properties.Color;
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
}