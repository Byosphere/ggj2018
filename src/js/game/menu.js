class GameMenu {

    constructor() {
        this.fleur = {data:null, ready:false};
        this.coli = {data:null, ready:false};
    }

    preload() {

    }

    create() {
        this.createBackground();
        this.createTitle();
        this.createCharacters();
        let that = this;
        game.socket.emit('newplayer');
        game.socket.on('newplayer',function(data){
            that.setNewPlayer(data);
        });
        game.socket.on('allplayers',function(data){
            console.log(data);
            for(var i = 0; i < data.length; i++){
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
                console.log('ajout de fleur');
                break;

            case 'coli':
                console.log('ajout de coli');
                break;
        }
    }

    createBackground() {

    }

    createCharacters() {
        this.fleur = game.add.sprite(300, 200, 'fleur');
        this.coli = game.add.sprite(800, 200, 'coli');
    }

    createTitle() {

    }

}