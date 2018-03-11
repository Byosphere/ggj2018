
class ElectronManager {

	constructor(game) {
		this.game = game;
		const { remote, screen } = require('electron');
		const { BrowserWindow } = remote;
		this.mainScreen = screen.getPrimaryDisplay();
		this.electronWindow = BrowserWindow.getFocusedWindow();
	}

	quit() {
		this.electronWindow.close();
	}

	setFullScreen() {
		this.electronWindow.setFullScreen(true);
	}

	initDisplay() {
		switch (this.game.parameters.fullScreen.value) {
			case 0:
				this.electronWindow.setFullScreen(false);
				this.electronWindow.unmaximize();
				this.game.scale.setGameSize(GAME_WIDTH, GAME_HEIGHT);
				break;
			case 1:
				this.electronWindow.maximize();
				console.log(this.mainScreen.size);
				this.game.scale.setGameSize(this.mainScreen.size.width, this.mainScreen.size.height);
				break;
			case 2:
				this.electronWindow.setFullScreen(true);
				this.game.scale.setGameSize(this.mainScreen.size.width, this.mainScreen.size.height);
				break;
		}
	}
}