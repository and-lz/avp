// Common parameters for the application
const APP_CONFIG = {
  basePath:
    "/Users/andreluiz/Library/Mobile Documents/com~apple~CloudDocs/avp/",
  shortcuts: {
    shuffleVideos: "r",
  },
};

// Helper function to create and configure video elements
function createVideoElement(id) {
  const video = document.createElement("video");
  video.id = id;
  video.controls = false;
  video.preload = false;
  video.muted = true;
  video.style.cursor = "default";
  video.style.userSelect = "none";
  return video;
}

// Helper function to create and configure input elements
function createInputElement(id, accept = "video/*", multiple = true) {
  const input = document.createElement("input");
  input.type = "file";
  input.id = id;
  input.accept = accept;
  input.multiple = multiple;
  return input;
}

// Helper function to throttle function calls
function throttle(fn, wait) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    }
  };
}

// Helper function to set styles on an element
function setStyles(element, styles) {
  Object.assign(element.style, styles);
}

// Grid templates optimized for 16:9 videos
function getGridTemplate(size) {
  if (size === 4) return { cols: 2, rows: 2 }; // 2x2
  if (size === 6) return { cols: 3, rows: 2 }; // 3x2
  if (size === 9) return { cols: 3, rows: 3 }; // 3x3 (square, but common)
  if (size === 12) return { cols: 4, rows: 3 }; // 4x3
  return { cols: 3, rows: 2 };
}

let videoPool = [];
let videoPoolIndex = 0;
let shuffledVideoPool = [];
let shownVideos = new Set();

// Replace renderGrid and addScrubHandler calls with imported functions
// Update other parts of the script to use helper functions from dom.js and grid.js
function initializeGrid(size) {
  const grid = document.getElementById("videoGrid");
  grid.innerHTML = "";
  const { cols, rows } = getGridTemplate(size);
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  for (let i = 0; i < size; i++) {
    const container = document.createElement("div");
    container.className = "video-container";
    const video = createVideoElement(`video${i}`);
    const input = createInputElement(`input${i}`);
    container.appendChild(video);
    container.appendChild(input);
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

document.addEventListener("DOMContentLoaded", () => {
  // Load video file names from local storage
  const savedVideoFileNames = JSON.parse(localStorage.getItem("videoPool"));
  const basePath =
    "/Users/andreluiz/Library/Mobile Documents/com~apple~CloudDocs/avp/";

  if (savedVideoFileNames && savedVideoFileNames.length > 0) {
    // Use cached file names and prefix with base path
    videoPool = savedVideoFileNames.map((name) => new File([], name)); // Simulate file picking
    const gridSize = parseInt(document.getElementById("gridSize").value, 10);
    initializeGrid(gridSize);
    for (let i = 0; i < gridSize; i++) {
      const v = document.getElementById("video" + i);
      if (savedVideoFileNames[i]) {
        v.src = basePath + savedVideoFileNames[i];
        v.muted = true;
        v.load();
        v.onloadedmetadata = function () {
          v.currentTime = v.duration * 0.5;
          v.play();
        };
      } else {
        v.src = "";
      }
    }
    // Play all videos after loading
    setTimeout(() => {
      for (let i = 0; i < gridSize; i++) {
        const v = document.getElementById("video" + i);
        if (v.src) {
          v.play();
        }
      }
    }, 500);
    console.log(
      "Videos loaded from local storage file names with base path and all are playing."
    );
  }
});

// Update key event listener to use the 'R' key for changing videos
document.addEventListener("keydown", function (e) {
  if (e.key === APP_CONFIG.shortcuts.shuffleVideos && videoPool.length > 0) {
    // Shuffle pool and pick gridSize videos
    const shuffled = videoPool.slice().sort(() => Math.random() - 0.5);
    for (let i = 0; i < gridSize; i++) {
      const v = document.getElementById("video" + i);
      if (shuffled[i]) {
        const url = URL.createObjectURL(shuffled[i]);
        v.src = url;
        v.muted = true;
        v.load();
        v.onloadedmetadata = function () {
          v.currentTime = v.duration * 0.5;
          v.play();
        };
      } else {
        v.src = "";
      }
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
// Throttle helper
function throttle(fn, wait) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    }
  };
}

function addScrubHandler(video) {
  const throttledScrub = throttle(function (e) {
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

      setFullscreenVideoStyles(video);

      video.addEventListener(
        "click",
        function exitFullscreenHandler() {
          resetVideoStyles(video);

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

// Helper function to reset video styles
function resetVideoStyles(video) {
  video.style.position = "";
  video.style.top = "";
  video.style.left = "";
  video.style.width = "";
  video.style.height = "";
  video.style.zIndex = "";
  video.style.backgroundColor = "";
}

// Helper function to set fullscreen video styles
function setFullscreenVideoStyles(video) {
  video.style.position = "fixed";
  video.style.top = "0";
  video.style.left = "0";
  video.style.width = "100vw";
  video.style.height = "100vh";
  video.style.zIndex = "1000";
  video.style.backgroundColor = "#000";
}

function applyVideosFromPool() {
  const gridSize = parseInt(document.getElementById("gridSize").value, 10);
  initializeGrid(gridSize);

  if (videoPool.length > 0) {
    // Shuffle pool only once if not already shuffled or if all videos have been shown
    if (
      shuffledVideoPool.length === 0 ||
      shownVideos.size >= videoPool.length
    ) {
      shuffledVideoPool = videoPool.slice().sort(() => Math.random() - 0.5);
      shownVideos.clear(); // Reset the set when reshuffling
    }

    for (let i = 0; i < gridSize; i++) {
      const v = document.getElementById("video" + i);

      // Find the next video that hasn't been shown yet
      let file;
      while (videoPoolIndex < shuffledVideoPool.length) {
        file = shuffledVideoPool[videoPoolIndex];
        videoPoolIndex++;
        if (!shownVideos.has(file)) {
          shownVideos.add(file);
          break;
        }
      }

      if (file) {
        const url = URL.createObjectURL(file);
        v.src = url;
        v.muted = true;
        v.load();
        v.onloadedmetadata = function () {
          v.currentTime = v.duration * 0.5;
          v.play();
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
      setFullscreenVideoStyles(video);

      // Exit fullscreen on second click
      video.addEventListener(
        "click",
        () => {
          resetVideoStyles(video);
        },
        { once: true }
      );
    });
  });
});
