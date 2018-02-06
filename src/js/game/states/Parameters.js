class Parameters extends Phaser.State {

	init(from) {
		this.from = from || 'lobby';
	}

	preload() {
		this.paddingLeft = 60;
		this.title = this.game.add.text(this.paddingLeft, 20, this.game.translate('PARAMETERS_TITLE'), { font: HEAD_FONT, fill: DEFAULT_COLOR });
		this.subline = this.game.add.text(this.paddingLeft, 40, "_______________________________", { font: HEAD_FONT, fill: DEFAULT_COLOR });
		this.backButton = this.game.add.text(this.paddingLeft, this.game.world.height - 130, this.game.translate('BACK_FROM_PARAMETERS'), { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		this.validButton = this.game.add.text(this.paddingLeft, this.game.world.height - 80, this.game.translate('CONFIRM'), { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		this.backButton.alpha = 0.5;
		this.validButton.alpha = 0.5;
		this.parametersTexts = [];
		this.game.controlsManager.setCallbackContext(this);
		this.index = 0;

		let height = 100;
		for (let key in this.game.parameters) {
			let param = this.game.parameters[key];
			height += 40;
			let text;
			if (param.allValues)
				text = this.game.add.text(this.paddingLeft, height, this.game.translate(param.nameKey) + ' ' + this.game.translate(param.allValues[param.value].name), { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
			else
				text = this.game.add.text(this.paddingLeft, height, this.game.translate(param.nameKey) + ' ' + param.value, { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
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
		if (gameParam && gameParam.allValues) {
			if (gameParam.tempVal > 0) {
				gameParam.tempVal--;
			} else {
				gameParam.tempVal = gameParam.allValues.length - 1;
			}
			text.text = this.game.translate(gameParam.nameKey) + ' ' + this.game.translate(gameParam.allValues[gameParam.tempVal].name)
		} else if (gameParam) {
			if (gameParam.tempVal > gameParam.min) {
				gameParam.tempVal--;
			}
			text.text = this.game.translate(gameParam.nameKey) + ' ' + gameParam.tempVal;
		}
	}

	rightButtonReleased() {
		let text = this.parametersTexts[this.index];
		let gameParam = this.game.parameters[this.parametersTexts[this.index].paramKey]
		if (gameParam && gameParam.allValues) {
			if (gameParam.tempVal < gameParam.allValues.length - 1) {
				gameParam.tempVal++;
			} else {
				gameParam.tempVal = 0;
			}
			text.text = this.game.translate(gameParam.nameKey) + ' ' + this.game.translate(gameParam.allValues[gameParam.tempVal].name)
		} else if (gameParam) {
			if (gameParam.tempVal < gameParam.max) {
				gameParam.tempVal++;
			}
			text.text = this.game.translate(gameParam.nameKey) + ' ' + gameParam.tempVal;
		}
	}

	cancelButtonReleased() {
		this.state.start(this.from);
	}

	actionButtonDown() {
		// si on est sur valider
		if (this.index === this.parametersTexts.length - 1) {
			for (let key in this.game.parameters) {
				let param = this.game.parameters[key];
				if (param.value != param.tempVal) {
					param.value = param.tempVal;
				}
				delete param.tempVal;
			}
			this.state.start(this.from);
		} else if (this.index === this.parametersTexts.length - 2) {
			this.state.start(this.from);
		}
	}

	shutdown() {

	}
}