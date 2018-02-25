let currentTextGroup = null;
/** 
 * Affiche un message
*/
class TextMessage {

    constructor(game, displayTime, line1, line2) {
        this.game = game;
        this.displayTime = displayTime;
        this.textGroup = game.add.group();
        this.textGroup.x = game.world.width / 4 - this.textGroup.width / 2;
        this.textGroup.y = game.world.height;
        let background = game.add.sprite(0, 20, 'tbMedium');
        this.textGroup.add(background);
        let info = game.add.sprite(background.width - 120, 0, 'info');
        let displayText1 = game.add.text(20, 40, line1, { font: SMALL_FONT, fill: DEFAULT_COLOR });
        this.textGroup.add(displayText1);
        if (line2) {
            let displayText2 = game.add.text(20, displayText1.y + displayText1.height, line2, { font: SMALL_FONT, fill: DEFAULT_COLOR });
            this.textGroup.add(displayText2);
        }
        this.textGroup.add(info);
    }

    show() {
        if (currentTextGroup) {
            currentTextGroup.hide();
            setTimeout(() => {
                this.game.add.tween(this.textGroup).to({ y: this.game.world.height - this.textGroup.height }, 1000, "Elastic.easeOut").start();
                currentTextGroup = this;
            }, 1000);
        }
        this.game.add.tween(this.textGroup).to({ y: this.game.world.height - this.textGroup.height }, 1000, "Elastic.easeOut").start();
        currentTextGroup = this;
        if (this.displayTime) {
            setTimeout(() => {
                this.hide();
            }, this.displayTime);
        }
    }

    hide() {
        this.game.add.tween(this.textGroup).to({ y: this.game.world.height }, 1000, "Linear").start();
        currentTextGroup = null;
    }
}