class ConfirmDialog {

	constructor(game, scene) {
		this.game = game;
		this.scene = scene;
		this.create();
	}

	create() {
		this.confirmDialog = this.game.add.group();
		let darkBack = this.game.add.graphics(0, 0);
		this.confirmDialog.add(darkBack);
		darkBack.beginFill(0x00000, 0.7);
		darkBack.drawRect(0, this.game.world.height / 2 - 100, this.game.world.width, 200);
		darkBack.endFill();
		this.confirmText = this.game.add.text(this.game.world.width / 2, this.game.world.height / 2 - 80, '', { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		this.confirmText.anchor.setTo(0.5, 0);
		this.confirmDialog.add(this.confirmText);
		this.confirmText2 = this.game.add.text(this.game.world.width / 2, this.game.world.height / 2 - 40, '', { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		this.confirmText2.anchor.setTo(0.5, 0);
		this.confirmDialog.add(this.confirmText2);
		this.yes = this.game.add.text(this.game.world.width / 2 - 100, this.game.world.height / 2 + 20, this.game.translate('YES'), { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		this.yes.confirm = 'yes';
		this.yes.anchor.setTo(0.5, 0);
		this.confirmDialog.add(this.yes);
		this.game.controlsManager.clickable(this.yes);
		this.no = this.game.add.text(this.game.world.width / 2 + 100, this.game.world.height / 2 + 20, this.game.translate('NO'), { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		this.no.anchor.setTo(0.5, 0);
		this.no.alpha = 0.3;
		this.no.confirm = 'no';
		this.confirmDialog.add(this.no);
		this.game.controlsManager.clickable(this.no);
		this.displaying = false;
		this.confirmDialog.visible = false;
		this.position = 'yes';
	}

	display(text1, text2) {
		if (text1)
			this.confirmText.text = text1;
		if (text2)
			this.confirmText2.text = text2;

		this.confirmDialog.visible = true;
		this.displaying = true;
		this.game.controlsManager.setCallbackContext(this);
	}

	updateDisplay() {
		if (this.position === 'yes') {
			this.yes.alpha = 1;
			this.no.alpha = 0.3;
		} else if (this.position === 'no') {
			this.no.alpha = 1;
			this.yes.alpha = 0.3;
		}
	}

	isDisplayed() {
		return this.displaying;
	}

	mouseOver(obj) {
		if (obj.confirm === 'yes' && this.position != 'yes') {
			this.position = 'yes';
			this.game.audioManager.playSound('cursor');
		} else if (obj.confirm === 'no' && this.position != 'no') {
			this.position = 'no';
			this.game.audioManager.playSound('cursor');
		}
		this.updateDisplay();
	}

	leftButtonReleased() {
		this.position === 'yes' ? this.position = 'no' : this.position = 'yes';
		this.game.audioManager.playSound('cursor');
		this.updateDisplay();
	}

	rightButtonReleased() {
		this.position === 'yes' ? this.position = 'no' : this.position = 'yes';
		this.game.audioManager.playSound('cursor');
		this.updateDisplay();
	}

	actionButtonReleased() {
		this.action();
	}

	mouseLeftClick(obj) {
		if (obj.confirm)
			this.action();
	}

	action() {
		if (this.position === 'yes') {
			this.game.audioManager.playSound('bip');
			this.game.serverManager.getSocket().emit('disconnect');
			this.game.state.start('menu');
		} else {
			this.game.audioManager.playSound('back');
			this.displaying = false;
			this.confirmDialog.visible = false;
			this.game.controlsManager.setCallbackContext(this.scene);
		}
	}
}