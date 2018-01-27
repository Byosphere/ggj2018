class GameLoader {

    constructor() { }

    preload() {
        game.stage.backgroundColor = BACKGROUND_COLOR;
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
        this.load.spritesheet('fleur', 'assets/sprites/fleur.png', 32, 32);
        this.load.spritesheet('coli', 'assets/sprites/coli.png', 32, 32);
    }

    loadAudio() {
        //audio files
    }

    create() {
        game.state.start('menu');
    }

}
