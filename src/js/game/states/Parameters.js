class Parameters extends Phaser.State {

	preload() {
		this.paddingLeft = 60;
		this.title = this.game.add.text(this.paddingLeft, 20, this.game.translate('PARAMETERS_TITLE'), { font: HEAD_FONT, fill: DEFAULT_COLOR });
		this.subline = this.game.add.text(this.paddingLeft, 40, "_______________________________", { font: HEAD_FONT, fill: DEFAULT_COLOR });
		this.backButton = this.game.add.text(this.paddingLeft, this.game.world.height - 130, "Retour (annule les modifications)", { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		this.validButton = this.game.add.text(this.paddingLeft, this.game.world.height - 80, "Valider", { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		this.backButton.alpha = 0.5;
		this.validButton.alpha = 0.5;
		this.parametersTexts = [];
		this.game.controlsManager.setCallbackContext(this);
		this.index = 0;

		let height = 100;
		for (let key in this.game.parameters) {
			let param = this.game.parameters[key];
			height += 40;
			let text = this.game.add.text(this.paddingLeft, height, this.game.translate(param.nameKey) + ' ' + this.game.translate(param.allValues[param.value].name), { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
			text.alpha = 0.5;
			text.paramKey = key;
			this.parametersTexts.push(text);
			param.tempVal = param.value;
		}
		this.parametersTexts.push(this.backButton);
		this.parametersTexts.push(this.validButton);
	}

	create() {
		this.parametersTexts[this.index].alpha = 1;
	}

	upButtonReleased() {
		if (this.index > 0) {
			this.index--;
		}
		this.parametersTexts[this.index + 1].alpha = 0.5;
		this.parametersTexts[this.index].alpha = 1;
	}

	downButtonReleased() {
		if (this.index < this.parametersTexts.length - 1) {
			this.index++;
		}
		this.parametersTexts[this.index - 1].alpha = 0.5;
		this.parametersTexts[this.index].alpha = 1;
	}

	leftButtonReleased() {
		let text = this.parametersTexts[this.index];
		let gameParam = this.game.parameters[this.parametersTexts[this.index].paramKey]
		if (gameParam) {
			if (gameParam.tempVal > 0) {
				gameParam.tempVal--;
			} else {
				gameParam.tempVal = gameParam.allValues.length - 1;
			}
			text.text = this.game.translate(gameParam.nameKey) + ' ' + this.game.translate(gameParam.allValues[gameParam.tempVal].name)
		}
	}

	rightButtonReleased() {
		let text = this.parametersTexts[this.index];
		let gameParam = this.game.parameters[this.parametersTexts[this.index].paramKey]
		if (gameParam) {
			if (gameParam.tempVal < gameParam.allValues.length - 1) {
				gameParam.tempVal++;
			} else {
				gameParam.tempVal = 0;
			}
			text.text = this.game.translate(gameParam.nameKey) + ' ' + this.game.translate(gameParam.allValues[gameParam.tempVal].name)
		}
	}

	cancelButtonReleased() {
		//retour au menu
	}

	actionButtonDown() {
		//apply modifications
	}

	shutdown() {

	}
}