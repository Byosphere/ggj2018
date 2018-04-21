class HowToPlay extends Phaser.State {

    preload() {
        this.game.stage.backgroundColor = MENU_BACKGROUND_COLOR;
        this.game.controlsManager.setCallbackContext(this);
    }

    create() {
        this.backButton = this.game.add.text(100, 750, this.game.translate('BACK_BUTTON'), { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
        this.backButton.setShadow(4, 4, "rgba(163, 73, 164, 0.7)", 7);
        this.game.controlsManager.clickable(this.backButton);
        this.pageTitle = this.game.add.text(this.game.world.centerX, 70, this.game.translate('HOW_TO_PLAY'), { font: HEAD_FONT, fill: DEFAULT_COLOR });
        this.pageTitle.anchor.setTo(0.5);
        this.quickText1 = this.game.add.text(this.game.world.centerX, 150, this.game.translate('QUICK_TEXT_1'), { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
        this.quickText1.anchor.setTo(0.5);
        this.quickText2 = this.game.add.text(this.game.world.centerX, 200, this.game.translate('QUICK_TEXT_2'), { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
        this.quickText2.anchor.setTo(0.5);

        this.btnAction = this.game.add.sprite(100, 280, 'btnA');
        this.keyAction = this.game.add.sprite(200, 280, 'enter');
        this.textAction = this.game.add.text(320, 300, this.game.translate('HTP_ACTION'), { font: DEFAULT_FONT, fill: DEFAULT_COLOR });

        this.btnCancel = this.game.add.sprite(100, 410, 'btnB');
        this.keyCancel = this.game.add.sprite(200, 430, 'esc');
        this.textCancel = this.game.add.text(320, 430, this.game.translate('HTP_CANCEL'), { font: DEFAULT_FONT, fill: DEFAULT_COLOR });

        this.keyArrow = this.game.add.sprite(120, 530, 'keys');
        this.textArrows = this.game.add.text(320, 560, this.game.translate('HTP_MOVE'), { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
    }

    cancelButtonReleased() {
        this.game.state.start('menu');
    }

    mouseLeftClick(obj) {
        this.game.state.start('menu');
    }
}