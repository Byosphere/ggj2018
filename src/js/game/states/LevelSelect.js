class LevelSelect {


	init(player) {
		this.player = player || null;
	}

	preload() {
		this.paddingLeft = 60;
		this.title = this.game.add.text(this.paddingLeft, 20, this.game.translate('LEVEL_SELECT_TITLE'), { font: HEAD_FONT, fill: DEFAULT_COLOR });
		this.subline = this.game.add.text(this.paddingLeft, 40, "_______________________________", { font: HEAD_FONT, fill: DEFAULT_COLOR });
		this.levelList = [];
		this.posY = 150;
		let index = 1;
		this.worldPos = 1;
		this.herosPosition = 0;
		for (let w = 1; w <= WORLDS.length; w++) {
			for (let i = 0; i < NB_LEVELS; i++) {
				this.levelList.push({
					name: this.game.translate('LEVEL_NAMES', index),
					levelNum: i,
					world: w,
					locked: index != 1,
					text: this.game.add.text(this.game.world.centerX, this.posY, this.game.translate('LEVEL_NAMES', index), { font: DEFAULT_FONT, fill: DEFAULT_COLOR })
				});
				index++;
				this.posY += 50;
			}
		}
		this.nextWorld = this.game.add.text(this.game.world.width - this.paddingLeft, this.game.world.height - 200, 'Next World ->', { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		this.previousWorld = this.game.add.text(this.paddingLeft, this.game.world.height - 200, '<- Previous World', { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		this.nextWorld.anchor.setTo(1, 0);
		this.nextWorld.visible = false;
		this.previousWorld.visible = false;
		this.game.controlsManager.setCallbackContext(this);
	}

	create() {
		this.displayLevels(this.worldPos);
	}

	displayLevels(world) {
		this.levelList.forEach(level => {
			level.text.anchor.setTo(0.5, 0);
			level.text.alpha = 0.6;

			if (level.world != world) {
				level.text.visible = false;
			}
			if (level.locked) {
				level.text.text = "????????";
			}
		});
		if (this.herosPosition < NB_LEVELS)
			this.levelList[this.herosPosition].text.alpha = 1;

		this.previousWorld.visible = true;//world > 1;
		this.previousWorld.alpha = (this.herosPosition === NB_LEVELS) ? 1 : 0.6;

		this.nextWorld.visible = true;//world < WORLDS.length;
		this.nextWorld.alpha = (this.herosPosition === NB_LEVELS + 1) ? 1 : 0.6;
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

	update() {

	}

	shutdown() {

	}
}