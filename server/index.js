var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

var shortid = require('shortid');

var Game = {
	room: '',
	players: [],
};

app.listen(3000, function () {
	  console.log('Server started...');
});

app.use(express.static('../browser'));

app.get('/', function (req, res) {
	  res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/host-game', function (req, res) {
	var room = shortid.generate().toUpperCase();
	var playerId = shortid.generate();

    var players = [{
			id: playerId,
			name: req.body,
			status: 'joined'
		},{
			id: shortid.generate(),
			name: '',
			status: 'open'
	}];

	Game.room = room;
    Game.players = players;

    var data = JSON.stringify(Game);

    data.action = 'host-game';
    data.player = playerId;

    res.send(data);
});

app.post('/join-game', function (req, res) {
	var room = req.body;
    console.log(room);
});
