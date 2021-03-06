class Loader extends Phaser.State {

    preload() {

        this.game.stage.backgroundColor = LOADER_BACKGROUND;

        this.preload = this.game.add.sprite(this.game.world.width - 100, this.game.world.height - 100, 'preloadbar');
        this.preload.anchor.setTo(0.5);
        this.preload.animations.add('default', [0, 1, 2, 3], 10, true);
        this.preload.animations.play('default');

        this.loadingText = this.game.add.text(0, 0, this.game.translate('LOADING_TEXT'), { font: DEFAULT_FONT, fill: LOADER_COLOR });
        this.loadingText.x = this.preload.x - this.loadingText.width - (this.preload.width / 2) - 10;
        this.loadingText.y = this.preload.y - this.loadingText.height / 2;

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
        this.game.load.image('hudSelect', BASE_URL + 'sprites/levelSelect/hud_select.png');
        this.game.load.image('levelBack', BASE_URL + 'sprites/levelSelect/level_back.png');
        this.game.load.image('rightBands', BASE_URL + 'sprites/levelSelect/right_bands.png');
        this.game.load.image('completed', BASE_URL + 'sprites/levelSelect/completed.png');
        this.game.load.image('worldMap', BASE_URL + 'sprites/levelSelect/world_map.png');
        this.game.load.image('lock', BASE_URL + 'sprites/levelSelect/lock.png');
        this.game.load.image('worldCursor', BASE_URL + 'sprites/levelSelect/world_cursor.png');
        this.game.load.image('tbMedium', BASE_URL + 'sprites/textMessage/background_medium.png');
        this.game.load.image('info', BASE_URL + 'sprites/textMessage/info.png');
        this.game.load.image('cursor', BASE_URL + 'sprites/mainMenu/cursor.png');
        this.game.load.image('logo', BASE_URL + 'logo.png');
        for (let w = 0; w < WORLDS.length; w++) {
            this.game.load.image('tileset-' + (w + 1), BASE_URL + 'tilemaps/tiles/tileset-' + (w + 1) + '.png');
        }
    }

    loadSpritesheets() {
        //spritesheets
        this.game.load.spritesheet('btnA', BASE_URL + 'sprites/controlsIcons/btnA.png', 44, 44);
        this.game.load.spritesheet('btnB', BASE_URL + 'sprites/controlsIcons/btnB.png', 44, 44);
        this.game.load.spritesheet('btnUp', BASE_URL + 'sprites/controlsIcons/btnUp.png', 64, 64);
        this.game.load.spritesheet('btnDown', BASE_URL + 'sprites/controlsIcons/btnDown.png', 64, 64);
        this.game.load.spritesheet('btnLeft', BASE_URL + 'sprites/controlsIcons/btnLeft.png', 64, 64);
        this.game.load.spritesheet('btnRight', BASE_URL + 'sprites/controlsIcons/btnRight.png', 64, 64);
        this.game.load.spritesheet('enter', BASE_URL + 'sprites/controlsIcons/enter.png', 80, 96);
        this.game.load.spritesheet('keys', BASE_URL + 'sprites/controlsIcons/keys.png', 140, 92);
        this.game.load.spritesheet('esc', BASE_URL + 'sprites/controlsIcons/esc.png', 80, 44);
        this.game.load.spritesheet('space', BASE_URL + 'sprites/controlsIcons/space.png', 140, 44);
        this.game.load.spritesheet('fleur', BASE_URL + 'sprites/fleur.png', CELL_SIZE * HEROS_WIDTH, CELL_SIZE * HEROS_HEIGHT);
        this.game.load.spritesheet('coli', BASE_URL + 'sprites/coli.png', CELL_SIZE * HEROS_WIDTH, CELL_SIZE * HEROS_HEIGHT);
        this.game.load.spritesheet('background_title', BASE_URL + 'sprites/background_title.png', this.game.world.width, this.game.world.height);
        this.game.load.spritesheet('bulle', BASE_URL + 'sprites/bulle.png', CELL_SIZE, CELL_SIZE);
        this.game.load.spritesheet('anim_title', BASE_URL + 'sprites/titre_anim.png', HEAD_TITLE_WIDTH, HEAD_TITLE_HEIGHT);
        this.game.load.spritesheet('button', BASE_URL + 'sprites/button.png', CELL_SIZE * BUTTON_WIDTH, CELL_SIZE * BUTTON_HEIGHT);
        this.game.load.spritesheet('hole', BASE_URL + 'sprites/hole.png', 64, 64);
        this.game.load.spritesheet('rock', BASE_URL + 'sprites/caillou.png', CELL_SIZE * ROCK_WIDTH, CELL_SIZE * ROCK_HEIGHT);
        this.game.load.spritesheet('hud', BASE_URL + 'sprites/hud.png', 64, 64);
        this.game.load.spritesheet('victory', BASE_URL + 'sprites/vousavezgagne.png', VICTORY_WIDTH, VICTORY_HEIGHT);
        this.game.load.spritesheet('exit_perso', BASE_URL + 'sprites/exit_perso.png', CELL_SIZE * EXIT_WIDTH, CELL_SIZE * EXIT_HEIGHT);
        this.game.load.spritesheet('felicitations', BASE_URL + 'sprites/felicitations.png', CREDITS_WIDTH, CREDITS_HEIGHT);
        this.game.load.spritesheet('background_top_corner', BASE_URL + 'sprites/mainMenu/background_top_corner.png', 192, 192);
        this.game.load.spritesheet('background_bot_corner', BASE_URL + 'sprites/mainMenu/background_bot_corner.png', 1064, 272);
        this.game.load.spritesheet('background_top_middle', BASE_URL + 'sprites/mainMenu/background_top_middle.png', 416, 96);
        this.game.load.spritesheet('background_top_middle2', BASE_URL + 'sprites/mainMenu/background_top_middle2.png', 212, 64);
        this.game.load.spritesheet('background_bot_corner2', BASE_URL + 'sprites/mainMenu/background_bot_corner2.png', 132, 296);
        for (let w = 1; w <= WORLDS.length; w++) {
            this.game.load.spritesheet('door_w' + w, BASE_URL + 'sprites/doors/door_w' + w + '.png', CELL_SIZE * DOOR_WIDTH, CELL_SIZE * DOOR_HEIGHT);
            this.game.load.spritesheet('door_horizontal_w' + w, BASE_URL + 'sprites/doors/door_horizontal_w' + w + '.png', CELL_SIZE * DOOR_HEIGHT, CELL_SIZE * DOOR_WIDTH);
            this.game.load.spritesheet('exit_w' + w, BASE_URL + 'sprites/exit_w' + w + '.png', CELL_SIZE * EXIT_WIDTH, CELL_SIZE * EXIT_HEIGHT);
        }
    }

    loadTilemaps() {
        for (let w = 1; w <= WORLDS.length; w++) {
            for (let i = 1; i <= NB_LEVELS; i++) {
                this.game.load.tilemap('level' + i + '_world' + w + '_fleur', BASE_URL + 'tilemaps/maps/' + 'world-' + w + '/level' + i + '_fleur.json', null, Phaser.Tilemap.TILED_JSON);
                this.game.load.tilemap('level' + i + '_world' + w + '_coli', BASE_URL + 'tilemaps/maps/' + 'world-' + w + '/level' + i + '_coli.json', null, Phaser.Tilemap.TILED_JSON);
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
        this.game.load.audio('cursor', BASE_URL + 'sound/curseur.mp3');
        this.game.load.audio('bip', BASE_URL + 'sound/bip.ogg');
        this.game.load.audio('back', BASE_URL + 'sound/back.wav');
        this.game.load.audio('pop', BASE_URL + 'sound/pop.wav');
        this.game.load.audio('door_laser', BASE_URL + 'sound/door_laser.wav');
        this.game.load.audio('door_leaves', BASE_URL + 'sound/door_leaves.wav');
        this.game.load.audio('button', BASE_URL + 'sound/button.wav');
    }

    create() {
        this.preload.destroy();
        this.loadingText.destroy();
        this.logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 100, 'logo');
        this.logo.anchor.setTo(0.5);
        this.game.add.tween(this.logo).to({ alpha: 0 }, 1000, 'Quart.easeInOut', true, 2000);
        this.startText = this.game.add.text(this.game.world.centerX, 550, this.game.translate('PRESENTS'), { font: DEFAULT_FONT, fill: LOADER_COLOR });
        this.startText.anchor.setTo(0.5);
        let anim = this.game.add.tween(this.startText).to({ alpha: 0 }, 1000, 'Quart.easeInOut', true, 2000);
        anim.onComplete.add(() => {
            this.game.state.start('menu');
        });
    }
}
