function startAutoShuffle() {
  if (autoShuffleInterval) return;
  autoShuffleInterval = setInterval(() => {
    shuffleVideosOnGrid();
  }, 3000);
  console.log("Auto-shuffle started");
}
function stopAutoShuffle() {
  if (autoShuffleInterval) {
    clearInterval(autoShuffleInterval);
    autoShuffleInterval = null;
    console.log("Auto-shuffle stopped");
  }
}
function shuffleVideosOnGrid() {
  // Directly shuffle videos on grid, respecting pin state
  if (videoPool.length === 0) {
    console.log("Video pool is empty. Cannot shuffle videos.");
    return;
  }
  const currentGridVideos = new Set();
  for (let i = 0; i < gridSize; i++) {
    const v = document.getElementById("video" + i);
    if (v && v.src) {
      currentGridVideos.add(v.src);
    }
  }
  let availableVideos = videoPool.filter((src) => {
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
  if (availableVideos.length === 0) {
    shownVideos.clear();
    availableVideos = videoPool.filter((src) => {
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
  const shuffled = window.videoUtil.shuffleArray(availableVideos);
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

// Refactored initializeGrid function
function initializeGrid(size) {
  const grid = document.getElementById("videoGrid");
  grid.innerHTML = "";

  const { cols, rows } = window.util.getGridTemplate(size);
  window.grid.setGridStyles(grid, cols, rows);

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < size; i++) {
    const container = window.grid.createVideoContainer(i);
    // Add pin button overlay
    const pinBtn = document.createElement("button");
    pinBtn.className = "pin-btn";
    pinBtn.textContent = "📌";
    pinBtn.title = "Pin/unpin this video";
    pinBtn.dataset.pinned = pinnedVideos[i] ? "true" : "false";
    pinBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      const idx = i;
      pinnedVideos[idx] = !pinnedVideos[idx];
      pinBtn.dataset.pinned = pinnedVideos[idx] ? "true" : "false";
    });
    container.style.position = "relative";
    container.appendChild(pinBtn);
    fragment.appendChild(container);
  }
  grid.appendChild(fragment);

  attachHandlers(size);
  attachFullscreenHandlers();
}
