class Game extends Phaser.Game {

    constructor() {

        super(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, '', null, false, false);

        this.state.add('boot', Booter);
        this.state.add('loader', Loader);
        this.state.add('lobby', Lobby);
        this.state.add('menu', MainMenu);
        this.state.add('scene', Scene);

        //set some parameters
        this.controller = CONTROLLER;
        this.translate = TEXT_FR;

        //add the controlsMananger to the game
        this.controlsManager = new ControlsManager(this);

        //audiomanager
        this.audioManager = new AudioManager(this);

        //server socket io
        this.serverManager = new ServerManager(this);

        this.state.start('boot');
    }
}
