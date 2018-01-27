var GameMenu = {};

GameMenu.preload = function () {
    GameMenu.fleur = {data:null, ready:false};
    GameMenu.coli = {data:null, ready:false};
};

GameMenu.create = function () {
    this.createBackground();
    this.createTitle();
    this.createCharacters();
    Client.askNewPlayer();
};

GameMenu.setNewPlayer = function (data) {
    if (GameMenu.fleur.data == null) {
        GameMenu.fleur.data = data;
        GameMenu.activateHero('fleur');
    } else if (GameMenu.coli.data == null) {
        GameMenu.coli.data = data;
        GameMenu.activateHero('coli');
    } else {
        console.log('error : 2 players are already connected');
    }
};
    
GameMenu.activateHero = function (hero) {
    switch (hero) {
        case 'fleur':
            console.log('ajout de fleur');
            break;

        case 'coli':
            console.log('ajout de coli');
            break;
    }
};

GameMenu.createBackground = function() {

};

GameMenu.createCharacters = function() {

};

GameMenu.createTitle = function() {

};