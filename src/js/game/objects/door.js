class Door {

    constructor(obj, group, game) {
        if (obj.properties.Orientation === 'vertical') {
            this.sprite = game.add.sprite(obj.x, obj.y, 'door');
        } else {
            this.sprite = game.add.sprite(obj.x, obj.y, 'door_horizontal');
        }
        group.add(this.sprite);
        this.sprite.body.immovable = true;
        this.sprite.anchor.setTo(0, 1);
        this.sprite.colorParam = obj.properties.Color;
        this.setColor(this.sprite.colorParam);
    }

    setColor(color) {
        switch (color) {
            case GREEN:
                this.sprite.frame = 20;
                this.sprite.animations.add(DOOR_ANIMATIONS.GREEN_OPEN.NAME, DOOR_ANIMATIONS.GREEN_OPEN.FRAMES, 14, false)
                this.sprite.animations.add(DOOR_ANIMATIONS.GREEN_CLOSE.NAME, DOOR_ANIMATIONS.GREEN_CLOSE.FRAMES, 14, false)
                break;
            case ORANGE:
                this.sprite.frame = 10;
                this.sprite.animations.add(DOOR_ANIMATIONS.ORANGE_OPEN.NAME, DOOR_ANIMATIONS.ORANGE_OPEN.FRAMES, 14, false)
                this.sprite.animations.add(DOOR_ANIMATIONS.ORANGE_CLOSE.NAME, DOOR_ANIMATIONS.ORANGE_CLOSE.FRAMES, 14, false)
                break;
            case RED:
                this.sprite.frame = 0;
                this.sprite.animations.add(DOOR_ANIMATIONS.RED_OPEN.NAME, DOOR_ANIMATIONS.RED_OPEN.FRAMES, 14, false)
                this.sprite.animations.add(DOOR_ANIMATIONS.RED_CLOSE.NAME, DOOR_ANIMATIONS.RED_CLOSE.FRAMES, 14, false)
                break;
            case WHITE:
                this.sprite.frame = 30;
                this.sprite.animations.add(DOOR_ANIMATIONS.WHITE_OPEN.NAME, DOOR_ANIMATIONS.WHITE_OPEN.FRAMES, 14, false)
                this.sprite.animations.add(DOOR_ANIMATIONS.WHITE_CLOSE.NAME, DOOR_ANIMATIONS.WHITE_CLOSE.FRAMES, 14, false)
                break;
        }
    }
}