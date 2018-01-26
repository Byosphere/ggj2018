var GameBooter = function(game) {
    this.game = game;
};
  
GameBooter.prototype = {
  
    preload: function() {
      
    },
  
    create: function() {
      this.game.state.start('loader');
    }
  
};