class PauseScreen {
    
    constructor(game) {
        this.game = game
        this.pauseGroup = this.game.add.group();
        this.onPause = false;
        this.create();
    }

    create() {
        let darkBack = this.game.add.graphics(0, 0);
        this.pauseGroup.add(darkBack);
        darkBack.beginFill(0x00000, 0.7);
        darkBack.drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        darkBack.endFill();
        let pauseText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, this.game.translate('MENU_TEXT_PAUSE'), { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
        this.pauseGroup.add(pauseText);
        pauseText.anchor.setTo(0.5);
        let resetText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 50, this.game.controlsManager.getStartButtonName() + ' ' + this.game.translate('MENU_TEXT_RESET'), { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
        resetText.anchor.setTo(0.5);
        this.pauseGroup.add(resetText);
        this.pauseGroup.visible = false;
    }

    display() {
        this.pauseGroup.visible = true;
        this.game.controlsManager.disableControls([START, CANCEL]);
        this.game.audioManager.getCurrentMusic().pause();
        this.onPause = true;
    }

    hide() {
        this.pauseGroup.visible = false;
        this.game.controlsManager.enableControls();
        this.game.audioManager.getCurrentMusic().resume();
        this.onPause = false;
    }

    isOnPause() {
        return this.onPause;
    }

    destroy() {
        this.pauseGroup.destroy();
    }
}