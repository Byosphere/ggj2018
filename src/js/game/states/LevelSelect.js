class LevelSelect {

	init() {
		this.WORLD_SELECT_STATE = 1;
		this.LEVEL_SELECT_STATE = 2;
		this.HEROS_SELECT_STATE = 3;
		this.READY_STATE = 4;
	}

	preload() {
		this.game.stage.backgroundColor = MENU_BACKGROUND_COLOR;
		this.otherPlayer = null;
		this.levelSelected = 0;
		this.heroSelected = COLI_HEROS;
		this.worldPos = 1;
		this.state = this.WORLD_SELECT_STATE;
		this.levelList = [];
		this.finishedLevels = 0;
		this.playerPosition = 0;
		this.lockedWorld = 0;
		this.animCursor = false;
		this.game.controlsManager.setCallbackContext(this);
		this.game.serverManager.setCallbackContext(this);
		this.game.controlsManager.disableControls();
		this.initLevelList();
	}

	/**
	 * Animation d'affichge du background, resoud une promesse lorsque l'animation est terminée.
	 */
	displayBackground() {

		return new Promise((resolve) => {
			this.backgroundTopCorner1 = this.game.add.sprite(-200, -200, 'background_top_corner');
			this.backgroundTopCorner1.animations.add(MENU_BACKGROUND_ANIMATIONS.DEFAULT.NAME, MENU_BACKGROUND_ANIMATIONS.DEFAULT.FRAMES, 1, true).play();
			this.game.add.tween(this.backgroundTopCorner1).to({ x: 0, y: 0 }, 500, 'Quart.easeInOut', true, 0);

			this.backgroundTopMiddle = this.game.add.sprite(300, -200, 'background_top_middle');
			this.backgroundTopMiddle.animations.add(MENU_BACKGROUND_ANIMATIONS.DEFAULT.NAME, MENU_BACKGROUND_ANIMATIONS.DEFAULT.FRAMES, 1, true).play();
			this.game.add.tween(this.backgroundTopMiddle).to({ y: 0 }, 500, 'Quart.easeInOut', true, 0);

			this.backgroundTopMiddle2 = this.game.add.sprite(800, -200, 'background_top_middle2');
			this.backgroundTopMiddle2.animations.add(MENU_BACKGROUND_ANIMATIONS.DEFAULT.NAME, MENU_BACKGROUND_ANIMATIONS.DEFAULT.FRAMES, 1, true).play();
			this.game.add.tween(this.backgroundTopMiddle2).to({ y: 0 }, 500, 'Quart.easeInOut', true, 0);

			this.backgroundTopCorner2 = this.game.add.sprite(this.game.world.width + 200, -200, 'background_top_corner');
			this.backgroundTopCorner2.animations.add(MENU_BACKGROUND_ANIMATIONS.DEFAULT.NAME, MENU_BACKGROUND_ANIMATIONS.DEFAULT.FRAMES, 1, true).play();
			this.backgroundTopCorner2.scale.setTo(-1, 1);
			this.game.add.tween(this.backgroundTopCorner2).to({ x: this.game.world.width + 60, y: -50 }, 500, 'Quart.easeInOut', true, 0);

			this.backgroundbotCorner1 = this.game.add.sprite(-100, this.game.world.height, 'background_bot_corner');
			this.backgroundbotCorner1.animations.add(MENU_BACKGROUND_ANIMATIONS.DEFAULT.NAME, MENU_BACKGROUND_ANIMATIONS.DEFAULT.FRAMES, 1, true).play();
			this.game.add.tween(this.backgroundbotCorner1).to({ x: -5, y: this.game.world.height - 220 }, 500, 'Quart.easeInOut', true, 500);

			this.backgroundbotCorner2 = this.game.add.sprite(this.game.world.width, this.game.world.height, 'background_bot_corner2');
			this.backgroundbotCorner2.animations.add(MENU_BACKGROUND_ANIMATIONS.DEFAULT.NAME, MENU_BACKGROUND_ANIMATIONS.DEFAULT.FRAMES, 1, true).play();
			this.game.add.tween(this.backgroundbotCorner2).to({ x: this.game.world.width - 122, y: this.game.world.height - 296 }, 500, 'Quart.easeInOut', true, 500);

			let worldmap = this.game.add.sprite(20, 30, 'worldMap');
			worldmap.alpha = 0;
			this.game.add.tween(worldmap).to({ alpha: 1 }, 500, 'Quart.easeInOut', true, 1000);

			let worldCursor = this.game.add.sprite(0, 0, 'worldCursor');
			let worldCursorText = this.game.add.text(worldCursor.x + 60, worldCursor.y - 20, '', { font: SMALL_FONT, fill: DEFAULT_COLOR });
			let worldCursorText2 = this.game.add.text(worldCursor.x + 74, worldCursor.y + 6, '', { font: SMALL_FONT, fill: DEFAULT_COLOR });
			this.worldCursor = this.game.add.group();
			this.worldCursor.alpha = 0;
			this.worldCursor.add(worldCursor);
			this.worldCursor.add(worldCursorText);
			worldCursorText.key = 'cursor';
			this.game.controlsManager.clickable(worldCursorText);
			this.worldCursor.add(worldCursorText2);
			this.worldCursor.x = WORLDS_DATA[this.worldPos - 1].world_position.x;
			this.worldCursor.y = WORLDS_DATA[this.worldPos - 1].world_position.y;

			if (this.lockedWorld) {
				this.lock = this.game.add.sprite(this.lockedWorld.world_position.x, this.lockedWorld.world_position.y - 15, 'lock');
				this.lock.alpha = 0;
				this.lockText = this.game.add.text(this.lock.x + 60, this.lock.y + 20, '', { font: SMALL_FONT, fill: DEFAULT_COLOR });
				if (this.lockedWorld.to_unlock > 0) {
					this.lockText.text = this.finishedLevels + '/' + this.lockedWorld.to_unlock;
				} else {
					this.lockText.text = 'coming soon...';
				}
				this.lockText.alpha = 0;
				this.game.add.tween(this.lock).to({ alpha: 1 }, 500, 'Quart.easeInOut', true, 1000);
				this.game.add.tween(this.lockText).to({ alpha: 0.7 }, 500, 'Quart.easeInOut', true, 1000);
			}

			let lastTween = this.game.add.tween(this.rightBands).to({ x: this.game.world.centerX - 64 }, 500, 'Quart.easeInOut', true, 1000);
			this.infoText = new TextMessage(this.game);
			this.disconnectScreen = new DisconnectScreen(this.game);
			lastTween.onComplete.add(() => {
				resolve(true);
			}, this);
		});
	}

	/** 
	 * initialise la création de la liste des niveaux
	*/
	initLevelList() {
		let index = 1;
		let posY2 = 50;
		this.rightBands = this.game.add.sprite(this.game.world.width, 0, 'rightBands');
		this.levelListGroup = this.game.add.group();

		for (let w = 1; w <= WORLDS.length; w++) {
			this.levelList[w] = [];
			let posY = 80;
			let mouseArea = this.game.add.graphics(WORLDS_DATA[w - 1].world_position.x, WORLDS_DATA[w - 1].world_position.y - 15);
			mouseArea.beginFill(0xFF000, 0);
			mouseArea.drawRect(0, 0, CELL_SIZE, CELL_SIZE);
			mouseArea.endFill();
			mouseArea.worldNum = w;
			this.game.controlsManager.clickable(mouseArea);

			for (let i = 0; i < NB_LEVELS; i++) {

				let graph = this.game.add.sprite(94, posY, 'levelBack');
				graph.id = i + 1;
				let text = this.game.add.text(graph.x + 50, graph.centerY - 5, this.game.translate('LEVEL_NAMES', index), { font: SMALL_FONT, fill: DEFAULT_COLOR });
				let levelNum = this.game.add.text(graph.x + 25, graph.centerY, w + '-' + (i + 1), { font: SMALL_FONT, fill: DEFAULT_COLOR });
				let levelHud = this.game.add.sprite(graph.x + graph.width - 11, graph.y, 'hudSelect');
				let score = this.game.add.text(graph.x + 50, graph.centerY + 5, this.game.translate('BEST_TIME') + ': -min -s | ' + this.game.translate('COLLECTIBLE') + ': -', { font: SMALLEST_FONT, fill: DEFAULT_COLOR });
				score.alpha = 0.7;
				let coliSelect = this.game.add.sprite(levelHud.x + 6, levelHud.y - 2, 'coli');
				this.game.controlsManager.clickable(coliSelect);
				let fleurSelect = this.game.add.sprite(levelHud.x + 61, levelHud.y - 2, 'fleur');
				this.game.controlsManager.clickable(fleurSelect);
				coliSelect.tint = 0x222222;
				fleurSelect.tint = 0x222222;
				text.anchor.setTo(0, 0.5);
				levelNum.anchor.setTo(0.5, 0.5);
				text.setShadow(4, 4, "rgba(0, 0, 0, 0.7)", 2);
				levelNum.angle = -90;
				levelNum.setShadow(4, 4, "rgba(0, 0, 0, 0.7)", 2);
				let levelGroup = this.game.add.group();
				levelGroup.add(graph);
				levelGroup.add(text);
				levelGroup.add(score);
				levelGroup.add(levelNum);
				levelGroup.add(levelHud);
				levelGroup.add(coliSelect);
				levelGroup.add(fleurSelect);
				levelGroup.visible = false;

				let isLocked = true;
				let finished = null;
				let savedLevel = this.game.levels[index - 1];
				if (this.game.parameters.debugMode.value) {
					isLocked = false;
					finished = this.game.add.sprite(graph.x, graph.centerY, 'completed');
					finished.anchor.setTo(0.5, 0.5);
					levelGroup.add(finished);
					score.text = 'debug mode';

				} else if (savedLevel) {
					isLocked = false;
					if (savedLevel.finished) {
						finished = this.game.add.sprite(graph.x, graph.centerY, 'completed');
						finished.anchor.setTo(0.5, 0.5);
						levelGroup.add(finished);
						score.text = this.game.translate('BEST_TIME') + ': ' + getFormatedTime(savedLevel.highScore) + ' | ' + this.game.translate('COLLECTIBLE') + ': -';
						this.finishedLevels++;
					}
				}

				this.levelList[w].push({
					name: this.game.translate('LEVEL_NAMES', index),
					levelNum: i,
					world: w,
					locked: isLocked,
					posY: posY,
					levelGroup: levelGroup,
					text: text,
					score: score,
					textNum: levelNum,
					finished: finished,
					coli: { selected: null, sprite: coliSelect },
					fleur: { selected: null, sprite: fleurSelect }
				});
				index++;
				posY += 70;
				this.game.controlsManager.clickable(graph);
				this.levelListGroup.add(levelGroup);
			}
		}
		this.levelListGroup.x = this.game.world.centerX - 64;
		this.backButton = this.game.add.text(100, 730, '<- Retour', { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
		this.backButton.setShadow(4, 4, "rgba(163, 73, 164, 0.7)", 7);
		this.backButton.name = 'backbutton';
		this.backButton.alpha = 0;
		this.setLockedWorld();
	}

	create() {
		this.displayBackground().then(() => {
			this.displayLevels();
			this.backButton.alpha = 1;
			this.game.controlsManager.clickable(this.backButton);
			this.infoText.show(null, this.game.translate('WORLD_SELECT'));
			this.game.controlsManager.enableControls();
			this.confirmDialog = new ConfirmDialog(this.game, this);
		});
	}

	setLockedWorld() {
		WORLDS_DATA.some(world => {
			if (this.finishedLevels < world.to_unlock) {
				this.lockedWorld = world;
				return true;
			} else if (world.to_unlock === -1) {
				this.lockedWorld = world;
				return true;
			}
		});
	}

	/**
	 * Mets à jour l'affichage
	 */
	displayLevels() {
		this.showOnly(this.worldPos);
		let finishedLevels = 0;
		if (this.levelList[this.worldPos]) {
			this.levelList[this.worldPos].forEach(level => {
				if (level.locked) {
					level.text.text = "????????";
				}
				if (level.finished) {
					finishedLevels++;
				}

				if (this.state === this.LEVEL_SELECT_STATE) {
					let tween1 = null;
					if (this.playerPosition === level.levelNum) {
						tween1 = this.game.add.tween(level.levelGroup).to({ x: 30 }, 500, "Quart.easeOut").start();
						level.text.alpha = 1;
						level.textNum.alpha = 1;
						level.score.alpha = 0.7;
					} else {
						tween1 = this.game.add.tween(level.levelGroup).to({ x: 0 }, 500, "Quart.easeOut").start();
						level.text.alpha = 0.2;
						level.score.alpha = 0.2;
						level.textNum.alpha = 0.2;
					}
				} else if (this.state === this.WORLD_SELECT_STATE) {
					level.levelGroup.x = 0;
					level.text.alpha = 0.2;
					level.score.alpha = 0.2;
					level.textNum.alpha = 0.2;
				}
				if (level.coli.selected) {
					level.coli.sprite.tint = 0xFFFFFF;
					level.coli.sprite.animations.add(HEROS_ANIMATIONS.HIGHLIGHT.NAME, HEROS_ANIMATIONS.HIGHLIGHT.FRAMES, 10, true).play();
				} else {
					level.coli.sprite.tint = 0x222222;
					level.coli.sprite.animations.stop();
					level.coli.sprite.animations.frame = 0;
				}

				if (level.fleur.selected) {
					level.fleur.sprite.tint = 0xFFFFFF;
					level.fleur.sprite.animations.add(HEROS_ANIMATIONS.HIGHLIGHT.NAME, HEROS_ANIMATIONS.HIGHLIGHT.FRAMES, 10, true).play();
				} else {
					level.fleur.sprite.tint = 0x222222;
					level.fleur.sprite.animations.stop();
					level.fleur.sprite.animations.frame = 0;
				}
			});
		}
		this.animCursor = true;
		let cursor = this.game.add.tween(this.worldCursor).to({ x: WORLDS_DATA[this.worldPos - 1].world_position.x, y: WORLDS_DATA[this.worldPos - 1].world_position.y }, 200, 'Circ.easeInOut', true, 0);
		cursor.onComplete.add(() => {
			this.animCursor = false;
		}, this);
		this.worldCursor.children[1].text = this.game.translate('WORLD_NAMES', this.worldPos);
		this.worldCursor.children[2].text = finishedLevels + '/10';

		if (this.state === this.WORLD_SELECT_STATE) {
			this.worldCursor.alpha = 1;
		} else {
			this.worldCursor.alpha = 0.5;
		}
		if (this.state === this.HEROS_SELECT_STATE) {
			this.levelList[this.worldPos][this.playerPosition][this.heroSelected].sprite.tint = 0xffffff;
		}
	}

	/**
	 * Filtre les niveaux à afficher en fonction du monde sélectionné
	 * @param {number} world 
	 */
	showOnly(world) {
		this.levelList.forEach(w => {
			w.forEach(l => {
				if (l.world != world) {
					l.levelGroup.visible = false;
				} else {
					l.levelGroup.visible = true;
				}
			});
		});
	}

	mouseOver(obj) {

		if (this.state === this.WORLD_SELECT_STATE && obj.worldNum && obj.worldNum != this.worldPos) {

			this.worldPos = obj.worldNum;
			this.displayLevels();
			this.game.audioManager.playSound('cursor');

		} else if (this.state === this.LEVEL_SELECT_STATE && obj.id && this.playerPosition != obj.id - 1) {
			this.playerPosition = obj.id - 1;
			this.displayLevels();
			this.game.audioManager.playSound('cursor');
		} else if (
			this.state === this.HEROS_SELECT_STATE
			&& obj.key === 'coli'
			&& !this.levelList[this.worldPos][this.playerPosition][COLI_HEROS].selected
			&& this.heroSelected != COLI_HEROS
		) {

			this.heroSelected = COLI_HEROS;
			this.game.audioManager.playSound('cursor');
			this.displayLevels();

		} else if (
			this.state === this.HEROS_SELECT_STATE
			&& obj.key === 'fleur'
			&& !this.levelList[this.worldPos][this.playerPosition][FLEUR_HEROS].selected
			&& this.heroSelected != FLEUR_HEROS
		) {

			this.heroSelected = FLEUR_HEROS;
			this.game.audioManager.playSound('cursor');
			this.displayLevels();
		}
	}

	mouseLeftClick(obj) {
		if (this.state === this.WORLD_SELECT_STATE && obj.worldNum === this.worldPos || obj.key === 'cursor') {

			this.state = this.LEVEL_SELECT_STATE;
			this.infoText.show(null, this.game.translate('LEVEL_SELECT'));
			this.game.audioManager.playSound('bip');
			this.displayLevels();

		} else if (obj.id >= 0 && this.state === this.LEVEL_SELECT_STATE) {
			this.actionButtonReleased();
		} else if (this.state === this.HEROS_SELECT_STATE && (obj.key === this.heroSelected)) {
			if (this.levelList[this.worldPos][this.playerPosition].selected) return;
			this.state = this.READY_STATE;
			this.infoText.show(null, this.game.translate('READY_SELECT'));
			this.game.serverManager.getSocket().emit('selectlevel', { heros: this.heroSelected, level: this.playerPosition + 1, world: this.worldPos });
			this.game.controlsManager.disableControls();
			this.game.audioManager.playSound('bip');
		} else if (obj.name === 'backbutton') {
			this.cancelButtonReleased();
		}
	}

	downButtonReleased() {
		switch (this.state) {

			case this.WORLD_SELECT_STATE:
				if (this.worldPos < this.lockedWorld.id - 1 && !this.animCursor) {
					this.worldPos++;
					this.displayLevels();
					this.game.audioManager.playSound('cursor');
				}
				break;

			case this.LEVEL_SELECT_STATE:
				if (this.playerPosition < NB_LEVELS - 1) {
					this.playerPosition++;
					this.displayLevels();
					this.game.audioManager.playSound('cursor');
				}
				break;
		}
	}

	upButtonReleased() {
		switch (this.state) {

			case this.WORLD_SELECT_STATE:
				if (this.worldPos > 1 && !this.animCursor) {
					this.worldPos--;
					this.displayLevels();
					this.game.audioManager.playSound('cursor');
				}
				break;

			case this.LEVEL_SELECT_STATE:
				if (this.playerPosition > 0) {
					this.playerPosition--;
					this.displayLevels();
					this.game.audioManager.playSound('cursor');
				}
				break;
		}
	}

	actionButtonReleased() {
		switch (this.state) {

			case this.WORLD_SELECT_STATE:
				this.state = this.LEVEL_SELECT_STATE;
				this.infoText.show(null, this.game.translate('LEVEL_SELECT'));
				this.game.audioManager.playSound('bip');
				this.displayLevels();
				break;

			case this.LEVEL_SELECT_STATE:
				if (!this.levelList[this.worldPos][this.playerPosition].locked) {
					this.state = this.HEROS_SELECT_STATE;
					if (this.levelList[this.worldPos][this.playerPosition].coli.selected) {
						this.heroSelected = FLEUR_HEROS;
					}
					this.infoText.show(null, this.game.translate('HEROS_SELECT'));
					this.game.audioManager.playSound('bip');
					this.displayLevels();
				}
				break;

			case this.HEROS_SELECT_STATE:
				if (this.levelList[this.worldPos][this.playerPosition].selected) break;
				this.state = this.READY_STATE;
				this.infoText.show(null, this.game.translate('READY_SELECT'));
				this.game.serverManager.getSocket().emit('selectlevel', { heros: this.heroSelected, level: this.playerPosition + 1, world: this.worldPos });
				this.game.controlsManager.disableControls();
				this.game.audioManager.playSound('bip');
				break;
		}
	}

	onUpdatePlayers(players) {
		this.game.controlsManager.enableControls();
		for (let w = 1; w <= WORLDS.length; w++) {
			this.levelList[w].forEach(level => {
				level.coli.selected = false;
				level.fleur.selected = false;
			});
		}

		if (players[0] && players[0].levelData) {
			this.levelList[players[0].levelData.world][players[0].levelData.level - 1][players[0].levelData.heros].selected = true;
		}
		if (players[1] && players[1].levelData) {
			this.levelList[players[1].levelData.world][players[1].levelData.level - 1][players[1].levelData.heros].selected = true;
		}
		this.displayLevels();
	}

	cancelButtonReleased() {
		switch (this.state) {

			case this.WORLD_SELECT_STATE:
				this.confirmDialog.display(this.game.translate('LEVEL_HUB_BACK'), this.game.translate('LEVEL_HUB_BACK_2'));
				this.game.audioManager.playSound('back');
				break;

			case this.LEVEL_SELECT_STATE:
				this.state = this.WORLD_SELECT_STATE;
				this.infoText.show(null, this.game.translate('WORLD_SELECT'));
				this.playerPosition = 0;
				this.game.audioManager.playSound('back');
				this.displayLevels();
				break;

			case this.HEROS_SELECT_STATE:
				this.state = this.LEVEL_SELECT_STATE;
				this.infoText.show(null, this.game.translate('LEVEL_SELECT'));
				this.game.audioManager.playSound('back');
				this.displayLevels();
				break;
			case this.READY_STATE:
				this.state = this.HEROS_SELECT_STATE;
				this.infoText.show(null, this.game.translate('HEROS_SELECT'));
				this.game.audioManager.playSound('back');
				this.game.serverManager.getSocket().emit('unselectlevel');
				break;
		}
		if (this.disconnectScreen.isDisconnected()) {
			this.game.state.start('menu');
		}
	}

	leftButtonReleased() {
		switch (this.state) {

			case this.HEROS_SELECT_STATE:
				if (this.heroSelected === COLI_HEROS && !this.levelList[this.worldPos][this.playerPosition][FLEUR_HEROS].selected) {
					this.heroSelected = FLEUR_HEROS;
				} else if (this.heroSelected === FLEUR_HEROS && !this.levelList[this.worldPos][this.playerPosition][COLI_HEROS].selected) {
					this.heroSelected = COLI_HEROS;
				}
				this.game.audioManager.playSound('cursor');
				this.displayLevels();
				break;
		}
	}

	rightButtonReleased() {
		switch (this.state) {

			case this.HEROS_SELECT_STATE:
				if (this.heroSelected === COLI_HEROS && !this.levelList[this.worldPos][this.playerPosition][FLEUR_HEROS].selected) {
					this.heroSelected = FLEUR_HEROS;
				} else if (this.heroSelected === FLEUR_HEROS && !this.levelList[this.worldPos][this.playerPosition][COLI_HEROS].selected) {
					this.heroSelected = COLI_HEROS;
				}
				this.game.audioManager.playSound('cursor');
				this.displayLevels();
				break;
		}
	}

	onStartLevel() {
		this.game.state.start('scene', true, false, this.heroSelected, { level: this.playerPosition + 1, world: this.worldPos });
	}

	/**
     * Si un joueur se déconnecte
     */
	onDisconnect() {
		this.disconnectScreen.display();
	}
}