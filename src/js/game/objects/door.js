class Door {

    constructor(obj, group) {
        this.sprite = game.add.sprite(obj.x, obj.y, 'door');
        group.add(this.sprite);
        this.sprite.body.immovable = true;
        this.sprite.anchor.setTo(0, 1);
        this.sprite.body.setSize(48, 192, 0, 0);
        const color = obj.properties.Color;
        this.setColor(color);
    }

    setColor(color) {
        switch(color) {
            case ORANGE: this.sprite.frame = 10;
                break;
            case GREEN: this.sprite.frame = 20;
                break;
            case RED: this.sprite.frame = 0;
                break;
            case WHITE: this.sprite.frame = 30;
                break;
        }
    }
}