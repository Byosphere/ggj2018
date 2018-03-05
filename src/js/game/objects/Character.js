/** 
 * Classe du personnage controllé par le joueur
*/
class Character extends Phaser.Sprite {

	constructor(game, data, characterName, scene) {
		super(game, data.x, data.y, characterName, 0);
		this.game = game;
		this.scene = scene;
		this.anchor.setTo(0, 1);
		this.game.physics.arcade.enable(this);
		if (characterName === FLEUR_HEROS) {
			this.body.setSize(64, 64, 0, 0);
		} else {
			this.body.setSize(64, 60, 0, 2);
		}
		this.initAnimations();
		this.previousX = data.x;
		this.previousY = data.y;
		this.carry = null;
		this.facing = null;
	}

	/**
	 * Affiche le personnage sur la scene
	 */
	addToGame() {
		this.game.add(this);
	}

	/**
	 * Initialisation des animations possibles du personnage
	 */
	initAnimations() {
		this.animations.add(HEROS_ANIMATIONS.WALK_RIGHT.NAME, HEROS_ANIMATIONS.WALK_RIGHT.FRAMES, 12, true);
		this.animations.add(HEROS_ANIMATIONS.WALK_LEFT.NAME, HEROS_ANIMATIONS.WALK_LEFT.FRAMES, 12, true);
		this.animations.add(HEROS_ANIMATIONS.WALK_UP.NAME, HEROS_ANIMATIONS.WALK_UP.FRAMES, 12, true);
		this.animations.add(HEROS_ANIMATIONS.CARRY_RIGHT.NAME, HEROS_ANIMATIONS.CARRY_RIGHT.FRAMES, 12, true);
	}

	/**
	 * Si le joueur porte un objet retourne true
	 */
	hasItem() {
		return this.carry;
	}

	/**
	 * Donne au personnage un objet qu'il transporte
	 * @param {Sprite} item
	 */
	catchItem(item) {
		this.carry = item.name;
		item.destroy();
	}

	/**
	 * Dépose l'objet
	 * @param {Object} group 
	 */
	dropItem(group) {
		if (!this.carry) return;
		let x, y;
		switch (this.facing) {
			case DOWN:
				x = this.x;
				y = this.y + 2;
				break;
			case UP:
				x = this.x;
				y = this.y - 120;
				break;
			case LEFT:
				x = this.x - 60;
				y = this.y - this.height;
				break;
			case RIGHT:
				x = this.x + 60;
				y = this.y - this.height;
				break;
		}
		let rock = new Rock(this.game, { x: x, y: y + 64, invisible: true }); // hack anchor + 64
		if (rock.isDroppable(this.scene)) {
			rock.visible = true;
			group.add(rock);
			this.carry = null;
			switch (this.facing) {
				case DOWN: this.stopDown();
					break;
				case UP: this.stopUp();
					break;
				case LEFT: this.stopLeft();
					break;
				case RIGHT: this.stopRight();
					break;
			}
		} else {
			rock.destroy();
		}
	}

	/**
	 * Réinitialise la position du personnage au début du niveau
	 */
	resetPosition() {
		this.x = this.previousX;
		this.y = this.previousY;
		this.body.velocity.x = 0;
		this.body.velocity.y = 0;
		let blink = true;
		this.game.audioManager.playSound('reset');
		this.blinkInterval = setInterval(() => {
			blink ? this.alpha = 0 : this.alpha = 1;
			blink = !blink;
		}, 300);
		this.blinkTimeout = setTimeout(() => {
			clearInterval(this.blinkInterval);
			clearTimeout(this.blinkTimeout);
		}, 2000);
	}

	stop() {
		switch (this.facing) {
			case DOWN: this.stopDown();
				break;
			case UP: this.stopUp();
				break;
			case LEFT: this.stopLeft();
				break;
			case RIGHT: this.stopRight();
				break;
		}
	}

	/**
	 * Déplacement vers la gauche
	 */
	moveLeft() {
		this.facing = LEFT;
		if (this.carry) {
			this.animations.play(HEROS_ANIMATIONS.CARRY_RIGHT.NAME, true);
			this.body.velocity.x = -100;
		} else {
			this.animations.play(HEROS_ANIMATIONS.WALK_LEFT.NAME, true);
			this.body.velocity.x = -200;
		}
	}

	/**
	 * Déplacement vers la droite
	 */
	moveRight() {
		this.facing = RIGHT;
		if (this.carry) {
			this.animations.play(HEROS_ANIMATIONS.CARRY_RIGHT.NAME, true);
			this.body.velocity.x = 100;
		} else {
			this.animations.play(HEROS_ANIMATIONS.WALK_RIGHT.NAME, true);
			this.body.velocity.x = 200;
		}
		this.scale.setTo(1, 1);
	}

	/**
	 * Déplacement vers le haut
	 */
	moveUp() {
		this.facing = UP;
		if (this.carry) {
			this.animations.play(HEROS_ANIMATIONS.CARRY_RIGHT.NAME, true);
			this.body.velocity.y = -100;
		} else {
			this.animations.play(HEROS_ANIMATIONS.WALK_UP.NAME, true);
			this.body.velocity.y = -200;
		}
		this.scale.setTo(1, 1);
	}

	/**
	 * Déplacement vers le bas
	 */
	moveDown() {
		this.facing = DOWN;
		if (this.carry) {
			this.animations.play(HEROS_ANIMATIONS.CARRY_RIGHT.NAME, true);
			this.body.velocity.y = 100;
		} else {
			this.animations.play(HEROS_ANIMATIONS.WALK_RIGHT.NAME, true);
			this.body.velocity.y = 200;
		}
		this.scale.setTo(1, 1);
	}

	/**
	 * Arrêt vers la gauche
	 */
	stopLeft() {
		this.body.velocity.x = 0;
		this.animations.stop();
		this.facing = LEFT;
		if (this.carry)
			this.frame = HEROS_ANIMATIONS.CARRY_RIGHT.FRAMES[0];
		else
			this.frame = HEROS_ANIMATIONS.WALK_LEFT.FRAMES[0];
	}

	/**
	 * Arrêt vers la droite
	 */
	stopRight() {
		this.body.velocity.x = 0;
		this.animations.stop();
		this.facing = RIGHT;
		if (this.carry)
			this.frame = HEROS_ANIMATIONS.CARRY_RIGHT.FRAMES[0];
		else
			this.frame = HEROS_ANIMATIONS.WALK_RIGHT.FRAMES[0];
	}

	/**
	 * Arrêt vers le haut
	 */
	stopUp() {
		this.body.velocity.y = 0;
		this.animations.stop();
		this.facing = UP;
		if (this.carry)
			this.frame = HEROS_ANIMATIONS.CARRY_RIGHT.FRAMES[0];
		else
			this.frame = HEROS_ANIMATIONS.WALK_UP.FRAMES[0];
	}

	/**
	 * Arrêt vers le bas
	 */
	stopDown() {
		this.body.velocity.y = 0;
		this.animations.stop();
		this.facing = DOWN;
		if (this.carry)
			this.frame = HEROS_ANIMATIONS.CARRY_RIGHT.FRAMES[0];
		else
			this.frame = HEROS_ANIMATIONS.WALK_RIGHT.FRAMES[0];
	}
}