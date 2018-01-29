class ControlsManager {

    constructor(game) {
        this.game = game;
        this.actionButtonName = '';
        this.cancelButtonName = '';
        this.upButtonName = '';
        this.downButtonName = '';
        this.leftButtonName = '';
        this.rightButtonName = '';
        this.resetButtonName = '';
    }

    init() {
        if (CONTROLLER) {
            this.initController();
        } else {
            this.initKeyboard();
        }
    }

    initController() {
        this.game.input.gamepad.start();
        this.pad = this.game.input.gamepad.pad1;
        this.actionButtonName = PAD_ACTION_BUTTON;
        this.cancelButtonName = PAD_CANCEL_BUTTON;
        this.upButtonName = PAD_UP_BUTTON;
        this.downButtonName = PAD_DOWN_BUTTON;
        this.leftButtonName = PAD_LEFT_BUTTON;
        this.rightButtonName = PAD_RIGHT_BUTTON;
        this.resetButtonName = PAD_RESET_BUTTON;
    }

    initKeyboard() {
        let keyZ = this.game.input.keyboard.addKey(Phaser.KeyCode.Z);
        let keyS = this.game.input.keyboard.addKey(Phaser.KeyCode.S);
        let keyQ = this.game.input.keyboard.addKey(Phaser.KeyCode.Q);
        let keyD = this.game.input.keyboard.addKey(Phaser.KeyCode.D);
        let keySPACE = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACE);
        let keyR = this.game.input.keyboard.addKey(Phaser.KeyCode.R);
        this.actionButtonName = KEY_ACTION_BUTTON;
        this.cancelButtonName = KEY_CANCEL_BUTTON;
        this.upButtonName = KEY_UP_BUTTON;
        this.downButtonName = KEY_DOWN_BUTTON;
        this.leftButtonName = KEY_LEFT_BUTTON;
        this.rightButtonName = KEY_RIGHT_BUTTON;
        this.resetButtonName = KEY_RESET_BUTTON;
    }

    /* ------------------ BUTTONS ON RELEASE ------------------------------ */
    actionButtonReleased() {
        return (this.pad.justReleased(Phaser.Gamepad.XBOX360_A));
            
    }

    upButtonReleased() {
        return this.pad.justReleased(Phaser.Gamepad.XBOX360_DPAD_UP);
    }

    downButtonReleased() {
        return this.pad.justReleased(Phaser.Gamepad.XBOX360_DPAD_DOWN);
    }

    leftButtonReleased() {
        return this.pad.justReleased(Phaser.Gamepad.XBOX360_DPAD_LEFT);
    }

    rightButtonReleased() {
        return this.pad.justReleased(Phaser.Gamepad.XBOX360_DPAD_RIGHT);
    }

    cancelButtonReleased() {
        return this.pad.justReleased(Phaser.Gamepad.XBOX360_B);
    }

    resetButtonReleased() {
        return this.pad.justReleased(Phaser.Gamepad.XBOX360_START);
    }

    /* ------------------ BUTTONS ON DOWN ------------------------------ */
    upButtonDown() {
        return (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1)
    }

    downButtonDown() {
        return (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1);
    }

    leftButtonDown() {
        return (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1);
    }

    rightButtonDown() {
        return (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1);
    }


    /* ----- GETTERS ----- */
    getActionButtonName() {
        return this.actionButtonName;
    }

    getUpButtonName() {
        return this.upButtonName;
    }

    getDownButtonName() {
        return this.downButtonName;
    }

    getLeftButtonName() {
        return this.leftButtonName;
    }

    getRightButtonName() {
        return this.rightButtonName;
    }

    getResetButtonName() {
        return this.resetButtonName;
    }
}
