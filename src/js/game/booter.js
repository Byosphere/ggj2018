var GameBooter = function(game) {
    this.game = game;
};
  
GameBooter.prototype = {
  
    preload: function() {
      this.game.load.image('phaser_logo', 'dist/assets/images/phaser_logo.png');
    },
  
    create: function() {
      this.game.state.start('loader');
    }
  
};