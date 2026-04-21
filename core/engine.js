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

    // Word completion is now handled by space bar only
    // Do not automatically move to next word
  }

  skipWord() {
    if (this.state !== GameState.RUNNING) return;

    const currentWord = this.wordProvider.getCurrentWord();

    // Record missed characters for the current word (only if incomplete)
    if (this.currentTyped !== currentWord) {
      const missed = currentWord.length - this.currentTyped.length;
      for (let i = 0; i < missed; i++) {
        this.stats.recordMissed();
      }
      this.stats.recordFailedWord();
    } else {
      // Word was completed correctly
      this.stats.recordCompletedWord();
    }

    this.wordProvider.nextWord();
    this.currentTyped = "";
  }

  finish() {
    if (this.state !== GameState.RUNNING) return;

    const currentWord = this.wordProvider.getCurrentWord();

    // Record missed characters for the current word (only if incomplete)
    if (this.currentTyped !== currentWord) {
      const missed = currentWord.length - this.currentTyped.length;
      for (let i = 0; i < missed; i++) {
        this.stats.recordMissed();
      }
      this.stats.recordFailedWord();
    } else if (this.currentTyped.length > 0) {
      // Word was completed correctly (and had some characters typed)
      this.stats.recordCompletedWord();
    }

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
