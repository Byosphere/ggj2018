class Game extends Phaser.Game {

    constructor() {

        super(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, '', null, false, false);

        this.state.add('boot', Booter);
        this.state.add('loader', Loader);
        this.state.add('param', Parameters);
        this.state.add('lobby', Lobby);
        this.state.add('menu', MainMenu);
        this.state.add('scene', Scene);

        //set some parameters shortcuts
        this.parameters = {
            translate: { nameKey: 'LANGUAGE', value: DEFAULT_LANGUAGE, allValues: [{ name: 'FRENCH', value: 'TEXT_FR' }, { name: 'ENGLISH', value: 'TEXT_EN' }] },
            musicVolume: { nameKey: 'MUSIC_VOLUME', value: DEFAULT_MUSIC_VOLUME, allValues: null, max: 10, min: 0 },
            soundVolume: { nameKey: 'SOUND_VOLUME', value: DEFAULT_SOUND_VOLUME, allValues: null, max: 10, min: 0 },
            debugMode: { nameKey: 'DEBUG_MODE', hidden: true, value: DEFAULT_DEBUG_MODE, allValues: [{ name: 'DESACTIVATED', value: 0 }, { name: 'ACTIVATED', value: 1 }] },
            debugLevel: { nameKey: 'DEBUG_MODE_LEVEL', hidden: true, value: 0, allValues: null, max: NB_LEVELS * WORLDS.length, min: 0 },
            debugHeros: { nameKey: 'DEBUG_MODE_HEROS', hidden: true, value: 0, allValues: [{ name: 'Coli', value: COLI_HEROS }, { name: 'Fleur', value: FLEUR_HEROS }] }
        };

        //add the controlsMananger to the game
        this.controlsManager = new ControlsManager(this);

        //audiomanager
        this.audioManager = new AudioManager(this);

        //server socket io
        this.serverManager = new ServerManager(this);

        this.state.start('boot');
    }

    /**
     * Permet de récupérer un texte traduit dans la langue choisie
     * @param {string} key : Clé de traduction
     * @param {any} deepkey : deepkey
     */
    translate(key, deepkey) {
        let value = this.parameters.translate.allValues[this.parameters.translate.value].value;
        if (window[value][key] && !deepkey) {
            return window[value][key];
        } else if (deepkey && window[value][key] && window[value][key][deepkey]) {
            return window[this.parameters.translate.allValues[this.parameters.translate.value].value][key][deepkey];
        } else {
            return key;
        }
    }
}
