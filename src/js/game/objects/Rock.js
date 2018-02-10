class Rock extends Phaser.Sprite {

    constructor(game, data, buttonsGroup) {
        super(game, data.x, data.y, 'rock', 0);
        this.anchor.setTo(0, 1);
        this.game.physics.arcade.enable(this);
        this.body.setSize(46, 42, 8, 8);
        this.carriedBy = null;
        this.buttonsGroup = buttonsGroup;
        this.leButton = null;
    }

    /**
     * 
     * @param {Character} character 
     */
    catchedBy(char) {
        this.carriedBy = char;
        this.visible = false;
    }

    /**
     * 
     * @param {Character} character 
     */
    droppedBy(char) {
        switch (this.carriedBy.facing) {
            case DOWN:
                this.centerX = this.carriedBy.centerX;
                this.y = this.carriedBy.y + 80
                break;
            case UP:
                this.centerX = this.carriedBy.centerX;
                this.y = this.carriedBy.y - 80;
                break;
            case LEFT:
                this.x = this.carriedBy.x - 80;
                this.y = this.carriedBy.y + 40;
                break;
            case RIGHT:
                this.x = this.carriedBy.x + 80;
                this.y = this.carriedBy.y + 40;
                break;
            default:
                console.log(this.carriedBy.facing);
        }
        this.carriedBy = null;
        this.visible = true;
    }

    /**
     * 
     */
    canBeDropped() {
        return true;
    }

    update() {
        if (!this.carriedBy) {

            if (!this.game.physics.arcade.overlap(this, this.buttonsGroup, (rock, button) => {
                this.lebutton = button;
                button.toggleOn();
            }, null, this)) {
                if (this.lebutton)
                    this.lebutton.toggleOff();
                this.leButton = null;
            }
        } else if (this.lebutton) {
            this.lebutton.toggleOff();
            this.leButton = null;
        }
    }

    // update() {

    // }
    // catch(heros) {
    //     if (this.carriedBy) return;
    //     this.carriedBy = heros;
    //     heros.getStone(this);
    //     this.visible = false;
    //     this.body.enable = false;
    // }

    // update() {
    //     if (this.carriedBy) {
    //         switch (this.carriedBy.facing) {
    //             case DOWN:
    //                 this.body.centerX = this.carriedBy.body.centerX;
    //                 this.body.y = this.carriedBy.body.y + 60;
    //                 break;
    //             case UP:
    //                 this.body.centerX = this.carriedBy.body.centerX;
    //                 this.body.y = this.carriedBy.body.y - 52;
    //                 break;
    //             case LEFT:
    //                 this.body.x = this.carriedBy.body.x - 56;
    //                 this.body.y = this.carriedBy.body.y + 12;
    //                 break;
    //             case RIGHT:
    //                 this.body.x = this.carriedBy.body.x + 56;
    //                 this.body.y = this.carriedBy.body.y + 12;
    //                 break;
    //             default:
    //                 console.log(this.carriedBy.facing);
    //         }
    //     }
    // }


    // dropStone() {

    // 	if (this.carry && this.carry.fittingDropZone()) {

    // 		this.carry.drop();
    // 		this.carry = null;
    // 		switch (this.facing) {
    // 			case DOWN:
    // 				this.stopDown();
    // 				break;
    // 			case UP:
    // 				this.stopUp();
    // 				break;
    // 			case LEFT:
    // 				this.stopLeft();
    // 				break;
    // 			case RIGHT:
    // 				this.stopRight();
    // 				break;
    // 		}
    // 	}
    // }
}
