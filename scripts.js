/**
 * Application configuration object.
 * @type {Object}
 * @property {Object} shortcuts - Keyboard shortcuts for the application.
 * @property {string} shortcuts.shuffleVideos - Key to shuffle videos.
 */
const APP_CONFIG = {
  shortcuts: {
    shuffleVideos: "r",
  },
};

/**
 * Manages the video grid and its interactions.
 */
class VideoGridManager {
  /**
   * Creates a new VideoGridManager instance.
   * @param {number} [gridSize=4] - Initial size of the video grid.
   */
  constructor(gridSize = 4) {
    this.gridSize = gridSize;
    this.pinnedVideos = [];
    this.shownVideos = new Set();
    this.videoPool = [];
    this.autoShuffleInterval = null;
    this.init();
  }

  /**
   * Initializes the video grid manager.
   */
  init() {
    this.initializeGrid(this.gridSize);
    this.setupPoolButton();
    this.setupPoolInput();
    this.setupKeydownListener();
    this.setupGridSizeListener();
    this.attachFullscreenClickHandlers();
  }

  /**
   * Sets up the pool button click listener.
   */
  setupPoolButton() {
    document.getElementById("poolBtn").addEventListener("click", () => {
      document.getElementById("poolInput").click();
    });
  }

  /**
   * Sets up the pool input change listener.
   */
  setupPoolInput() {
    document
      .getElementById("poolInput")
      .addEventListener("change", (e) => this.handlePoolInput(e));
  }

  /**
   * Sets up the keydown event listener.
   */
  setupKeydownListener() {
    document.addEventListener("keydown", (e) => this.handleKeydown(e));
  }

  /**
   * Sets up the grid size change listener.
   */
  setupGridSizeListener() {
    document
      .getElementById("gridSize")
      .addEventListener("change", window.videoUtil.applyVideosFromPool);
  }

  /**
   * Handles the pool input change event.
   * @param {Event} e - The change event.
   */
  handlePoolInput(e) {
    this.videoPool = Array.from(e.target.files);
    if (this.videoPool.length === 0) {
      console.log("No videos selected for pool.");
      return;
    }
    const selectedGridSize = parseInt(
      document.getElementById("gridSize").value,
      10
    );
    this.gridSize = selectedGridSize;
    this.initializeGrid(this.gridSize);
    for (let i = 0; i < this.gridSize; i++) {
      const video = document.getElementById(`video${i}`);
      const src = this.videoPool[i]
        ? URL.createObjectURL(this.videoPool[i])
        : "";
      if (src) {
        window.videoUtil.setVideoSource(video, src, true);
      } else {
        video.src = "";
      }
    }
  }

  /**
   * Handles the keydown event.
   * @param {KeyboardEvent} e - The keydown event.
   */
  handleKeydown(e) {
    console.log("Key pressed:", e.key);
    console.log("Video pool length:", this.videoPool.length);
    if (this.handleAutoShuffleKey(e)) return;
    if (this.handlePlayPauseKey(e)) return;
    if (this.handleShuffleVideosKey(e)) return;
    if (this.handlePinKey(e)) return;
    if (this.handleArrowKey(e)) return;
    if (this.handleGridIncreaseKey(e)) return;
    if (this.handleGridDecreaseKey(e)) return;
  }

  /**
   * Handles the auto-shuffle key press.
   * @param {KeyboardEvent} e - The keydown event.
   * @returns {boolean} True if handled, false otherwise.
   */
  handleAutoShuffleKey(e) {
    if (e.key === "l") {
      if (this.autoShuffleInterval) {
        this.stopAutoShuffle();
      } else {
        this.startAutoShuffle();
      }
      return true;
    }
    return false;
  }

  /**
   * Handles the play/pause toggle on space key press.
   * @param {KeyboardEvent} e - The keydown event.
   * @returns {boolean} True if handled, false otherwise.
   */
  handlePlayPauseKey(e) {
    if (e.code === "Space") {
      e.preventDefault();
      const videos = document.querySelectorAll("video");
      let anyPlaying = false;
      videos.forEach((video) => {
        if (!video.paused && !video.ended) {
          anyPlaying = true;
        }
      });
      videos.forEach((video) => {
        if (anyPlaying) {
          video.pause();
        } else {
          video.play().catch(() => {});
        }
      });
      return true;
    }
    return false;
  }

  /**
   * Handles the shuffle videos shortcut key.
   * @param {KeyboardEvent} e - The keydown event.
   * @returns {boolean} True if handled, false otherwise.
   */
  handleShuffleVideosKey(e) {
    if (e.key === APP_CONFIG.shortcuts.shuffleVideos) {
      window.viewTransitionUtil.executeViewTransition(() => {
        window.shuffleVideosOnGrid();
      });
      return true;
    }
    return false;
  }

  /**
   * Handles the pinning and unpinning of videos.
   * @param {KeyboardEvent} e - The keydown event.
   * @returns {boolean} True if handled, false otherwise.
   */
  handlePinKey(e) {
    if (e.key === "p") {
      const hovered = document.querySelector("video:hover");
      if (!hovered) return true;
      const idMatch = hovered.id.match(/video(\d+)/);
      if (!idMatch) return true;
      const idx = parseInt(idMatch[1], 10);
      this.pinnedVideos[idx] = !this.pinnedVideos[idx];
      // Update pin button state
      const pinBtn = hovered.parentElement.querySelector(".pin-btn");
      if (!pinBtn) return true;
      pinBtn.dataset.pinned = this.pinnedVideos[idx] ? "true" : "false";
      return true;
    }
    return false;
  }

  /**
   * Handles the seek functionality with arrow keys.
   * @param {KeyboardEvent} e - The keydown event.
   * @returns {boolean} True if handled, false otherwise.
   */
  handleArrowKey(e) {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const hovered = document.querySelector("video:hover");
      if (!hovered || isNaN(hovered.duration)) return true;
      if (e.key === "ArrowLeft") {
        hovered.currentTime = Math.max(0, hovered.currentTime - 5);
        return true;
      }
      hovered.currentTime = Math.min(hovered.duration, hovered.currentTime + 5);
      return true;
    }
    return false;
  }

  /**
   * Increases the grid size.
   * @param {KeyboardEvent} e - The keydown event.
   * @returns {boolean} True if handled, false otherwise.
   */
  handleGridIncreaseKey(e) {
    if (e.key === "+" || e.key === "=") {
      window.viewTransitionUtil.executeViewTransition(() => {
        this.gridSize += 1;
        if (this.pinnedVideos.length < this.gridSize) {
          this.pinnedVideos.length = this.gridSize;
          for (let i = 0; i < this.gridSize; i++) {
            if (typeof this.pinnedVideos[i] !== "boolean")
              this.pinnedVideos[i] = false;
          }
        }
        this.initializeGrid(this.gridSize);
        this.applyVideosToGrid();
      });
      return true;
    }
    return false;
  }

  /**
   * Decreases the grid size.
   * @param {KeyboardEvent} e - The keydown event.
   * @returns {boolean} True if handled, false otherwise.
   */
  handleGridDecreaseKey(e) {
    if (e.key === "-" || e.key === "_" || e.key === "–") {
      if (this.gridSize <= 1) return true;
      executeViewTransition(() => {
        this.gridSize -= 1;
        this.pinnedVideos.length = this.gridSize;
        this.initializeGrid(this.gridSize);
        this.applyVideosToGrid();
      });
      return true;
    }
    return false;
  }

  /**
   * Applies the videos from the pool to the grid.
   */
  applyVideosToGrid() {
    for (let i = 0; i < this.gridSize; i++) {
      const video = document.getElementById(`video${i}`);
      let src = "";
      if (this.pinnedVideos[i] && video.src) {
        continue;
      }
      if (this.videoPool[i]) {
        if (this.videoPool[i] instanceof File) {
          src = URL.createObjectURL(this.videoPool[i]);
        } else {
          src = this.videoPool[i];
        }
      }
      if (src) {
        window.videoUtil.setVideoSource(video, src, true);
      } else {
        video.src = "";
      }
    }
  }

  /**
   * Starts the auto-shuffle feature.
   */
  startAutoShuffle() {
    if (this.autoShuffleInterval) return;
    this.autoShuffleInterval = setInterval(window.shuffleVideosOnGrid, 3000);
    console.log("Auto-shuffle started");
  }

  /**
   * Stops the auto-shuffle feature.
   */
  stopAutoShuffle() {
    if (!this.autoShuffleInterval) return;
    clearInterval(this.autoShuffleInterval);
    this.autoShuffleInterval = null;
    console.log("Auto-shuffle stopped");
  }

  /**
   * Initializes the grid with the given size.
   * @param {number} gridSize - The size of the grid.
   */
  initializeGrid(gridSize) {
    window.initializeGrid(gridSize);
  }

  /**
   * Attaches click handlers for fullscreen functionality.
   */
  attachFullscreenClickHandlers() {
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
      video.addEventListener("click", () => {
        video.classList.add("fullscreen");
        video.addEventListener(
          "click",
          () => {
            video.classList.remove("fullscreen");
          },
          { once: true }
        );
      });
    });
  }
}

// Initialize the manager
window.videoGridManager = new VideoGridManager();
