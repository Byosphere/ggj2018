class Timer {

    constructor(game) {
        this.game = game;
        this.timerGroup = this.game.add.group();
        this.time = 0;
        this.interval = null;
    }

    start(levelNum, callback) {
        let darkBack = this.game.add.graphics(0, 0);
        this.timerGroup.add(darkBack);
        darkBack.beginFill(0x00000, 0.7);
        darkBack.drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        darkBack.endFill();
        this.game.world.bringToTop(this.timerGroup);

        let level = this.game.add.text(this.game.world.centerX, 120, 'Niveau ' + levelNum, { font: HUGE_FONT, fill: DEFAULT_COLOR });
        level.setShadow(4, 4, "rgba(163, 73, 164, 0.7)", 7);
        level.anchor.setTo(0.5, 0.5);
        this.timerGroup.add(level);

        let levelName = this.game.translate.LEVEL_NAMES[levelNum-1] || 'no-name';
        let levelSubtitle = this.game.add.text(GAME_WIDTH - 300, 200, levelName, { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
        levelSubtitle.setShadow(4, 4, "rgba(163, 73, 164, 0.7)", 7);
        levelSubtitle.anchor.setTo(0.5, 0.5);
        this.timerGroup.add(levelSubtitle);

        let tween1 = this.game.add.tween(level).to({ x: this.game.world.centerX + 200 }, 2000, "Quart.easeOut");
        let tween2 = this.game.add.tween(levelSubtitle).to({ x: GAME_WIDTH - 350 }, 2000, "Quart.easeOut");
        let tween3 = this.game.add.tween(this.timerGroup).to({ alpha: 0 }, 500, "Linear");

        tween1.onComplete.add(() => {
            tween3.start();
            tween3.onComplete.add(() => {
                this.timerGroup.destroy();
                this._startTimer();
                callback();
            });
        }, this);

        tween1.start();
        tween2.start();
    }

    _startTimer() {
        this.timeScreenGrounp = this.game.add.group();
        this.timerBack = this.game.add.graphics(0, 0);
        this.timerBack.beginFill(0x00000, 0.7);
        this.timerBack.drawRect(0, 8, GAME_WIDTH, 46);
        this.timerBack.endFill();
        this.timerText = this.game.add.text(20, 10, this.game.translate.ELAPSED_TIME + '0min 0s', { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
        this.timeScreenGrounp.add(this.timerBack);
        this.timeScreenGrounp.add(this.timerText);
        this.interval = setInterval(() => {
            this._timerTick();
        }, 1000);
    }


    _timerTick() {
        this.time++;
        let minutes = Math.floor(this.time / 60);
        let seconds = this.time % 60;
        this.timerText.text = this.game.translate.ELAPSED_TIME + minutes + 'min ' + seconds + 's';
    }

    getTime() {
        return this.time;
    }

    stopTime() {
        clearInterval(this.interval);
    }

    resetTime() {
        this.stopTime();
        this.timeScreenGrounp.destroy();
        this.time = 0;
    }
}
