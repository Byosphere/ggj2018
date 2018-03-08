/** 
 * Affiche un message
*/
class TextMessage {

    constructor(game) {
        this.game = game;
        this.currentTextGroup = null;
        this.textGroup = game.add.group();
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
        this.textGroup.x = game.world.centerX - (this.textGroup.width / 2);
    }

    /**
     * Affiche une popin en bas de l'écran avec le text passé en paramètre
     * displaytime est infini si null, si sound est true, un son est joué lors de l'affichage de la popin
     * Retourne une promesse quand la popin disparait après displaytime
     * @param {number} displayTime 
     * @param {string} line1 
     * @param {string} line2 
     * @param {boolean} sound 
     */
    show(displayTime, line1, line2, sound) {
        return new Promise((resolve) => {
            if (this.currentTextGroup) {
                this.currentTextGroup.hide().then(() => {
                    if (sound)
                        this.game.audioManager.playSound('pop');
                    this.displayText1.text = line1;
                    this.displayText2.text = line2 || '';
                    this.game.add.tween(this.textGroup).to({ y: this.game.world.height - this.textGroup.height }, 1000, "Elastic.easeOut").start();
                    this.currentTextGroup = this;
                });

            } else {
                if (sound)
                    this.game.audioManager.playSound('pop');
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

    /**
     * masque la popin affichée. Retourne une promesse lorsque la popin a fini de disparaitre
     */
    hide() {
        return new Promise((resolve, reject) => {
            let tween = this.game.add.tween(this.textGroup).to({ y: this.game.world.height }, 300, "Linear").start();
            tween.onComplete.add(() => {
                this.currentTextGroup = null;
                resolve(true);
            }, this);
        });
    }

    /**
     * Si une popin est actuellement affichée, retourne la popin, sinon null
     */
    isShowing() {
        return this.currentTextGroup;
    }
}