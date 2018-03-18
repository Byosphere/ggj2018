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
		this.inputs = [];
		this.inputs[DOWN] = false;
		this.inputs[LEFT] = false;
		this.inputs[RIGHT] = false;
		this.inputs[UP] = false;
		this.DEFAULT_SKIN = 'WALK';
		this.DEFAULT_SPEED = 200;
		this.skin = this.DEFAULT_SKIN;
		this.speed = this.DEFAULT_SPEED;
		this.itemOnContact = null;
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
		Object.keys(HEROS_ANIMATIONS).map(objectKey => {
			this.animations.add(HEROS_ANIMATIONS[objectKey].NAME, HEROS_ANIMATIONS[objectKey].FRAMES, 12, true);
		});
	}

	/**
	 * Si le joueur porte un objet retourne true
	 */
	hasItem() {
		return this.carry;
	}

	contactItem(item) {
		this.itemOnContact = item;
		item.onContact();
	}

	noContactItem(item) {
		if (this.itemOnContact && this.itemOnContact.uid === item.uid) {
			this.itemOnContact.outContact();
			this.itemOnContact = null;
		}
	}

	/**
	 * Donne au personnage un objet qu'il transporte
	 * @param {Sprite} item
	 */
	catchItem() {
		this.carry = this.itemOnContact;
		this.noContactItem(this.carry);
		this.itemOnContact = null;
		if (this.carry.weight)
			this.speed -= 100;
		if (this.carry.skin)
			this.skin = this.carry.skin;
		this.frame = HEROS_ANIMATIONS[this.skin + '_' + this.facing.toUpperCase()].FRAMES[0];
		this._animate();
		this.carry.destroy();
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
			this.speed = this.DEFAULT_SPEED;
			this.skin = this.DEFAULT_SKIN;
			this.frame = HEROS_ANIMATIONS[this.skin + '_' + this.facing.toUpperCase()].FRAMES[0];
			this.stop(this.facing);
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

	move(direction) {
		this.inputs[direction] = true;
		this.facing = direction;
		this._animate();
	}

	stop(direction) {
		if(direction) {
			this.inputs[direction] = false;
		} else {
			this.inputs[this.facing] = false;
		}
		
		this._animate();
	}

	_animate() {
		for (let index in this.inputs) {
			if (this.inputs[index]) {
				this.facing = index;
				this.animations.play(HEROS_ANIMATIONS[this.skin + '_' + index.toUpperCase()].NAME, true);
				switch (index) {
					case UP:
						this.body.velocity.y = this.speed * (-1);
						break;

					case DOWN:
						this.body.velocity.y = this.speed;
						break;

					case RIGHT:
						this.body.velocity.x = this.speed;
						break;

					case LEFT:
						this.body.velocity.x = this.speed * (-1);
						break;
				}
			} else if (this.animations.currentAnim.name === HEROS_ANIMATIONS[this.skin + '_' + index.toUpperCase()].NAME) {
				this.animations.stop();
				this.frame = HEROS_ANIMATIONS[this.skin + '_' + index.toUpperCase()].FRAMES[0];
			}

			switch (index) {
				case UP:
					if (!this.inputs[index] && this.body.velocity.y < 0) {
						this.body.velocity.y = 0;
					}
					break;

				case DOWN:
					if (!this.inputs[index] && this.body.velocity.y > 0) {
						this.body.velocity.y = 0;
					}
					break;

				case RIGHT:
					if (!this.inputs[index] && this.body.velocity.x > 0) {
						this.body.velocity.x = 0;
					}
					break;
				case LEFT:
					if (!this.inputs[index] && this.body.velocity.x < 0) {
						this.body.velocity.x = 0;
					}
					break;
			}
		}
	}
}