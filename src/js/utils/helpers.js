function getWorldFromLevelNum(num) {
	return Math.floor(num / NB_LEVELS) + 1
}

function getLevelFromLevelNum(num) {
	if (num < NB_LEVELS) {
		return num;
	} else {
		return (num % NB_LEVELS) + 1;
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