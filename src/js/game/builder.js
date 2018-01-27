var GameBuilder = {};
var game;

GameBuilder.init = function() {
  // Game configuration object
  var gameConfig = {
    width: 1280,
    height: 720,
    renderer: Phaser.AUTO,
    parent: ''
  };

  // Creation of the game
  game = new Phaser.Game(gameConfig);

  // Adding the states to the game state manager
  game.state.add('boot', GameBooter);
  game.state.add('loader', GameLoader);
  game.state.add('menu', GameMenu);
  game.state.add('scene', GameScene);

  // Starting the first state
  game.state.start('boot');
};