// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let gameTimer; // Tracks the 30-second round countdown
let confettiTimeout;
let timeLeft = 30;
let score = 0;

const winningMessages = [
  "Amazing work! Every drop brings clean water closer.",
  "You did it! Your water-drop skills made a big splash.",
  "Fantastic catching! Clean water is worth celebrating."
];

const losingMessages = [
  "Good effort! Every drop counts. Give it another try!",
  "Keep going! There are more clean drops to catch.",
  "A little more practice and you will make a big splash."
];

const gameContainer = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const startButton = document.getElementById("start-btn");
const resetButton = document.getElementById("reset-btn");
const gameMessage = document.getElementById("game-message");
const confettiContainer = document.getElementById("confetti-container");

// Wait for button click to start the game
startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);

function startGame() {
  // A click during a round must not start a second timer or drop loop.
  if (gameRunning) return;

  clearInterval(dropMaker);
  clearInterval(gameTimer);
  clearTimeout(confettiTimeout);
  confettiContainer.replaceChildren();
  gameContainer.replaceChildren();
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  gameMessage.textContent = "";
  gameMessage.hidden = true;
  gameRunning = true;
  startButton.textContent = "Game in Progress";

  // Create drops and update the countdown once per second.
  dropMaker = setInterval(createDrop, 1000);
  gameTimer = setInterval(() => {
    timeLeft -= 1;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function createDrop() {
  if (!gameRunning) return;

  // A button gives each drop native mouse, touch, and keyboard interaction.
  const drop = document.createElement("button");
  drop.type = "button";
  const isContaminated = Math.random() < 0.2;
  drop.className = isContaminated ? "water-drop bad-drop" : "water-drop";
  drop.setAttribute("aria-label", isContaminated
    ? "Contaminated water drop, lose one point"
    : "Clean water drop, earn one point");

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Keep the drop inside the play area, even on narrow screens.
  const gameWidth = gameContainer.clientWidth;
  const xPosition = Math.random() * Math.max(0, gameWidth - size);
  drop.style.left = xPosition + "px";

  // Match the fall distance to the responsive play-area height.
  drop.style.setProperty("--fall-distance", `${gameContainer.clientHeight}px`);
  drop.style.animationDuration = "4s";

  gameContainer.appendChild(drop);

  drop.addEventListener("click", () => {
    if (!gameRunning || !drop.isConnected) return;
    score = isContaminated ? Math.max(0, score - 1) : score + 1;
    scoreDisplay.textContent = score;
    drop.remove();
  }, { once: true });

  // Missed drops disappear without changing the score.
  drop.addEventListener("animationend", () => {
    drop.remove();
  });
}

function endGame() {
  if (!gameRunning) return;

  gameRunning = false;
  clearInterval(gameTimer);
  clearInterval(dropMaker);
  gameTimer = null;
  dropMaker = null;
  gameContainer.replaceChildren();
  startButton.textContent = "Play Again";

  const messages = score >= 20 ? winningMessages : losingMessages;
  const messageIndex = Math.floor(Math.random() * messages.length);
  gameMessage.textContent = `${score >= 20 ? "You win! " : "Round complete. "}${messages[messageIndex]}`;
  gameMessage.hidden = false;

  if (score >= 20) {
    celebrateWin();
  }
}

function resetGame() {
  gameRunning = false;
  clearInterval(gameTimer);
  clearInterval(dropMaker);
  clearTimeout(confettiTimeout);
  gameTimer = null;
  dropMaker = null;
  confettiTimeout = null;

  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  gameContainer.replaceChildren();
  confettiContainer.replaceChildren();
  gameMessage.textContent = "";
  gameMessage.hidden = true;
  startButton.textContent = "Start Game";
}

function celebrateWin() {
  const confettiColors = ["#ffc907", "#2e9df7", "#171717", "#f16061", "#4f9b66"];

  for (let pieceIndex = 0; pieceIndex < 45; pieceIndex += 1) {
    const confettiPiece = document.createElement("span");
    confettiPiece.className = "confetti-piece";
    confettiPiece.style.left = `${Math.random() * 100}%`;
    confettiPiece.style.backgroundColor = confettiColors[pieceIndex % confettiColors.length];
    confettiPiece.style.animationDelay = `${Math.random() * 0.8}s`;
    confettiContainer.appendChild(confettiPiece);
  }

  confettiTimeout = setTimeout(() => {
    confettiContainer.replaceChildren();
  }, 3500);
}
