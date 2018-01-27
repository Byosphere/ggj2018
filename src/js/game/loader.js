class GameLoader {

    constructor() {}
  
    preload() {
        game.stage.backgroundColor = BACKGROUND_COLOR;
    }

    create() {
        game.state.start('menu');
    }

}
