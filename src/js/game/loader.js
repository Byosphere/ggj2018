class GameLoader {

    constructor() {}
  
    preload() {
        game.stage.backgroundColor = BACKGROUND_COLOR;

        game.add.sprite(0, 0, 'title');
    }

    create() {
        game.state.start('menu');
    }

}
