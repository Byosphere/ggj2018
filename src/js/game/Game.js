class Game extends Phaser.Game {

    constructor() {

        super(1280, 896, Phaser.AUTO);

        this.state.add('boot', Booter);
        this.state.add('loader', Loader);
        this.state.add('menu', MainMenu);
        this.state.add('scene', Scene);

        //add socket IO to the game
        this.socket = io.connect();
        //add the controlsMananger to the game
        this.controlsManager = new ControlsManager(this);
        
        this.state.start('boot');
    }
}