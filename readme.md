# AVP Project

AVP (Automatic Video Pool) is a web-based tool for displaying and shuffling multiple videos in a dynamic grid layout. It is designed for quick video previews and auto-shuffling, making it ideal for video pool management, live events, or creative video displays.

### Features

- **Dynamic Grid:** Responsive grid adapts to the number of videos.
- **Auto-Shuffle:** Shuffle videos automatically at intervals (default: every 3 seconds) or toggle on/off.
- **Fullscreen Support:** Click a video to toggle fullscreen styling (not browser fullscreen).
- **Pin Button Overlay:** Pin videos in place during shuffling by clicking the pin button (📌) or pressing `p` while hovering.
- **Video Pool Selection:** Select multiple videos at once using the file input or 🎞️ button.
- **Keyboard Shortcuts & Controls:** See below for all shortcuts and controls.

### Keyboard Shortcuts & Usage Tips

- **Shuffle Videos:** Press `r` to shuffle the videos in the grid.
- **Auto-Shuffle Toggle:** Press `l` to enable or disable auto-shuffling.
- **Fullscreen Toggle:** Click a video to toggle fullscreen styling (not browser fullscreen).
- **Play/Pause All Videos:** Press the space bar to toggle play/pause for all videos.
- **Pin Video:** Click the pin button (📌) or hover and press `p` to pin/unpin.
- **Adjust Grid Size:** Use minus (`-`) and plus (`+`) keys or the number input.
- **Change Video Position:** Use left/right arrow keys to seek, or drag across the video area to scrub.
- **Accessibility:** All controls are labeled for screen readers and keyboard navigation.

### How to Use

1. **Open `index.html` in your browser.**
2. **Add Videos:** Click the 🎞️ button or use the file input to select multiple video files.
3. **View Grid:** Videos appear in a grid layout, auto-sized for your screen.
4. **Shuffle:** Use the shuffle shortcut (`r`).
5. **Enable Auto-Shuffle:** Press `l` to start auto-shuffling videos at intervals.

### Project Structure

```
index.html      # Main HTML file
scripts.js      # Main JavaScript logic
styles.css      # Styles for grid and controls
helpers/
	dom.js        # DOM utilities for video/input creation
	grid.js       # Grid layout helpers
	util.js       # Utility functions (throttle, debounce, grid template)
```

### Setup, Customization & Requirements

- No build step required. Just open `index.html` in a browser.
- Customize grid size, shuffle interval, and shortcuts in `scripts.js` and `index.html`.
- Style the grid and controls via `styles.css`.
- Requires a modern browser (Chrome, Firefox, Edge, Safari).
- Local video files are needed for preview.

### Use Case Scenarios

AVP is not intended for single video playback. Its core purpose is to present, shuffle, and interact with multiple videos simultaneously in a dynamic grid.

AVP excels in scenarios where multi-video presentation and rapid switching are required:

- **Live Events & Performances:** Instantly shuffle and display several video feeds for VJing, concerts, or art installations.
- **Video Pool Management:** Preview, organize, and compare many video files at once.
- **Creative Displays:** Build interactive video walls or kiosks in galleries, museums, or public spaces.
- **Education & Training:** Present multiple instructional videos for workshops, classrooms, or remote learning.
- **Testing & Review:** Rapidly preview, shuffle, and compare video assets during development or QA.
- **Personal Use:** Create video collages or shuffle family videos for group viewing and entertainment.

### Known Limitations

- No persistence: selected videos are not saved after reload.
- No mute/unmute on hover: videos play with default browser settings.
- Fullscreen is a visual effect, not true browser fullscreen.

- Only local video files are supported; network streams are not.
- Some browsers may restrict autoplay or fullscreen behavior.
- Pinning is per session and not persisted after reload.
- Large video pools may impact performance.

### Troubleshooting

- If videos do not play, check browser permissions for autoplay and local file access.
- For best results, use modern browsers (Chrome, Firefox, Edge, Safari).

### Contributing

- Pull requests and feature suggestions are welcome!
- See `scripts.js` for main logic and add new features in the `helpers/` directory.

### License

MIT
