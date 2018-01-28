class Door {

    constructor(obj) {
        this.sprite = game.add.sprite(obj.x, obj.y, 'door');
        this.sprite.anchor.setTo(0, 1);
        const color = obj.properties.Color;
        this.setColor(color);
    }

    setColor(color) {
        switch(color) {
            case ORANGE: this.sprite.frame = 5;
                break;
            case GREEN: this.sprite.frame = 10;
                break;
            case RED: this.sprite.frame = 0;
                break;
            case WHITE: this.sprite.frame = 15;
                break;
        }
    }
}