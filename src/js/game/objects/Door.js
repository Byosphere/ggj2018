/**
 * Classe de l'objet porte
 */
class Door extends Phaser.Sprite {

    constructor(game, data, worldNum) {
        if (data.properties.Orientation === 'vertical') {
            super(game, data.x, data.y, 'door_w' + worldNum, 0);
        } else {
            super(game, data.x, data.y, 'door_horizontal_w' + worldNum, 0);
            this.key = 'door_horizontal';
        }
        this.game.physics.arcade.enable(this);
        if (this.key === 'door_horizontal') {
            this.body.setSize(192, 48, 0, 8);
        } else {
            this.body.setSize(48, 192, 8, 0);
            this.anchor.setTo(0, 1);
        }

        this.worldNum = worldNum;
        this.body.immovable = true;
        this.colorParam = data.properties.Color;
        this.isAnimating = false;
        this.closeFrame = null;
        this.openFrame = null;
        this.setColor(this.colorParam);
    }

    /**
     * Déclenche l'ouverture de la porte
     */
    openDoor() {
        if (this.body.enable) {
            this.playSound();
            this.animations.play(DOOR_ANIMATIONS[this.worldNum].OPEN.NAME);
            this.isAnimating = true;
            this.animations.currentAnim.onComplete.add(() => {
                this.body.enable = false;
                this.isAnimating = false;
                this.animations.frame = this.openFrame;
            });
        } else if (this.isAnimating) {
            if (this.animations.currentAnim.name === DOOR_ANIMATIONS[this.worldNum].CLOSE.NAME) {
                this.animations.play(DOOR_ANIMATIONS[this.worldNum].OPEN.NAME);
            }
            this.animations.currentAnim.onComplete.add(() => {
                this.body.enable = false;
                this.isAnimating = false;
                this.animations.frame = this.openFrame;
            });
        }
    }

    playSound() {
        switch (this.worldNum) {
            case 1:
                this.game.audioManager.playSound('door_leaves');
                break;
            case 2:
                this.game.audioManager.playSound('door_laser');
                break;
        }
    }
    /**
     * Déclenche la fermeture de la porte
     */
    closeDoor() {
        if (!this.body.enable) {
            this.playSound();
            this.animations.play(DOOR_ANIMATIONS[this.worldNum].CLOSE.NAME);
            this.isAnimating = true;
            this.animations.currentAnim.onComplete.add(() => {
                this.body.enable = true;
                this.isAnimating = false;
                this.animations.frame = this.closeFrame;
            });
        } else if (this.isAnimating) {
            if (this.animations.currentAnim.name === DOOR_ANIMATIONS[this.worldNum].OPEN.NAME) {
                this.animations.play(DOOR_ANIMATIONS[this.worldNum].CLOSE.NAME);
            }
            this.animations.currentAnim.onComplete.add(() => {
                this.body.enable = true;
                this.isAnimating = false;
                this.animations.frame = this.closeFrame;
            });
        }
    }

    /**
     * Défini la couleur de la porte
     * @param {string} color 
     */
    setColor(color) {
        switch (color) {
            case GREEN:
                this.animations.frame = DOOR_ANIMATIONS[this.worldNum].GREEN_OPEN.FRAMES[0];
                this.closeFrame = DOOR_ANIMATIONS[this.worldNum].GREEN_OPEN.FRAMES[0];
                this.openFrame = DOOR_ANIMATIONS[this.worldNum].GREEN_CLOSE.FRAMES[0];
                this.animations.add(DOOR_ANIMATIONS[this.worldNum].GREEN_OPEN.NAME, DOOR_ANIMATIONS[this.worldNum].GREEN_OPEN.FRAMES, 14, false)
                this.animations.add(DOOR_ANIMATIONS[this.worldNum].GREEN_CLOSE.NAME, DOOR_ANIMATIONS[this.worldNum].GREEN_CLOSE.FRAMES, 18, false)
                break;
            case ORANGE:
                this.animations.frame = DOOR_ANIMATIONS[this.worldNum].ORANGE_OPEN.FRAMES[0];
                this.closeFrame = DOOR_ANIMATIONS[this.worldNum].ORANGE_OPEN.FRAMES[0];
                this.openFrame = DOOR_ANIMATIONS[this.worldNum].ORANGE_CLOSE.FRAMES[0];
                this.animations.add(DOOR_ANIMATIONS[this.worldNum].ORANGE_OPEN.NAME, DOOR_ANIMATIONS[this.worldNum].ORANGE_OPEN.FRAMES, 14, false)
                this.animations.add(DOOR_ANIMATIONS[this.worldNum].ORANGE_CLOSE.NAME, DOOR_ANIMATIONS[this.worldNum].ORANGE_CLOSE.FRAMES, 18, false)
                break;
            case RED:
                this.animations.frame = DOOR_ANIMATIONS[this.worldNum].RED_OPEN.FRAMES[0];
                this.closeFrame = DOOR_ANIMATIONS[this.worldNum].RED_OPEN.FRAMES[0];
                this.openFrame = DOOR_ANIMATIONS[this.worldNum].RED_CLOSE.FRAMES[0];
                this.animations.add(DOOR_ANIMATIONS[this.worldNum].RED_OPEN.NAME, DOOR_ANIMATIONS[this.worldNum].RED_OPEN.FRAMES, 14, false)
                this.animations.add(DOOR_ANIMATIONS[this.worldNum].RED_CLOSE.NAME, DOOR_ANIMATIONS[this.worldNum].RED_CLOSE.FRAMES, 18, false)
                break;
            case WHITE:
                this.animations.frame = DOOR_ANIMATIONS[this.worldNum].WHITE_OPEN.FRAMES[0];
                this.closeFrame = DOOR_ANIMATIONS[this.worldNum].WHITE_OPEN.FRAMES[0];
                this.openFrame = DOOR_ANIMATIONS[this.worldNum].WHITE_CLOSE.FRAMES[0];
                this.animations.add(DOOR_ANIMATIONS[this.worldNum].WHITE_OPEN.NAME, DOOR_ANIMATIONS[this.worldNum].WHITE_OPEN.FRAMES, 14, false)
                this.animations.add(DOOR_ANIMATIONS[this.worldNum].WHITE_CLOSE.NAME, DOOR_ANIMATIONS[this.worldNum].WHITE_CLOSE.FRAMES, 18, false)
                break;
        }
    }
}
