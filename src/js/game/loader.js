class GameLoader {

    constructor() { }

    preload() {
        game.stage.backgroundColor = LOADER_BACKGROUND;

        // Displaying the title of the game
        this.title = game.add.sprite(game.world.centerX, 20, 'title');
        this.title.anchor.setTo(0.5, 0);

        let preloadBar = game.add.sprite(game.world.centerX, game.world.centerY, 'preloadbar');
        game.load.setPreloadSprite(preloadBar);
        preloadBar.anchor.setTo(0.5, 0);

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
        game.load.spritesheet('door', 'assets/sprites/door.png', 64, 192);
        game.load.spritesheet('button', 'assets/sprites/button.png', 64, 64);
        game.load.spritesheet('exit', 'assets/sprites/exit.png', 192, 192);
        game.load.spritesheet('victory', 'assets/sprites/vousavezgagne.png', 1200, 800);
        game.load.spritesheet('exit_perso', 'assets/sprites/exit_perso.png', 192, 192);
    }

    loadTilemaps() {
        game.load.tilemap('level1fleur', 'assets/tilemaps/maps/level1_fleur.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level1coli', 'assets/tilemaps/maps/level1_coli.json', null, Phaser.Tilemap.TILED_JSON);
    }

    loadAudio() {
        game.load.audio('sound_coli', 'assets/sound/phrase1.wav');
        game.load.audio('sound_fleur', 'assets/sound/phrase11.wav');
        game.load.audio('main_menu', 'assets/sound/loader.wav');
        game.load.audio('game', 'assets/sound/niveau.wav');
    }

    create() {
        game.state.start('menu');
    }

}
