class Lobby extends Phaser.State {

	preload() {
		this.connected = false;
		this.connexionText = this.game.add.text(20, 20, '- ' + this.game.translate.LOBBY_TEXT_CONNECTING + ' -', { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		this.choice = 0;
		this.input = null;
		this.game.controlsManager.setCallbackContext(this);
		this.code = null;
	}

	create() {
		this.serverConnexion();
		this.game.socket.emit('init');
	}

	serverConnexion() {
		this.game.socket.on('init', () => {
			this.connexionText.text = '- ' + this.game.translate.LOBBY_TEXT_CONNECTED;
			this.connected = true;
			this.startChoice();
		});

		this.game.socket.on('newlobby', (code) => {
			this.code = code;
			this.joinLobby.alpha = 0;
			this.createLobby.alpha = 0;
			this.displayCode = this.game.add.text(this.game.world.centerX, this.game.world.centerY, code, { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
			this.displayCode.anchor.setTo(0.5);
			this.codeMessage = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 80, this.game.translate.LOBBY_TEXT_CODE_INSTRUCTIONS, { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
			this.codeMessage.anchor.setTo(0.5);
			this.codeMessage2 = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 160, this.game.translate.GENERIC_PRESS_BUTTON + ' ' + this.game.controlsManager.getActionButtonName() + ' ' + this.game.translate.GENERIC_TO_START, { font: DEFAULT_FONT, fill: MENU_TEXT_WAITING_COLOR });
			this.codeMessage2.anchor.setTo(0.5);
			this.choice = 3;
		});

		this.game.socket.on('joinlobby', (success) => {
			if (success)
				this.game.state.start('menu', true, false, this.code);
		});
	}

	startChoice() {
		this.game.add.text(20, 80, '- ' + this.game.translate.LOBBY_TEXT_INSTRUCTIONS, { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		this.createLobby = this.game.add.text(this.game.world.width / 4, this.game.world.centerY, '- ' + this.game.translate.LOBBY_TEXT_CREATE + ' -', { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		this.createLobby.anchor.setTo(0.5);
		this.joinLobby = this.game.add.text((this.game.world.width / 4) * 3, this.game.world.centerY, this.game.translate.LOBBY_TEXT_JOIN, { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		this.joinLobby.anchor.setTo(0.5);
		this.joinLobby.alpha = 0.4;
	}

	actionButtonReleased() {
		if (!this.connected) return;
		if (this.input === null) {
			if (this.choice === 0) {
				this.game.socket.emit('newlobby');
			} else if (this.choice === 1) {
				this.input = this.game.add.inputField(this.game.world.centerX - 110, this.game.world.centerY + 80, {
					font: '44px uni0553',
					width: 220,
					height: 60,
					padding: 4,
					placeHolder: 'Code'
				});
				this.input.startFocus();
			} else if (this.choice === 3) {
				this.game.state.start('menu', true, false, this.code);
			}
		} else {
			this.code = this.input.text.text;
			this.game.socket.emit('joinlobby', this.code);
		}
	}

	leftButtonReleased() {
		if (this.choice === 1 && this.connected) {
			this.choice = 0;
			this.joinLobby.alpha = 0.4;
			this.joinLobby.text = this.game.translate.LOBBY_TEXT_JOIN;
			this.createLobby.alpha = 1;
			this.createLobby.text = '- ' + this.game.translate.LOBBY_TEXT_CREATE + ' -';
		}
	}

	rightButtonReleased() {
		if (this.choice === 0 && this.connected) {
			this.choice = 1;
			this.joinLobby.alpha = 1;
			this.joinLobby.text = '- ' + this.game.translate.LOBBY_TEXT_JOIN + ' -';
			this.createLobby.alpha = 0.4;
			this.createLobby.text = this.game.translate.LOBBY_TEXT_CREATE;
		}
	}
}