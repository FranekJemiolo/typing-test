import { TypingEngine, GameState } from "./core/engine.js";
import { WordRenderer } from "./ui/renderer.js";
import { ResultsPanel } from "./ui/results.js";
import { ThemeManager } from "./ui/theme.js";
import { downloadResultImage, copyResultText } from "./export/card.js";

// Initialize components
const engine = new TypingEngine();
const themeManager = new ThemeManager();
const wordBox = document.getElementById("word-box");
const input = document.getElementById("input");
const renderer = new WordRenderer(wordBox);
const resultsContainer = document.getElementById("results-container");

// Stats elements
const timerValueElement = document.getElementById("timer-value");
const keysElement = document.getElementById("keys");
const correctElement = document.getElementById("correct");
const errorsElement = document.getElementById("errors");
const missedElement = document.getElementById("missed");
const completedElement = document.getElementById("completed");
const failedElement = document.getElementById("failed");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");

// Results panel
const resultsPanel = new ResultsPanel(
  resultsContainer,
  (stats) => {
    downloadResultImage(stats);
  },
  () => {
    handleRestart();
  }
);

// Apply theme
themeManager.applyTheme("dark");

// Update stats display
function updateStatsDisplay(stats) {
  timerValueElement.textContent = stats.remainingTime;
  keysElement.textContent = stats.keysPressed;
  correctElement.textContent = stats.correctChars;
  errorsElement.textContent = stats.errors;
  missedElement.textContent = stats.missedChars;
  completedElement.textContent = stats.completedWords;
  failedElement.textContent = stats.failedWords;
  wpmElement.textContent = stats.wpm;
  accuracyElement.textContent = stats.accuracy;
}

// Handle state changes
engine.onStateChange((state, stats) => {
  updateStatsDisplay(stats);

  if (state === GameState.FINISHED) {
    input.disabled = true;
    input.style.display = "none";
    wordBox.style.display = "none";
    document.querySelector(".input-container").style.display = "none";
    document.querySelector(".controls").style.display = "none";
    resultsPanel.show(stats);
  } else if (state === GameState.IDLE) {
    input.disabled = false;
    input.value = "";
    input.style.display = "";
    wordBox.style.display = "";
    document.querySelector(".input-container").style.display = "";
    document.querySelector(".controls").style.display = "";
    resultsPanel.hide();
    timerValueElement.textContent = "60";
  }
});

// Handle input
input.addEventListener("input", (e) => {
  const typed = e.target.value;
  const currentWord = engine.getCurrentWord();
  const previousTyped = engine.getTyped();

  if (engine.getState() === GameState.IDLE && typed.length > 0) {
    engine.start();
  }

  if (engine.getState() === GameState.RUNNING) {
    // Track only the new character(s) that were added
    if (typed.length > previousTyped.length) {
      // Characters were added - pass each new character to engine
      for (let i = previousTyped.length; i < typed.length; i++) {
        const char = typed[i];
        engine.handleInput(char);
      }
    }

    engine.updateTyped(typed);
    renderer.renderWord(currentWord, typed);
    updateStatsDisplay(engine.getStats());
  }
});

// Handle space key to skip to next word
input.addEventListener("keydown", (e) => {
  if (e.key === " " && engine.getState() === GameState.RUNNING) {
    e.preventDefault();
    engine.skipWord();
    input.value = "";
    renderer.renderWord(engine.getCurrentWord(), "");
    updateStatsDisplay(engine.getStats());
  }
});

// Handle restart
function handleRestart() {
  engine.restart();
  renderer.renderWord(engine.getCurrentWord(), "");
  updateStatsDisplay(engine.getStats());
  input.disabled = false;
  input.value = "";
  input.style.display = "";
  wordBox.style.display = "";
  document.querySelector(".input-container").style.display = "";
  document.querySelector(".controls").style.display = "";
  timerValueElement.textContent = "60";
  input.focus();
}

document.getElementById("restart-btn").addEventListener("click", handleRestart);

// Initialize the app
async function init() {
  await engine.initialize();
  renderer.renderWord(engine.getCurrentWord(), "");
  input.focus();
}

// Start the app
init().catch(error => {
  console.error("Failed to initialize app:", error);
  wordBox.textContent = "Error loading words. Please refresh.";
});
