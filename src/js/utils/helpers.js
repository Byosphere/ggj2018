function getWorldFromLevelNum(num) {
	return Math.floor(num / NB_LEVELS) + 1
}

function getLevelFromLevelNum(num) {
	return (num % NB_LEVELS) + 1;
}

function getLevelNumFromWorldLevel(world, level) {
	return level + ((world - 1) * 10);
}