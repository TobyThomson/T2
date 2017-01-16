var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

var LobbyManager = require('./lobby-manager.js');

server.listen(4000);

app.use(express.static('../'));

app.get('/', function (req, res) {
	  res.sendFile(path.join(__dirname + '../index.html'));
});

var lobbyConfig = {
    name: "T2 Lobby",
    minOpenRooms: 0,
    maxRooms: 6,
    roomOptions: {
        softMemberCap: 1,
        memberCap: 2,
        isOpen: true,
        closeOnFull: true,
        endOnCloseAndEmpty: true,
        openWhenNotFull: false
    }
};

var lobbyManager = new LobbyManager(lobbyConfig, io);
