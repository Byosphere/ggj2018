/**
 * Objet pierre de la scene
 */
class Rock extends Phaser.Sprite {

    constructor(game, data) {
        super(game, data.x, data.y - 64, 'rock', 0);
        this.anchor.setTo(0, 0);
        this.game.physics.arcade.enable(this);
        this.body.setSize(46, 42, 8, 8);
        this.body.immovable = true;
        this.name = 'rock';
        this.visible = !data.invisible;
        this.weight = 100;
        this.skin = 'STONE';
        this.infoTextGroup = this.game.add.group();

        let button = this.game.add.sprite(0, 0, this.game.controlsManager.getSpriteName(ACTION));
        button.animations.add('default', [0, 1, 2], 6, true).play();
        button.scale.setTo(0.7, 0.7);
        button.anchor.setTo(0, 0.5);

        let infoText = this.game.add.text(35, -10, this.game.translate('PICK'), { font: SMALL_FONT, fill: DEFAULT_COLOR });
        infoText.setShadow(6, 6, "rgba(0, 0, 0, 0.8)", 7);
        this.infoTextGroup.add(button);
        this.infoTextGroup.add(infoText);

        this.game.world.bringToTop(this.infoTextGroup);
        this.infoTextGroup.x = this.centerX - this.infoTextGroup.width / 2;
        this.infoTextGroup.y = this.y - 10;
        this.infoTextGroup.visible = false;

        this.uid = Math.floor(Date.now() + (Math.random() * 10));
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

    /**
     * Action quand le héros est proche de la pierre
     */
    onContact() {
        this.infoTextGroup.visible = true;
    }

    /**
     * Action quand le héros est loin de la pierre
     */
    outContact() {
        this.infoTextGroup.visible = false;
    }

    /**
     * lors de la destruction de la pierre
     */
    destroy() {
        this.infoTextGroup.destroy();
        super.destroy();
    }
}