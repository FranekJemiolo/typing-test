# TypeRacer Lite - Share Edition

A fully client-side typing speed test web app that measures your typing performance and generates shareable result images. Built with vanilla JavaScript, optimized for GitHub Pages deployment.

## Features

- **Real-time typing metrics**: Track keystrokes, correct characters, errors, WPM, and accuracy
- **Visual feedback**: Color-coded character highlighting (green for correct, red for wrong)
- **Shareable results**: Generate and download beautiful result cards (1200x630 PNG)
- **Dark theme**: F1 telemetry-inspired UI design
- **Fully client-side**: No backend required, works entirely in the browser
- **Responsive design**: Works on desktop and mobile devices

## Live Demo

Visit the live site at: `https://franekjemiolo.github.io/typing-test/`

## Project Structure

```
typing-test/
├── index.html          # Main HTML file
├── style.css           # Dark theme styling
├── app.js              # Main application entry point
├── words.txt           # Word list for typing test
├── core/               # Game logic (no DOM)
│   ├── engine.js       # Game state management
│   ├── stats.js        # Statistics calculations
│   └── words.js        # Word provider
├── ui/                 # UI rendering and interactions
│   ├── renderer.js     # Word display renderer
│   ├── results.js      # Results panel
│   └── theme.js        # Theme management
├── export/             # Image generation
│   ├── image.js        # Canvas image generator
│   └── card.js         # Download/share handlers
└── assets/             # Optional fonts or icons
```

## Metrics Explained

- **Keys Pressed**: Total keystrokes in the input field
- **Correct Characters**: Characters matching expected word positions
- **Errors**: Wrong characters typed at any position
- **WPM (Words Per Minute)**: Standard formula: `(correct_chars / 5) / minutes`
- **Accuracy**: `correct_chars / total_keys_pressed * 100`

## How to Use

1. Open the page in your browser
2. Start typing the displayed word
3. Watch your stats update in real-time
4. Complete all words to see your results
5. Download your result image to share

## Local Development

Simply open `index.html` in a web browser. No build step or dependencies required.

```bash
# Using a local server (recommended)
python -m http.server 8000
# or
npx serve
```

Then visit `http://localhost:8000`

## Deployment

### GitHub Pages

1. Push this repository to GitHub
2. Go to **Settings** → **Pages**
3. Set **Source** to `main` branch, `/ (root)` directory
4. Your site will be available at `https://yourusername.github.io/typing-test/`

### Other Static Hosting

This app works on any static hosting service:
- Netlify
- Vercel
- Cloudflare Pages
- AWS S3 + CloudFront

## Customization

### Adding More Words

Edit `words.txt` to add or modify the word list. Words should be separated by whitespace or newlines.

### Changing the Theme

Modify the CSS variables in `style.css`:

```css
:root {
  --bg-color: #0d0f14;
  --text-color: #eeeeee;
  --accent-color: #00ff88;
  --error-color: #ff4444;
  --panel-color: #1a1d24;
  --border-color: #333333;
}
```

### Adjusting Image Export

Modify `export/image.js` to customize the result card design.

## Architecture

The app follows a clean separation of concerns:

- **core/**: Pure game logic, no DOM manipulation
- **ui/**: Rendering and user interactions
- **export/**: Canvas image generation

This architecture makes the codebase maintainable and easy to extend.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - Feel free to use and modify as needed.

## Future Enhancements

Potential upgrades:
- Timed mode (30s / 60s / infinite)
- Real-time WPM graph
- Ghost typing replay
- Sound feedback
- Leaderboard integration
- Adaptive difficulty

---

Built with vanilla JavaScript, no frameworks required.
