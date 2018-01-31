/**
 * Fonctions possibles à mettre dans la class qui implemente ControlsManager : 
 * actionButtonReleased
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
        this.controlsEnabled = [];
        this.controlsEnabled[ACTION] = true;
        this.controlsEnabled[UP] = true;
        this.controlsEnabled[DOWN] = true;
        this.controlsEnabled[LEFT] = true;
        this.controlsEnabled[RIGHT] = true;
        this.controlsEnabled[CANCEL] = true;
        this.controlsEnabled[START] = true;
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
        this.startButtonName = PAD_START_BUTTON;
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
        this.startButtonName = KEY_START_BUTTON;
    }

    setCallbackContext(context) {
        this.callbackContext = context;
    }

    /* ------------------ BUTTONS ON RELEASE ------------------------------ */


    onControllerButtonReleased(button) {

        switch (button) {
            case Phaser.Gamepad.XBOX360_A:
                if (this.callbackContext.actionButtonReleased && this.controlsEnabled[ACTION])
                    this.callbackContext.actionButtonReleased();
                break;

            case Phaser.Gamepad.XBOX360_DPAD_UP:
                if (this.callbackContext.upButtonReleased && this.controlsEnabled[UP])
                    this.callbackContext.upButtonReleased();
                break;

            case Phaser.Gamepad.XBOX360_DPAD_DOWN:
                if (this.callbackContext.downButtonReleased && this.controlsEnabled[DOWN])
                    this.callbackContext.downButtonReleased();
                break;

            case Phaser.Gamepad.XBOX360_DPAD_LEFT:
                if (this.callbackContext.leftButtonReleased && this.controlsEnabled[LEFT])
                    this.callbackContext.leftButtonReleased();
                break;
            case Phaser.Gamepad.XBOX360_DPAD_RIGHT:
                if (this.callbackContext.rightButtonReleased && this.controlsEnabled[RIGHT])
                    this.callbackContext.rightButtonReleased();
                break;
            case Phaser.Gamepad.XBOX360_B:
                if (this.callbackContext.cancelButtonReleased && this.controlsEnabled[CANCEL])
                    this.callbackContext.cancelButtonReleased();
                break;
            case Phaser.Gamepad.XBOX360_START:
                if (this.callbackContext.startButtonReleased && this.controlsEnabled[START])
                    this.callbackContext.startButtonReleased();
                break;
            default:
                console.log('Button pressed unknown : ' + button);
        }
    }

    onKeyboardButtonReleased(keyboardEvent) {
        let button = keyboardEvent.keyCode;

        switch (button) {
            case Phaser.KeyCode.ENTER:
                if (this.callbackContext.actionButtonReleased && this.controlsEnabled[ACTION])
                    this.callbackContext.actionButtonReleased();
                break;

            case Phaser.KeyCode.UP:
            case Phaser.KeyCode.Z:
                if (this.callbackContext.upButtonReleased && this.controlsEnabled[UP])
                    this.callbackContext.upButtonReleased();
                break;

            case Phaser.KeyCode.DOWN:
            case Phaser.KeyCode.S:
                if (this.callbackContext.downButtonReleased && this.controlsEnabled[DOWN])
                    this.callbackContext.downButtonReleased();
                break;

            case Phaser.KeyCode.LEFT:
            case Phaser.KeyCode.Q:
                if (this.callbackContext.leftButtonReleased && this.controlsEnabled[LEFT])
                    this.callbackContext.leftButtonReleased();
                break;
            case Phaser.KeyCode.RIGHT:
            case Phaser.KeyCode.D:
                if (this.callbackContext.rightButtonReleased && this.controlsEnabled[RIGHT])
                    this.callbackContext.rightButtonReleased();
                break;
            case Phaser.KeyCode.BACKSPACE:
            case Phaser.KeyCode.ESC:
                if (this.callbackContext.cancelButtonReleased && this.controlsEnabled[CANCEL])
                    this.callbackContext.cancelButtonReleased();
                break;
            case Phaser.KeyCode.SPACEBAR:
                if (this.callbackContext.startButtonReleased && this.controlsEnabled[START])
                    this.callbackContext.startButtonReleased();
                break;
            default:
                console.log('Button pressed unknown : ' + button);
        }
    }

    onControllerButtonDown(button) {

        switch (button) {
            case Phaser.Gamepad.XBOX360_A:
                if (this.callbackContext.actionButtonDown && this.controlsEnabled[ACTION])
                    this.callbackContext.actionButtonDown();
                break;
            case Phaser.Gamepad.XBOX360_DPAD_UP:
                if (this.callbackContext.upButtonDown && this.controlsEnabled[UP])
                    this.callbackContext.upButtonDown();
                break;
            case Phaser.Gamepad.XBOX360_DPAD_DOWN:
                if (this.callbackContext.downButtonDown && this.controlsEnabled[DOWN])
                    this.callbackContext.downButtonDown();
                break;
            case Phaser.Gamepad.XBOX360_DPAD_LEFT:
                if (this.callbackContext.leftButtonDown && this.controlsEnabled[LEFT])
                    this.callbackContext.leftButtonDown();
                break;
            case Phaser.Gamepad.XBOX360_DPAD_RIGHT:
                if (this.callbackContext.rightButtonDown && this.controlsEnabled[RIGHT])
                    this.callbackContext.rightButtonDown();
                break;
            case Phaser.Gamepad.XBOX360_B:
                if (this.callbackContext.cancelButtonDown && this.controlsEnabled[CANCEL])
                    this.callbackContext.cancelButtonDown();
                break;
            case Phaser.Gamepad.XBOX360_START:
                if (this.callbackContext.startButtonDown && this.controlsEnabled[START])
                    this.callbackContext.startButtonDown();
                break;
            default:
                console.log('Button pressed unknown : ' + button);

        }
    }


    onKeyboardButtonDown(keyboardEvent) {
        let button = keyboardEvent.keyCode;

        switch (button) {
            case Phaser.KeyCode.ENTER:
                if (this.callbackContext.actionButtonDown && this.controlsEnabled[ACTION])
                    this.callbackContext.actionButtonDown();
                break;

            case Phaser.KeyCode.UP:
            case Phaser.KeyCode.Z:
                if (this.callbackContext.upButtonDown && this.controlsEnabled[UP])
                    this.callbackContext.upButtonDown();
                break;

            case Phaser.KeyCode.DOWN:
            case Phaser.KeyCode.S:
                if (this.callbackContext.downButtonDown && this.controlsEnabled[DOWN])
                    this.callbackContext.downButtonDown();
                break;

            case Phaser.KeyCode.LEFT:
            case Phaser.KeyCode.Q:
                if (this.callbackContext.leftButtonDown && this.controlsEnabled[LEFT])
                    this.callbackContext.leftButtonDown();
                break;
            case Phaser.KeyCode.RIGHT:
            case Phaser.KeyCode.D:
                if (this.callbackContext.rightButtonDown && this.controlsEnabled[DOWN])
                    this.callbackContext.rightButtonDown();
                break;
            case Phaser.KeyCode.BACKSPACE:
            case Phaser.KeyCode.ESC:
                if (this.callbackContext.cancelButtonDown && this.controlsEnabled[CANCEL])
                    this.callbackContext.cancelButtonDown();
                break;
            case Phaser.KeyCode.SPACEBAR:
                if (this.callbackContext.startButtonDown && this.controlsEnabled[START])
                    this.callbackContext.startButtonDown();
                break;
            default:
                console.log('Button pressed unknown : ' + button);
        }
    }

    onKeyboardButtonPressed(button) {
        //TODO
    }


    /**
     * Fonction permettant de désactiver les boutons du jeu
     * @param {array} exceptions : tableau des boutons à ne pas désactiver. Laisser vide pour tout désactiver
     */
    disableControls(exceptions) {

        for (let button in this.controlsEnabled) {
            this.controlsEnabled[button] = false;
        }

        if (exceptions) {
            exceptions.forEach(button => {
                this.controlsEnabled[button] = true;
            });
        }
        console.log(this.controlsEnabled);
    }

    /**
     * Fonction permettant d'activer les boutons du jeu
     * @param {array} exceptions : tableau des boutons à ne pas activer. Laisser vide pour tout activer
     */
    enableControls(exceptions) {
        for (let button in this.controlsEnabled) {
            this.controlsEnabled[button] = true;
        }

        if (exceptions) {
            exceptions.forEach(button => {
                this.controlsEnabled[button] = false;
            });
        }
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

    getCancelButtonName() {
        return this.cancelButtonName;
    }

    getStartButtonName() {
        return this.startButtonName;
    }
}
