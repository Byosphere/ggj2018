var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/assets', express.static(__dirname + '/public/assets'));
app.use('/fonts', express.static(__dirname + '/public/fonts'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

server.listen(process.env.PORT || 8081, function () {
    console.log('Listening on ' + server.address().port);
});

server.lobby = {};
/*
idées pour la gestion des lobby
{
    '012546' : {players: [null, null], buttonsState: ['red' : true, 'orange' : false], exitCount: 0 },
    '649822' : {},
    '586136' : {}
    ...
}
*/
server.exitCount = 0;
server.players = [null, null];

io.on('connection', function (socket) {

    socket.on('init', function(){
        socket.emit('init');
    }) ;
 
    // initialisation d'un nouveau joueur
    socket.on('newplayer', function () {
        if (server.players[0] && server.players[1]) return;
        let id = server.players[0] ? 1 : 0;

        socket.player = {
            id: id,
            selectedHero: false,
            position: 'fleur'
        };
        server.players[id] = socket.player;
        socket.emit('newplayer', socket.player, server.players);
        socket.broadcast.emit('newplayer', null, server.players);
    });

    // selection d'un personnage par un joueur sur l'écran titre
    socket.on('selecthero', function (selectedHero) {
        server.players[socket.player.id].selectedHero = selectedHero;
        socket.emit('updateplayers', server.players);
        socket.broadcast.emit('updateplayers', server.players);
        if (server.players[0] && server.players[0].selectedHero && server.players[1] && server.players[1].selectedHero) {
            socket.emit('startgame');
            socket.broadcast.emit('startgame');
        }
    });

    // mets à jour la position du curseur d'un joueur sur l'écran titre
    socket.on('updateposition', function (position) {
        server.players[socket.player.id].position = position;
        socket.broadcast.emit('updateplayers', server.players);
        console.log(server.players);
    });

    // reset le niveau en cours
    socket.on('reset', function() {
        socket.broadcast.emit('reset');
    });

    //disconnect
    socket.on('disconnect', function () {
        if (socket.player) {
            io.emit('disconnect');
            server.playerCount--;
            server.players[socket.player.id] = null;
        }
    });

    // Interrupteur actif 
    socket.on('opendoor', function (color) {
        socket.broadcast.emit('opendoor', color);
        socket.emit('opendoor', color);
    });

    // Interrupteur inactif 
    socket.on('closedoor', function (color) {
        socket.broadcast.emit('closedoor', color);
        socket.emit('closedoor', color);
    });

    // player on exit spot
    socket.on('inexit', function () {
        server.exitCount++;
        if (server.exitCount === 2) {
            socket.emit('success');
            socket.broadcast.emit('success');
        }
    });

    // player out of exit spot
    socket.on('outexit', function () {
        server.exitCount--;
    });

    socket.on('resetexit', function () {
        server.exitCount = 0;
    });

});