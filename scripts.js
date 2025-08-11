class VideoGridManager {
  constructor(gridSize = 4) {
    this.gridSize = gridSize;
    this.pinnedVideos = [];
    this.shownVideos = new Set();
    this.videoPool = [];
    this.autoShuffleInterval = null;
    this.init();
  }

  init() {
    this.initializeGrid(this.gridSize);
    this.setupPoolButton();
    this.setupPoolInput();
    this.setupKeydownListener();
    this.setupGridSizeListener();
    this.attachFullscreenClickHandlers();
  }

  setupPoolButton() {
    document.getElementById("poolBtn").addEventListener("click", () => {
      document.getElementById("poolInput").click();
    });
  }

  setupPoolInput() {
    document
      .getElementById("poolInput")
      .addEventListener("change", (e) => this.handlePoolInput(e));
  }

  setupKeydownListener() {
    document.addEventListener("keydown", (e) => this.handleKeydown(e));
  }

  setupGridSizeListener() {
    document
      .getElementById("gridSize")
      .addEventListener("change", window.videoUtil.applyVideosFromPool);
  }

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

  handleShuffleVideosKey(e) {
    if (e.key === APP_CONFIG.shortcuts.shuffleVideos) {
      window.shuffleVideosOnGrid();
      return true;
    }
    return false;
  }

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

  handleGridIncreaseKey(e) {
    if (e.key === "+" || e.key === "=") {
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
      return true;
    }
    return false;
  }

  handleGridDecreaseKey(e) {
    if (e.key === "-" || e.key === "_" || e.key === "–") {
      if (this.gridSize <= 1) return true;
      this.gridSize -= 1;
      this.pinnedVideos.length = this.gridSize;
      this.initializeGrid(this.gridSize);
      this.applyVideosToGrid();
      return true;
    }
    return false;
  }

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

  // Existing methods below remain unchanged
  startAutoShuffle() {
    if (this.autoShuffleInterval) return;
    this.autoShuffleInterval = setInterval(window.shuffleVideosOnGrid, 3000);
    console.log("Auto-shuffle started");
  }

  stopAutoShuffle() {
    if (!this.autoShuffleInterval) return;
    clearInterval(this.autoShuffleInterval);
    this.autoShuffleInterval = null;
    console.log("Auto-shuffle stopped");
  }

  initializeGrid(gridSize) {
    window.initializeGrid(gridSize);
  }

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

// Initialize the manager
window.videoGridManager = new VideoGridManager();
