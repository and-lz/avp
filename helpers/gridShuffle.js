function startAutoShuffle() {
  if (autoShuffleInterval) return;
  autoShuffleInterval = setInterval(shuffleVideosOnGrid, 3000);
  console.log("Auto-shuffle started");
}
function stopAutoShuffle() {
  if (!autoShuffleInterval) return;
  clearInterval(autoShuffleInterval);
  autoShuffleInterval = null;
  console.log("Auto-shuffle stopped");
}
function getCurrentGridVideos(gridSize) {
  const currentGridVideos = new Set();
  for (let i = 0; i < gridSize; i++) {
    const v = document.getElementById("video" + i);
    if (!v || !v.src) continue;
    currentGridVideos.add(v.src);
  }
  return currentGridVideos;
}

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

// Refactored initializeGrid function
function createPinButton(i) {
  const pinBtn = document.createElement("button");
  pinBtn.className = "pin-btn";
  pinBtn.textContent = "📌";
  pinBtn.title = "Pin/unpin this video";
  pinBtn.dataset.pinned = window.videoGridManager?.pinnedVideos[i]
    ? "true"
    : "false";
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
  attachFullscreenHandlers();
}
