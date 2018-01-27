class GameLoader {

    constructor() { }

    preload() {
        game.stage.backgroundColor = LOADER_BACKGROUND;

        // Displaying the title of the game
        game.add.sprite(game.world.centerX, 0, 'title');

        let preloadBar = game.add.sprite(game.world.centerX, game.world.centerY, 'preloadbar');
        game.load.setPreloadSprite(preloadBar);

        // Loading the assets
        this.loadAssets();
    }

    loadAssets() {
        this.loadTilemaps();
        this.loadImages();
        this.loadSpritesheets();
        this.loadAudio();
    }

    loadImages() {
        //simple images
        game.load.image('decor', 'assets/tilemaps/tiles/decor.png');
    }

    loadSpritesheets() {
        //spritesheets
        game.load.spritesheet('fleur', 'assets/sprites/fleur.png', HEROWIDTH, HEROHEIGHT);
        game.load.spritesheet('coli', 'assets/sprites/coli.png', HEROWIDTH, HEROHEIGHT);
    }

    loadTilemaps() {
        game.load.tilemap('level1chou', 'assets/tilemaps/maps/level1_chou.json', null, Phaser.Tilemap.TILED_JSON);
    }

    loadAudio() {
        //audio files
    }

    create() {
        game.state.start('scene');
    }

}
