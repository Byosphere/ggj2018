class Exit extends Phaser.Sprite {

    constructor(game, data, worldNum) {
        super(game, data.x, data.y, 'exit_w' + worldNum, 0);
        this.game = game;
        this.data = data;
        this.anchor.setTo(0, 1);
        this.animations.add(EXIT_ANIMATIONS.EXIT_ACTIVE.NAME, EXIT_ANIMATIONS.EXIT_ACTIVE.FRAMES, 4, true).play();
        this.game.physics.arcade.enable(this);
        this.body.setSize(64, 64, 64, 64);
    }

    animateSuccess() {
        let exitanim = this.game.add.sprite(this.data.x, this.data.y, 'exit_perso');
        exitanim.anchor.setTo(0, 1);
        exitanim.bringToTop();
        exitanim.animations.add(EXIT_HEROS.DANCE.NAME, EXIT_HEROS.DANCE.FRAMES, 8, true).play();
        exitanim.animations.currentAnim.onComplete.add(() => {
            exitanim.destroy();
        });
    }
}
