class Loader extends Phaser.State {

    preload() {

        this.game.stage.backgroundColor = LOADER_BACKGROUND;

        // Displaying the title of the game
        this.title = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'title');
        this.title.anchor.setTo(0.5);

        let preload = this.game.add.sprite(this.game.world.width - 100, this.game.world.height - 100, 'preloadbar');
        preload.anchor.setTo(0.5);
        preload.animations.add('default', [0,1,2,3], 10, true);
        preload.animations.play('default');

        let loadingText = this.game.add.text(0, 0, LOADING_TEXT, {font: DEFAULT_FONT, fill: LOADER_COLOR});
        loadingText.x = preload.x - loadingText.width - (preload.width/2) - 10;
        loadingText.y = preload.y - loadingText.height/2;

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
        this.game.load.image('decor', 'assets/tilemaps/tiles/decor.png');
    }

    loadSpritesheets() {
        //spritesheets
        this.game.load.spritesheet('fleur', 'assets/sprites/fleur.png', CELL_SIZE*HEROS_WIDTH, CELL_SIZE*HEROS_HEIGHT);
        this.game.load.spritesheet('coli', 'assets/sprites/coli.png', CELL_SIZE*HEROS_WIDTH, CELL_SIZE*HEROS_HEIGHT);
        this.game.load.spritesheet('background_title', 'assets/sprites/background_title.png', this.game.world.width, this.game.world.height);
        this.game.load.spritesheet('bulle', 'assets/sprites/bulle.png', CELL_SIZE, CELL_SIZE);
        this.game.load.spritesheet('anim_title', 'assets/sprites/titre_anim.png', HEAD_TITLE_WIDTH, HEAD_TITLE_HEIGHT);
        this.game.load.spritesheet('door', 'assets/sprites/door.png', CELL_SIZE*DOOR_WIDTH, CELL_SIZE*DOOR_HEIGHT);
        this.game.load.spritesheet('door_horizontal', 'assets/sprites/door_horizontal.png', CELL_SIZE*DOOR_HEIGHT, CELL_SIZE*DOOR_WIDTH);
        this.game.load.spritesheet('button', 'assets/sprites/button.png', CELL_SIZE*BUTTON_WIDTH, CELL_SIZE*BUTTON_HEIGHT);
        this.game.load.spritesheet('rock', 'assets/sprites/caillou.png', CELL_SIZE*ROCK_WIDTH, CELL_SIZE*ROCK_HEIGHT);
        this.game.load.spritesheet('exit', 'assets/sprites/exit.png', CELL_SIZE*EXIT_WIDTH, CELL_SIZE*EXIT_HEIGHT);
        this.game.load.spritesheet('victory', 'assets/sprites/vousavezgagne.png', VICTORY_WIDTH, VICTORY_HEIGHT);
        this.game.load.spritesheet('exit_perso', 'assets/sprites/exit_perso.png', CELL_SIZE*EXIT_WIDTH, CELL_SIZE*EXIT_HEIGHT);
        this.game.load.spritesheet('felicitations', 'assets/sprites/felicitations.png', CREDITS_WIDTH, CREDITS_HEIGHT);
    }

    loadTilemaps() {
        this.game.load.tilemap('level1fleur', 'assets/tilemaps/maps/level1_fleur.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('level1coli', 'assets/tilemaps/maps/level1_coli.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('level2fleur', 'assets/tilemaps/maps/level2_fleur.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('level2coli', 'assets/tilemaps/maps/level2_coli.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('level3fleur', 'assets/tilemaps/maps/level3_fleur.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('level3coli', 'assets/tilemaps/maps/level3_coli.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('level4fleur', 'assets/tilemaps/maps/level4_fleur.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('level4coli', 'assets/tilemaps/maps/level4_coli.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('level5fleur', 'assets/tilemaps/maps/level5_fleur.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('level5coli', 'assets/tilemaps/maps/level5_coli.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('level6fleur', 'assets/tilemaps/maps/level6_fleur.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('level6coli', 'assets/tilemaps/maps/level6_coli.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('level7fleur', 'assets/tilemaps/maps/level7_fleur.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('level7coli', 'assets/tilemaps/maps/level7_coli.json', null, Phaser.Tilemap.TILED_JSON);
    }

    loadAudio() {
        this.game.load.audio('sound_coli', 'assets/sound/phrase1.wav');
        this.game.load.audio('sound_fleur', 'assets/sound/phrase11.wav');
        this.game.load.audio('main_menu', 'assets/sound/loader.wav');
        this.game.load.audio('game', 'assets/sound/niveau.wav');
    }

    create() {
        this.game.state.start('menu');
    }
}
