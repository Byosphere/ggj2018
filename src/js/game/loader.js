class GameLoader {

    constructor() { }

    preload() {
        game.stage.backgroundColor = BACKGROUND_COLOR;

        // Displaying the title of the game
        game.add.sprite(game.world.centerX, 0, 'title');

        let preloadBar = game.add.sprite(game.world.centerX, game.world.centerY, 'preloadbar');
        game.load.setPreloadSprite(preloadBar);

        // Loading the assets
        this.loadAssets();
    }

    loadAssets() {
        this.loadImages();
        this.loadSpritesheets();
        this.loadAudio();
    }

    loadImages() {
        //simple images
    }

    loadSpritesheets() {
        //spritesheets
        game.load.spritesheet('fleur', 'assets/sprites/fleur.png', 32, 32);
        game.load.spritesheet('coli', 'assets/sprites/coli.png', 32, 32);
    }

    loadAudio() {
        //audio files
    }

    create() {
        game.state.start('menu');
    }

}
