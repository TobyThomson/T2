var Lobby = require('./lobby.js');
var Member = require('./member.js');

function LobbyManager(options, io) {
    this.io = io;
    this.options = options;
    this._initLobby();
}

LobbyManager.prototype = {
    constructor: LobbyManager,

    _initLobby: function() {
        var self = this;
        var lobby = this.lobby = new Lobby(this.options);

        this.handleConnections();
    },

    handleConnections: function() {
        var self = this;

        this.io.on('connection', function(socket) {
            var member = null;
            var room = null;

            socket.on('disconnect', function() {
                if (room) {
                    room.removeMember(member);
                    self.io.to(room.id).emit('player_left', {});

                    console.log(' > Member', member.id, 'left room', room.id);
                }

                console.log(' > Member destroyed', member.id);
            });

            socket.on('register_player', function(data) {
                member = new Member({ name: data.name });

                socket.emit('register_player', {});

                console.log(' > Member created', member.id);
            });

            socket.on('create_room', function(data) {
                room = self.lobby.createRoom(self.options.roomOptions);

                socket.emit('create_room', {id: room.id});

                console.log(' > New room created (', room.id, ') by', member.id);
            });

            socket.on('join_room', function(data) {
                room = self.lobby.rooms[data.id];

                if (room == undefined) {
                    socket.emit('join_room', {error: 'room not found'});
                    return;
                }

                room.addMember(member);

                socket.join(room.id);

                socket.emit('join_room', {id: room.id});

                console.log(' > Player', member.id, 'joined room', room.id);

                if (room.allMembers.length == 2) {
                    self.io.to(room.id).emit('start_game', {
                        playerOneName: room.allMembers[0].name,
                        playerTwoName: room.allMembers[1].name
                    });

                    console.log(' > Room', room.id, 'has begun a game!');
                }
            });

            socket.on('try_move', function(data) {
                if (room.allMembers[room.game.playerTurn - 1].name == member.name) {
                    var result = room.game.tryMove(data.subBoard, data.row, data.columb);

                    if (result == 'move allowed') {
                        self.io.to(room.id).emit('try_move', {
                            currentSubBoard: room.game.currentSubBoard,
                            occupiedSquares: room.game.occupiedSquares,
                            capturedBoards: room.game.capturedBoards,
                            playerTurn: room.game.playerTurn,
                            playerTurnName: room.allMembers[room.game.playerTurn - 1].name
                        });

                        console.log(' > Move made by player', member.id, 'of room', room.id);
                    }
                }
            });
        })
    }
};

module.exports = LobbyManager;
