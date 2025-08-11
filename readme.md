# AVP Project

AVP (Automatic Video Pool) is a web-based tool for displaying and shuffling multiple videos in a dynamic grid layout. It is designed for quick video previews, auto-shuffling, and lazy loading, making it ideal for video pool management, live events, or creative video displays.

### Features

- **Dynamic Grid:** Videos are arranged in a responsive grid that adapts to the number of videos.
- **Auto-Shuffle:** Videos can be shuffled automatically at intervals (default: every 3 seconds).
- **Lazy Loading:** Videos only play when visible, saving resources.
- **Fullscreen Support:** Videos can be toggled to fullscreen mode.
- **Pin/Overlay Controls:** Easily pin or control individual videos.
- **Keyboard Shortcuts:** Shuffle videos with a shortcut (default: `r`).

### How to Use

1. **Open `avp.html` in your browser.**
2. **Add Videos:** Click the 🎞️ button or use the file input to select multiple video files.
3. **View Grid:** Videos will appear in a grid layout, auto-sized for your screen.
4. **Shuffle:** Use the shuffle shortcut (`r`) or enable auto-shuffle for dynamic rearrangement.
5. **Lazy Loading:** Videos play only when visible in the grid.

### Project Structure

```
avp.html         # Main HTML file
scripts.js       # Main JavaScript logic
styles.css       # Styles for grid and controls
helpers/
	dom.js         # DOM utilities for video/input creation
	grid.js        # Grid layout helpers
	util.js        # Utility functions (throttle, debounce, grid template)
```

### Setup & Customization

- No build step required. Just open `avp.html` in a browser.
- Customize grid size, shuffle interval, and shortcuts in `scripts.js` and `avp.html`.
- Style the grid and controls via `styles.css`.

### Requirements

- Modern browser (Chrome, Firefox, Edge, Safari)
- Local video files for preview

### License

MIT
