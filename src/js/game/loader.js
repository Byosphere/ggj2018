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
        game.load.spritesheet('background_title', 'assets/sprites/background_title.png', 1280, 896);
        game.load.spritesheet('bulle', 'assets/sprites/bulle.png', 64, 64);
        game.load.spritesheet('anim_title', 'assets/sprites/titre_anim.png', 444, 276);
        game.load.spritesheet('door', 'assets/sprites/door.png', 320, 192);
        game.load.spritesheet('button', 'assets/sprites/button.png', 64, 64);
    }

    loadTilemaps() {
        game.load.tilemap('level1fleur', 'assets/tilemaps/maps/level1_fleur.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level1coli', 'assets/tilemaps/maps/level1_coli.json', null, Phaser.Tilemap.TILED_JSON);
    }

    loadAudio() {
        //audio files
    }

    create() {
        game.state.start('menu');
    }

}
