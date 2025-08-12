# AVP Project

AVP (Automatic Video Pool) is a lightweight, browser-based tool for dynamically displaying and shuffling multiple videos in a responsive grid layout. Designed for simplicity and accessibility, AVP is perfect for video pool management, live events, creative displays, and more. With no build process required, users can run the project directly from their file system using the `file://` protocol, making it ideal for quick setups and offline use.

### Keywords

- Video Grid
- Video Shuffle
- Dynamic Video Layout
- Video Pool Management
- Live Events
- Creative Video Displays
- Video Wall
- Video Collage
- Browser-Based Video Tool
- No Build Process
- File Protocol Support
- JavaScript Video Tool
- HTML5 Video
- Responsive Video Grid
- Lightweight Video Manager
- Offline Video Tool
- Video Presentation
- Video Kiosk
- Video Scrubbing
- Video Pinning

### Features

- **Dynamic Grid:** Responsive grid adapts to the number of videos.
- **Auto-Shuffle:** Shuffle videos automatically at intervals (default: every 3 seconds) or toggle on/off.
- **Fullscreen Support:** Double-click a video to toggle fullscreen styling (not browser fullscreen).
- **Pin Button Overlay:** Pin videos in place during shuffling by clicking the pin button (📌) or pressing `p` while hovering.
- **Video Pool Selection:** Select multiple videos at once using the file input or 🎞️ button.
- **Mute/Unmute on Hover:** Videos are muted by default; the one you hover will play audio.
- **Keyboard Shortcuts & Controls:** See below for all shortcuts and controls.
- **Fallback Video Handling:** Ensures that videos are always available for display, even when no new videos are left to shuffle.

AVP is designed to be simple, lightweight, and highly functional, making it a versatile tool for a wide range of video presentation needs.

### Keyboard Shortcuts & Usage Tips

- **Mute/Unmute on Hover:** Videos are muted by default; the one you hover will play audio.

- **Shuffle Videos:** Press `r` to shuffle the videos in the grid.
- **Auto-Shuffle Toggle:** Press `l` to enable or disable auto-shuffling.
- **Fullscreen Toggle:** Click a video to toggle fullscreen styling (not browser fullscreen).
- **Play/Pause All Videos:** Press the space bar to toggle play/pause for all videos.
- **Pin Video:** Click the pin button (📌) or hover and press `p` to pin/unpin.
- **Adjust Grid Size:** Use minus (`-`) and plus (`+`) keys or the number input.
- **Change Video Position:** Use left/right arrow keys to seek, or drag across the video area to scrub.
- **Scrubbing Mode:** Press `s` to start scrubbing mode and `d` to stop. While scrubbing is active, all videos are paused, and you can move the mouse left or right to adjust the position of all videos based on the cursor's horizontal position. When scrubbing stops, all videos resume playback.
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
  gridShuffle.js # Grid shuffling logic, including fallback video handling
  util.js       # Utility functions (throttle, debounce, grid template)
  video.js      # Video-specific utilities
  viewTransitionUtil.js # Utilities for view transitions
```

### Setup, Customization & Requirements

- No build step required. Just open `index.html` in a browser.
- **Important:** All `<script>` tags in `index.html` must include the `defer` attribute to ensure proper script execution order.
- Customize grid size, shuffle interval, and shortcuts in `scripts.js` and `index.html`.
- Style the grid and controls via `styles.css`.
- Requires a modern browser (Chrome, Firefox, Edge, Safari).
- Local video files are needed for preview.

### Project Philosophy

This project is designed to be simple and lightweight, relying only on JavaScript, HTML, and CSS. It avoids the need for a build process, ensuring that you can run it directly in the browser without additional tools or configurations.

#### Why Not Use ES6 Imports/Exports?

While ES6 `import` and `export` statements are powerful, they require a build process (e.g., using Babel) to ensure compatibility across all browsers. Additionally, using ES6 modules with the `type="module"` attribute in `<script>` tags introduces CORS restrictions when running the project directly from the file system (`file://` protocol). Browsers block such requests for security reasons, requiring the project to be served via a local server.

This project is intentionally designed to work directly with the `file://` protocol, allowing users to open `index.html` in their browser without needing a local server or additional setup. To achieve this simplicity and accessibility, we use global variables and functions instead of module imports/exports. This approach eliminates the need for tools like Babel or Webpack and ensures the project remains easy to set up and use.

### Future Enhancements

In the near future, this project may adopt ES6 `import` and `export` statements along with the `type="module"` attribute in `<script>` tags. This would modernize the codebase and improve modularity. However, this change would require serving files via a local server and targeting only modern browsers (released after 2017) that support ES6 modules natively.

For now, the project avoids this to maintain simplicity and compatibility without requiring a build process or additional tools.

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
- Only local video files are supported; network streams are not.
- Some browsers may restrict autoplay or fullscreen behavior.
- Pinning is per session and not persisted after reload.
- Large video pools may impact performance.

### Troubleshooting

- If videos do not play, check browser permissions for autoplay and local file access.
- Ensure all `<script>` tags in `index.html` include the `defer` attribute to avoid script execution issues.
- For best results, use modern browsers (Chrome, Firefox, Edge, Safari).

### Contributing

- Pull requests and feature suggestions are welcome!
- See `scripts.js` for main logic and add new features in the `helpers/` directory.

### License

MIT
