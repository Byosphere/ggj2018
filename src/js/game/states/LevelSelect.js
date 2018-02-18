class LevelSelect {

	init() {
		this.WORLD_SELECT_STATE = 1;
		this.LEVEL_SELECT_STATE = 2;
		this.HEROS_SELECT_STATE = 3;
		this.READY_STATE = 4;
	}

	preload() {

		this.otherPlayer = null;
		this.levelSelected = 0;
		this.heroSelected = COLI_HEROS;
		this.worldPos = 1;
		this.state = this.WORLD_SELECT_STATE;
		this.levelList = [];
		this.playerPosition = 0;
		this.game.controlsManager.setCallbackContext(this);
		this.game.serverManager.setCallbackContext(this);
		this.initDisplay();
		this.initLevelList();
		this.disconnectScreen = new DisconnectScreen(this.game);
	}

	initDisplay() {
		this.game.stage.backgroundColor = MENU_BACKGROUND_COLOR;
		this.background = this.game.add.sprite(0, 0, 'background_title');
		this.background.alpha = 0.2;
		let darkBack = this.game.add.graphics(0, 0);
		darkBack.beginFill(0xFFFFFF, 0.1);
		darkBack.drawRect(GAME_WIDTH / 2, 0, GAME_WIDTH / 2, GAME_HEIGHT);
		darkBack.endFill();
		this.rightBands = this.game.add.sprite(this.game.world.centerX - 64, 0, 'rightBands');
		this.title = this.game.add.text(this.rightBands.centerX + 32, -4, this.game.translate('WORLD_NAMES', this.worldPos), { font: HEAD_FONT, fill: DEFAULT_COLOR });
		this.title.setShadow(4, 4, "rgba(0, 0, 0, 0.7)", 2);
		this.title.anchor.setTo(0.5, 0);
		let worldmap = this.game.add.sprite(0, 0, 'worldMap');
		this.bottomInfo = this.game.add.text(this.rightBands.x + 80, this.game.world.height - 48, this.game.translate('WORLD_SELECT'), { font: SMALL_FONT, fill: DEFAULT_COLOR });
		this.bottomInfo.setShadow(4, 4, "rgba(0, 0, 0, 0.7)", 2);
		this.bottomInfo.alpha = 0.6;
		let worldCursor = this.game.add.sprite(0, 0, 'worldCursor');
		let worldCursorText = this.game.add.text(worldCursor.x + 60, worldCursor.y - 20, '', { font: SMALL_FONT, fill: DEFAULT_COLOR });
		let worldCursorText2 = this.game.add.text(worldCursor.x + 74, worldCursor.y + 6, '', { font: SMALL_FONT, fill: DEFAULT_COLOR });
		this.worldCursor = this.game.add.group();
		this.worldCursor.add(worldCursor);
		this.worldCursor.add(worldCursorText);
		this.worldCursor.add(worldCursorText2);
		this.worldCursor.x = WORLD_POSITIONS[this.worldPos].x;
		this.worldCursor.y = WORLD_POSITIONS[this.worldPos].y;
		// this.arrowLeft = this.game.add.sprite(this.rightBands.x + 40, 300, 'arrow');
		// this.arrowLeft.anchor.setTo(0.5,0.5);
		// let arrowLeftText = this.game.add.text(this.arrowLeft.x - 45, this.arrowLeft.y + 10, 'enter', { font: SMALL_FONT, fill: DEFAULT_COLOR });
		// arrowLeftText.setShadow(4, 4, "rgba(0, 0, 0, 0.7)", 2);
		// this.arrowLeft.angle = -180;
		// this.arrowRight= this.game.add.sprite(this.rightBands.x + 24, 500, 'arrow');
		// this.arrowRight.anchor.setTo(0.5,0.5);
		// let arrowRightText = this.game.add.text(this.arrowRight.x -10, this.arrowRight.y + 10, 'Esc.', { font: SMALL_FONT, fill: DEFAULT_COLOR });
		// arrowRightText.setShadow(4, 4, "rgba(0, 0, 0, 0.7)", 2);
	}

	initLevelList() {
		let index = 1;
		let posY2 = 50;

		for (let w = 1; w <= WORLDS.length; w++) {
			this.levelList[w] = [];
			let posY = 100;

			for (let i = 0; i < NB_LEVELS; i++) {

				let graph = this.game.add.sprite(this.rightBands.x + 120, posY, 'levelBack');
				let text = this.game.add.text(graph.x + 50, graph.centerY - 5, this.game.translate('LEVEL_NAMES', index), { font: SMALL_FONT, fill: DEFAULT_COLOR });
				let levelNum = this.game.add.text(graph.x + 25, graph.centerY, w + '-' + (i + 1), { font: SMALL_FONT, fill: DEFAULT_COLOR });
				let levelHud = this.game.add.sprite(graph.x + graph.width - 11, graph.y, 'hudSelect');
				let score = this.game.add.text(graph.x + 50, graph.centerY + 5, this.game.translate('BEST_TIME') + ': -min -s | ' + this.game.translate('COLLECTIBLE') + ': -', { font: SMALLEST_FONT, fill: DEFAULT_COLOR });
				score.alpha = 0.7;
				let coliSelect = this.game.add.sprite(levelHud.x + 6, levelHud.y - 2, 'coli');
				let fleurSelect = this.game.add.sprite(levelHud.x + 61, levelHud.y - 2, 'fleur');
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
						score.text = this.game.translate('BEST_TIME') + ': ' + this.getFormatedTime(savedLevel.highScore) + ' | ' + this.game.translate('COLLECTIBLE') + ': -';
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
					finished: finished,
					coli: { selected: null, sprite: coliSelect },
					fleur: { selected: null, sprite: fleurSelect }
				});
				index++;
				posY += 70;
			}
		}
	}

	create() {
		this.displayLevels();
	}

	displayLevels() {
		this.showOnly(this.worldPos);
		let finishedLevels = 0;
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
					level.score.alpha = 0.7;
				} else {
					tween1 = this.game.add.tween(level.levelGroup).to({ x: 0 }, 500, "Quart.easeOut").start();
					level.text.alpha = 0.2;
					level.score.alpha = 0.2;
				}
			} else if (this.state === this.WORLD_SELECT_STATE) {
				level.levelGroup.x = 0;
				level.text.alpha = 0.2;
				level.score.alpha = 0.2;
			}
			if (level.coli.selected) {
				level.coli.sprite.tint = 0xFFFFFF;
			} else {
				level.coli.sprite.tint = 0x222222;
			}

			if (level.fleur.selected) {
				level.fleur.sprite.tint = 0xFFFFFF;
			} else {
				level.fleur.sprite.tint = 0x222222;
			}
		});

		this.worldCursor.x = WORLD_POSITIONS[this.worldPos].x;
		this.worldCursor.y = WORLD_POSITIONS[this.worldPos].y;
		this.worldCursor.children[1].text = this.game.translate('WORLD') + ' ' + this.worldPos;
		this.worldCursor.children[2].text = finishedLevels + '/10';

		if (this.state === this.WORLD_SELECT_STATE) {
			this.worldCursor.alpha = 1;
		} else {
			this.worldCursor.alpha = 0.5;
		}

		this.title.text = this.game.translate('WORLD_NAMES', this.worldPos);
		if (this.state === this.HEROS_SELECT_STATE) {
			this.levelList[this.worldPos][this.playerPosition][this.heroSelected].sprite.tint = 0xffffff;
		}
	}

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

	downButtonReleased() {
		switch (this.state) {

			case this.WORLD_SELECT_STATE:
				if (this.worldPos < WORLDS.length) {
					this.worldPos++;
					this.displayLevels();
				}
				break;

			case this.LEVEL_SELECT_STATE:
				if (this.playerPosition < NB_LEVELS - 1) {
					this.playerPosition++;
					this.displayLevels();
				}
				break;
		}
	}

	upButtonReleased() {
		switch (this.state) {

			case this.WORLD_SELECT_STATE:
				if (this.worldPos > 1) {
					this.worldPos--;
					this.displayLevels();
				}
				break;

			case this.LEVEL_SELECT_STATE:
				if (this.playerPosition > 0) {
					this.playerPosition--;
					this.displayLevels();
				}
				break;
		}
	}

	actionButtonReleased() {
		switch (this.state) {

			case this.WORLD_SELECT_STATE:
				this.state = this.LEVEL_SELECT_STATE;
				this.bottomInfo.text = this.game.translate('LEVEL_SELECT');
				this.displayLevels();
				break;

			case this.LEVEL_SELECT_STATE:
				if (!this.levelList[this.worldPos][this.playerPosition].locked) {
					this.state = this.HEROS_SELECT_STATE;
					if (this.levelList[this.worldPos][this.playerPosition].coli.selected) {
						this.heroSelected = FLEUR_HEROS;
					}
					this.bottomInfo.text = this.game.translate('HEROS_SELECT');
					this.displayLevels();
				}
				break;

			case this.HEROS_SELECT_STATE:
				this.state = this.READY_STATE;
				this.bottomInfo.text = this.game.translate('READY_SELECT');
				this.game.serverManager.getSocket().emit('selectlevel', { heros: this.heroSelected, level: this.playerPosition + 1, world: this.worldPos });
				this.game.controlsManager.disableControls();
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

			case this.LEVEL_SELECT_STATE:
				this.state = this.WORLD_SELECT_STATE;
				this.bottomInfo.text = this.game.translate('WORLD_SELECT');
				this.playerPosition = 0;
				this.displayLevels();
				break;

			case this.HEROS_SELECT_STATE:
				this.state = this.LEVEL_SELECT_STATE;
				this.bottomInfo.text = this.game.translate('LEVEL_SELECT');
				this.displayLevels();
				break;
			case this.READY_STATE:
				this.state = this.HEROS_SELECT_STATE;
				this.bottomInfo.text = this.game.translate('HEROS_SELECT');
				this.game.serverManager.getSocket().emit('unselectlevel');
				break;
		}
		if (this.disconnectScreen.isDisconnected()) {
			this.game.state.start('lobby');
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
				this.displayLevels();
				break;
		}
	}

	onStartLevel() {
		this.game.state.start('scene', true, false, this.heroSelected, { level: this.playerPosition + 1, world: this.worldPos });
	}
	/**
     * retourne le temps sous la forme : MMmin SSs
     */
	getFormatedTime(time) {
		let minutes = Math.floor(time / 60);
		let seconds = time % 60;
		return minutes + 'min ' + seconds + 's';
	}

	/**
     * Si un joueur se déconnecte
     */
	onDisconnect() {
		this.disconnectScreen.display();
	}

	shutdown() {

	}
}