/** 
 * Affiche un message
*/
class TextMessage {

    constructor(game) {
        this.game = game;
        this.currentTextGroup = null;
        this.textGroup = game.add.group();
        this.textGroup.x = game.world.width / 4 - this.textGroup.width / 2;
        this.textGroup.y = game.world.height;
        let background = game.add.sprite(0, 20, 'tbMedium');
        background.alpha = 0.9;
        this.textGroup.add(background);
        let info = game.add.sprite(background.width - 120, 0, 'info');
        this.displayText1 = game.add.text(30, 40, '', { font: SMALL_FONT, fill: DEFAULT_COLOR });
        this.textGroup.add(this.displayText1);
        this.displayText2 = game.add.text(30, this.displayText1.y + this.displayText1.height, '', { font: SMALL_FONT, fill: DEFAULT_COLOR });
        this.textGroup.add(this.displayText2);
        this.textGroup.add(info);
    }

    show(displayTime, line1, line2) {
        return new Promise((resolve) => {
            if (this.currentTextGroup) {
                this.currentTextGroup.hide().then(() => {
                    this.displayText1.text = line1;
                    this.displayText2.text = line2 || '';
                    this.game.add.tween(this.textGroup).to({ y: this.game.world.height - this.textGroup.height }, 1000, "Elastic.easeOut").start();
                    this.currentTextGroup = this;
                });

            } else {
                this.displayText1.text = line1;
                this.displayText2.text = line2 || '';
                this.game.add.tween(this.textGroup).to({ y: this.game.world.height - this.textGroup.height }, 1000, "Elastic.easeOut").start();
                this.currentTextGroup = this;
            }

            if (displayTime) {
                setTimeout(() => {
                    this.hide().then(() => {
                        resolve(true);
                    });
                }, displayTime);
            }
        });
    }

    hide() {
        return new Promise((resolve, reject) => {
            let tween = this.game.add.tween(this.textGroup).to({ y: this.game.world.height }, 300, "Linear").start();
            tween.onComplete.add(() => {
                this.currentTextGroup = null;
                resolve(true);
            }, this);
        });
    }
}