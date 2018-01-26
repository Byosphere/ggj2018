var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/css',express.static(__dirname + '/public/css'));
app.use('/js',express.static(__dirname + '/public/js'));
app.use('/assets',express.static(__dirname + '/public/assets'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

server.listen(process.env.PORT || 8081, function () {
    console.log('Listening on ' + server.address().port);
});

server.lastPlayderID = 0;

io.on('connection', function (socket) {

    socket.on('newplayer', function () {
        socket.player = {
            id: server.lastPlayderID++
        };
        console.log('newPlayer ' + socket.player.id);
    });
});