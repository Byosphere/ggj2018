var GameLoader = function(game) {
    this.game = game;
};
  
GameLoader.prototype = {
  
    loadImages: function() {
  
    },
  
    preload: function() {
        this.game.stage.backgroundColor = BACKGROUND_COLOR;
    },

    create: function() {
        this.game.state.start('menu');
    }
  
};