export class StatsTracker {
  constructor(timeLimit = 60) {
    this.timeLimit = timeLimit;
    this.reset();
  }

  reset() {
    this.keysPressed = 0;
    this.correctChars = 0;
    this.errors = 0;
    this.missedChars = 0;
    this.completedWords = 0;
    this.failedWords = 0;
    this.startTime = null;
    this.endTime = null;
  }

  start() {
    this.startTime = Date.now();
  }

  stop() {
    this.endTime = Date.now();
  }

  recordKey() {
    this.keysPressed++;
  }

  recordCorrect() {
    this.correctChars++;
  }

  recordError() {
    this.errors++;
  }

  recordMissed() {
    this.missedChars++;
  }

  recordCompletedWord() {
    this.completedWords++;
  }

  recordFailedWord() {
    this.failedWords++;
  }

  getElapsedTime() {
    if (!this.startTime) return 0;
    const end = this.endTime || Date.now();
    return (end - this.startTime) / 1000; // in seconds
  }

  getElapsedTimeMinutes() {
    return this.getElapsedTime() / 60;
  }

  getRemainingTime() {
    if (!this.startTime) return this.timeLimit;
    const elapsed = this.getElapsedTime();
    const remaining = this.timeLimit - elapsed;
    return Math.max(0, Math.round(remaining));
  }

  isTimeUp() {
    return this.getRemainingTime() <= 0;
  }

  getWPM() {
    const elapsedMinutes = this.getElapsedTimeMinutes();
    if (elapsedMinutes <= 0) return 0;
    // Standard: 1 word = 5 characters
    return Math.round((this.correctChars / 5) / elapsedMinutes);
  }

  getAccuracy() {
    if (this.keysPressed === 0) return 100;
    return Math.round((this.correctChars / this.keysPressed) * 100);
  }

  getStats() {
    return {
      keysPressed: this.keysPressed,
      correctChars: this.correctChars,
      errors: this.errors,
      missedChars: this.missedChars,
      completedWords: this.completedWords,
      failedWords: this.failedWords,
      wpm: this.getWPM(),
      accuracy: this.getAccuracy(),
      elapsedTime: this.getElapsedTime(),
      remainingTime: this.getRemainingTime()
    };
  }
}
