class GameBooter {

    constructor() {}

    preload() {
        // No antialiasing
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

        // Scaling options
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        // Centering game
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        // Loading the game title asset
        game.load.image('title', 'assets/title.png');
        // Loading the preload bar asset
        game.load.image('preloadbar', 'assets/preloadbar.png');
    }

    create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.state.start('loader');
    }

}