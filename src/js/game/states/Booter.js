class Booter extends Phaser.State {

    preload() {
        // CROSS Origin
        this.game.load.crossOrigin = 'anonymous';

        // No antialiasing
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

        // Scaling options
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        //init controllers
        this.game.controlsManager.init();

        // Centering game
        //this.game.scale.pageAlignHorizontally = true;
        //this.game.scale.pageAlignVertically = true;

        // Loading the game title asset
        this.game.load.image('title', BASE_URL + 'title.png');
        
        // Loading the preload bar asset
        this.game.load.spritesheet('preloadbar', BASE_URL + 'sprites/loader.png', 64, 64);

        this.game.add.plugin(PhaserInput.Plugin);
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.state.start('loader');
    }
}