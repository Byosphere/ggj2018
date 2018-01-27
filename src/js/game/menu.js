var GameMenu = function (game) {
    this.game = game;
};

GameMenu.prototype = {


    preload: function () {
        this.fleur = {data:null, ready:false};
        this.coli = {data:null, ready:false};
    },

    create: function () {
        console.log('menu');
        this.createBackground();
        this.createTitle();
        this.createCharacters();
        Client.askNewPlayer();
    },

    setNewPlayer: function (data) {
        if (this.fleur.data == null) {
            this.fleur.data = data;
            this.activateHero('fleur');
        } else if (this.coli.data == null) {
            this.coli.data = data;
            this.activateHero('coli');
        } else {
            console.log('error : 2 players are already connected');
        }
    },
    activateHero: function (hero) {
        switch (hero) {
            case 'fleur':
                console.log('ajout de fleur');
                break;

            case 'coli':
                console.log('ajout de coli');
                break;
        }
    },

    createBackground: function() {

    },

    createCharacters: function() {

    },

    createTitle: function() {

    }
};