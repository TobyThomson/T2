var notie = require('notie');
var io = require('socket.io-client');
var Game = require('./game.js');

var _socket;

var isOnline;
var isHost;

var gameStarted = false;

var _game;

var title = document.getElementById("title");
var main = document.getElementById("main");
var startPage = document.getElementById("start-page");
var hostGameButton = document.getElementById("host-game-button");
var joinGameButton = document.getElementById("join-game-button");
var localGameButton = document.getElementById("local-game-button");
var gamePage = document.getElementById("game-page");
var backButton = document.getElementById("back-button");
var board = document.getElementById("board");

var boardGridColor = "#0dab76";
var subBoardSquareColor = "#e0e0e2";
var playerOneColor = "#2e86ab";
var playerTwoColor = "#e71d36";

var boardSize;
var sectionSize;
var subBoardSquareSize;

var subBoardSquareSizePercent = 8;
var subBoardSquareRadius = 4;

var stage = new createjs.Stage(board);

hostGameButton.addEventListener("click", function() {
    notie.input({
        type: 'text',
        allowed: ['a'],
        prefilledValue: 'Sly Jim',
    }, 'Who are you?', 'Host', 'X', function(valueEntered) {
            isOnline = true;
            isHost = true;

            setupGame({name: valueEntered});
        }, function(valueEntered) {
            notie.alertHide();
    });
});

joinGameButton.addEventListener("click", function() {
    notie.input({
        type: 'text'
    }, 'Your your name and game code sepearted by a comma?', 'Join', 'X', function(valueEntered) {
            var name = valueEntered.split(',')[0];
            var id  = valueEntered.split(',')[1];

            isOnline = true;
            isHost = false;

            setupGame({name: name, id: id});
        }, function(valueEntered) {
            notie.alertHide();
    });
});

localGameButton.addEventListener("click", function() {
    isOnline = false;
    gameStarted = true;

    setupGame();
});

backButton.addEventListener("click", function() {
    exitGame();
});

function setupGame(options) {
    _game = new Game();

    if (isOnline) {
        _socket = io.connect();

        _socket.on('connect', function() {
            _socket.emit('register_player', { name: options.name } );

            _socket.on('register_player', function (data) {
                if (isHost) {
                    _socket.emit('create_room');
                } else {
                    _socket.emit('join_room', { id: options.id } );
                }
            });

            _socket.on('create_room', function (data) {
                _socket.emit('join_room', { id: data.id } );
            });

            _socket.on('join_room', function (data) {
                if (data.error == 'room not found') {
                    notie.alert(3, 'No such game I\'m afraid');
                    _socket.disconnect();
                } else {
                    if (isHost) {
                        updateTitleText({text: 'Your room code is: ' + data.id});
                    }

                    startGame();
                }
            });

            _socket.on('start_game', function (data) {
                updateTitleText({text: data.playerOneName + ' Vs.' + data.playerTwoName + ' (' + data.playerOneName + ' may play anywhere)'});

                gameStarted = true;
            });

            _socket.on('try_move', function (data) {
                _game.updateGame(data);

                drawBoard();

                updateTitleText({type: 'online game', playerName: data.playerTurnName});
            });

            _socket.on('player_left', function (data) {
                exitGame();

                notie.alert(3, 'It seems there is some bad feeling...');
            });

            _socket.on('player_won', function (data) {
                var id = data.id;
                var name = data.name;

                endGame(id, name);
            });
        });
    } else {
        startGame();

        updateTitleText({type: 'local game'});
    }
}

window.onresize = function(event) {
    drawResponsiveElements();
};

function startGame(json) {
    startPage.style.display = "none";
    gamePage.style.display = "block";
    backButton.style.display = "block";

    drawResponsiveElements();
}

function endGame(id, name) {
    if (id == _id) {
        notie.alert(1, 'You won!');
    } else {
        notie.alert(3, 'Looks like ' + name + ' has won!');
    }

    var tryExit = function(){
        if(condition){
            exitGame();
        }
        else {
            setTimeout(tryExit, 3000);
        }
    }

    tryExit();
}

function exitGame() {
    if (_socket != undefined) {
        _socket.disconnect();
    }

    _game = null;

    isOnline = false;
    isHost = false;

    updateTitleText({type: 'menu'});

    startPage.style.display = "block";
    gamePage.style.display = "none";
    backButton.style.display = "none";
}

function drawBoard() {
    stage.removeAllChildren();

    drawBoardLines();
    drawBoardSubBoards();

    stage.update();
}

function updateTitleText(options) {
    var text = title.innerHTML;
    console.log(options);

    if (options.text != null) {
        text = options.text;
    }
    if (options.type == 'menu') {
        text = '<span>T<sup>2</sup></span>';
    } else {
        var playPosition = '(You may play in any square)';

        if (_game.currentSubBoard != 'all') {
            playPosition = '(You may play in square ' + (_game.currentSubBoard + 1) + ')';
        }

        if (options.type == 'local game') {
            text = "<span>Player " + _game.playerTurn + "\'s Turn " + playPosition + '</span>';
        } else if (options.type == 'online game') {
            text = '<span>' + options.playerName + '\'s Turn ' + playPosition + '</span>';
        }
    }

    title.innerHTML = text;
}

function drawResponsiveElements() {
    backButton.style.width = backButton.clientHeight;
    backButton.style.lineHeight = backButton.style.width;

    if ((main.clientWidth - main.clientHeight) < 0) {
        board.style.width = (main.clientWidth * 0.9);
        board.clientHeight = board.clientWidth;
    }

    else {
        board.style.height = (main.clientHeight * 0.9);
        board.style.width = board.clientHeight;
    }

    boardSize = board.clientHeight;
    sectionSize = boardSize / 3;
    subBoardSquareSize = boardSize * (subBoardSquareSizePercent / 100);

    board.width = boardSize;
    board.height = boardSize;

    drawBoard();
}

function drawBoardLines() {
  var lineStart = 4;
  var lineLength = boardSize - 5;

  var grid = new createjs.Shape();

  grid.graphics.setStrokeStyle(10, "round").beginStroke(boardGridColor);

  for (var y = 1; y <= 2; y++) {
    grid.graphics.moveTo(lineStart, y * sectionSize);
    grid.graphics.lineTo(lineLength, y * sectionSize);
  }

  for (var x = 1; x <= 2; x++) {
    grid.graphics.moveTo(x * sectionSize, lineStart);
    grid.graphics.lineTo(x * sectionSize, lineLength);
  }

  stage.addChild(grid);

  grid.graphics.endStroke();
}

function drawBoardSubBoards() {
    var squareSpacing = ((sectionSize - (subBoardSquareSize * 3)) / 4);

    var x = squareSpacing;
    var y = squareSpacing;

    for (var subBoard = 0; subBoard < 9; subBoard++) {
        for (var row = 0; row < 3; row++) {
            for (var columb = 0; columb < 3; columb++) {
                var square = new createjs.Shape();

                square.name = subBoard + "," + row + "," + columb;

                square.x = x;
                square.y = y;

                var squareColor = subBoardSquareColor;

                if (_game.occupiedSquares[subBoard][row][columb] == 1) {
                    squareColor = playerOneColor;
                }

                else if (_game.occupiedSquares[subBoard][row][columb] == 2) {
                    squareColor = playerTwoColor;
                }

                square.graphics.beginFill(squareColor).drawRoundRect(0, 0, subBoardSquareSize, subBoardSquareSize, subBoardSquareRadius).endFill();

                square.addEventListener("click", function(event) {
                    if (gameStarted) {
                        var squarePosition = event.target.name.split(",");

                        var subBoard = parseInt(squarePosition[0]);
                        var row = parseInt(squarePosition[1]);
                        var columb = parseInt(squarePosition[2]);

                        if(isOnline) {
                            _socket.emit('try_move', {subBoard: subBoard, row: row, columb: columb});
                        } else {
                            var result = _game.tryMove(subBoard, row, columb);

                            if (result == 'move allowed') {
                                drawBoard();

                                updateTitleText({type: 'local game'});
                            }
                        }
                    }
                });

                stage.addChild(square);

                x += subBoardSquareSize + squareSpacing;
            }

            x -= ((squareSpacing + subBoardSquareSize) * 3);
            y += subBoardSquareSize + squareSpacing;
        }

        if (((subBoard + 1) % 3) == 0) {
            x = squareSpacing;
        }

        else {
            x += sectionSize;
        }

        y = (sectionSize * (((subBoard + 1) - ((subBoard + 1) % 3)) / 3)) + squareSpacing;
    }
}
