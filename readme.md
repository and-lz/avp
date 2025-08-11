# AVP Project

AVP (Automatic Video Pool) is a web-based tool for displaying and shuffling multiple videos in a dynamic grid layout. It is designed for quick video previews, auto-shuffling, and lazy loading, making it ideal for video pool management, live events, or creative video displays.

### Features

- **Dynamic Grid:** Videos are arranged in a responsive grid that adapts to the number of videos.
- **Auto-Shuffle:** Videos can be shuffled automatically at intervals (default: every 3 seconds), or you can enable/disable auto-shuffle for continuous randomization.
- **Lazy Loading:** Videos only play when visible, saving resources.
- **Fullscreen Support:** Videos can be toggled to fullscreen mode.
- **Pin Button Overlay:** Each video has a pin button (📌) overlay to keep it in place during shuffling.
- **Video Pool Selection:** Select multiple videos at once using the file input or 🎞️ button.
- **Persistence:** Selected video file paths are saved to localStorage for convenience.
- **Keyboard Shortcuts:** Shuffle videos with a shortcut (default: `r`).

### Keyboard Shortcuts

- **Shuffle Videos:** Press `r` to shuffle the videos in the grid.
- **Fullscreen Toggle:** Double-click a video to toggle fullscreen mode.
- **Pin Video:** (If implemented) Use the pin button overlay on each video to keep it in place.

### Changing Video Position

You can change the playback position (seek to different moments) in a video by:

- Using the left (`←`) and right (`→`) arrow keys to rewind or fast-forward the currently selected video.
- Dragging the video's timeline which represents the entire video, to jump to a specific moment.

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

### Use Case Scenarios

AVP is not intended for single video playback. Its core purpose is to present, shuffle, and interact with multiple videos simultaneously in a dynamic grid. If you need to show just one video, a standard video player is more appropriate.

AVP excels in scenarios where multi-video presentation and rapid switching are required:

- **Live Events & Performances:** Instantly shuffle and display several video feeds for VJing, concerts, or art installations, creating dynamic visual experiences.
- **Video Pool Management:** Preview, organize, and compare many video files at once—ideal for editors, curators, or archivists handling large collections.
- **Creative Displays:** Build interactive video walls or kiosks in galleries, museums, or public spaces, with the ability to shuffle and rearrange content on the fly.
- **Education & Training:** Present multiple instructional videos for workshops, classrooms, or remote learning, allowing quick switching and comparison.
- **Testing & Review:** Developers and testers can rapidly preview, shuffle, and compare video assets during development or QA.
- **Personal Use:** Home users can create video collages or shuffle family videos for group viewing and entertainment.

All these use cases leverage AVP's ability to display, shuffle, and manage multiple videos at once—making it a unique tool for multi-video scenarios.
