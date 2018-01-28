class Booter extends Phaser.State {

    preload() {
        // No antialiasing
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

        // Scaling options
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        // Centering game
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;

        // Loading the game title asset
        this.game.load.image('title', 'assets/title.png');
        // Loading the preload bar asset
        this.game.load.spritesheet('preloadbar', 'assets/sprites/loader.png', 64, 64);
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.state.start('loader');
    }
}