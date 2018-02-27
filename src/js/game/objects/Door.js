/**
 * Classe de l'objet porte
 */
class Door extends Phaser.Sprite {

    constructor(game, data) {
        if (data.properties.Orientation === 'vertical') {
            super(game, data.x, data.y, 'door', 0);
        } else {
            super(game, data.x, data.y, 'door_horizontal', 0);
            this.key = 'door_horizontal';
        }
        this.game.physics.arcade.enable(this);
        if (this.key === 'door_horizontal') {
            this.body.setSize(192, 48, 0, 8);
        } else {
            this.body.setSize(48, 192, 8, 0);
            this.anchor.setTo(0, 1);
        }
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
            this.animations.play(DOOR_ANIMATIONS.OPEN.NAME);
            this.isAnimating = true;
            this.animations.currentAnim.onComplete.add(() => {
                this.body.enable = false;
                this.isAnimating = false;
                this.animations.frame = this.openFrame;
            });
        } else if (this.isAnimating) {
            if (this.animations.currentAnim.name === DOOR_ANIMATIONS.CLOSE.NAME) {
                this.animations.play(DOOR_ANIMATIONS.OPEN.NAME);
            }
            this.animations.currentAnim.onComplete.add(() => {
                this.body.enable = false;
                this.isAnimating = false;
                this.animations.frame = this.openFrame;
            });
        }
    }

    /**
     * Déclenche la fermeture de la porte
     */
    closeDoor() {
        if (!this.body.enable) {
            this.animations.play(DOOR_ANIMATIONS.CLOSE.NAME);
            this.isAnimating = true;
            this.animations.currentAnim.onComplete.add(() => {
                this.body.enable = true;
                this.isAnimating = false;
                this.animations.frame = this.closeFrame;
            });
        } else if (this.isAnimating) {
            if (this.animations.currentAnim.name === DOOR_ANIMATIONS.OPEN.NAME) {
                this.animations.play(DOOR_ANIMATIONS.CLOSE.NAME);
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
                this.animations.frame = DOOR_ANIMATIONS.GREEN_OPEN.FRAMES[0];
                this.closeFrame = DOOR_ANIMATIONS.GREEN_OPEN.FRAMES[0];
                this.openFrame = DOOR_ANIMATIONS.GREEN_CLOSE.FRAMES[0];
                this.animations.add(DOOR_ANIMATIONS.GREEN_OPEN.NAME, DOOR_ANIMATIONS.GREEN_OPEN.FRAMES, 14, false)
                this.animations.add(DOOR_ANIMATIONS.GREEN_CLOSE.NAME, DOOR_ANIMATIONS.GREEN_CLOSE.FRAMES, 18, false)
                break;
            case ORANGE:
                this.animations.frame = DOOR_ANIMATIONS.ORANGE_OPEN.FRAMES[0];
                this.closeFrame = DOOR_ANIMATIONS.ORANGE_OPEN.FRAMES[0];
                this.openFrame = DOOR_ANIMATIONS.ORANGE_CLOSE.FRAMES[0];
                this.animations.add(DOOR_ANIMATIONS.ORANGE_OPEN.NAME, DOOR_ANIMATIONS.ORANGE_OPEN.FRAMES, 14, false)
                this.animations.add(DOOR_ANIMATIONS.ORANGE_CLOSE.NAME, DOOR_ANIMATIONS.ORANGE_CLOSE.FRAMES, 18, false)
                break;
            case RED:
                this.animations.frame = DOOR_ANIMATIONS.RED_OPEN.FRAMES[0];
                this.closeFrame = DOOR_ANIMATIONS.RED_OPEN.FRAMES[0];
                this.openFrame = DOOR_ANIMATIONS.RED_CLOSE.FRAMES[0];
                this.animations.add(DOOR_ANIMATIONS.RED_OPEN.NAME, DOOR_ANIMATIONS.RED_OPEN.FRAMES, 14, false)
                this.animations.add(DOOR_ANIMATIONS.RED_CLOSE.NAME, DOOR_ANIMATIONS.RED_CLOSE.FRAMES, 18, false)
                break;
            case WHITE:
                this.animations.frame = DOOR_ANIMATIONS.WHITE_OPEN.FRAMES[0];
                this.closeFrame = DOOR_ANIMATIONS.WHITE_OPEN.FRAMES[0];
                this.openFrame = DOOR_ANIMATIONS.WHITE_CLOSE.FRAMES[0];
                this.animations.add(DOOR_ANIMATIONS.WHITE_OPEN.NAME, DOOR_ANIMATIONS.WHITE_OPEN.FRAMES, 14, false)
                this.animations.add(DOOR_ANIMATIONS.WHITE_CLOSE.NAME, DOOR_ANIMATIONS.WHITE_CLOSE.FRAMES, 18, false)
                break;
        }
    }
}
