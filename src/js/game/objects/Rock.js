class Rock extends Phaser.Sprite {

    constructor(game, data) {
        super(game, data.x, data.y, 'rock', 0);
        this.anchor.setTo(0, 1);
        this.game.physics.arcade.enable(this);
        //this.body.enable = false;
        this.body.setSize(46, 42, 8, 8);
        this.body.immovable = true;
        this.carriedBy = null;
    }

    catch(heros) {
        if (this.carriedBy) return;
        this.carriedBy = heros;
        heros.getStone(this);
        this.visible = false;
        this.body.enable = false;
    }

    drop() {
        if (!this.carriedBy) return;
        switch (this.carriedBy.facing) {
            case DOWN:
                this.centerX = this.carriedBy.centerX;
                this.y = this.carriedBy.y + 60;
                break;
            case UP:
                this.centerX = this.carriedBy.centerX;
                this.y = this.carriedBy.y - 52;
                break;
            case LEFT:
                this.x = this.carriedBy.x - 56;
                this.y = this.carriedBy.y + 12;
                break;
            case RIGHT:
                this.x = this.carriedBy.x + 56;
                this.y = this.carriedBy.y + 12;
                break;
            default:
                console.log(this.carriedBy.facing);
        }

        this.visible = true;
        this.body.enable = true;
        this.carriedBy = null;
    }

    fittingDropZone() {
        switch(this.carriedBy.facing) {
            case DOWN:

                break;
            case UP:

                break;
            case LEFT:

                break;
            case RIGHT:

                break;
            default:
                console.log(this.carriedBy.facing);
        }
        return true;
    }
}
