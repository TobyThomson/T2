function Game() {
    this.currentSubBoard = 'all';
    this.occupiedSquares = [];
    this.capturedBoards = [];
    this.playerTurn = 1;

    this.createGame();
}

Game.prototype = {
    constructor: Game,

    createGame: function() {
        for (var subBoard = 0; subBoard < 9; subBoard++) {
            this.occupiedSquares.push([]);
            this.capturedBoards.push(0);

            for (var row = 0; row < 3; row++) {
                this.occupiedSquares[subBoard].push([]);

                for (var columb = 0; columb < 3; columb++) {
                    this.occupiedSquares[subBoard][row].push(0);
                }
            }
        }
    },

    updateGame: function(data) {
        this.currentSubBoard = data.currentSubBoard;
        this.occupiedSquares = data.occupiedSquares;
        this.capturedBoards = data.capturedBoards;
        this.playerTurn = data.playerTurn;
    },

    tryMove: function(subBoard, row, columb) {
        if (subBoard == this.currentSubBoard || this.currentSubBoard == 'all') {
            if (this.occupiedSquares[subBoard][row][columb] == 0) {
                this.makeMove(subBoard, row, columb);

                return 'move allowed';
            }
        }
    },

    makeMove: function(subBoard, row, columb) {
        this.occupiedSquares[subBoard][row][columb] = this.playerTurn;

        if (this.playerTurn == 1) {
            this.playerTurn = 2;
        } else if (this.playerTurn == 2) {
            this.playerTurn = 1;
        }

        var selectedSubBoard = ((row * 3) + columb);

        this.setCurrentSubBoard(selectedSubBoard);
    },

    setCurrentSubBoard: function(selectedSubBoard) {
        var subBoardFilled = true;

        for (var row = 0; row < 3; row++) {
            for (var columb = 0; columb < 3; columb++) {
                if (this.occupiedSquares[selectedSubBoard][row][columb] == 0) {
                    subBoardFilled = false;
                }
            }
        }

        if (subBoardFilled) {
            this.currentSubBoard = 'all';
        } else {
            this.currentSubBoard = selectedSubBoard;
        }
    }
};

module.exports = Game;
