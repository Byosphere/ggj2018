class DisconnectScreen {

    constructor(game) {
        this.game = game
        this.disconnectGroup = this.game.add.group();
        this.create();
        this.disconnected = false;
    }

    create() {
        let darkBack = this.game.add.graphics(0, 0);
        this.disconnectGroup.add(darkBack);
        darkBack.beginFill(0x00000, 0.7);
        darkBack.drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        darkBack.endFill();
        let disconnectText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, this.game.translate('MENU_TEXT_ERROR'), { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
        this.disconnectGroup.add(disconnectText);
        disconnectText.anchor.setTo(0.5);
        let resetText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 50, this.game.translate('GENERIC_PRESS_BUTTON') + ' ' + this.game.controlsManager.getCancelButtonName() + ' ' + this.game.translate('MENU_TEXT_BACKMENU'), { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
        resetText.anchor.setTo(0.5);
        this.disconnectGroup.add(resetText);
        this.disconnectGroup.visible = false;
    }

    display() {
        this.disconnectGroup.visible = true;
        this.disconnected = true;
        this.game.controlsManager.disableControls([CANCEL]);
        this.game.audioManager.stopCurrentMusic();
    }
    isDisconnected() {
        return this.disconnected;
    }

    destroy() {
        this.disconnectGroup.destroy();
    }
}