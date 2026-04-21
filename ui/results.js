export class ResultsPanel {
  constructor(containerElement, onDownload, onRestart) {
    this.container = containerElement;
    this.onDownload = onDownload;
    this.onRestart = onRestart;
    this.panel = null;
  }

  show(stats) {
    if (this.panel) return;

    this.panel = document.createElement("div");
    this.panel.className = "results-panel";
    this.panel.innerHTML = `
      <h2>Result Summary</h2>
      <div class="result-stats">
        <div class="result-item">
          <span class="result-value">${stats.wpm}</span>
          <span class="result-label">WPM</span>
        </div>
        <div class="result-item">
          <span class="result-value">${stats.accuracy}%</span>
          <span class="result-label">Accuracy</span>
        </div>
        <div class="result-item">
          <span class="result-value">${stats.errors}</span>
          <span class="result-label">Errors</span>
        </div>
        <div class="result-item">
          <span class="result-value">${stats.missedChars}</span>
          <span class="result-label">Missed</span>
        </div>
        <div class="result-item">
          <span class="result-value">${stats.keysPressed}</span>
          <span class="result-label">Keys</span>
        </div>
      </div>
      <div class="result-buttons">
        <button id="download-btn" class="btn-primary">Download Image</button>
        <button id="restart-btn" class="btn-secondary">Restart</button>
      </div>
    `;

    this.container.appendChild(this.panel);

    document.getElementById("download-btn").addEventListener("click", () => {
      this.onDownload(stats);
    });

    document.getElementById("restart-btn").addEventListener("click", () => {
      this.onRestart();
    });
  }

  hide() {
    if (this.panel) {
      this.panel.remove();
      this.panel = null;
    }
  }
}
