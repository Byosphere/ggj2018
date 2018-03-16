/**
 * Objet pierre de la scene
 */
class Rock extends Phaser.Sprite {

    constructor(game, data) {
        super(game, data.x, data.y - 64, 'rock', 0);
        this.anchor.setTo(0, 0);
        this.game.physics.arcade.enable(this);
        this.body.setSize(46, 42, 8, 8);
        this.name = 'rock';
        this.visible = !data.invisible;
        this.weight = 100;
        this.skin = 'STONE';
    }

    /**
     * Vérifie si la pierre peut être déposée à l'endroit voulu
     * @param {Object} scene 
     */
    isDroppable(scene) {
        let blockingTiles = [];
        let droppable = true;
        this.game.physics.arcade.overlap(this, scene.layer, (e, w) => {
            if (w.isInteresting(true)) {
                blockingTiles.push(w);
            }
        });

        if (blockingTiles.length > 0)
            droppable = false;

        if (this.game.physics.arcade.overlap(this, scene.doorsGroup))
            return false;

        return droppable;
    }
}