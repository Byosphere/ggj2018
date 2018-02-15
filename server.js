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
server.debugLobby = 'L_DEBUG';
server.lobbies = [];
server.lobbies[server.debugLobby] = { players: [{ id: 0, selectedHero: 'fleur', position: 'fleur' }, null], buttonsState: [], exitCount: 0, playerCount: 1, levelReady: 1 }
/*
idées pour la gestion des lobby
{
    '012546' : {players: [null, null], buttonsState: ['red' : true, 'orange' : false], exitCount: 0 },
    '649822' : {},
    '586136' : {}
    ...
}
*/

io.on('connection', function (socket) {

    socket.on('init', function () {
        socket.emit('init');
    });

    socket.on('newlobby', function () {
        let code = '';
        do {
            code = Math.floor((Math.random() * 900000) + 100000);

        } while (server.lobbies['L_' + code]);

        socket.emit('newlobby', code);
        code = 'L_' + code;
        server.lobbies[code] = { players: [null, null], buttonsState: [], exitCount: 0, playerCount: 1, levelReady: 0 };
        socket.join(code);
        socket.code = code;
    });

    socket.on('joinlobby', function (code) {

        code = 'L_' + code;
        if (!code || !server.lobbies[code] || server.lobbies[code].playerCount === 2) return;
        server.lobbies[code].playerCount++;
        socket.join(code);
        socket.code = code;
        socket.emit('joinlobby', true);
    });

    // initialisation d'un nouveau joueur
    socket.on('newplayer', function () {
        if (server.lobbies[socket.code].players[0] && server.lobbies[socket.code].players[1]) return;
        let id = server.lobbies[socket.code].players[0] ? 1 : 0;

        socket.player = {
            id: id,
            selectedHero: false,
            position: 'fleur',
            levelSelect: null,
            levelPosition: 0,
            world: 1
        };
        server.lobbies[socket.code].players[id] = socket.player;
        socket.emit('newplayer', socket.player, server.lobbies[socket.code].players);
        socket.broadcast.to(socket.code).emit('newplayer', null, server.lobbies[socket.code].players);
    });

    // selection d'un personnage par un joueur sur l'écran titre
    socket.on('selecthero', function (selectedHero) {
        server.lobbies[socket.code].players[socket.player.id].selectedHero = selectedHero;
        socket.emit('updateplayers', server.lobbies[socket.code].players);
        socket.broadcast.to(socket.code).emit('updateplayers', server.lobbies[socket.code].players);
        if (server.lobbies[socket.code].players[0] && server.lobbies[socket.code].players[0].selectedHero && server.lobbies[socket.code].players[1] && server.lobbies[socket.code].players[1].selectedHero) {
            socket.emit('startgame');
            socket.broadcast.to(socket.code).emit('startgame');
        }
    });

    // mets à jour la position du curseur d'un joueur sur l'écran titre
    socket.on('updateposition', function (position) {
        server.lobbies[socket.code].players[socket.player.id].position = position;
        socket.broadcast.to(socket.code).emit('updateplayers', server.lobbies[socket.code].players);
    });

    socket.on('updatelevelselect', function (levelPosition, levelSelect, world) {
        let player = server.lobbies[socket.code].players[socket.player.id];
        player.levelPosition = levelPosition;
        player.levelSelect = levelSelect;
        player.world = world;
        socket.broadcast.to(socket.code).emit('updateplayers', server.lobbies[socket.code].players);
        socket.emit('updateplayers', server.lobbies[socket.code].players);
        if (server.lobbies[socket.code].players[0].levelSelect > 0
            && server.lobbies[socket.code].players[1].levelSelect > 0
            && server.lobbies[socket.code].players[0].levelSelect === server.lobbies[socket.code].players[1].levelSelect
            && server.lobbies[socket.code].players[0].world === server.lobbies[socket.code].players[1].world) {
            socket.broadcast.to(socket.code).emit('startlevel');
            socket.emit('startlevel');
        }
    });

    // reset le niveau en cours
    socket.on('reset', function (gameover) {
        gameover = gameover || false;
        server.lobbies[socket.code].exitCount = 0;
        server.lobbies[socket.code].levelReady = 0;
        server.lobbies[socket.code].buttonsState = [];
        if (gameover)
            socket.emit('reset', gameover);

        socket.broadcast.to(socket.code).emit('reset', gameover);
    });

    socket.on('levelready', (debug) => {
        if (debug) {
            socket.code = server.debugLobby;
            socket.emit('startlevel');
        } else {
            server.lobbies[socket.code].levelReady++;
            if (server.lobbies[socket.code].levelReady === 2) {
                socket.broadcast.to(socket.code).emit('startlevel');
                socket.emit('startlevel');
            }
        }
    });

    //disconnect
    socket.on('disconnect', function () {
        if (socket.player) {
            io.to(socket.code).emit('disconnect');
            server.lobbies[socket.code].playerCount--;
            server.lobbies[socket.code].players[socket.player.id] = null;
            socket.leave(socket.code);
        }
    });

    // Interrupteur actif 
    socket.on('pressbutton', function (color) {
        if (server.lobbies[socket.code].buttonsState[color]) {
            server.lobbies[socket.code].buttonsState[color]++;
        } else {
            server.lobbies[socket.code].buttonsState[color] = 1;
        }
        socket.broadcast.to(socket.code).emit('opendoor', color);
        socket.emit('opendoor', color);
    });

    // Interrupteur inactif 
    socket.on('releasebutton', function (color) {
        if (server.lobbies[socket.code].buttonsState[color]) {
            server.lobbies[socket.code].buttonsState[color]--;
        }
        if (!server.lobbies[socket.code].buttonsState[color]) {
            socket.broadcast.to(socket.code).emit('closedoor', color);
            socket.emit('closedoor', color);
        }
    });

    // player on exit spot
    socket.on('inexit', function () {
        server.lobbies[socket.code].exitCount++;
        if (server.lobbies[socket.code].exitCount === 2) {
            socket.emit('levelcompleted');
            socket.broadcast.to(socket.code).emit('levelcompleted');
        }
    });

    // player out of exit spot
    socket.on('outexit', function () {
        if (server.lobbies[socket.code].exitCount > 0)
            server.lobbies[socket.code].exitCount--;
    });

    socket.on('finishlevel', function () {
        server.lobbies[socket.code].exitCount = 0;
        server.lobbies[socket.code].levelReady = 0;
        server.lobbies[socket.code].buttonsState = [];
    });
});