var BoardGridColor = "#0dab76";
var BackGroundColor = "#f4f4f4";
var SubBoardSquareColor = "#e0e0e2";
var PlayerOneColor = "#2e86ab";
var PlayerTwoColor = "#e71d36";

var SubBoardSquareSizePercent = 8;
var SubBoardSquareRadius = 4;

var title = document.getElementById("title");
var main = document.getElementById("main");
var startPage = document.getElementById("start-page");
var onlineGameButton = document.getElementById("online-game-button");
var localGameButton = document.getElementById("local-game-button");
var gamePage = document.getElementById("game-page");
var backButton = document.getElementById("back-button");
var board = document.getElementById("board");

var stage = new createjs.Stage(board);

var boardSize;
var sectionSize;
var SubBoardSquareSize;

var CurrentSubBoard = "all";
var OccupiedSquares = [];
var CapturedBoards = [];
var PlayerTurn = 1;

localGameButton.addEventListener("click", function(){
    startPage.style.display = "none";
    gamePage.style.display = "block";
    backButton.style.display = "block";

    updateTitleText();
    drawResponsiveElements();
});

backButton.addEventListener("click", function(){
    goBackToMenu();
});

function goBackToMenu() {
    startPage.style.display = "block";
    gamePage.style.display = "none";
    backButton.style.display = "none";

    title.textContent = "UTTT";
}

function resetGame() {
    CurrentSubBoard = "all";
    OccupiedSquares = [];
    CapturedBoards = [];
    PlayerTurn = 1;
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
    SubBoardSquareSize = boardSize * (SubBoardSquareSizePercent / 100);

    board.width = boardSize;
    board.height = boardSize;

    stage.removeAllChildren();

    drawLines();
    drawSubBoards();

    stage.update();
}

function drawLines() {
  var lineStart = 4;
  var lineLength = boardSize - 5;

  var grid = new createjs.Shape();

  grid.graphics.setStrokeStyle(10, "round").beginStroke(BoardGridColor);

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

function drawSubBoards() {
    var squareSpacing = ((sectionSize - (SubBoardSquareSize * 3)) / 4);

    var x = squareSpacing;
    var y = squareSpacing;

    for (var subBoard = 1; subBoard <= 9; subBoard++) {
        OccupiedSquares.push([]);
        CapturedBoards.push(0);

        for (var row = 0; row < 3; row++) {
            OccupiedSquares[(subBoard - 1)].push([]);

            for (var columb = 0; columb < 3; columb++) {
                var square = new createjs.Shape();

                square.name = (subBoard - 1) + "," + row + "," + columb;

                square.x = x;
                square.y = y;

                square.graphics.beginFill("#c8c8c8").drawRoundRect(0, 0, SubBoardSquareSize, SubBoardSquareSize, SubBoardSquareRadius).endFill();

                square.addEventListener("click", function(event) {
                    var squarePosition = event.target.name.split(",");

                    var subBoard = parseInt(squarePosition[0]);
                    var row = parseInt(squarePosition[1]);
                    var columb = parseInt(squarePosition[2]);

                    tryMove(subBoard, row, columb);
                });

                stage.addChild(square);

                OccupiedSquares[(subBoard - 1)][row].push(0);

                x += SubBoardSquareSize + squareSpacing;
            }

            x -= ((squareSpacing + SubBoardSquareSize) * 3);
            y += SubBoardSquareSize + squareSpacing;
        }

        if ((subBoard % 3) == 0) {
            x = squareSpacing;
        }

        else {
            x += sectionSize;
        }

        y = (sectionSize * ((subBoard -(subBoard % 3)) / 3)) + squareSpacing;
    }
}

function tryMove(subBoard, row, columb) {
    if (subBoard == CurrentSubBoard || CurrentSubBoard == "all") {
        if (OccupiedSquares[subBoard][row][columb] == 0) {
            makeMove(subBoard, row, columb);
        }
    }
}

function makeMove(subBoard, row, columb) {
    OccupiedSquares[subBoard][row][columb] = PlayerTurn;

    var square = stage.getChildByName(subBoard + "," + row + "," + columb);

    var playerColor = PlayerOneColor;

    if (PlayerTurn == 1) {
        PlayerTurn = 2;
    }

    else if (PlayerTurn == 2) {
        playerColor = PlayerTwoColor;

        PlayerTurn = 1;
    }

    square.graphics.clear();
    square.graphics.beginFill(playerColor).drawRoundRect(0, 0, SubBoardSquareSize, SubBoardSquareSize, SubBoardSquareRadius).endFill();

    stage.update();

    /*if (CurrentSubBoard != "all") {
        checkSubBoardWon();
        checkGameWon();
    }*/

    var selectedSubBoard = ((row * 3) + columb);

    setCurrentSubBoard(selectedSubBoard);

    updateTitleText();
}

function updateTitleText() {
    var playPosition = "(You may play in any square)";

    if (CurrentSubBoard != "all") {
        playPosition = "(You may play in square " + (CurrentSubBoard + 1) + ")"
    }

    title.innerHTML = "Player " + PlayerTurn + "\'s Turn " + playPosition;
}

function setCurrentSubBoard(selectedSubBoard) {
    var subBoardFilled = true;

    for (var row = 0; row < 3; row++) {
        for (var columb = 0; columb < 3; columb++) {
            if (OccupiedSquares[selectedSubBoard][row][columb] == 0) {
                subBoardFilled = false;
            }
        }
    }

    if (subBoardFilled) {
        CurrentSubBoard = "all";
    }

    else {
        CurrentSubBoard = selectedSubBoard;
    }
}

function checkSubBoardWon() {
    for (var row = 0; row < 3; row++) {
        var rowSum = OccupiedSquares[CurrentSubBoard][row].reduce(sumArray, 0);

        if (rowSum == (1 * 3)) {
            CapturedBoards[CurrentSubBoard] = 1;
        }

        else if (rowSum == (2 * 3)) {
            CapturedBoards[CurrentSubBoard] = 2;
        }
    }

    for (var columb = 0; columb < 3; columb++) {
        var columbSum = (OccupiedSquares[CurrentSubBoard][0][columb] + OccupiedSquares[CurrentSubBoard][1][columb] + OccupiedSquares[CurrentSubBoard][2][columb]);

        if (columbSum == (1 * 3)) {
            CapturedBoards[CurrentSubBoard] = 1;
        }

        else if (columbSum == (2 * 3)) {
            CapturedBoards[CurrentSubBoard] = 2;
        }
    }

    console.log(CapturedBoards.toString());
}

function checkGameWon() {
    var winningTeam;

    for (var i = 0; i < 3; i++) {
        var row = CapturedBoards.slice(i, (i + 3));

        var rowSum = row.reduce(sumArray, 0);

        if (rowSum == (1 * 3)) {
            winningTeam = 1;
        }

        else if (rowSum == (2 * 3)) {
            winningTeam = 2;
        }
    }

    for (var i = 0; i < 3; i++) {
        var columbSum = CapturedBoards[i] + CapturedBoards[(i + 3)] + CapturedBoards[(i + 6)];

        if (columbSum == (1 * 3)) {
            winningTeam = 1;
        }

        else if (columbSum == (2 * 3)) {
            winningTeam = 2;
        }
    }

    if (winningTeam == 1) {
        console.log("team 1 wins");

        resetGame();
        goBackToMenu();
    }

    else if (winningTeam == 2) {
        console.log("team 2 wins");

        resetGame();
        goBackToMenu();
    }
}

function sumArray(total, number) {
    return total + number;
}
