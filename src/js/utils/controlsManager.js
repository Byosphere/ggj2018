/**
 * actionButtonReleased$
 * upButtonReleased
 * downButtonReleased
 * leftButtonReleased
 * rightButtonReleased
 * cancelButtonReleased
 * startButtonReleased
 * actionButtonDown
 * upButtonDown
 * donwButtonDown
 * leftButtonDown
 * rightButtonDown
 * cancelButtonDown
 * startButtonDown
 */
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
        this.callbackContext = this;
        this.controlsEnabled = true;
    }

    init() {
        if (this.game.parameters.controller) {
            this.initController();
        } else {
            this.initKeyboard();
        }
    }

    initController() {
        this.game.input.gamepad.start();
        let pad = this.game.input.gamepad.pad1;
        pad.callbackContext = this;
        pad.onUpCallback = this.onControllerButtonReleased;
        pad.onDownCallback = this.onControllerButtonDown;
        pad.onAxisCallback = this.onControllerAxisChanged;

        //button names
        this.actionButtonName = PAD_ACTION_BUTTON;
        this.cancelButtonName = PAD_CANCEL_BUTTON;
        this.upButtonName = PAD_UP_BUTTON;
        this.downButtonName = PAD_DOWN_BUTTON;
        this.leftButtonName = PAD_LEFT_BUTTON;
        this.rightButtonName = PAD_RIGHT_BUTTON;
        this.resetButtonName = PAD_RESET_BUTTON;
    }

    initKeyboard() {
        let keyboard = this.game.input.keyboard.addCallbacks(this, this.onKeyboardButtonDown, this.onKeyboardButtonReleased, this.onKeyboardButtonPressed);

        //button names
        this.actionButtonName = KEY_ACTION_BUTTON;
        this.cancelButtonName = KEY_CANCEL_BUTTON;
        this.upButtonName = KEY_UP_BUTTON;
        this.downButtonName = KEY_DOWN_BUTTON;
        this.leftButtonName = KEY_LEFT_BUTTON;
        this.rightButtonName = KEY_RIGHT_BUTTON;
        this.resetButtonName = KEY_RESET_BUTTON;
    }

    setCallbackContext(context) {
        this.callbackContext = context;
    }

    /* ------------------ BUTTONS ON RELEASE ------------------------------ */


    onControllerButtonReleased(button) {
        if (!this.controlsEnabled) return;

        switch (button) {
            case Phaser.Gamepad.XBOX360_A:
                if (this.callbackContext.actionButtonReleased)
                    this.callbackContext.actionButtonReleased();
                break;

            case Phaser.Gamepad.XBOX360_DPAD_UP:
                if (this.callbackContext.upButtonReleased)
                    this.callbackContext.upButtonReleased();
                break;

            case Phaser.Gamepad.XBOX360_DPAD_DOWN:
                if (this.callbackContext.downButtonReleased)
                    this.callbackContext.downButtonReleased();
                break;

            case Phaser.Gamepad.XBOX360_DPAD_LEFT:
                if (this.callbackContext.leftButtonReleased)
                    this.callbackContext.leftButtonReleased();
                break;
            case Phaser.Gamepad.XBOX360_DPAD_RIGHT:
                if (this.callbackContext.rightButtonReleased)
                    this.callbackContext.rightButtonReleased();
                break;
            case Phaser.Gamepad.XBOX360_B:
                if (this.callbackContext.cancelButtonReleased)
                    this.callbackContext.cancelButtonReleased();
                break;
            case Phaser.Gamepad.XBOX360_START:
                if (this.callbackContext.startButtonReleased)
                    this.callbackContext.startButtonReleased();
                break;
            default:
                console.log('Button pressed unknown : ' + button);
        }
    }

    onKeyboardButtonReleased(keyboardEvent) {
        if (!this.controlsEnabled) return;
        let button = keyboardEvent.keyCode;

        switch (button) {
            case Phaser.KeyCode.ENTER:
                if (this.callbackContext.actionButtonReleased)
                    this.callbackContext.actionButtonReleased();
                break;

            case Phaser.KeyCode.UP:
            case Phaser.KeyCode.Z:
                if (this.callbackContext.upButtonReleased)
                    this.callbackContext.upButtonReleased();
                break;

            case Phaser.KeyCode.DOWN:
            case Phaser.KeyCode.S:
                if (this.callbackContext.downButtonReleased)
                    this.callbackContext.downButtonReleased();
                break;

            case Phaser.KeyCode.LEFT:
            case Phaser.KeyCode.Q:
                if (this.callbackContext.leftButtonReleased)
                    this.callbackContext.leftButtonReleased();
                break;
            case Phaser.KeyCode.RIGHT:
            case Phaser.KeyCode.D:
                if (this.callbackContext.rightButtonReleased)
                    this.callbackContext.rightButtonReleased();
                break;
            case Phaser.KeyCode.BACKSPACE:
            case Phaser.KeyCode.ESC:
                if (this.callbackContext.cancelButtonReleased)
                    this.callbackContext.cancelButtonReleased();
                break;
            case Phaser.KeyCode.SPACEBAR:
                if (this.callbackContext.startButtonReleased)
                    this.callbackContext.startButtonReleased();
                break;
            default:
                console.log('Button pressed unknown : ' + button);
        }
    }

    onControllerButtonDown(button) {
        if (!this.controlsEnabled) return;

        switch (button) {
            case Phaser.Gamepad.XBOX360_A:
                if (this.callbackContext.actionButtonDown)
                    this.callbackContext.actionButtonDown();
                break;
            case Phaser.Gamepad.XBOX360_DPAD_UP:
                if (this.callbackContext.upButtonDown)
                    this.callbackContext.upButtonDown();
                break;
            case Phaser.Gamepad.XBOX360_DPAD_DOWN:
                if (this.callbackContext.downButtonDown)
                    this.callbackContext.downButtonDown();
                break;
            case Phaser.Gamepad.XBOX360_DPAD_LEFT:
                if (this.callbackContext.leftButtonDown)
                    this.callbackContext.leftButtonDown();
                break;
            case Phaser.Gamepad.XBOX360_DPAD_RIGHT:
                if (this.callbackContext.rightButtonDown)
                    this.callbackContext.rightButtonDown();
                break;
            case Phaser.Gamepad.XBOX360_B:
                if (this.callbackContext.cancelButtonDown)
                    this.callbackContext.cancelButtonDown();
                break;
            case Phaser.Gamepad.XBOX360_START:
                if (this.callbackContext.startButtonDown)
                    this.callbackContext.startButtonDown();
                break;
            default:
                console.log('Button pressed unknown : ' + button);

        }
    }


    onKeyboardButtonDown(keyboardEvent) {
        if (!this.controlsEnabled) return;
        let button = keyboardEvent.keyCode;

        switch (button) {
            case Phaser.KeyCode.ENTER:
                if (this.callbackContext.actionButtonDown)
                    this.callbackContext.actionButtonDown();
                break;

            case Phaser.KeyCode.UP:
            case Phaser.KeyCode.Z:
                if (this.callbackContext.upButtonDown)
                    this.callbackContext.upButtonDown();
                break;

            case Phaser.KeyCode.DOWN:
            case Phaser.KeyCode.S:
                if (this.callbackContext.downButtonDown)
                    this.callbackContext.downButtonDown();
                break;

            case Phaser.KeyCode.LEFT:
            case Phaser.KeyCode.Q:
                if (this.callbackContext.leftButtonDown)
                    this.callbackContext.leftButtonDown();
                break;
            case Phaser.KeyCode.RIGHT:
            case Phaser.KeyCode.D:
                if (this.callbackContext.rightButtonDown)
                    this.callbackContext.rightButtonDown();
                break;
            case Phaser.KeyCode.BACKSPACE:
            case Phaser.KeyCode.ESC:
                if (this.callbackContext.cancelButtonDown)
                    this.callbackContext.cancelButtonDown();
                break;
            case Phaser.KeyCode.SPACEBAR:
                if (this.callbackContext.startButtonDown)
                    this.callbackContext.startButtonDown();
                break;
            default:
                console.log('Button pressed unknown : ' + button);
        }
    }

    onKeyboardButtonPressed(button) {
        
    }

    disableControls() {
        this.controlsEnabled = false;
    }

    enableControls() {
        this.controlsEnabled = true;
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
