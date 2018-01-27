/* Client - server transmissions functions */

var Client = {};
Client.socket = io.connect();

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

Client.socket.on('newplayer',function(data){
    GameMenu.setNewPlayer(data);
});

Client.socket.on('allplayers',function(data){
    
    for(var i = 0; i < data.length; i++){
        GameMenu.setNewPlayer(data[i]);
    }

    Client.socket.on('move',function(data){
        //move
    });

    Client.socket.on('remove',function(id){
        //remove
    });
});