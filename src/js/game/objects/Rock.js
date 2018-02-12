class Rock extends Phaser.Sprite {

    constructor(game, data) {
        super(game, data.x, data.y, 'rock', 0);
        this.anchor.setTo(0, 1);
        this.game.physics.arcade.enable(this);
        this.body.setSize(46, 42, 8, 8);
        this.name = 'rock';
        this.visible = !data.invisible;
    }

    isDroppable() {
        // TODO
        return true;
    }
}
