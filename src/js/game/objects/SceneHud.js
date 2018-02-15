class SceneHud {

    constructor(game) {
        this.game = game;
        this.timerGroup = this.game.add.group();
        this.time = 0;
        this.interval = null;
        this.hudGroup = null;
        this.pausedTime = false;
        this.heroLife = HEROS_MAX_LIVES;
        this.currentLevel = null;
    }

    start(currentLevel, callback) {
        this.currentLevel = currentLevel;
        let darkBack = this.game.add.graphics(0, 0);
        this.timerGroup.add(darkBack);
        darkBack.beginFill(0x00000, 0.7);
        darkBack.drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        darkBack.endFill();
        this.game.world.bringToTop(this.timerGroup);

        let level = this.game.add.text(this.game.world.centerX, 120, this.game.translate('LEVEL') + ' ' + currentLevel.world + '-' + currentLevel.level, { font: HUGE_FONT, fill: DEFAULT_COLOR });
        level.setShadow(4, 4, "rgba(163, 73, 164, 0.7)", 7);
        level.anchor.setTo(0.5, 0.5);
        this.timerGroup.add(level);

        let index = (currentLevel.world - 1) * 10 + currentLevel.level;
        let levelName = this.game.translate('LEVEL_NAMES', index);
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
                this._displayHud();
                callback();
            });
        }, this);

        tween1.start();
        tween2.start();
    }

    /**
     * retourne le temps du timer en secondes
     */
    getTime() {
        return this.time;
    }

    /**
     * retourne le temps sous la forme : MMmin SSs
     */
    getFormatedTime() {
        let minutes = Math.floor(this.time / 60);
        let seconds = this.time % 60;
        return minutes + 'min ' + seconds + 's';
    }

    /**
     * mets le timer en pause
     */
    pauseTime() {
        this.pausedTime = true;
    }

    /**
     * relance le timer
     */
    resumeTime() {
        this.pausedTime = false;
    }

    /**
     * arrête le timer
     */
    stopTime() {
        clearInterval(this.interval);
    }

    /**
     * masque le timer
     */
    hideTimer() {
        this.timerText.visible = false;
    }

    /**
     * masque le hud
     */
    hideHud() {
        this.hudGroup.visible = false;
    }

    /**
     * affiche le Hud
     */
    showHud() {
        this.hudGroup.visible = true;
    }

    /**
     * montre le timer
     */
    showTimer() {
        this.timerText.visible = true;
    }

    /**
     * réinitialise le timer
     */
    resetTime() {
        this.stopTime();
        this.timerText.destroy();
        this.time = 0;
    }

    /**
     * Retire des points de vie
     * @param {number} nb : nombre de points de vie
     */
    removeLife(nb) {
        this.heroLife -= nb;
        if (this.heroLife === 0) {
            this.game.serverManager.getSocket().emit('reset', true);
        } else {
            this.bulle.animations.play(BULLE_ANIMATIONS.HEART_BREAK.NAME);
            this.lifeText.text = this.heroLife + '/' + HEROS_MAX_LIVES;
        }
    }

    /**
     * Ajoute de la vie au héros
     * @param {number} nb : nombre de points de vie
     */
    addLife(nb) {
        this.bulle.animations.play(BULLE_ANIMATIONS.HEART_FLASH.NAME);
        this.heroLife += nb;
        if (this.heroLife > HEROS_MAX_LIVES) this.heroLife = HEROS_MAX_LIVES;
        this.lifeText.text = this.heroLife + '/' + HEROS_MAX_LIVES;
    }

    _displayHud() {
        this.hudGroup = this.game.add.group();
        this.hudBack = this.game.add.graphics(0, 0);
        this.hudBack.beginFill(0x00000, 0.7);
        this.hudBack.drawRect(0, 8, GAME_WIDTH, 46);
        this.hudBack.endFill();
        this.hudGroup.add(this.hudBack);
        this.hudGroup.add(this.game.add.sprite(264, -1, 'bulle'));
        this.hudGroup.add(this.game.add.sprite(10, -1, 'bulle'));
        this.hudGroup.add(this.game.add.text(254 + CELL_SIZE, 10, ': ' + this.game.translate('LEVEL') + ' ' + this.currentLevel.world + '-' + this.currentLevel.level, { font: DEFAULT_FONT, fill: DEFAULT_COLOR }));
        this.hudGroup.add(this._startTimer());
        this.hudGroup.add(this._displayLife());
    }

    _displayLife() {
        this.lifeGroup = this.game.add.group();
        this.bulle = this.game.add.sprite(this.game.world.width - 200, CELL_SIZE / 2, 'bulle');
        this.bulle.frame = BULLE_ANIMATIONS.HEART_DEFAULT.FRAMES;
        this.bulle.anchor.setTo(.5, .5);
        this.bulle.scale.setTo(-1, 1);
        this.bulle.animations.add(BULLE_ANIMATIONS.HEART_BREAK.NAME, BULLE_ANIMATIONS.HEART_BREAK.FRAMES, 10, false);
        this.bulle.animations.add(BULLE_ANIMATIONS.HEART_FLASH.NAME, BULLE_ANIMATIONS.HEART_FLASH.FRAMES, 10, false);
        this.lifeText = this.game.add.text(this.game.world.width - 150, 14, this.heroLife + '/' + HEROS_MAX_LIVES, { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
        this.lifeGroup.add(this.lifeText);
        this.lifeGroup.add(this.bulle);
        return this.lifeGroup;
    }

    _startTimer() {
        this.timerText = this.game.add.text(CELL_SIZE, 10, ': 0min 0s', { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
        this.interval = setInterval(() => {
            if (!this.pausedTime)
                this._timerTick();
        }, 1000);
        return this.timerText;
    }


    _timerTick() {
        this.time++;
        this.timerText.text = ': ' + this.getFormatedTime();
    }
}
