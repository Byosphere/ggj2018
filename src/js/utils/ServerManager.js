/**
 * Ecouteurs serveur :
 * onGameInit
 * onNewLobby
 * onJoinLobby
 */
class ServerManager {

    constructor(game) {
        this.game = game;
        this.callbackContext = null;
        this.socket = io(IO_CONNEXION);
        this.addListeners();
    }

    setCallbackContext(context) {
        this.callbackContext = context;
    }

    addListeners() {
        this.socket.on('init', () => {
            if (this.callbackContext && this.callbackContext.onGameInit)
                this.callbackContext.onGameInit();
        });

        this.socket.on('newlobby', (code) => {
            if (this.callbackContext && this.callbackContext.onNewLobby)
                this.callbackContext.onNewLobby(code);
        });

        this.socket.on('joinlobby', (success) => {
            if (this.callbackContext && this.callbackContext.onJoinLobby)
                this.callbackContext.onJoinLobby(success);
        });

        this.socket.on('newplayer', (self, playerList) => {
            if (this.callbackContext && this.callbackContext.onInitNewPlayer)
                this.callbackContext.onInitNewPlayer(self, playerList);
        });

        this.socket.on('updateplayers', (playerList) => {
            if (this.callbackContext && this.callbackContext.onUpdatePlayers)
                this.callbackContext.onUpdatePlayers(playerList);
        });

        this.socket.on('startgame', () => {
            if (this.callbackContext && this.callbackContext.onStartGame)
                this.callbackContext.onStartGame();
        });

        this.socket.on('disconnect', () => {
            if (this.callbackContext && this.callbackContext.onDisconnect)
                this.callbackContext.onDisconnect();
        });

        this.socket.on('opendoor', (color) => {
            if (this.callbackContext && this.callbackContext.onOpenDoor)
                this.callbackContext.onOpenDoor(color);
        });

        this.socket.on('closedoor', (color) => {
            if (this.callbackContext && this.callbackContext.onCloseDoor)
                this.callbackContext.onCloseDoor(color);
        });

        this.socket.on('receiveitem', (itemData) => {
            if (this.callbackContext && this.callbackContext.onReceiveItem)
                this.callbackContext.onReceiveItem(itemData);
        });

        this.socket.on('inexit', (player) => {
            if (this.callbackContext && this.callbackContext.onInExit)
                this.callbackContext.onInExit(player);
        });

        this.socket.on('outexit', (player) => {
            if (this.callbackContext && this.callbackContext.onOutExit)
                this.callbackContext.onOutExit(player);
        });

        this.socket.on('reset', (gameover) => {
            if (this.callbackContext && this.callbackContext.onResetLevel)
                this.callbackContext.onResetLevel(gameover);
        });

        this.socket.on('levelcompleted', () => {
            if (this.callbackContext && this.callbackContext.onLevelCompleted)
                this.callbackContext.onLevelCompleted();
        });

        this.socket.on('startlevel', () => {
            if (this.callbackContext && this.callbackContext.onStartLevel)
                this.callbackContext.onStartLevel();
        });

        this.socket.on('backmenu', () => {
            if (this.callbackContext && this.callbackContext.onBackToMenu)
                this.callbackContext.onBackToMenu();
        });
    }

    getSocket() {
        return this.socket;
    }
}