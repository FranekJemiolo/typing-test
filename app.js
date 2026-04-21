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
const keysElement = document.getElementById("keys");
const correctElement = document.getElementById("correct");
const errorsElement = document.getElementById("errors");
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
  keysElement.textContent = stats.keysPressed;
  correctElement.textContent = stats.correctChars;
  errorsElement.textContent = stats.errors;
  wpmElement.textContent = stats.wpm;
  accuracyElement.textContent = stats.accuracy;
}

// Handle state changes
engine.onStateChange((state, stats) => {
  updateStatsDisplay(stats);

  if (state === GameState.FINISHED) {
    input.disabled = true;
    resultsPanel.show(stats);
  } else if (state === GameState.IDLE) {
    input.disabled = false;
    input.value = "";
    resultsPanel.hide();
  }
});

// Handle input
input.addEventListener("input", (e) => {
  const typed = e.target.value;
  const currentWord = engine.getCurrentWord();

  if (engine.getState() === GameState.IDLE && typed.length > 0) {
    engine.start();
  }

  if (engine.getState() === GameState.RUNNING) {
    // Check if space was pressed (input ends with space)
    if (typed.endsWith(" ")) {
      // Skip to next word
      engine.skipWord();
      input.value = "";
      renderer.renderWord(engine.getCurrentWord(), "");
      updateStatsDisplay(engine.getStats());
      return;
    }

    // Track character-by-character for stats
    for (let i = 0; i < typed.length; i++) {
      const char = typed[i];
      if (i < currentWord.length) {
        engine.handleInput(char);
      }
    }

    engine.updateTyped(typed);
    renderer.renderWord(currentWord, typed);
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
