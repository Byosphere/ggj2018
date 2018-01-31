class Game extends Phaser.Game {

    constructor() {

        super(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO);

        this.state.add('boot', Booter);
        this.state.add('loader', Loader);
        this.state.add('lobby', Lobby);
        this.state.add('menu', MainMenu);
        this.state.add('scene', Scene);

        //add socket IO to the game
        this.socket = io.connect();
        this.parameters = { controller: CONTROLLER };
        //add the controlsMananger to the game
        this.controlsManager = new ControlsManager(this);

        this.state.start('boot');
    }
}
