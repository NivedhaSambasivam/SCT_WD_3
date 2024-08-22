const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartButton = document.getElementById('restart');
const gameDiv = document.getElementById('game');
const modeSelectionDiv = document.getElementById('mode-selection');
const twoPlayerModeButton = document.getElementById('two-player-mode');
const computerModeButton = document.getElementById('computer-mode');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;
let playAgainstComputer = false;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Horizontal
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Vertical
  [0, 4, 8],
  [2, 4, 6]  // Diagonal
];

const displayStatus = () => {
  statusText.textContent = `Player ${currentPlayer}'s turn`;
};

const handleResultValidation = () => {
  let roundWon = false;
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] === '' || board[b] === '' || board[c] === '') continue;
    if (board[a] === board[b] && board[b] === board[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `Player ${currentPlayer} has won!`;
    isGameActive = false;
    restartButton.classList.remove('hidden');
    return;
  }

  if (!board.includes('')) {
    statusText.textContent = `Game ended in a draw!`;
    isGameActive = false;
    restartButton.classList.remove('hidden');
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  displayStatus();
};

const cellClicked = (event) => {
  const cell = event.target;
  const index = cell.getAttribute('data-index');

  if (board[index] !== '' || !isGameActive) return;

  updateCell(cell, index);
  handleResultValidation();

  if (playAgainstComputer && isGameActive && currentPlayer === 'O') {
    setTimeout(computerMove, 500);
  }
};

const updateCell = (cell, index) => {
  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
};

const computerMove = () => {
  let availableIndices = board
    .map((val, idx) => (val === '' ? idx : null))
    .filter((val) => val !== null);

  if (availableIndices.length === 0) return;

  // Simple AI: Random move
  const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  const cell = document.querySelector(`.cell[data-index='${randomIndex}']`);
  updateCell(cell, randomIndex);
  handleResultValidation();
};

const restartGame = () => {
  board = ['', '', '', '', '', '', '', '', ''];
  isGameActive = true;
  currentPlayer = 'X';
  cells.forEach((cell) => (cell.textContent = ''));
  restartButton.classList.add('hidden');
  displayStatus();
};

cells.forEach((cell) => cell.addEventListener('click', cellClicked));
restartButton.addEventListener('click', restartGame);

twoPlayerModeButton.addEventListener('click', () => {
  playAgainstComputer = false;
  modeSelectionDiv.classList.add('hidden');
  gameDiv.classList.remove('hidden');
  restartButton.classList.remove('hidden');
  restartGame();
});

computerModeButton.addEventListener('click', () => {
  playAgainstComputer = true;
  modeSelectionDiv.classList.add('hidden');
  gameDiv.classList.remove('hidden');
  restartButton.classList.remove('hidden');
  restartGame();
});
