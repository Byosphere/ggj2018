class GameLoader {

    constructor() { }

    preload() {
        game.stage.backgroundColor = LOADER_BACKGROUND;

        // Displaying the title of the game
        this.title = game.add.sprite(game.world.centerX, game.world.centerY, 'title');
        this.title.anchor.setTo(0.5);

        let preload = game.add.sprite(game.world.width - 100, game.world.height - 100, 'preloadbar');
        //game.load.setPreloadSprite(preloadBar);
        preload.anchor.setTo(0.5);
        preload.animations.add('default', [0,1,2,3], 10, true);
        preload.animations.play('default');

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
        game.load.spritesheet('door_horizontal', 'assets/sprites/door_horizontal.png', 192, 64);
        game.load.spritesheet('button', 'assets/sprites/button.png', 64, 64);
        game.load.spritesheet('rock', 'assets/sprites/caillou.png', 64, 64);
        game.load.spritesheet('exit', 'assets/sprites/exit.png', 192, 192);
        game.load.spritesheet('victory', 'assets/sprites/vousavezgagne.png', 1200, 800);
        game.load.spritesheet('exit_perso', 'assets/sprites/exit_perso.png', 192, 192);
        game.load.spritesheet('felicitations', 'assets/sprites/felicitations.png', 1200, 800);
    }

    loadTilemaps() {
        game.load.tilemap('level1fleur', 'assets/tilemaps/maps/level1_fleur.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level1coli', 'assets/tilemaps/maps/level1_coli.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level2fleur', 'assets/tilemaps/maps/level2_fleur.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level2coli', 'assets/tilemaps/maps/level2_coli.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level3fleur', 'assets/tilemaps/maps/level3_fleur.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level3coli', 'assets/tilemaps/maps/level3_coli.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level4fleur', 'assets/tilemaps/maps/level4_fleur.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level4coli', 'assets/tilemaps/maps/level4_coli.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level5fleur', 'assets/tilemaps/maps/level5_fleur.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level5coli', 'assets/tilemaps/maps/level5_coli.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level6fleur', 'assets/tilemaps/maps/level6_fleur.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level6coli', 'assets/tilemaps/maps/level6_coli.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level7fleur', 'assets/tilemaps/maps/level7_fleur.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level7coli', 'assets/tilemaps/maps/level7_coli.json', null, Phaser.Tilemap.TILED_JSON);
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
