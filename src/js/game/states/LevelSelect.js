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

				let graph = this.game.add.sprite(0, 0, 'levelBack');
				graph.id = i + 1;
				let text = this.game.add.text(graph.x + 50, graph.centerY - 5, '????????', { font: SMALL_FONT, fill: DEFAULT_COLOR });
				let levelNum = this.game.add.text(graph.x + 25, graph.centerY, w + '-' + (i + 1), { font: SMALL_FONT, fill: DEFAULT_COLOR });
				let levelHud = this.game.add.sprite(0, 0, 'hudSelect');
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
				let herosGroup = this.game.add.group();
				herosGroup.y = graph.y + posY;
				herosGroup.add(levelHud);
				herosGroup.add(coliSelect);
				herosGroup.add(fleurSelect);

				levelGroup.add(graph);
				levelGroup.add(text);
				levelGroup.add(score);
				levelGroup.add(levelNum);
				levelGroup.x = LEVEL_POS_X;
				levelGroup.y = posY;

				herosGroup.visible = false;
				levelGroup.visible = false;

				let isLocked = true;
				let finished = null;
				let savedLevel = this.game.levels[index - 1];
				if (this.game.parameters.debugMode.value) {
					isLocked = false;
					finished = this.game.add.sprite(graph.x, graph.centerY, 'completed');
					finished.anchor.setTo(0.5, 0.5);
					levelGroup.add(finished);
					text.text = this.game.translate('LEVEL_NAMES', index);
					score.text = 'debug mode';

				} else if (savedLevel) {
					isLocked = false;
					text.text = this.game.translate('LEVEL_NAMES', index);
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
					herosGroup: herosGroup,
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
		this.friendGroup = this.game.add.group();
		this.friendCursor = this.game.add.text(0, 0, '<- J2', { font: SMALL_FONT, fill: DEFAULT_COLOR });
		this.friendCursor.setShadow(4, 4, "rgba(0, 0, 0, 0.7)", 7);
		this.friendCursor2 = this.game.add.text(0, 21, 'choisi: -', { font: SMALLEST_FONT, fill: DEFAULT_COLOR });
		this.friendCursor2.setShadow(4, 4, "rgba(0, 0, 0, 0.7)", 7);
		this.friendGroup.add(this.friendCursor);
		this.friendGroup.add(this.friendCursor2);
		this.friendGroup.x = this.game.world.width - 140;
		this.friendGroup.y = 90;
		this.friendGroup.visible = false;
		this.setLockedWorld();
	}

	create() {
		this.displayBackground().then(() => {
			this.updateDisplay();
			this.backButton.alpha = 1;
			this.friendGroup.alpha = 0.8;
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

	updateDisplay() {

		switch (this.state) {
			case this.WORLD_SELECT_STATE:
				this.showOnly(this.worldPos);
				this.worldCursor.alpha = 1;
				this.animCursor = true;
				let cursorTween = this.game.add.tween(this.worldCursor).to({ x: WORLDS_DATA[this.worldPos - 1].world_position.x, y: WORLDS_DATA[this.worldPos - 1].world_position.y }, 200, 'Circ.easeInOut', true, 0);
				cursorTween.onComplete.add(() => {
					this.animCursor = false;
				}, this);
				let finishedLevels = 0;
				this.levelList[this.worldPos].forEach(level => {
					if (level.finished) finishedLevels++;
					this.game.add.tween(level.levelGroup).to({ x: LEVEL_POS_X }, 500, "Quart.easeOut").start();
					level.text.alpha = 0.2;
					level.score.alpha = 0.2;
					level.textNum.alpha = 0.2;
					level.levelGroup.setAll('tint', 0x999999);
				});
				this.worldCursor.children[1].text = this.game.translate('WORLD_NAMES', this.worldPos);
				this.worldCursor.children[2].text = finishedLevels + '/10';
				this.game.serverManager.getSocket().emit('updatelevel', { world: this.worldPos, pos: this.playerPosition, heros: null });
				break;

			case this.LEVEL_SELECT_STATE:
				this.worldCursor.alpha = 0.5;
				let tween1 = null;
				if (this.levelList[this.worldPos]) {
					this.levelList[this.worldPos].forEach(level => {
						if (this.playerPosition === level.levelNum) {
							tween1 = this.game.add.tween(level.levelGroup).to({ x: LEVEL_POS_X - 30 }, 500, "Quart.easeOut").start();
							level.text.alpha = 1;
							level.textNum.alpha = 1;
							level.score.alpha = 0.7;
						} else {
							tween1 = this.game.add.tween(level.levelGroup).to({ x: LEVEL_POS_X }, 500, "Quart.easeOut").start();
							level.text.alpha = 0.2;
							level.score.alpha = 0.2;
							level.textNum.alpha = 0.2;
						}
						level.coli.sprite.animations.stop();
						level.coli.sprite.animations.frame = 0;
						level.fleur.sprite.animations.stop();
						level.fleur.sprite.animations.frame = 0;
						level.herosGroup.visible = false;
						level.levelGroup.setAll('tint', 0xFFFFFF);
					});
				}
				this.game.serverManager.getSocket().emit('updatelevel', { world: this.worldPos, pos: this.playerPosition, heros: null });
				break;

			case this.HEROS_SELECT_STATE:
				let currentLevel = this.levelList[this.worldPos][this.playerPosition];
				if (this.heroSelected === COLI_HEROS) {
					currentLevel.coli.sprite.tint = 0xffffff;
					currentLevel.fleur.sprite.tint = 0x222222;
				} else {
					currentLevel.coli.sprite.tint = 0x222222;
					currentLevel.fleur.sprite.tint = 0xffffff;
				}
				if (this.otherPlayer && this.otherPlayer.world === this.worldPos && this.otherPlayer.pos === this.playerPosition && this.otherPlayer.heros === COLI_HEROS) {
					currentLevel.coli.selected = true;
					currentLevel.coli.sprite.tint = 0xFFFFFF;
					currentLevel.coli.sprite.animations.add(HEROS_ANIMATIONS.HIGHLIGHT.NAME, HEROS_ANIMATIONS.HIGHLIGHT.FRAMES, 10, true).play();
				} else {
					currentLevel.coli.selected = false;
					currentLevel.coli.sprite.animations.stop();
					currentLevel.coli.sprite.animations.frame = 0;
				}

				if (this.otherPlayer && this.otherPlayer.world === this.worldPos && this.otherPlayer.pos === this.playerPosition && this.otherPlayer.heros === FLEUR_HEROS) {
					currentLevel.fleur.selected = true;
					currentLevel.fleur.sprite.tint = 0xFFFFFF;
					currentLevel.fleur.sprite.animations.add(HEROS_ANIMATIONS.HIGHLIGHT.NAME, HEROS_ANIMATIONS.HIGHLIGHT.FRAMES, 10, true).play();
				} else {
					currentLevel.fleur.selected = false;
					currentLevel.fleur.sprite.animations.stop();
					currentLevel.fleur.sprite.animations.frame = 0;
				}

				if (!currentLevel.herosGroup.visible) {
					currentLevel.herosGroup.alpha = 0;
					currentLevel.herosGroup.x = this.levelListGroup.x + LEVEL_POS_X + currentLevel.levelGroup.width - 90;
					currentLevel.herosGroup.visible = true;

					this.game.add.tween(currentLevel.levelGroup).to({ x: LEVEL_POS_X - 116 }, 501, 'Quart.easeOut', true, 0);
					if (currentLevel.finished) {
						this.game.add.tween(currentLevel.herosGroup).to({ x: currentLevel.herosGroup.x - 50, alpha: 1 }, 500, 'Quart.easeOut', true, 0);
					} else {
						this.game.add.tween(currentLevel.herosGroup).to({ x: currentLevel.herosGroup.x - 37, alpha: 1 }, 500, 'Quart.easeOut', true, 0);
					}

				}
				this.levelList[this.worldPos].forEach(level => {
					if (level.name != this.levelList[this.worldPos][this.playerPosition].name) {
						level.levelGroup.setAll('tint', 0x999999);
					}
				});
				this.game.serverManager.getSocket().emit('updatelevel', { world: this.worldPos, pos: this.playerPosition, heros: null });
				break;
			case this.READY_STATE:
				let heros = this.levelList[this.worldPos][this.playerPosition][this.heroSelected];
				heros.sprite.tint = 0xFFFFFF;
				heros.sprite.animations.add(HEROS_ANIMATIONS.HIGHLIGHT.NAME, HEROS_ANIMATIONS.HIGHLIGHT.FRAMES, 10, true).play();

				break;
				this.game.serverManager.getSocket().emit('updatelevel', { world: this.worldPos, pos: this.playerPosition, heros: this.heroSelected });
		}
		if (this.otherPlayer)
			this.updateFriendCursor(this.otherPlayer.world, this.otherPlayer.pos, this.otherPlayer.heros);
	}


	updateFriendCursor(world, pos, heros) {

		if (this.worldPos != world) {
			this.friendGroup.visible = false;
		} else {
			this.friendGroup.visible = true;
			this.friendGroup.y = 90 + (70 * pos);
			if (heros === COLI_HEROS || heros === FLEUR_HEROS) {
				this.friendCursor2.text = 'choisi : ' + heros;
				let h = this.levelList[world][pos][heros];
				h.sprite.tint = 0xFFFFFF;
				h.sprite.animations.add(HEROS_ANIMATIONS.HIGHLIGHT.NAME, HEROS_ANIMATIONS.HIGHLIGHT.FRAMES, 10, true).play();
			} else {
				this.friendCursor2.text = 'choisi : -';

			}
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
			this.updateDisplay();
			this.game.audioManager.playSound('cursor');

		} else if (this.state === this.LEVEL_SELECT_STATE && obj.id && this.playerPosition != obj.id - 1) {
			this.playerPosition = obj.id - 1;
			this.updateDisplay();
			this.game.audioManager.playSound('cursor');
		} else if (
			this.state === this.HEROS_SELECT_STATE
			&& obj.key === 'coli'
			&& !this.levelList[this.worldPos][this.playerPosition][COLI_HEROS].selected
			&& this.heroSelected != COLI_HEROS
		) {

			this.heroSelected = COLI_HEROS;
			this.game.audioManager.playSound('cursor');
			this.updateDisplay();

		} else if (
			this.state === this.HEROS_SELECT_STATE
			&& obj.key === 'fleur'
			&& !this.levelList[this.worldPos][this.playerPosition][FLEUR_HEROS].selected
			&& this.heroSelected != FLEUR_HEROS
		) {

			this.heroSelected = FLEUR_HEROS;
			this.game.audioManager.playSound('cursor');
			this.updateDisplay();
		}
	}

	mouseLeftClick(obj) {
		if (this.state === this.WORLD_SELECT_STATE && (obj.worldNum === this.worldPos || obj.key === 'cursor')) {

			this.state = this.LEVEL_SELECT_STATE;
			this.infoText.show(null, this.game.translate('LEVEL_SELECT'));
			this.game.audioManager.playSound('bip');
			this.updateDisplay();

		} else if (obj.id >= 0 && this.state === this.LEVEL_SELECT_STATE) {
			this.actionButtonReleased();
		} else if (this.state === this.HEROS_SELECT_STATE && (obj.key === this.heroSelected)) {
			if (this.levelList[this.worldPos][this.playerPosition].selected) return;
			this.state = this.READY_STATE;
			this.infoText.show(null, this.game.translate('READY_SELECT'));
			this.game.serverManager.getSocket().emit('selectlevel', { heros: this.heroSelected, pos: this.playerPosition, world: this.worldPos });
			this.game.audioManager.playSound('bip');
			this.updateDisplay();
		} else if (obj.name === 'backbutton') {
			this.cancelButtonReleased();
		}
	}

	downButtonReleased() {
		switch (this.state) {

			case this.WORLD_SELECT_STATE:
				if (this.worldPos < this.lockedWorld.id - 1 && !this.animCursor) {
					this.worldPos++;
					this.updateDisplay();
					this.game.audioManager.playSound('cursor');
				}
				break;

			case this.LEVEL_SELECT_STATE:
				if (this.playerPosition < NB_LEVELS - 1) {
					this.playerPosition++;
					this.updateDisplay();
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
					this.updateDisplay();
					this.game.audioManager.playSound('cursor');
				}
				break;

			case this.LEVEL_SELECT_STATE:
				if (this.playerPosition > 0) {
					this.playerPosition--;
					this.updateDisplay();
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
				this.game.serverManager.getSocket().emit('selectlevel', { heros: null, pos: null, world: this.worldPos });
				this.game.audioManager.playSound('bip');
				this.updateDisplay();
				break;

			case this.LEVEL_SELECT_STATE:
				if (!this.levelList[this.worldPos][this.playerPosition].locked) {
					this.state = this.HEROS_SELECT_STATE;
					if (this.levelList[this.worldPos][this.playerPosition].coli.selected) {
						this.heroSelected = FLEUR_HEROS;
					}
					this.game.serverManager.getSocket().emit('selectlevel', { heros: null, pos: this.playerPosition, world: this.worldPos });
					this.infoText.show(null, this.game.translate('HEROS_SELECT'));
					this.game.audioManager.playSound('bip');
					this.updateDisplay();
				}
				break;

			case this.HEROS_SELECT_STATE:
				if (this.levelList[this.worldPos][this.playerPosition].selected) break;
				this.state = this.READY_STATE;
				this.infoText.show(null, this.game.translate('READY_SELECT'));
				this.game.serverManager.getSocket().emit('selectlevel', { heros: this.heroSelected, pos: this.playerPosition, world: this.worldPos });
				this.game.audioManager.playSound('bip');
				this.updateDisplay();
				break;
		}
	}

	onUpdatePlayers(otherPlayer) {

		if (otherPlayer) {
			this.otherPlayer = otherPlayer;
			this.updateFriendCursor(this.otherPlayer.world, this.otherPlayer.pos, this.otherPlayer.heros);
		} else {
			this.friendGroup.visible = false;
		}
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
				this.updateDisplay();
				break;

			case this.HEROS_SELECT_STATE:
				this.state = this.LEVEL_SELECT_STATE;
				this.infoText.show(null, this.game.translate('LEVEL_SELECT'));
				this.game.audioManager.playSound('back');
				this.updateDisplay();
				break;
			case this.READY_STATE:
				this.state = this.HEROS_SELECT_STATE;
				this.infoText.show(null, this.game.translate('HEROS_SELECT'));
				this.game.audioManager.playSound('back');
				this.game.serverManager.getSocket().emit('unselectlevel');
				this.updateDisplay();
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
				this.updateDisplay();
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
				this.updateDisplay();
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