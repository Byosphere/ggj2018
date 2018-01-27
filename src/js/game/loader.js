var GameLoader = {};
  
GameLoader.preload = function() {
    game.stage.backgroundColor = BACKGROUND_COLOR;
};

GameLoader.create = function() {
    game.state.start('menu');
};
