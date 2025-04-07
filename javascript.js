// Gameboard module
const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const updateCell = (index, marker) => {
      if (board[index] === "") {
        board[index] = marker;
        return true;
      }
      return false;
    };

    const reset = () => {
      board = ["", "", "", "", "", "", "", "", ""];
    };

    return { getBoard, updateCell, reset };
})();

// Player factory
const Player = (name, marker) => {
    return { name, marker };
};

// Game controller module
const GameController = (() => {
    let player1, player2;
    let currentPlayer = player1;
    let gameOver = false;
    let score = { X: 0, O: 0 };

    const startGame = (name1, name2) => {
        player1 = Player(name1 || "Player X", "X");
        player2 = Player(name2 || "Player O", "O");
        currentPlayer = player1;
        gameOver = false;
        Gameboard.reset();
        DisplayController.render();
        DisplayController.setResult("");
        DisplayController.updateScoreboard(player1.name, player2.name, score.X, score.O);
    };

    const switchPlayer = () => {
      currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const getCurrentPlayer = () => currentPlayer;

    const checkWinner = () => {
      const b = Gameboard.getBoard();
      const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
        [0, 4, 8], [2, 4, 6],           // diagonals
      ];

      for (const condition of winConditions) {
        const [a, b1, c] = condition;
        if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
          return true;
        }
      }

      return false;
    };

    const checkTie = () => {
      return Gameboard.getBoard().every(cell => cell !== "");
    };

    const playTurn = (index) => {
      if (gameOver) return;

      const success = Gameboard.updateCell(index, currentPlayer.marker);
      if (!success) return;

      DisplayController.render();

      if (checkWinner()) {
        DisplayController.setResult(`${currentPlayer.name} wins!`);
        score[currentPlayer.marker]++;
        DisplayController.updateScoreboard(player1.name, player2.name, score.X, score.O);
        gameOver = true;
      } else if (checkTie()) {
        DisplayController.setResult("It's a tie!");
        gameOver = true;
      } else {
        switchPlayer();
      }
    };

    const restart = () => {
      Gameboard.reset();
      currentPlayer = player1;
      gameOver = false;
      DisplayController.render();
      DisplayController.setResult("");
    };

    return { playTurn, getCurrentPlayer, restart, startGame };
})();

// Display controller module
const DisplayController = (() => {
    const boardElement = document.getElementById("game-board");
    const resultElement = document.getElementById("result");
    const restartBtn = document.getElementById("restart-btn");
    const startBtn = document.getElementById("start-btn");

    const render = () => {
      boardElement.innerHTML = "";
      const board = Gameboard.getBoard();
      board.forEach((cell, index) => {
        const cellDiv = document.createElement("div");
        cellDiv.textContent = cell;
        cellDiv.addEventListener("click", () => GameController.playTurn(index));
        boardElement.appendChild(cellDiv);
      });
    };

    const setResult = (message) => {
      resultElement.textContent = message;
    };

    restartBtn.addEventListener("click", () => {
      GameController.restart();
    });

    startBtn.addEventListener("click", () => {
      const name1 = document.getElementById("player1-name").value;
      const name2 = document.getElementById("player2-name").value;
      document.getElementById("player-setup").style.display = "none";
      document.getElementById("game-container").style.display = "block";
      document.getElementById("scoreboard").style.display = "block";
      GameController.startGame(name1, name2);
    });

    const updateScoreboard = (name1, name2, scoreX, scoreO) => {
      document.getElementById("player1-label").textContent = name1;
      document.getElementById("player2-label").textContent = name2;
      document.getElementById("score-x").textContent = scoreX;
      document.getElementById("score-o").textContent = scoreO;
    };

    return { render, setResult, updateScoreboard };
})();

// Initialize
DisplayController.render();