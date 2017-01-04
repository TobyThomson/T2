var BoardGridColor = "#0dab76";
var BackGroundColor = "#f4f4f4";
var SubBoardSquareColor = "#e0e0e2";

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

var context = board.getContext('2d');

var boardSize;
var sectionSize;
var SubBoardSquareSize;

localGameButton.addEventListener("click", function(){
    startPage.style.display = "none";
    gamePage.style.display = "block";
    backButton.style.display = "block";

    title.textContent = "Your Turn";

    drawResponsiveElements();
});

backButton.addEventListener("click", function(){
    startPage.style.display = "block";
    gamePage.style.display = "none";
    backButton.style.display = "none";

    title.textContent = "UTTT";
});

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

    drawLines(10, BoardGridColor);
    drawSubBoards();
}

function drawLines(lineWidth, strokeStyle) {
  var lineStart = 4;
  var lineLenght = boardSize - 5;
  context.lineWidth = lineWidth;
  context.lineCap = 'round';
  context.strokeStyle = strokeStyle;
  context.beginPath();

  for (var y = 1; y <= 2; y++) {
    context.moveTo(lineStart, y * sectionSize);
    context.lineTo(lineLenght, y * sectionSize);
  }

  for (var x = 1; x <= 2; x++) {
    context.moveTo(x * sectionSize, lineStart);
    context.lineTo(x * sectionSize, lineLenght);
  }

  context.stroke();
}

function drawSubBoards() {
    context.strokeStyle = SubBoardSquareColor;
    context.fillStyle = SubBoardSquareColor;

    var squareSpacing = ((sectionSize - (SubBoardSquareSize * 3)) / 4);

    var x = squareSpacing;
    var y = squareSpacing;

    context.moveTo(x, y);

    for (var subBoard = 1; subBoard <= 9; subBoard++) {
        for (var row = 1; row <= 3; row++) {
            for (var square = 1; square <= 3; square++) {
                context.beginPath();
                context.moveTo(x + SubBoardSquareRadius, y);
                context.lineTo(x + SubBoardSquareSize - SubBoardSquareRadius, y);
                context.quadraticCurveTo(x + SubBoardSquareSize, y, x + SubBoardSquareSize, y + SubBoardSquareRadius);
                context.lineTo(x + SubBoardSquareSize, y + SubBoardSquareSize - SubBoardSquareRadius);
                context.quadraticCurveTo(x + SubBoardSquareSize, y + SubBoardSquareSize, x + SubBoardSquareSize - SubBoardSquareRadius, y + SubBoardSquareSize);
                context.lineTo(x + SubBoardSquareRadius, y + SubBoardSquareSize);
                context.quadraticCurveTo(x, y + SubBoardSquareSize, x, y + SubBoardSquareSize - SubBoardSquareRadius);
                context.lineTo(x, y + SubBoardSquareRadius);
                context.quadraticCurveTo(x, y, x + SubBoardSquareRadius, y);
                context.closePath();
                context.fill();

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

window.onresize = function(event) {
    drawResponsiveElements();
};
