class LocalStorageManager {

	constructor(game) {
		this.game = game;
		this.localData = {};
		this.LOCAL_NAME = 'cfesbc';
	}

	init() {
		if (this.isLocalStorageEnabled()) {

			let data = this.getObject();

			if (data && data.parameters && data.levels) {
				this.game.parameters = this.getObject().parameters;
				this.game.levels = this.getObject().levels;
			} else {
				this.setObject('parameters', this.getDefaultParamData());
				this.setObject('levels', this.getDefaultLevels());
				this.game.parameters = this.getDefaultParamData();
				this.game.levels = this.getDefaultLevels();
			}

		} else {
			this.game.parameters = this.getDefaultParamData();
			this.game.levels = this.getDefaultLevels();
		}
	}

	getDefaultParamData() {
		return {
			translate: { nameKey: 'LANGUAGE', value: DEFAULT_LANGUAGE, allValues: [{ name: 'FRENCH', value: 'TEXT_FR' }, { name: 'ENGLISH', value: 'TEXT_EN' }] },
			musicVolume: { nameKey: 'MUSIC_VOLUME', value: DEFAULT_MUSIC_VOLUME, allValues: null, max: 10, min: 0 },
			soundVolume: { nameKey: 'SOUND_VOLUME', value: DEFAULT_SOUND_VOLUME, allValues: null, max: 10, min: 0 },
			debugMode: { nameKey: 'DEBUG_MODE', hidden: true, value: DEFAULT_DEBUG_MODE, allValues: [{ name: 'DESACTIVATED', value: 0 }, { name: 'ACTIVATED', value: 1 }] },
			debugLevel: { nameKey: 'DEBUG_MODE_LEVEL', hidden: true, value: 0, allValues: null, max: NB_LEVELS * WORLDS.length, min: 0 },
			debugHeros: { nameKey: 'DEBUG_MODE_HEROS', hidden: true, value: 0, allValues: [{ name: 'Coli', value: COLI_HEROS }, { name: 'Fleur', value: FLEUR_HEROS }] }
		};
	}

	getDefaultLevels() {
		return [1,2];
	}

	save(key) {
		this.setObject(key, this.game[key]);
	}

	/**
	 * Set un objet dans le localstorage
	 * @param {string} name 
	 * @param {object} value 
	 */
	setObject(name, value) {
		this.localData[name] = value;
		localStorage.setItem(this.LOCAL_NAME, JSON.stringify(this.localData));
	}

	/**
	 * récupère un objet dans le localstorage
	 */
	getObject() {
		var value = localStorage.getItem(this.LOCAL_NAME);
		return value && JSON.parse(value);
	}

	/**
	 * Check if localStorage is enabled
	 */
	isLocalStorageEnabled() {
		let test = 'test';
		try {
			localStorage.setItem(test, test);
			localStorage.removeItem(test);
			return true;
		} catch (e) {
			return false;
		}
	}
}