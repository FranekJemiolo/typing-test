import { WordProvider } from "./words.js";
import { StatsTracker } from "./stats.js";

export const GameState = {
  IDLE: "idle",
  RUNNING: "running",
  FINISHED: "finished"
};

export class TypingEngine {
  constructor() {
    this.state = GameState.IDLE;
    this.wordProvider = new WordProvider();
    this.stats = new StatsTracker();
    this.currentTyped = "";
    this.listeners = [];
    this.timerInterval = null;
  }

  async initialize() {
    await this.wordProvider.loadWords();
  }

  onStateChange(callback) {
    this.listeners.push(callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.state, this.getStats()));
  }

  start() {
    if (this.state === GameState.RUNNING) return;
    
    this.state = GameState.RUNNING;
    this.stats.reset();
    this.currentTyped = "";
    this.wordProvider.reset();
    this.stats.start();
    this.notifyListeners();

    // Start timer interval to check for time up and update display
    this.timerInterval = setInterval(() => {
      if (this.stats.isTimeUp()) {
        this.finish();
      } else {
        // Notify listeners to update timer display
        this.notifyListeners();
      }
    }, 100); // Update every 100ms
  }

  handleInput(char) {
    if (this.state !== GameState.RUNNING) return;

    this.stats.recordKey();
    const currentWord = this.wordProvider.getCurrentWord();
    
    if (char === currentWord[this.currentTyped.length]) {
      this.stats.recordCorrect();
    } else {
      this.stats.recordError();
    }
  }

  handleBackspace() {
    if (this.state !== GameState.RUNNING) return;
    // Optional: you could track backspace as an error or just ignore
    // For now, we don't penalize backspace
  }

  updateTyped(text) {
    if (this.state !== GameState.RUNNING) return;

    this.currentTyped = text;
    const currentWord = this.wordProvider.getCurrentWord();

    // Check if word is complete
    if (text === currentWord) {
      this.wordProvider.nextWord();
      this.currentTyped = "";
    }
  }

  skipWord() {
    if (this.state !== GameState.RUNNING) return;

    this.wordProvider.nextWord();
    this.currentTyped = "";
  }

  finish() {
    if (this.state !== GameState.RUNNING) return;
    
    this.state = GameState.FINISHED;
    this.stats.stop();
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.notifyListeners();
  }

  restart() {
    this.state = GameState.IDLE;
    this.stats.reset();
    this.currentTyped = "";
    this.wordProvider.reset();
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.notifyListeners();
  }

  getCurrentWord() {
    return this.wordProvider.getCurrentWord();
  }

  getTyped() {
    return this.currentTyped;
  }

  getStats() {
    return this.stats.getStats();
  }

  getState() {
    return this.state;
  }
}
