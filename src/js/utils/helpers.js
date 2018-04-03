function getWorldFromLevelNum(num) {
	return Math.ceil(num / NB_LEVELS);
}

function getLevelFromLevelNum(num) {
	if (num % NB_LEVELS === 0) {
		return NB_LEVELS;
	} else {
		return (num % NB_LEVELS);
	}
}

function getLevelNumFromWorldLevel(world, level) {
	return level + ((world - 1) * 10);
}


function getFormatedTime(time) {
	let minutes = Math.floor(time / 60);
	let seconds = time % 60;
	return minutes + 'min ' + seconds + 's';
}

function displayOverlay(state) {
	return new Promise((resolve) => {
		state.backgroundTopCorner1 = state.game.add.sprite(-200, -200, 'background_top_corner');
		state.backgroundTopCorner1.animations.add(MENU_BACKGROUND_ANIMATIONS.DEFAULT.NAME, MENU_BACKGROUND_ANIMATIONS.DEFAULT.FRAMES, 1, true).play();
		state.game.add.tween(state.backgroundTopCorner1).to({ x: 0, y: 0 }, 500, 'Quart.easeInOut', true, 0);

		state.backgroundTopMiddle = state.game.add.sprite(300, -200, 'background_top_middle');
		state.backgroundTopMiddle.animations.add(MENU_BACKGROUND_ANIMATIONS.DEFAULT.NAME, MENU_BACKGROUND_ANIMATIONS.DEFAULT.FRAMES, 1, true).play();
		state.game.add.tween(state.backgroundTopMiddle).to({ y: 0 }, 500, 'Quart.easeInOut', true, 0);

		state.backgroundTopMiddle2 = state.game.add.sprite(800, -200, 'background_top_middle2');
		state.backgroundTopMiddle2.animations.add(MENU_BACKGROUND_ANIMATIONS.DEFAULT.NAME, MENU_BACKGROUND_ANIMATIONS.DEFAULT.FRAMES, 1, true).play();
		state.game.add.tween(state.backgroundTopMiddle2).to({ y: 0 }, 500, 'Quart.easeInOut', true, 0);

		state.backgroundTopCorner2 = state.game.add.sprite(state.game.world.width + 200, -200, 'background_top_corner');
		state.backgroundTopCorner2.animations.add(MENU_BACKGROUND_ANIMATIONS.DEFAULT.NAME, MENU_BACKGROUND_ANIMATIONS.DEFAULT.FRAMES, 1, true).play();
		state.backgroundTopCorner2.scale.setTo(-1, 1);
		state.game.add.tween(state.backgroundTopCorner2).to({ x: state.game.world.width + 60, y: -50 }, 500, 'Quart.easeInOut', true, 0);

		state.backgroundbotCorner1 = state.game.add.sprite(-100, state.game.world.height, 'background_bot_corner');
		state.backgroundbotCorner1.animations.add(MENU_BACKGROUND_ANIMATIONS.DEFAULT.NAME, MENU_BACKGROUND_ANIMATIONS.DEFAULT.FRAMES, 1, true).play();
		state.game.add.tween(state.backgroundbotCorner1).to({ x: -5, y: state.game.world.height - 220 }, 500, 'Quart.easeInOut', true, 500);

		state.backgroundbotCorner2 = state.game.add.sprite(state.game.world.width, state.game.world.height, 'background_bot_corner2');
		state.backgroundbotCorner2.animations.add(MENU_BACKGROUND_ANIMATIONS.DEFAULT.NAME, MENU_BACKGROUND_ANIMATIONS.DEFAULT.FRAMES, 1, true).play();
		let last = state.game.add.tween(state.backgroundbotCorner2).to({ x: state.game.world.width - 122, y: state.game.world.height - 296 }, 500, 'Quart.easeInOut', true, 500);
		last.onComplete.add(() => {
			resolve(true);
		}, state);
	});
}

function hideOverlay(state) {
	return new Promise((resolve) => {
		state.game.add.tween(state.backgroundTopCorner1).to({ x: -200, y: -200 }, 500, 'Quart.easeInOut', true, 500);
		state.game.add.tween(state.backgroundTopMiddle).to({ y: -200 }, 500, 'Quart.easeInOut', true, 500);
		state.game.add.tween(state.backgroundTopMiddle2).to({ y: -200 }, 500, 'Quart.easeInOut', true, 500);
		state.game.add.tween(state.backgroundTopCorner2).to({ x: state.game.world.width + 200, y: -200 }, 500, 'Quart.easeInOut', true, 500);
		state.game.add.tween(state.backgroundbotCorner1).to({ x: -100, y: state.game.world.height }, 500, 'Quart.easeInOut', true, 1000);
		let last = state.game.add.tween(state.backgroundbotCorner2).to({ x: state.game.world.width, y: state.game.world.height }, 500, 'Quart.easeInOut', true, 1000);
		last.onComplete.add(() => {
			resolve(true);
		}, state);
	});
}