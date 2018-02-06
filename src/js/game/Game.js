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
            translate: { nameKey: 'LANGUAGE', value: 0, allValues: [{ name: 'FRENCH', value: 'TEXT_FR' }, { name: 'ENGLISH', value: 'TEXT_EN' }] },
            musicVolume: { nameKey: 'MUSIC_VOLUME', value: 0, allValues: [{ name: '10', value: 1 }] },
            soundVolume: { nameKey: 'SOUND_VOLUME', value: 0, allValues: [{ name: '10', value: 1 }] },
            debugMode: { nameKey: 'DEBUG_MODE', value: 1, level: DEBUG_LEVEL, heros: DEBUG_HEROS, allValues: [{ name: 'ACTIVATED', value: true }, { name: 'DESACTIVATED', value: false }] }
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
     * @param {Clé de traduction} key 
     */
    translate(key, deepkey) {
        let value = this.parameters.translate.allValues[this.parameters.translate.value].value;
        if (window[value][key] && !deepkey) {
            return window[value][key];
        } else if (deepkey && window[value][key] && window[value][key][deepkey]) {
            return window[this.parameters.translate.value][key][deepkey];
        } else {
            return key;
        }
    }
}
