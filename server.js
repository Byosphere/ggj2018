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

app.get('/instructions', function (req, res) {
    res.sendFile(__dirname + '/public/howtoplay.html');
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

    // ---------------------------- LOBBY STATE ------------------------------------ //

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
    // ----------------------------------------------------------------------------- //

    // ---------------------------- MAINMENU STATE ------------------------------------ //
    // initialisation d'un nouveau joueur
    socket.on('newplayer', function () {
        if (server.lobbies[socket.code].players[0] && server.lobbies[socket.code].players[1]) return;
        let id = server.lobbies[socket.code].players[0] ? 1 : 0;
        socket.player = { id: id };
        server.lobbies[socket.code].players[id] = socket.player;
        socket.emit('newplayer', server.lobbies[socket.code].players);
        socket.broadcast.to(socket.code).emit('newplayer', server.lobbies[socket.code].players);
        if (server.lobbies[socket.code].players[0] && server.lobbies[socket.code].players[1]) {
            socket.emit('startgame');
            socket.broadcast.to(socket.code).emit('startgame');
        }
    });

    // ----------------------------------------------------------------------------- //

    socket.on('selectlevel', function (levelData) {
        server.lobbies[socket.code].players[socket.player.id].levelData = levelData;
        let player1 = server.lobbies[socket.code].players[0];
        let player2 = server.lobbies[socket.code].players[1];
        if (player1.levelData && player2.levelData
            && player1.levelData.world === player2.levelData.world
            && player1.levelData.pos === player2.levelData.pos
            && player1.levelData.heros && player2.levelData.heros
            && player1.levelData.heros != player2.levelData.heros) {
            player1.levelData = null;
            player2.levelData = null;
            socket.emit('startlevel');
            socket.broadcast.to(socket.code).emit('startlevel');
        } else {
            socket.broadcast.to(socket.code).emit('updateplayers', levelData);
        }
    });

    socket.on('unselectlevel', function () {
        server.lobbies[socket.code].players[socket.player.id].levelData.heros = null;
        socket.broadcast.to(socket.code).emit('updateplayers', server.lobbies[socket.code].players[socket.player.id].levelData);
    });

    socket.on('updatelevel', function (levelData) {
        socket.broadcast.to(socket.code).emit('updateplayers', levelData);
    })
    // ---------------------------- GAME STATE ------------------------------------ //
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

    socket.on('quit', () => {
        if (socket.player) {
            io.to(socket.code).emit('disconnect');
            server.lobbies[socket.code].playerCount--;
            server.lobbies[socket.code].players[socket.player.id] = null;
            socket.leave(socket.code);
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

    socket.on('backmenu', function () {
        server.lobbies[socket.code].exitCount = 0;
        server.lobbies[socket.code].levelReady = 0;
        server.lobbies[socket.code].buttonsState = [];
        socket.broadcast.to(socket.code).emit('backmenu');
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
        } else {
            socket.broadcast.to(socket.code).emit('inexit', socket.player);
        }
    });

    // player out of exit spot
    socket.on('outexit', function () {
        if (server.lobbies[socket.code].exitCount > 0) {
            server.lobbies[socket.code].exitCount--;
            socket.broadcast.to(socket.code).emit('outexit', socket.player);
        }
    });

    socket.on('finishlevel', function () {
        if (server.lobbies[socket.code].levelReady === 2) {
            server.lobbies[socket.code].exitCount = 0;
            server.lobbies[socket.code].levelReady = 0;
            server.lobbies[socket.code].buttonsState = [];
        }
    });
    // ----------------------------------------------------------------------------- //
});