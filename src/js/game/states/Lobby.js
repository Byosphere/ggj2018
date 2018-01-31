class Lobby extends Phaser.State {

	preload() {
		this.connected = false;
		this.connexionText = this.game.add.text(20, 20, '- Tentative de connexion...' , { font: DEFAULT_FONT, fill: MENU_TEXT_WAITING_COLOR });
		this.choice = 0;
		this.input = null;
		this.game.controlsManager.setCallbackContext(this);
	}

	create() {
		this.serverConnexion();
		this.game.socket.emit('init');
	}

	serverConnexion() {
		this.game.socket.on('init', ()=> {
			this.connexionText.text = '- Connexion établie avec le serveur';
			this.connected = true;
			this.startChoice();
		});

		this.game.on('newlobby', (code) => {
			// TODO
		});

		this.game.on('joinlobby', (success) => {
			//TODO
		});
	}

	startChoice() {
		this.game.add.text(20, 80, '- Sélectionnez une option pour retrouver votre compagnon de jeu !' , { font: DEFAULT_FONT, fill: MENU_TEXT_WAITING_COLOR });
		this.createLobby = this.game.add.text(this.game.world.width/4, this.game.world.centerY, '- Créer un salon -' , { font: DEFAULT_FONT, fill: MENU_TEXT_WAITING_COLOR });
		this.createLobby.anchor.setTo(0.5);
		this.joinLobby = this.game.add.text((this.game.world.width/4)*3, this.game.world.centerY, 'Rejoindre un salon' , { font: DEFAULT_FONT, fill: MENU_TEXT_WAITING_COLOR });
		this.joinLobby.anchor.setTo(0.5);
		this.joinLobby.alpha = 0.4;
	}

	actionButtonReleased() {
		if(!this.connected) return;
		if(this.input === null) {
			if(this.choice === 0) {
				this.game.socket.emit('newlobby');
			} else if(this.choice === 1) {
				this.input = this.game.add.inputField(this.game.world.centerX - 110, this.game.world.centerY + 80, {
					font: '44px uni0553',
					width: 220,
					height: 60,
					padding: 4,
					placeHolder: 'Code'
				});
				this.input.startFocus();
			}
		} else {
			this.game.socket.emit('joinlobby', this.input.text.text);
		}
	}

	leftButtonReleased() {
		if(this.choice === 1 && this.connected) {
			this.choice = 0;
			this.joinLobby.alpha = 0.4;
			this.joinLobby.text = 'Rejoindre un salon';
			this.createLobby.alpha = 1;
			this.createLobby.text = '- Créer un salon -';
		}
	}

	rightButtonReleased() {
		if(this.choice === 0 && this.connected) {
			this.choice = 1;
			this.joinLobby.alpha = 1;
			this.joinLobby.text = '- Rejoindre un salon -';
			this.createLobby.alpha = 0.4;
			this.createLobby.text = 'Créer un salon';
		}
	}
}