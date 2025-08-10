// Removed ES6 import and updated references to use window.grid

// Refactored initializeGrid function
function initializeGrid(size) {
  const grid = document.getElementById("videoGrid");
  grid.innerHTML = "";

  const { cols, rows } = window.util.getGridTemplate(size);
  window.grid.setGridStyles(grid, cols, rows);

  for (let i = 0; i < size; i++) {
    const container = window.grid.createVideoContainer(i);
    grid.appendChild(container);
  }

  attachHandlers(size);
  attachFullscreenHandlers();
}

// Pool input and button logic
document.getElementById("poolBtn").addEventListener("click", function () {
  document.getElementById("poolInput").click();
});

document.getElementById("poolInput").addEventListener("change", function (e) {
  videoPool = Array.from(e.target.files);

  if (videoPool.length === 0) {
    console.log("No videos selected for pool.");
  } else {
    // Save full file paths using the provided directory
    const videoFilePaths = videoPool.map(
      (file) => APP_CONFIG.basePath + file.name
    );
    localStorage.setItem("videoPoolPaths", JSON.stringify(videoFilePaths));
    console.log("Saved video file paths to localStorage:", videoFilePaths);
  }
});

// Helper function to load videos from local storage
function loadVideosFromLocalStorage() {
  const savedVideoFileNames = JSON.parse(localStorage.getItem("videoPool"));
  const basePath = APP_CONFIG.basePath;

  if (savedVideoFileNames && savedVideoFileNames.length > 0) {
    videoPool = savedVideoFileNames.map((name) => basePath + name);
    return true;
  }
  return false;
}

// Helper function to set video source and playback
function setVideoSourceAndPlay(video, src) {
  video.src = src;
  video.muted = true;
  video.load();
  video.onloadedmetadata = function () {
    video.currentTime = video.duration * 0.5;
    video.play().catch((error) => {
      console.error("Video playback failed:", error);
    });
  };
}

// Refactored DOMContentLoaded logic
function handleDOMContentLoaded() {
  if (loadVideosFromLocalStorage()) {
    const gridSize = parseInt(document.getElementById("gridSize").value, 10);
    initializeGrid(gridSize);

    for (let i = 0; i < gridSize; i++) {
      const video = document.getElementById(`video${i}`);
      const src = videoPool[i];
      if (src) {
        setVideoSourceAndPlay(video, src);
      } else {
        video.src = "";
      }
    }

    setTimeout(() => {
      for (let i = 0; i < gridSize; i++) {
        const video = document.getElementById(`video${i}`);
        if (video.src) {
          video.play().catch((error) => {
            console.error("Video playback failed:", error);
          });
        }
      }
    }, 500);

    console.log("Videos loaded from local storage and are playing.");
  }
}

document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);

// Update key event listener to use the 'R' key for changing videos
document.addEventListener("keydown", function (e) {
  console.log("Key pressed:", e.key);
  console.log("Video pool length:", videoPool.length);

  if (e.key === APP_CONFIG.shortcuts.shuffleVideos) {
    if (videoPool.length > 0) {
      console.log("Shuffling videos...");
      // Shuffle pool and pick gridSize videos
      const shuffled = videoPool.slice().sort(() => Math.random() - 0.5);
      for (let i = 0; i < gridSize; i++) {
        const v = document.getElementById("video" + i);
        if (shuffled[i]) {
          let url;
          if (shuffled[i] instanceof File || shuffled[i] instanceof Blob) {
            url = URL.createObjectURL(shuffled[i]);
          } else if (typeof shuffled[i] === "string") {
            // Assume it's a file path and use it directly
            url = shuffled[i];
          } else {
            console.error("Invalid video file in shuffled pool:", shuffled[i]);
            v.src = "";
            continue;
          }

          if (v) {
            v.src = url;
            v.muted = true;
            v.load();
            v.onloadedmetadata = function () {
              v.currentTime = v.duration * 0.5;
              v.play();
            };
          } else {
            console.error("Video element not found for index:", i);
          }
        } else {
          console.error("Invalid video file in shuffled pool:", shuffled[i]);
          if (v) v.src = "";
        }
      }
    } else {
      console.log("Video pool is empty. Cannot shuffle videos.");
    }
  }
});

function attachHandlers(size) {
  for (let i = 0; i < size; i++) {
    const video = document.getElementById("video" + i);
    const input = document.getElementById("input" + i);

    // Remove click-to-select-file behavior
    input.addEventListener("change", (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        let start = i;
        for (let j = 0; j < files.length && start + j < size; j++) {
          const v = document.getElementById("video" + (start + j));
          const url = URL.createObjectURL(files[j]);
          v.src = url;
          v.muted = true;
          v.load();
          v.onloadedmetadata = function () {
            v.currentTime = v.duration * 0.5;
            v.play();
          };
        }
      }
    });

    // Unmute on hover, mute on leave
    video.addEventListener("mouseenter", () => {
      video.muted = false;
    });
    video.addEventListener("mouseleave", () => {
      video.muted = true;
    });

    // Add scrub handler
    addScrubHandler(video);
  }
}

// Initial grid size
let gridSize = 6;
initializeGrid(gridSize);

document.getElementById("gridSize").addEventListener("change", function (e) {
  gridSize = parseInt(e.target.value, 10);
  initializeGrid(gridSize);
});

// Scrubbing is now per-video: mousemove over a video sets only that video's currentTime
function addScrubHandler(video) {
  const throttledScrub = window.util.throttle(function (e) {
    const rect = video.getBoundingClientRect();
    const percent = Math.min(
      Math.max((e.clientX - rect.left) / rect.width, 0),
      1
    );
    if (video.readyState >= 1 && video.duration) {
      video.currentTime = percent * video.duration;
    }
  }, 1000);
  video.addEventListener("mousemove", throttledScrub);
}

function attachFullscreenHandlers() {
  const videos = document.querySelectorAll("video");
  videos.forEach((video) => {
    video.addEventListener("click", function fullscreenHandler() {
      // Pause all other videos
      videos.forEach((v) => {
        if (v !== video) {
          v.pause();
        }
      });

      // Apply fullscreen styles to the clicked video
      window.dom.toggleVideoStyles(video, true);

      video.addEventListener(
        "click",
        function exitFullscreenHandler() {
          // Reset styles
          window.dom.toggleVideoStyles(video, false);

          // Play all videos again
          videos.forEach((v) => {
            v.play();
          });

          video.removeEventListener("click", exitFullscreenHandler);
        },
        { once: true }
      );
    });
  });
}

function applyVideosFromPool(forceReload = false) {
  const gridSize = parseInt(document.getElementById("gridSize").value, 10);
  initializeGrid(gridSize);
  videoPoolIndex = 0; // Reset index when grid size changes

  if (videoPool.length > 0) {
    // Shuffle pool only once if not already shuffled or if all videos have been shown
    if (
      forceReload ||
      shuffledVideoPool.length === 0 ||
      shownVideos.size >= videoPool.length
    ) {
      shuffledVideoPool = videoPool.slice().sort(() => Math.random() - 0.5);
      shownVideos.clear(); // Reset the set when reshuffling
    }

    for (let i = 0; i < gridSize; i++) {
      const v = document.getElementById("video" + i);

      // Find the next video that hasn't been shown yet
      let filePath;
      while (videoPoolIndex < shuffledVideoPool.length) {
        filePath = shuffledVideoPool[videoPoolIndex];
        videoPoolIndex++;
        if (!shownVideos.has(filePath)) {
          shownVideos.add(filePath);
          break;
        }
      }

      if (filePath) {
        v.src = filePath;
        v.muted = true;
        v.load();
        v.onloadedmetadata = function () {
          v.currentTime = v.duration * 0.5;
          v.play().catch((error) => {
            console.error("Video playback failed:", error);
          });
        };
      } else {
        v.src = "";
      }
    }
  } else {
    console.log("No videos in the pool. Please select videos first.");
  }
}

// Ensure the function is properly connected to the dropdown
document
  .getElementById("gridSize")
  .addEventListener("change", applyVideosFromPool);

document.addEventListener("DOMContentLoaded", () => {
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
});

// Declared the missing shownVideos variable as a Set to fix the ReferenceError.
let shownVideos = new Set();
