class Character extends Phaser.Sprite {

	constructor(game, data, characterName) {
		super(game, data.x, data.y, characterName, 0);
		this.game = game;
		this.anchor.setTo(0, 1);
		this.game.physics.arcade.enable(this);
		this.body.setSize(64, 64, 0, 0);
		this.initAnimations();
	}

	addToGame() {
		this.game.add(this);
	}

	initAnimations() {
		this.animations.add(HEROS_ANIMATIONS.WALK_RIGHT.NAME, HEROS_ANIMATIONS.WALK_RIGHT.FRAMES, 12, true);
		this.animations.add(HEROS_ANIMATIONS.WALK_LEFT.NAME, HEROS_ANIMATIONS.WALK_LEFT.FRAMES, 12, true);
		this.animations.add(HEROS_ANIMATIONS.WALK_UP.NAME, HEROS_ANIMATIONS.WALK_UP.FRAMES, 12, true);
	}

	moveLeft() {
		this.body.velocity.x = -200;
		this.animations.play(HEROS_ANIMATIONS.WALK_LEFT.NAME, true);
	}

	moveRight() {
		this.body.velocity.x = 200;
		this.animations.play(HEROS_ANIMATIONS.WALK_RIGHT.NAME, true);
		this.scale.setTo(1, 1);
	}

	moveUp() {
		this.body.velocity.y = -200;
		this.animations.play(HEROS_ANIMATIONS.WALK_UP.NAME, true);
		this.scale.setTo(1, 1);
	}

	moveDown() {
		this.body.velocity.y = 200;
		this.animations.play(HEROS_ANIMATIONS.WALK_RIGHT.NAME, true);
		this.scale.setTo(1, 1);
	}

	stopLeft() {
		this.body.velocity.x = 0;
		this.animations.stop();
		this.frame = HEROS_ANIMATIONS.WALK_LEFT.FRAMES[0];
	}

	stopRight() {
		this.body.velocity.x = 0;
		this.animations.stop();
		this.frame = HEROS_ANIMATIONS.WALK_RIGHT.FRAMES[0];
	}

	stopUp() {
		this.body.velocity.y = 0;
		this.animations.stop();
		this.frame = HEROS_ANIMATIONS.WALK_UP.FRAMES[0];
	}

	stopDown() {
		this.body.velocity.y = 0;
		this.animations.stop();
		this.frame = HEROS_ANIMATIONS.WALK_RIGHT.FRAMES[0];
	}
}