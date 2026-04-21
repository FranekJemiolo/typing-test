export class WordRenderer {
  constructor(wordBoxElement) {
    this.wordBox = wordBoxElement;
  }

  renderWord(word, typed) {
    this.wordBox.innerHTML = "";
    
    if (!word) {
      this.wordBox.textContent = "Loading...";
      return;
    }

    const letters = word.split("");
    letters.forEach((char, index) => {
      const span = document.createElement("span");
      span.textContent = char;
      
      if (index < typed.length) {
        if (typed[index] === char) {
          span.classList.add("correct");
        } else {
          span.classList.add("wrong");
        }
      }
      
      this.wordBox.appendChild(span);
    });
  }

  clear() {
    this.wordBox.innerHTML = "";
  }
}
