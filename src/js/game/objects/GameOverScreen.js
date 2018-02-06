class GameOverScreen {

	constructor(game) {
		this.game = game
		this.gameoverGroup = this.game.add.group();
		this.create();
	}


	create() {
		let darkBack = this.game.add.graphics(0, 0);
		this.gameoverGroup.add(darkBack);
		darkBack.beginFill(0x00000, 0.7);
		darkBack.drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
		darkBack.endFill();
		let goText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, this.game.translate('GAME_OVER'), { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		this.gameoverGroup.add(goText);
		goText.anchor.setTo(0.5);
		this.gameoverGroup.visible = false;
	}

	display(callback) {
		this.gameoverGroup.visible = true;
		this.game.controlsManager.disableControls();
		this.game.audioManager.stopCurrentMusic();
		setTimeout(() => {
			callback();
		}, 2000);
	}

	destroy() {
		this.gameoverGroup.destroy();
	}

}