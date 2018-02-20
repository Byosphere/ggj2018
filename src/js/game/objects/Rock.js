class Rock extends Phaser.Sprite {

    constructor(game, data) {
        super(game, data.x, data.y, 'rock', 0);
        this.anchor.setTo(0, 1);
        this.game.physics.arcade.enable(this);
        this.body.setSize(46, 42, 8, 8);
        this.name = 'rock';
        this.visible = !data.invisible;
    }

    isDroppable(scene) {
        let test = [];
        let droppable = true;
        this.game.physics.arcade.overlap(this, scene.layer, (e, w) => {
            test.push(w.isInteresting(true));
            console.log(w);
        });
        test.forEach((i) => {
            if (i) {
                droppable = false;
            }
        });
        if (this.game.physics.arcade.overlap(this, scene.doorsGroup))
            return false;

        return droppable;
    }
}
