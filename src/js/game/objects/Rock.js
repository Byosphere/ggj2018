class Rock extends Phaser.Sprite {

    constructor(game, data) {
        super(game, data.x, data.y, 'rock', 0);
        this.anchor.setTo(0, 1);
        this.game.physics.arcade.enable(this);
        //this.body.enable = false;
        this.body.setSize(60, 50, 0, 0);
        this.body.immovable = true;
        this.carriedBy = null;
    }

    catch(heros) {
        this.carriedBy = heros;
        heros.getStone(this);
        this.visible = false;
        this.body.enable = false;
    }

    drop() {
        if (!this.carriedBy) return;

        switch (this.carriedBy.facing) {
            case DOWN:
                this.x = this.carriedBy.x;
                this.y = this.carriedBy.y + 64;
                break;
            case UP:
                this.x = this.carriedBy.x;
                this.y = this.carriedBy.y - 64;
                break;
            case LEFT:
                this.x = this.carriedBy.x - 64;
                this.y = this.carriedBy.y;
                break;
            case RIGHT:
                this.x = this.carriedBy.x + 64;
                this.y = this.carriedBy.y;
                break;
        }
        this.visible = true;
        this.body.enable = true;
        this.carriedBy = null;
    }
}
