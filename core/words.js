export class WordProvider {
  constructor() {
    this.words = [];
    this.currentIndex = 0;
    this.loaded = false;
  }

  async loadWords(url = "words.txt") {
    try {
      const response = await fetch(url);
      const text = await response.text();
      this.words = text.split(/\s+/).filter(word => word.length > 0);
      this.loaded = true;
      return this.words;
    } catch (error) {
      console.error("Failed to load words:", error);
      // Fallback words if loading fails
      this.words = [
        "typing", "speed", "reaction", "keyboard", "javascript",
        "browser", "function", "performance", "accuracy", "github"
      ];
      this.loaded = true;
      return this.words;
    }
  }

  getCurrentWord() {
    if (!this.loaded || this.words.length === 0) {
      return "";
    }
    return this.words[this.currentIndex];
  }

  nextWord() {
    this.currentIndex++;
    if (this.currentIndex >= this.words.length) {
      this.currentIndex = 0; // Loop back to start
    }
    return this.getCurrentWord();
  }

  reset() {
    this.currentIndex = 0;
  }

  getTotalWords() {
    return this.words.length;
  }

  isLoaded() {
    return this.loaded;
  }
}
