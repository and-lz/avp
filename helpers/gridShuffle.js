/**
 * Starts the automatic shuffling of videos on the grid.
 * @function startAutoShuffle
 */
function startAutoShuffle() {
  if (autoShuffleInterval) return;
  autoShuffleInterval = setInterval(shuffleVideosOnGrid, 3000);
  console.log("Auto-shuffle started");
}

/**
 * Stops the automatic shuffling of videos on the grid.
 * @function stopAutoShuffle
 */
function stopAutoShuffle() {
  if (!autoShuffleInterval) return;
  clearInterval(autoShuffleInterval);
  autoShuffleInterval = null;
  console.log("Auto-shuffle stopped");
}

/**
 * Gets the currently displayed videos on the grid.
 * @function getCurrentGridVideos
 * @param {number} gridSize - The size of the grid.
 * @returns {Set} A set of currently displayed video sources.
 */
function getCurrentGridVideos(gridSize) {
  const currentGridVideos = new Set();
  for (let i = 0; i < gridSize; i++) {
    const v = document.getElementById("video" + i);
    if (!v || !v.src) continue;
    currentGridVideos.add(v.src);
  }
  return currentGridVideos;
}

/**
 * Gets the available videos that can be shown on the grid.
 * @function getAvailableVideos
 * @param {Set} currentGridVideos - A set of currently displayed video sources.
 * @returns {Array} An array of available video sources.
 */
function getAvailableVideos(currentGridVideos) {
  const videoPool = window.videoGridManager?.videoPool || [];
  return videoPool.filter((src) => {
    const key = window.videoUtil.getVideoKey(src);
    for (let vSrc of currentGridVideos) {
      if (vSrc.includes(key)) return false;
    }
    const shownVideos = window.videoGridManager?.shownVideos || new Set();
    if (shownVideos.has(key)) return false;
    return true;
  });
}

/**
 * Gets the fallback videos that can be shown on the grid if no other videos are available.
 * @function getFallbackVideos
 * @param {Set} currentGridVideos - A set of currently displayed video sources.
 * @returns {Array} An array of fallback video sources.
 */
function getFallbackVideos(currentGridVideos) {
  const videoPool = window.videoGridManager?.videoPool || [];
  return videoPool.filter((src) => {
    const key = window.videoUtil.getVideoKey(src);
    for (let vSrc of currentGridVideos) {
      if (vSrc.includes(key)) return false;
    }
    return true;
  });
}

/**
 * Sets the videos to be displayed on the grid.
 * @function setGridVideos
 * @param {Array} shuffled - An array of shuffled video sources.
 * @param {Set} currentGridVideos - A set of currently displayed video sources.
 */
function setGridVideos(shuffled, currentGridVideos) {
  let shuffledIdx = 0;
  const gridSize = window.videoGridManager?.gridSize || 4;
  for (let i = 0; i < gridSize; i++) {
    const v = document.getElementById("video" + i);
    if (window.videoGridManager?.pinnedVideos[i]) continue;
    let url = "";
    let key = "";
    if (shuffledIdx < shuffled.length) {
      const candidate = shuffled[shuffledIdx];
      key = window.videoUtil.getVideoKey(candidate);
      if (candidate instanceof File || candidate instanceof Blob) {
        url = URL.createObjectURL(candidate);
      } else if (typeof candidate === "string") {
        url = candidate;
      }
      currentGridVideos.add(url);
      const shownVideos = window.videoGridManager?.shownVideos || new Set();
      shownVideos.add(key);
    }
    window.videoUtil.setVideoSource(v, url);
    shuffledIdx++;
  }
}

/**
 * Shuffles the videos on the grid.
 * @function shuffleVideosOnGrid
 */
function shuffleVideosOnGrid() {
  const videoPool = window.videoGridManager?.videoPool || [];
  const gridSize = window.videoGridManager?.gridSize || 4;
  if (videoPool.length === 0) {
    console.log("Video pool is empty. Cannot shuffle videos.");
    return;
  }
  const currentGridVideos = getCurrentGridVideos(gridSize);
  let availableVideos = getAvailableVideos(currentGridVideos);
  if (availableVideos.length > 0) {
    const shuffled = window.util.shuffleArray(availableVideos);
    setGridVideos(shuffled, currentGridVideos);
    return;
  }
  const shownVideos = window.videoGridManager?.shownVideos || new Set();
  shownVideos.clear();
  availableVideos = getFallbackVideos(currentGridVideos);
  const shuffled = window.util.shuffleArray(availableVideos);
  setGridVideos(shuffled, currentGridVideos);
}

window.shuffleVideosOnGrid = shuffleVideosOnGrid;

/**
 * Attaches event handlers to the video elements in the grid.
 * @function attachHandlers
 * @param {number} gridSize - The size of the grid.
 */
function attachHandlers(gridSize) {
  Array.from({ length: gridSize }).forEach((_, i) => {
    const video = document.getElementById("video" + i);
    if (!video) return;
    video.addEventListener("mouseenter", () => {
      video.muted = false;
    });
    video.addEventListener("mouseleave", () => {
      video.muted = true;
    });
    window.videoUtil.addScrubHandler(video);
  });
}

/**
 * Creates a pin button for a video element.
 * @function createPinButton
 * @param {number} i - The index of the video element.
 * @returns {HTMLButtonElement} The created pin button element.
 */
function createPinButton(i) {
  const pinBtn = document.createElement("button");
  pinBtn.className = "pin-btn";
  pinBtn.textContent = "📌";
  pinBtn.title = "Pin/unpin this video";
  pinBtn.dataset.pinned = window.videoGridManager?.pinnedVideos[i]
    ? "true"
    : "false";
  pinBtn.style.viewTransitionName = `pin-btn-${i}`; // Add unique viewTransitionName
  pinBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (window.videoGridManager) {
      window.videoGridManager.pinnedVideos[i] =
        !window.videoGridManager.pinnedVideos[i];
      pinBtn.dataset.pinned = window.videoGridManager.pinnedVideos[i]
        ? "true"
        : "false";
    }
  });
  return pinBtn;
}

/**
 * Initializes the video grid.
 * @function initializeGrid
 * @param {number} gridSize - The size of the grid.
 */
function initializeGrid(gridSize) {
  const grid = document.getElementById("videoGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const { cols, rows } = window.util.getGridTemplate(gridSize);
  window.grid.setGridStyles(grid, cols, rows);

  const fragment = document.createDocumentFragment();
  Array.from({ length: gridSize }).forEach((_, i) => {
    const container = window.grid.createVideoContainer(i);
    if (!container) return;
    const pinBtn = createPinButton(i);
    container.style.position = "relative";
    container.appendChild(pinBtn);
    fragment.appendChild(container);
  });
  grid.appendChild(fragment);

  attachHandlers(gridSize);
  window.videoUtil.attachFullscreenClickHandlers();
}

// Ensure window.videoUtil.attachFullscreenClickHandlers is defined
if (!window.videoUtil.attachFullscreenClickHandlers) {
  window.videoUtil.attachFullscreenClickHandlers = function () {
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
  };
}

// Ensure window.gridShuffle is initialized
window.gridShuffle = {
  startAutoShuffle,
  stopAutoShuffle,
  getCurrentGridVideos,
  getAvailableVideos,
  getFallbackVideos, // Ensure this is included
  setGridVideos,
  shuffleVideosOnGrid,
  attachHandlers,
  createPinButton,
  initializeGrid,
  toggleAutoShuffle: function (isActive, startShuffle, stopShuffle) {
    if (isActive) {
      stopShuffle();
    } else {
      startShuffle();
      window.videoUtil.attachFullscreenClickHandlers(); // Ensure fullscreen handlers are attached
    }
    return true;
  },
};
