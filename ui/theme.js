export class ThemeManager {
  constructor() {
    this.themes = {
      dark: {
        background: "#0d0f14",
        text: "#eeeeee",
        accent: "#00ff88",
        error: "#ff4444",
        panel: "#1a1d24",
        border: "#333333"
      }
    };
    this.currentTheme = "dark";
  }

  applyTheme(themeName = "dark") {
    this.currentTheme = themeName;
    const theme = this.themes[themeName];
    
    document.documentElement.style.setProperty("--bg-color", theme.background);
    document.documentElement.style.setProperty("--text-color", theme.text);
    document.documentElement.style.setProperty("--accent-color", theme.accent);
    document.documentElement.style.setProperty("--error-color", theme.error);
    document.documentElement.style.setProperty("--panel-color", theme.panel);
    document.documentElement.style.setProperty("--border-color", theme.border);
  }

  getCurrentTheme() {
    return this.themes[this.currentTheme];
  }
}
