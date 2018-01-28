class Rock {

    constructor(obj, group) {
        this.sprite = game.add.sprite(obj.x, obj.y, 'rock');
        group.add(this.sprite);
        this.sprite.anchor.setTo(0, 1);
    }

}