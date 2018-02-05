class Character extends Phaser.Sprite {

	constructor(game, data, characterName) {
		super(game, data.x, data.y, characterName, 0);
		this.game = game;
		this.anchor.setTo(0, 1);
		this.game.physics.arcade.enable(this);
		if (characterName === FLEUR_HEROS) {
			this.body.setSize(60, 55, 2, 9);
		} else {
			this.body.setSize(48, 55, 8, 9);
		}
		this.initAnimations();
		this.previousX = data.x;
		this.previousY = data.y;
		this.resetSound = this.game.add.audio('reset');
	}

	addToGame() {
		this.game.add(this);
	}

	initAnimations() {
		this.animations.add(HEROS_ANIMATIONS.WALK_RIGHT.NAME, HEROS_ANIMATIONS.WALK_RIGHT.FRAMES, 12, true);
		this.animations.add(HEROS_ANIMATIONS.WALK_LEFT.NAME, HEROS_ANIMATIONS.WALK_LEFT.FRAMES, 12, true);
		this.animations.add(HEROS_ANIMATIONS.WALK_UP.NAME, HEROS_ANIMATIONS.WALK_UP.FRAMES, 12, true);
	}

	resetPosition() {
		this.x = this.previousX;
		this.y = this.previousY;
		let blink = true;
		this.resetSound.play();
		this.blinkInterval = setInterval(() => {
			blink ? this.alpha = 0 : this.alpha = 1;
			blink = !blink;
		}, 300);
		this.blinkTimeout = setTimeout(() => {
			clearInterval(this.blinkInterval);
			clearTimeout(this.blinkTimeout);
		}, 2000);
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