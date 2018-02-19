class EndLevel extends Phaser.State {

	init(levelData) {
		this.level = levelData;
	}

	preload() {
		this.game.stage.backgroundColor = MENU_BACKGROUND_COLOR;
		this.game.controlsManager.setCallbackContext(this);
		this.game.serverManager.setCallbackContext(this);
		this.posY = 0;
		this.delay = 800;
		this.game.controlsManager.disableControls();
	}

	create() {
		//this.game.serverManager.getSocket().emit('finishlevel');
		this.game.localStorageManager.unlockLevel(this.level.num + 1);
		let newHighScore = this.game.localStorageManager.saveLevelScore(this.level.num, this.level.highScore);
		let title = this.game.add.text(this.game.world.centerX, 180, 'Level Completed !', { font: BIG_FONT, fill: DEFAULT_COLOR });
		title.anchor.setTo(0.5, 0.5);
		title.setShadow(4, 4, "rgba(0, 0, 0, 0.7)", 7);
		let time = this.game.add.text(this.game.world.centerX, 230, 'Temps : 2min 20s', { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		time.setShadow(4, 4, "rgba(0, 0, 0, 0.7)", 7);

		if (newHighScore) {
			let star = this.game.add.sprite(time.x + time.width + 300, time.y + 15, 'completed');
			star.scale.setTo(10, 10);
			star.anchor.setTo(0.5, 0.5);
			this.game.add.tween(star.scale).to({ x: 2, y: 2 }, 800, "Quart.easeInOut", true, 0);
			this.game.add.tween(star).to({ x: time.x + time.width + 30 }, 800, "Quart.easeInOut", true, 0);
		} else {
			this.delay = 0;
		}

		let unlock = this.game.add.text(this.game.world.centerX, 350, 'Level(s) Unlocked :', { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		unlock.anchor.setTo(0.5, 0.5);
		unlock.setShadow(4, 4, "rgba(0, 0, 0, 0.7)", 7);
		UNLOCK_PATTERN[this.level.num].forEach(num => {
			this.displayLevel(num, getLevelFromLevelNum(num), getWorldFromLevelNum(num));
		});
		this.background = this.game.add.sprite(0, 0, 'background_title');
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
		this.game.add.tween(levelGroup).to({ y: 400 + this.posY }, 1500, "Quart.easeInOut", true, this.delay);
		this.posY = + 80;
		this.delay += 200;
	}

	displayNext() {
		this.game.controlsManager.enableControls();
		let group = this.game.add.group();
		let text = this.game.add.text(0, 0, 'Continuer ?', { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		let yes = this.game.add.text(250, 0, 'Oui', { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		let no = this.game.add.text(370, 0, 'Non', { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		group.add(text);
		group.add(yes);
		group.add(no);
		group.y = 650;
		group.x = this.game.world.centerX - group.width/2;
	}
}