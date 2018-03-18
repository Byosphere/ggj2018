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