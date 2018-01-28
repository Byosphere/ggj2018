class ControlsManager {

    constructor(game) {
        this.game = game;
        if(CONTROLLER) {
            initController();
        } else {
            initKeyboard();
        }
    }


    initController() {
        this.game.input.gamepad.start();
        this.pad = this.game.input.gamepad.pad1;
    }

    initKeyboard() {
        let keyZ = this.game.input.keyboard.addKey(Phaser.KeyCode.Z);
        let keyS = this.game.input.keyboard.addKey(Phaser.KeyCode.S);
        let keyQ = this.game.input.keyboard.addKey(Phaser.KeyCode.Q);
        let keyD = this.game.input.keyboard.addKey(Phaser.KeyCode.D);
        
    }
}
