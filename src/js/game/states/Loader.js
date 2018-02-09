class Loader extends Phaser.State {

    preload() {

        this.game.stage.backgroundColor = LOADER_BACKGROUND;

        // Displaying the title of the game
        this.title = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'title');
        this.title.anchor.setTo(0.5);

        let preload = this.game.add.sprite(this.game.world.width - 100, this.game.world.height - 100, 'preloadbar');
        preload.anchor.setTo(0.5);
        preload.animations.add('default', [0, 1, 2, 3], 10, true);
        preload.animations.play('default');

        let loadingText = this.game.add.text(0, 0, this.game.translate('LOADING_TEXT'), { font: DEFAULT_FONT, fill: LOADER_COLOR });
        loadingText.x = preload.x - loadingText.width - (preload.width / 2) - 10;
        loadingText.y = preload.y - loadingText.height / 2;

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
        this.game.load.image('decor', BASE_URL + 'tilemaps/tiles/decor.png');
        // for (let w = 0; w < WORLDS.length; w++) {
        //     this.game.load.image(WORLDS[w], BASE_URL + 'tilemaps/tiles/'+WORLDS+'.png');
        // }
    }

    loadSpritesheets() {
        //spritesheets
        this.game.load.spritesheet('fleur', BASE_URL + 'sprites/fleur.png', CELL_SIZE * HEROS_WIDTH, CELL_SIZE * HEROS_HEIGHT);
        this.game.load.spritesheet('coli', BASE_URL + 'sprites/coli.png', CELL_SIZE * HEROS_WIDTH, CELL_SIZE * HEROS_HEIGHT);
        this.game.load.spritesheet('background_title', BASE_URL + 'sprites/background_title.png', this.game.world.width, this.game.world.height);
        this.game.load.spritesheet('bulle', BASE_URL + 'sprites/bulle.png', CELL_SIZE, CELL_SIZE);
        this.game.load.spritesheet('anim_title', BASE_URL + 'sprites/titre_anim.png', HEAD_TITLE_WIDTH, HEAD_TITLE_HEIGHT);
        this.game.load.spritesheet('door', BASE_URL + 'sprites/door.png', CELL_SIZE * DOOR_WIDTH, CELL_SIZE * DOOR_HEIGHT);
        this.game.load.spritesheet('door_horizontal', BASE_URL + 'sprites/door_horizontal.png', CELL_SIZE * DOOR_HEIGHT, CELL_SIZE * DOOR_WIDTH);
        this.game.load.spritesheet('button', BASE_URL + 'sprites/button.png', CELL_SIZE * BUTTON_WIDTH, CELL_SIZE * BUTTON_HEIGHT);
        this.game.load.spritesheet('rock', BASE_URL + 'sprites/caillou.png', CELL_SIZE * ROCK_WIDTH, CELL_SIZE * ROCK_HEIGHT);
        this.game.load.spritesheet('exit', BASE_URL + 'sprites/exit.png', CELL_SIZE * EXIT_WIDTH, CELL_SIZE * EXIT_HEIGHT);
        this.game.load.spritesheet('victory', BASE_URL + 'sprites/vousavezgagne.png', VICTORY_WIDTH, VICTORY_HEIGHT);
        this.game.load.spritesheet('exit_perso', BASE_URL + 'sprites/exit_perso.png', CELL_SIZE * EXIT_WIDTH, CELL_SIZE * EXIT_HEIGHT);
        this.game.load.spritesheet('felicitations', BASE_URL + 'sprites/felicitations.png', CREDITS_WIDTH, CREDITS_HEIGHT);
    }

    loadTilemaps() {
        for (let w = 0; w < WORLDS.length; w++) {
            for (let i = 1; i <= NB_LEVELS; i++) {
                this.game.load.tilemap('level' + i + '_world' + (w + 1) + '_fleur', BASE_URL + 'tilemaps/maps/' + WORLDS[w] + '/level' + i + '_fleur.json', null, Phaser.Tilemap.TILED_JSON);
                this.game.load.tilemap('level' + i + '_world' + (w + 1) + '_coli', BASE_URL + 'tilemaps/maps/' + WORLDS[w] + '/level' + i + '_coli.json', null, Phaser.Tilemap.TILED_JSON);
            }
        }
    }

    loadAudio() {
        this.game.load.audio('sound_coli', BASE_URL + 'sound/phrase1.wav');
        this.game.load.audio('sound_fleur', BASE_URL + 'sound/phrase11.wav');
        this.game.load.audio('reset', BASE_URL + 'sound/phrase17.wav');
        this.game.load.audio('main_menu', BASE_URL + 'sound/loader.wav');
        this.game.load.audio('game', BASE_URL + 'sound/niveau.wav');
        this.game.load.audio('win', BASE_URL + 'sound/win.wav');
    }

    create() {
        this.game.state.start('levelhub', true, false, { id: 0 });
    }
}
