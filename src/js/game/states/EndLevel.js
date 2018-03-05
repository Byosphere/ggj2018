class EndLevel extends Phaser.State {

	init(levelData, hero) {
		this.level = levelData;
		this.heroSelected = hero;
	}

	preload() {
		this.game.stage.backgroundColor = MENU_BACKGROUND_COLOR;
		this.game.controlsManager.setCallbackContext(this);
		this.game.serverManager.setCallbackContext(this);
		this.posY = 0;
		this.delay = 200;
		this.game.controlsManager.disableControls();
		this.playerPos = 0;
		this.nextLevel = this.level.num + 1;
		this.continue = true;
	}

	create() {
		this.game.serverManager.getSocket().emit('finishlevel');
		let newHighScore = this.game.localStorageManager.saveLevelScore(this.level.num, this.level.highScore);
		let title = this.game.add.text(this.game.world.centerX, -100, this.game.translate('LEVEL_COMPLETED'), { font: BIG_FONT, fill: DEFAULT_COLOR });
		title.anchor.setTo(0.5, 0.5);
		title.setShadow(4, 4, "rgba(0, 0, 0, 0.7)", 7);
		let time = this.game.add.text(this.game.world.centerX, -80, this.game.translate('TIME') + ' : ' + getFormatedTime(this.level.highScore), { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		time.setShadow(4, 4, "rgba(0, 0, 0, 0.7)", 7);
		this.game.add.tween(title).to({ y: 180 }, 1500, "Quart.easeInOut", true, this.delay);
		this.game.add.tween(time).to({ y: 230 }, 1500, "Quart.easeInOut", true, 0);
		this.delay += 1700;

		if (newHighScore) {
			let star = this.game.add.sprite(time.x + time.width + 800, 230 + 15, 'completed');
			star.scale.setTo(15, 15);
			star.anchor.setTo(0.5, 0.5);
			this.game.add.tween(star.scale).to({ x: 2, y: 2 }, 1000, "Quart.easeInOut", true, this.delay);
			this.game.add.tween(star).to({ x: time.x + time.width + 30 }, 1000, "Quart.easeInOut", true, this.delay);
			this.delay += 1000;
		}
		let unlockPattern = WORLDS_DATA[this.level.world - 1].unlock_pattern;

		if (unlockPattern && unlockPattern.length && unlockPattern[this.level.num]) {
			this.initialDelay = this.delay;
			let unlock = this.game.add.text(this.game.world.centerX, 350, this.game.translate('LEVELS_UNLOCKED') + ' :', { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
			unlock.anchor.setTo(0.5, 0.5);
			unlock.setShadow(4, 4, "rgba(0, 0, 0, 0.7)", 7);
			unlock.alpha = 0;
			this.game.add.tween(unlock).to({ alpha: 1 }, 800, "Quart.easeInOut", true, 1700);
			unlockPattern[this.level.num].forEach(num => {
				if (this.game.localStorageManager.unlockLevel(num)) {
					this.displayLevel(num, getLevelFromLevelNum(num), getWorldFromLevelNum(num));
				}
			});
		} else {
			this.game.localStorageManager.unlockLevel(this.nextLevel);
		}
		this.background = this.game.add.sprite(0, 0, 'background_title');
		this.disconnectScreen = new DisconnectScreen(this.game);
		this.displayNext();
	}

	displayLevel(num, level, world) {
		let levelGroup = this.game.add.group();
		let graph = this.game.add.sprite(0, 0, 'levelBack');
		let text = this.game.add.text(graph.x + 50, graph.centerY - 5, this.game.translate('LEVEL_NAMES', num), { font: SMALL_FONT, fill: DEFAULT_COLOR });
		text.anchor.setTo(0, 0.5);
		text.setShadow(4, 4, "rgba(0, 0, 0, 0.7)", 2);
		let levelNum = this.game.add.text(graph.x + 25, graph.centerY, world + '-' + level, { font: SMALL_FONT, fill: DEFAULT_COLOR });
		levelNum.anchor.setTo(0.5, 0.5);
		levelNum.angle = -90;
		levelNum.setShadow(4, 4, "rgba(0, 0, 0, 0.7)", 2);
		let score = this.game.add.text(graph.x + 50, graph.centerY + 5, this.game.translate('BEST_TIME') + ': -min -s | ' + this.game.translate('COLLECTIBLE') + ': -', { font: SMALLEST_FONT, fill: DEFAULT_COLOR });
		score.alpha = 0.7;
		levelGroup.add(graph);
		levelGroup.add(text);
		levelGroup.add(levelNum);
		levelGroup.add(score);
		levelGroup.x = this.game.world.centerX - graph.width / 2;
		levelGroup.y = this.game.world.height;
		this.game.add.tween(levelGroup).to({ y: 400 + this.posY }, 1500, "Quart.easeInOut", true, this.initialDelay);
		this.posY = + 80;
		this.initialDelay += 200;
		this.delay += 1500;
	}

	displayNext() {
		this.game.controlsManager.enableControls();
		let group = this.game.add.group();
		let text = this.game.add.text(0, 0, this.game.translate('CONTINUE'), { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		this.yes = this.game.add.text(250, 0, '< ' + this.game.translate('YES') + ' >', { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		this.no = this.game.add.text(390, 0, '  ' + this.game.translate('NO') + '  ', { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		this.no.alpha = 0.3;
		group.add(text);
		group.add(this.yes);
		group.add(this.no);
		group.y = 650;
		group.x = this.game.world.centerX - group.width / 2;
		group.alpha = 0;
		this.game.add.tween(group).to({ alpha: 1 }, 500, "Quart.easeInOut", true, this.delay);
	}

	leftButtonReleased() {
		if (this.playerPos === 1) {
			this.game.audioManager.playSound('cursor');
			this.playerPos = 0;
			this.yes.alpha = 1;
			this.yes.text = '< ' + this.game.translate('YES') + ' >';
			this.no.alpha = 0.3;
			this.no.text = '  ' + this.game.translate('NO') + '  ';
		}
	}

	rightButtonReleased() {
		if (this.playerPos === 0) {
			this.game.audioManager.playSound('cursor');
			this.playerPos = 1;
			this.yes.alpha = 0.3;
			this.yes.text = '  ' + this.game.translate('YES') + '  ';
			this.no.alpha = 1;
			this.no.text = '< ' + this.game.translate('NO') + ' >';
		}
	}

	/**
     * Si un joueur se déconnecte
     */
	onDisconnect() {
		this.disconnectScreen.display();
	}

	onBackToMenu() {
		this.continue = false;
		this.yes.tint = '#000000';
	}

	actionButtonReleased() {
		this.game.audioManager.playSound('bip');
		if (this.playerPos) {
			this.game.serverManager.getSocket().emit('backmenu');
			this.game.state.start('levelhub');
		} else {
			if (this.game.levels[this.nextLevel - 1] && this.continue)
				this.game.state.start('scene', true, false, this.heroSelected, { level: getLevelFromLevelNum(this.nextLevel), world: getWorldFromLevelNum(this.nextLevel) });
		}
	}
}