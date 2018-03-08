const { remote } = require('electron');

class ElectronManager {

	constructor() {
		this.remote = remote;
		const { BrowserWindow } = remote;
		this.electronWindow = BrowserWindow.getFocusedWindow();
	}

	quit() {
		this.electronWindow.close();
	}

	setFullScreen() {
		this.electronWindow.setFullScreen(true);
	}
}