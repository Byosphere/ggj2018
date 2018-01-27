class GameBuilder {

  constructor() {}

  init() {
    // Game configuration object
    var gameConfig = {
      width: 1280,
      height: 720,
      renderer: Phaser.AUTO,
      parent: ''
    };

    // Creation of the game
    var game = new Phaser.Game(gameConfig);

    // Adding the states to the game state manager
    game.state.add('boot', GameBooter);
    game.state.add('loader', GameLoader);
    game.state.add('menu', GameMenu);
    game.state.add('scene', GameScene);

    // Starting the first state
    game.state.start('boot');

    // Initializing connection
    game.socket = io.connect();
    
    return game;
  }

}

var game;
window.onload = function() {
    let gameBuilder  = new GameBuilder();
    game = gameBuilder.init();
};