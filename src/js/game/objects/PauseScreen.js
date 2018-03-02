class PauseScreen {

    constructor(game) {
        this.game = game
        this.pauseGroup = null;
        this.onPause = false;
        this.index = 0;
    }

    displayBackground() {
        return new Promise((resolve) => {
            this.pauseGroup = this.game.add.group();
            this.darkBack = this.game.add.graphics(0, 0);
            this.darkBack.beginFill(0x00000, 0.8);
            this.darkBack.drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
            this.darkBack.endFill();
            this.pauseGroup.add(this.darkBack);

            this.backgroundTopCorner1 = this.game.add.sprite(-200, -200, 'background_top_corner');
            this.backgroundTopCorner1.animations.add(MENU_BACKGROUND_ANIMATIONS.DEFAULT.NAME, MENU_BACKGROUND_ANIMATIONS.DEFAULT.FRAMES, 1, true).play();
            this.game.add.tween(this.backgroundTopCorner1).to({ x: 0, y: 0 }, 500, 'Quart.easeInOut', true, 0);
            this.pauseGroup.add(this.backgroundTopCorner1);

            this.backgroundTopMiddle = this.game.add.sprite(300, -200, 'background_top_middle');
            this.backgroundTopMiddle.animations.add(MENU_BACKGROUND_ANIMATIONS.DEFAULT.NAME, MENU_BACKGROUND_ANIMATIONS.DEFAULT.FRAMES, 1, true).play();
            this.game.add.tween(this.backgroundTopMiddle).to({ y: 0 }, 500, 'Quart.easeInOut', true, 0);
            this.pauseGroup.add(this.backgroundTopMiddle);

            this.backgroundTopMiddle2 = this.game.add.sprite(800, -200, 'background_top_middle2');
            this.backgroundTopMiddle2.animations.add(MENU_BACKGROUND_ANIMATIONS.DEFAULT.NAME, MENU_BACKGROUND_ANIMATIONS.DEFAULT.FRAMES, 1, true).play();
            this.game.add.tween(this.backgroundTopMiddle2).to({ y: 0 }, 500, 'Quart.easeInOut', true, 0);
            this.pauseGroup.add(this.backgroundTopMiddle2);

            this.backgroundTopCorner2 = this.game.add.sprite(this.game.world.width + 200, -200, 'background_top_corner');
            this.backgroundTopCorner2.animations.add(MENU_BACKGROUND_ANIMATIONS.DEFAULT.NAME, MENU_BACKGROUND_ANIMATIONS.DEFAULT.FRAMES, 1, true).play();
            this.backgroundTopCorner2.scale.setTo(-1, 1);
            this.game.add.tween(this.backgroundTopCorner2).to({ x: this.game.world.width + 60, y: -50 }, 500, 'Quart.easeInOut', true, 0);
            this.pauseGroup.add(this.backgroundTopCorner2);

            this.backgroundbotCorner1 = this.game.add.sprite(-100, this.game.world.height, 'background_bot_corner');
            this.backgroundbotCorner1.animations.add(MENU_BACKGROUND_ANIMATIONS.DEFAULT.NAME, MENU_BACKGROUND_ANIMATIONS.DEFAULT.FRAMES, 1, true).play();
            this.game.add.tween(this.backgroundbotCorner1).to({ x: -5, y: this.game.world.height - 220 }, 500, 'Quart.easeInOut', true, 500);
            this.pauseGroup.add(this.backgroundbotCorner1);

            this.backgroundbotCorner2 = this.game.add.sprite(this.game.world.width, this.game.world.height, 'background_bot_corner2');
            this.backgroundbotCorner2.animations.add(MENU_BACKGROUND_ANIMATIONS.DEFAULT.NAME, MENU_BACKGROUND_ANIMATIONS.DEFAULT.FRAMES, 1, true).play();
            this.pauseGroup.add(this.backgroundbotCorner2);
            const lastTween = this.game.add.tween(this.backgroundbotCorner2).to({ x: this.game.world.width - 122, y: this.game.world.height - 296 }, 500, 'Quart.easeInOut', true, 500);
            lastTween.onComplete.add(() => {
                resolve(true);
            }, this);
        });
    }

    hideBackground() {
        return new Promise((resolve) => {
            this.game.add.tween(this.pauseText).to({ alpha: 0 }, 500, 'Quart.easeInOut', true, 0);
            this.game.add.tween(this.textMenu1).to({ alpha: 0 }, 500, 'Quart.easeInOut', true, 0);
            this.game.add.tween(this.textMenu2).to({ alpha: 0 }, 500, 'Quart.easeInOut', true, 0);
            this.game.add.tween(this.textMenu3).to({ alpha: 0 }, 500, 'Quart.easeInOut', true, 0);
            this.game.add.tween(this.backgroundTopCorner1).to({ x: -200, y: -200 }, 500, 'Quart.easeInOut', true, 300);
            this.game.add.tween(this.backgroundTopMiddle).to({ y: -200 }, 500, 'Quart.easeInOut', true, 300);
            this.game.add.tween(this.backgroundTopMiddle2).to({ y: -200 }, 500, 'Quart.easeInOut', true, 300);
            this.game.add.tween(this.backgroundTopCorner2).to({ x: this.game.world.width + 200, y: -200 }, 500, 'Quart.easeInOut', true, 300);
            this.game.add.tween(this.backgroundbotCorner1).to({ x: -100, y: this.game.world.height }, 500, 'Quart.easeInOut', true, 800);
            let lastTween = this.game.add.tween(this.backgroundbotCorner2).to({ x: this.game.world.width, y: this.game.world.height }, 500, 'Quart.easeInOut', true, 800);
            lastTween.onComplete.add(() => {
                resolve(true);
            }, this);
        });
    }

    display() {
        this.game.audioManager.getCurrentMusic().pause();
        this.displayBackground().then(() => {
            this.displayMenu();
            this.onPause = true;
        });
    }

    displayMenu() {
        this.pauseText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 150, this.game.translate('MENU_TEXT_PAUSE'), { font: BIG_FONT, fill: DEFAULT_COLOR });
        this.pauseText.anchor.setTo(0.5);
        this.pauseGroup.add(this.pauseText);
        this.textMenu1 = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 50, 'Recommencer le niveau', { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
        this.textMenu1.anchor.setTo(0.5);
        this.textMenu1.alpha = 1;
        this.pauseGroup.add(this.textMenu1);
        this.textMenu2 = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Retourner à la carte des mondes', { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
        this.textMenu2.anchor.setTo(0.5);
        this.textMenu2.alpha = 0.3;
        this.pauseGroup.add(this.textMenu2);
        this.textMenu3 = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 50, 'Reprendre la partie', { font: DEFAULT_FONT, fill: DEFAULT_COLOR });
        this.textMenu3.anchor.setTo(0.5);
        this.textMenu3.alpha = 0.3;
        this.pauseGroup.add(this.textMenu3);
    }

    hide() {
        this.hideBackground().then(() => {
            this.pauseGroup.destroy();
            this.game.controlsManager.enableControls();
            this.game.audioManager.getCurrentMusic().resume();
            this.onPause = false;
        });
    }

    updateMenu() {
        this.textMenu1.alpha = 0.3;
        this.textMenu2.alpha = 0.3;
        this.textMenu3.alpha = 0.3;
        switch (this.index) {
            case 0:
                this.textMenu1.alpha = 1;
                break;
            case 1:
                this.textMenu2.alpha = 1;
                break;
            case 2:
                this.textMenu3.alpha = 1;
                break;
        }
    }

    moveUp() {
        console.log('move');
        if (this.index > 0) {
            this.index--;
            this.updateMenu();
        }
    }

    moveDown() {
        console.log('move');
        if (this.index < 2) {
            this.index++;
            this.updateMenu();
        }
    }

    action(scene) {
        switch (this.index) {
            case 0:
                this.game.serverManager.getSocket().emit('reset');
                scene.onResetLevel();
                break;
            case 1:
                break;
            case 2:
                break;
        }
    }

    isOnPause() {
        return this.onPause;
    }

    destroy() {
        this.pauseGroup.destroy();
    }
}