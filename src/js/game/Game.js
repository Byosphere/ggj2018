class Game extends Phaser.Game {

    constructor() {

        super('100', '100', Phaser.AUTO, '', null, false, false);

        this.state.add('boot', Booter);
        this.state.add('loader', Loader);
        this.state.add('param', Parameters);
        this.state.add('menu', MainMenu);
        this.state.add('htp', HowToPlay);
        this.state.add('levelhub', LevelSelect);
        this.state.add('scorescreen', ScoreScreen);
        this.state.add('scene', Scene);

        //localstoragemanager
        this.localStorageManager = new LocalStorageManager(this);
        this.localStorageManager.init();

        //add the controlsMananger to the game
        this.controlsManager = new ControlsManager(this);

        //audiomanager
        this.audioManager = new AudioManager(this);

        //server socket io
        this.serverManager = new ServerManager(this);

        //check if is an electron app
        this.isElectronApp = navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;
        if (this.isElectronApp) {
            this.electronManager = new ElectronManager(this);
        }

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
