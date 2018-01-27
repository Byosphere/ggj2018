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
        this.load.spritesheet('fleur', 'assets/sprites/fleur.png', HEROWIDTH, HEROHEIGHT);
        this.load.spritesheet('coli', 'assets/sprites/coli.png', HEROWIDTH, HEROHEIGHT);
    }

    loadAudio() {
        //audio files
    }

    create() {
        game.state.start('menu');
    }

}
