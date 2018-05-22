/**
 * Classe de l'objet hole
 */
class Hole extends Phaser.Sprite {

	constructor(game, data) {
		super(game, data.x, data.y, 'hole', 0);
		this.animations.add(HOLE_ANIMATIONS.DEFAULT.NAME, HOLE_ANIMATIONS.DEFAULT.FRAMES, 14, true).play();
		this.game.physics.arcade.enable(this);
		this.linkedHoleId = data.link;
		this.body.immovable = true;
	}

	/**
	 * Fait disparaitre l'objet et l'envoi dans le hole lié
	 * @param {Object} item 
	 */
	sendItem(item) {
		item.body.enable = false;
		item.available = false;
		let tween = this.game.add.tween(item).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true, 0);
		tween.onComplete.add(() => {
			item.destroy();
			this.game.serverManager.getSocket().emit('senditem', { type: item.name, id: this.linkedHoleId });
		});
	}
}