// Initial grid size
window.gridSize = 4;
window.pinnedVideos = [];
window.shownVideos = new Set();
window.videoPool = [];
initializeGrid(window.gridSize);

// Pool input and button logic
document.getElementById("poolBtn").addEventListener("click", function () {
  document.getElementById("poolInput").click();
});

document.getElementById("poolInput").addEventListener("change", function (e) {
  videoPool = Array.from(e.target.files);
  if (videoPool.length === 0) {
    console.log("No videos selected for pool.");
    return;
  }

  // Refresh the grid with new video options using the selected grid size
  const selectedGridSize = parseInt(
    document.getElementById("gridSize").value,
    10
  );
  initializeGrid(selectedGridSize);
  for (let i = 0; i < selectedGridSize; i++) {
    const video = document.getElementById(`video${i}`);
    const src = videoPool[i] ? URL.createObjectURL(videoPool[i]) : "";
    if (src) {
      window.videoUtil.setVideoSource(video, src, true);
    } else {
      video.src = "";
    }
  }
});

// Update key event listener to use the 'R' key for changing videos
document.addEventListener("keydown", function (e) {
  console.log("Key pressed:", e.key);
  console.log("Video pool length:", videoPool.length);

  // Toggle auto-shuffle on 'L' key
  if (e.key === "l") {
    if (autoShuffleInterval) {
      stopAutoShuffle();
    } else {
      startAutoShuffle();
    }
    return;
  }

  // Toggle play/pause for all videos on space bar
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
    return;
  }

  if (e.key === APP_CONFIG.shortcuts.shuffleVideos) {
    window.shuffleVideosOnGrid();
    return;
  }

  if (e.key === "p") {
    const hovered = document.querySelector("video:hover");
    if (!hovered) return;

    const idMatch = hovered.id.match(/video(\d+)/);
    if (!idMatch) return;
    const idx = parseInt(idMatch[1], 10);
    pinnedVideos[idx] = !pinnedVideos[idx];

    // Update pin button state
    const pinBtn = hovered.parentElement.querySelector(".pin-btn");
    if (!pinBtn) return;
    pinBtn.dataset.pinned = pinnedVideos[idx] ? "true" : "false";
  }

  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    // Seek only the video being hovered
    const hovered = document.querySelector("video:hover");
    if (!hovered || isNaN(hovered.duration)) return;
    if (e.key === "ArrowLeft") {
      hovered.currentTime = Math.max(0, hovered.currentTime - 5);
      return;
    }
    hovered.currentTime = Math.min(hovered.duration, hovered.currentTime + 5);
    return;
  }

  if (e.key === "+" || e.key === "=") {
    gridSize += 1;
    // Preserve pin state and add new unpinned slot
    if (pinnedVideos.length < gridSize) {
      pinnedVideos.length = gridSize;
      for (let i = 0; i < gridSize; i++) {
        if (typeof pinnedVideos[i] !== "boolean") pinnedVideos[i] = false;
      }
    }
    initializeGrid(gridSize);
    for (let i = 0; i < gridSize; i++) {
      const video = document.getElementById(`video${i}`);
      let src = "";
      if (pinnedVideos[i] && video.src) {
        // Keep pinned video as is
        continue;
      }
      if (videoPool[i]) {
        if (videoPool[i] instanceof File) {
          src = URL.createObjectURL(videoPool[i]);
        } else {
          src = videoPool[i];
        }
      }
      if (src) {
        window.videoUtil.setVideoSource(video, src, true);
      } else {
        video.src = "";
      }
    }
    return;
  }

  if (e.key === "-" || e.key === "_" || e.key === "–") {
    if (gridSize <= 1) return;
    gridSize -= 1;
    // Trim pin state
    pinnedVideos.length = gridSize;
    initializeGrid(gridSize);
    for (let i = 0; i < gridSize; i++) {
      const video = document.getElementById(`video${i}`);
      let src = "";
      if (pinnedVideos[i] && video.src) {
        // Keep pinned video as is
        continue;
      }
      if (videoPool[i]) {
        if (videoPool[i] instanceof File) {
          src = URL.createObjectURL(videoPool[i]);
        } else {
          src = videoPool[i];
        }
      }
      if (src) {
        window.videoUtil.setVideoSource(video, src, true);
      } else {
        video.src = "";
      }
    }
    return;
  }
});

function attachHandlers(size) {
  for (let i = 0; i < size; i++) {
    const video = document.getElementById("video" + i);

    video.addEventListener("mouseenter", () => {
      video.muted = false;
    });
    video.addEventListener("mouseleave", () => {
      video.muted = true;
    });

    window.videoUtil.addScrubHandler(video);
  }
}

document
  .getElementById("gridSize")
  .addEventListener("change", window.videoUtil.applyVideosFromPool);

const videos = document.querySelectorAll("video");
videos.forEach((video) => {
  // Add fullscreen behavior on click
  video.addEventListener("click", () => {
    video.classList.add("fullscreen");

    // Exit fullscreen on second click
    video.addEventListener(
      "click",
      () => {
        video.classList.remove("fullscreen");
      },
      { once: true }
    );
  });
});
