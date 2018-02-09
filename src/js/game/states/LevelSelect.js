class LevelSelect {

	init(player) {
		this.player = player;
	}

	preload() {
		this.paddingLeft = 60;
		this.posY = 150;
		this.title = this.game.add.text(this.paddingLeft, 20, this.game.translate('LEVEL_SELECT_TITLE'), { font: HEAD_FONT, fill: DEFAULT_COLOR });
		this.subline = this.game.add.text(this.paddingLeft, 40, "_______________________________", { font: HEAD_FONT, fill: DEFAULT_COLOR });
		this.p1 = this.game.add.text(this.paddingLeft, this.posY, this.game.translate('P1_REVERSE'), { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		this.p2 = this.game.add.text(this.game.world.width - this.paddingLeft, this.posY, this.game.translate('P2'), { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		this.p2.anchor.setTo(1, 0);
		this.playerCursor = null;
		if (this.player.id === 0) {
			this.playerCursor = this.p1;
			this.p1.alpha = 1;
			this.p2.alpha = 0.4;
		} else {
			this.playerCursor = this.p2;
			this.p1.alpha = 0.4;
			this.p2.alpha = 1;
		}
		this.levelList = [];
		let index = 1;
		this.worldPos = 1;
		this.herosPosition = 0;
		for (let w = 1; w <= WORLDS.length; w++) {
			this.levelList[w] = [];
			this.posY = 150;

			for (let i = 0; i < NB_LEVELS; i++) {

				let isLocked = true;
				this.game.levels.forEach(el => {
					if (el === index) {
						isLocked = false;
						return;
					}
				})

				this.levelList[w].push({
					name: this.game.translate('LEVEL_NAMES', index),
					levelNum: i,
					world: w,
					locked: isLocked,
					posY: this.posY,
					text: this.game.add.text(this.game.world.centerX, this.posY, this.game.translate('LEVEL_NAMES', index), { font: DEFAULT_FONT, fill: DEFAULT_COLOR })
				});
				index++;
				this.posY += 50;
			}
		}
		this.nextWorld = this.game.add.text(this.game.world.width - this.paddingLeft, this.game.world.height - 200, this.game.translate('LEVEL_NEXT_WORLD'), { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		this.previousWorld = this.game.add.text(this.paddingLeft, this.game.world.height - 200, this.game.translate('LEVEL_PREV_WORLD'), { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		this.nextWorld.anchor.setTo(1, 0);
		this.nextWorld.visible = false;
		this.previousWorld.visible = false;
		this.game.controlsManager.setCallbackContext(this);
	}

	create() {
		this.displayLevels(this.worldPos);
	}

	displayLevels(world) {

		this.showOnly(world);
		this.levelList[world].forEach(level => {
			level.text.anchor.setTo(0.5, 0);
			level.text.alpha = 0.4;

			if (level.locked) {
				level.text.text = "????????";
			}
		});
		if (this.herosPosition < NB_LEVELS) {
			this.levelList[world][this.herosPosition].text.alpha = 1;
			this.playerCursor.alpha = 1;
			this.playerCursor.y = this.levelList[world][this.herosPosition].posY;
		} else {
			this.playerCursor.alpha = 0;
		}
			

		this.previousWorld.visible = world > 1;
		this.previousWorld.alpha = (this.herosPosition === NB_LEVELS) ? 1 : 0.6;

		this.nextWorld.visible = world < WORLDS.length;
		this.nextWorld.alpha = (this.herosPosition === NB_LEVELS + 1) ? 1 : 0.6;
	}

	showOnly(world) {
		this.levelList.forEach(w => {
			w.forEach(l => {
				if (l.world != world) {
					l.text.visible = false;
				} else {
					l.text.visible = true;
				}
			});
		});
	}

	downButtonReleased() {
		if (this.herosPosition < NB_LEVELS - 1) {
			this.herosPosition++;
		} else if (this.herosPosition === NB_LEVELS - 1 && this.previousWorld.visible) {
			this.herosPosition++;
		} else if (this.herosPosition === NB_LEVELS - 1 && this.nextWorld.visible) {
			this.herosPosition = NB_LEVELS + 1;
		} else if (this.herosPosition === NB_LEVELS && this.nextWorld.visible) {
			this.herosPosition++;
		}

		this.displayLevels(this.worldPos);
	}

	upButtonReleased() {
		if (this.herosPosition > 0 && this.herosPosition < NB_LEVELS + 1) {
			this.herosPosition--;
		} else if (this.herosPosition === NB_LEVELS + 1 && !this.previousWorld.visible) {
			this.herosPosition = NB_LEVELS - 1;
		} else if (this.herosPosition === NB_LEVELS + 1 && this.previousWorld.visible) {
			this.herosPosition--;
		}

		this.displayLevels(this.worldPos);
	}

	leftButtonReleased() {

		if (this.herosPosition === NB_LEVELS + 1 && this.previousWorld.visible && this.nextWorld.visible)
			this.herosPosition--;
		this.displayLevels(this.worldPos);
	}

	rightButtonReleased() {

		if (this.herosPosition === NB_LEVELS && this.nextWorld.visible)
			this.herosPosition++;
		this.displayLevels(this.worldPos);
	}

	actionButtonReleased() {
		if (this.herosPosition === NB_LEVELS) {
			this.worldPos--;
			this.herosPosition = 0;
			this.displayLevels(this.worldPos);
		} else if (this.herosPosition === NB_LEVELS + 1) {
			this.worldPos++;
			this.herosPosition = 0;
			this.displayLevels(this.worldPos);
		} else {
			if (!this.levelList[this.worldPos][this.herosPosition].locked)
				this.game.state.start('scene', true, false, this.player, { level: this.herosPosition + 1, world: this.worldPos }, { heros: 'coli' });
		}
	}

	shutdown() {

	}
}