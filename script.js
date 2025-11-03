const users = document.querySelector("#users");
const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const status = document.querySelectorAll("#status");
const playerStatus = document.querySelectorAll("#player-status");
const winnerModal = new bootstrap.Modal(document.getElementById("winnerModal"));
const winnerText = document.getElementById("winnerText");
const playAgainButton = document.getElementById("playAgainBtn");
const restartButton = document.getElementById("restartBtn");

let currentPlayer = "❌";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let isComputerMode = false;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

users.addEventListener("click", function () {
  const usersCount = document.querySelector("#users-count");
  const player_one = document.querySelector("#player-o");
  if (usersCount.textContent === "2P") {
    usersCount.textContent = "1P";
    player_one.textContent = "COMPUTER";
    isComputerMode = true;
  } else {
    usersCount.textContent = "2P";
    player_one.textContent = "PLAYER 🟢";
    isComputerMode = false;
  }
  resetGame();
});

function handleCellClick(e) {
  const cell = e.target;
  const index = cell.getAttribute("data-index");

  if (gameBoard[index] !== "" || !gameActive) return;

  makeMove(index, currentPlayer);

  if (gameActive && isComputerMode && currentPlayer === "🟢") {
    setTimeout(computerMove, 500);
  }
}

function makeMove(index, player) {
  gameBoard[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player.toLowerCase());

  if (checkWin()) {
    if (player === "❌") {
      status[0].textContent = parseInt(status[0].textContent) + 1;
    } else {
      status[1].textContent = parseInt(status[1].textContent) + 1;
    }
    showWinner(`Player ${player} wins!`);
    gameActive = false;
    return;
  }

  if (checkDraw()) {
    document.querySelector("#draw-count").textContent =
      parseInt(document.querySelector("#draw-count").textContent) + 1;
    showWinner("It's a draw!");
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "❌" ? "🟢" : "❌";

  if (currentPlayer === "❌") {
    playerStatus[0].classList.remove("not-active");
    playerStatus[1].classList.add("not-active");
  } else {
    playerStatus[1].classList.remove("not-active");
    playerStatus[0].classList.add("not-active");
  }
}

function computerMove() {
  let move = findBestMove("🟢") || findBestMove("❌") || getRandomMove();
  if (move !== null && gameActive) {
    makeMove(move, "🟢");
  }
}

function findBestMove(player) {
  for (let combo of winningCombinations) {
    let [a, b, c] = combo;
    if (gameBoard[a] === player && gameBoard[b] === player && !gameBoard[c])
      return c;
    if (gameBoard[a] === player && !gameBoard[b] && gameBoard[c] === player)
      return b;
    if (!gameBoard[a] && gameBoard[b] === player && gameBoard[c] === player)
      return a;
  }
  return null;
}

function getRandomMove() {
  let available = [];
  gameBoard.forEach((cell, index) => {
    if (!cell) available.push(index);
  });
  return available.length
    ? available[Math.floor(Math.random() * available.length)]
    : null;
}

function checkWin() {
  for (let combination of winningCombinations) {
    if (combination.every((index) => gameBoard[index] === currentPlayer)) {
      return currentPlayer;
    }
  }
  return false;
}

function checkDraw() {
  return gameBoard.every((cell) => cell !== "");
}

function playAgain() {
  currentPlayer = "❌";
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("❌", "🟢");
  });
  playerStatus[0].classList.remove("not-active");
  playerStatus[1].classList.add("not-active");
  winnerModal.hide();
}

function resetGame() {
  currentPlayer = "❌";
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("❌", "🟢");
  });
  playerStatus[0].classList.remove("not-active");
  playerStatus[1].classList.add("not-active");

  status[0].textContent = 0;
  status[1].textContent = 0;
  document.querySelector("#draw-count").textContent = 0;

  winnerModal.hide();
}

function showWinner(message) {
  winnerText.textContent = message;
  winnerModal.show();
}


playAgainButton.addEventListener("click", playAgain);
restartButton.addEventListener("click", resetGame);
cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
