class GameMenu {

    constructor() {
        this.fleur = { data: null, ready: false };
        this.coli = { data: null, ready: false };
    }

    preload() {

    }

    create() {
        this.createBackground();
        this.createTitle();
        this.createCharacters();
        let that = this;
        game.socket.emit('newplayer');
        game.socket.on('newplayer', function (data) {
            that.setNewPlayer(data);
        });
        game.socket.on('allplayers', function (data) {
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                that.setNewPlayer(data[i]);
            }
        });
    }

    setNewPlayer(data) {
        if (this.fleur.data == null) {
            this.fleur.data = data;
            this.activateHero('fleur');
        } else if (this.coli.data == null) {
            this.coli.data = data;
            this.activateHero('coli');
        } else {
            console.log('error : 2 players are already connected');
        }
    }

    activateHero(hero) {
        switch (hero) {
            case 'fleur':
                this.fleurSprite.alpha = 1;

                break;

            case 'coli':
                this.coliSprite.alpha = 1;
                break;
        }
    }

    createBackground() {

    }

    createCharacters() {
        this.coliSprite = game.add.sprite((game.world.centerX / 2) - (HEROWIDTH / 2), game.world.height - MENU_HEROS_POS_Y, 'coli');
        this.fleurSprite = game.add.sprite(game.world.centerX + (game.world.centerX / 2) - (HEROWIDTH / 2), game.world.height - MENU_HEROS_POS_Y, 'fleur');
        this.coliSprite.alpha = 0.3;
        this.fleurSprite.alpha = 0.3;
    }

    createTitle() {

    }

}