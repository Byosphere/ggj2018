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
        game.add.sprite(0, 0, 'title');
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
