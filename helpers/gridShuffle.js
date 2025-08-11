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
    if (v && v.src) {
      currentGridVideos.add(v.src);
    }
  }
  return currentGridVideos;
}

function getAvailableVideos(currentGridVideos) {
  return videoPool.filter((src) => {
    const key = window.videoUtil.getVideoKey(src);
    let onGrid = false;
    for (let vSrc of currentGridVideos) {
      if (vSrc.includes(key)) {
        onGrid = true;
        break;
      }
    }
    return !onGrid && !shownVideos.has(key);
  });
}

function getFallbackVideos(currentGridVideos) {
  return videoPool.filter((src) => {
    const key = window.videoUtil.getVideoKey(src);
    let onGrid = false;
    for (let vSrc of currentGridVideos) {
      if (vSrc.includes(key)) {
        onGrid = true;
        break;
      }
    }
    return !onGrid;
  });
}

function setGridVideos(shuffled, currentGridVideos) {
  let shuffledIdx = 0;
  for (let i = 0; i < gridSize; i++) {
    const v = document.getElementById("video" + i);
    if (!pinnedVideos[i]) {
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
        shownVideos.add(key);
      }
      window.videoUtil.setVideoSource(v, url);
      shuffledIdx++;
    }
  }
}

function shuffleVideosOnGrid() {
  if (videoPool.length === 0) {
    console.log("Video pool is empty. Cannot shuffle videos.");
    return;
  }
  const currentGridVideos = getCurrentGridVideos(gridSize);
  let availableVideos = getAvailableVideos(currentGridVideos);
  if (availableVideos.length === 0) {
    shownVideos.clear();
    availableVideos = getFallbackVideos(currentGridVideos);
  }
  const shuffled = window.videoUtil.shuffleArray(availableVideos);
  setGridVideos(shuffled, currentGridVideos);
}

function attachHandlers(gridSize) {
  Array.from({ length: gridSize }).forEach((_, i) => {
    const video = document.getElementById("video" + i);
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
  pinBtn.dataset.pinned = pinnedVideos[i] ? "true" : "false";
  pinBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    pinnedVideos[i] = !pinnedVideos[i];
    pinBtn.dataset.pinned = pinnedVideos[i] ? "true" : "false";
  });
  return pinBtn;
}

function initializeGrid(gridSize) {
  const grid = document.getElementById("videoGrid");
  grid.innerHTML = "";

  const { cols, rows } = window.util.getGridTemplate(gridSize);
  window.grid.setGridStyles(grid, cols, rows);

  const fragment = document.createDocumentFragment();
  Array.from({ length: gridSize }).forEach((_, i) => {
    const container = window.grid.createVideoContainer(i);
    const pinBtn = createPinButton(i);
    container.style.position = "relative";
    container.appendChild(pinBtn);
    fragment.appendChild(container);
  });
  grid.appendChild(fragment);

  attachHandlers(gridSize);
  attachFullscreenHandlers();
}
