/**
 * Applies videos from the pool to the grid. Initializes the grid and sets video sources.
 * @param {boolean} forceReload - Whether to force reload the videos.
 */
function applyVideosFromPool(forceReload = false) {
  initializeGrid(gridSize);
  videoPoolIndex = 0;
  if (videoPool.length === 0) {
    console.log("No videos in the pool. Please select videos first.");
    return;
  }
  if (shouldReshufflePool(forceReload)) {
    reshuffleVideoPool();
  }
  for (let i = 0; i < gridSize; i++) {
    const v = document.getElementById("video" + i);
    const filePath = getNextUnshownVideo();
    setVideoSource(v, filePath, true);
  }
}

/**
 * Determines if the video pool should be reshuffled.
 * @param {boolean} forceReload - Whether to force reload the videos.
 * @returns {boolean} - True if the pool should be reshuffled, false otherwise.
 */
function shouldReshufflePool(forceReload) {
  return (
    forceReload ||
    shuffledVideoPool.length === 0 ||
    shownVideos.size >= videoPool.length
  );
}

/**
 * Reshuffles the video pool and clears the set of shown videos.
 */
function reshuffleVideoPool() {
  shuffledVideoPool = shuffleArray(videoPool);
  shownVideos.clear();
}

/**
 * Gets the next unshown video from the shuffled pool.
 * @returns {string} - The file path of the next unshown video, or an empty string if none are available.
 */
function getNextUnshownVideo() {
  let filePath;
  while (videoPoolIndex < shuffledVideoPool.length) {
    filePath = shuffledVideoPool[videoPoolIndex];
    videoPoolIndex++;
    if (!shownVideos.has(filePath)) {
      shownVideos.add(filePath);
      return filePath;
    }
  }
  return "";
}

// Scrubbing is now per-video: mousemove over a video sets only that video's currentTime
/**
 * Adds a scrub handler to the video for mouse movement.
 * @param {HTMLVideoElement} video - The video element to add the scrub handler to.
 */
function addScrubHandler(video) {
  let isDragging = false;
  const throttledScrub = window.util.throttle(function (e) {
    if (!isDragging) return;
    if (!canScrub(video)) return;
    scrubVideoToMouse(video, e);
  }, 100);
  video.addEventListener("mousedown", () => (isDragging = true));
  window.addEventListener("mouseup", () => (isDragging = false));
  video.addEventListener("mousemove", throttledScrub);
}

/**
 * Checks if the video can be scrubbed.
 * @param {HTMLVideoElement} video - The video element to check.
 * @returns {boolean} - True if the video can be scrubbed, false otherwise.
 */
function canScrub(video) {
  return video.readyState >= 1 && !!video.duration;
}

/**
 * Scrubs the video to the mouse position.
 * @param {HTMLVideoElement} video - The video element to scrub.
 * @param {MouseEvent} e - The mouse event containing the position.
 */
function scrubVideoToMouse(video, e) {
  const rect = video.getBoundingClientRect();
  const percent = Math.min(
    Math.max((e.clientX - rect.left) / rect.width, 0),
    1
  );
  video.currentTime = percent * video.duration;
}

/**
 * Attaches click handlers for fullscreen functionality.
 */
function attachFullscreenClickHandlers() {
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

// Ensure window.videoUtil is initialized
window.videoUtil = window.videoUtil || {};

// Export the function for use in other files
window.videoUtil.attachFullscreenClickHandlers = attachFullscreenClickHandlers;

/**
 * Gets a unique key for a video source.
 * @param {File|Blob|string} src - The video source.
 * @returns {string} - The unique key for the video source.
 */
function getVideoKey(src) {
  if (src instanceof File) return src.name;
  if (src instanceof Blob && src.name) return src.name;
  if (typeof src === "string") return src;
  return String(src);
}

/**
 * Sets the video source and optionally plays the video.
 * @param {HTMLVideoElement} video - The video element to set the source for.
 * @param {File|Blob|string} src - The video source.
 * @param {boolean} [play=true] - Whether to play the video after setting the source.
 */
function setVideoSource(video, src, play = true) {
  if (!video) return;
  if (!src) {
    video.src = "";
    return;
  }
  if (video.src) {
    URL.revokeObjectURL(video.src);
  }
  video.src = src;
  video.muted = true;
  video.load();
  video.onloadedmetadata = function () {
    video.currentTime = video.duration * 0.5;
    if (play) tryPlayVideo(video);
  };
}

/**
 * Tries to play the video, logging an error if playback fails.
 * @param {HTMLVideoElement} video - The video element to play.
 */
function tryPlayVideo(video) {
  video.play().catch((error) => {
    console.error("Video playback failed:", error);
  });
}

/**
 * Pauses all videos on the page.
 */
function pauseAllVideos() {
  const videos = document.querySelectorAll("video");
  videos.forEach((video) => video.pause());
}

/**
 * Plays all videos on the page.
 */
function playAllVideos() {
  const videos = document.querySelectorAll("video");
  videos.forEach((video) =>
    video.play().catch((error) => {
      console.error("Video playback failed:", error);
    })
  );
}

/**
 * Handles the play/pause toggle on space key press.
 * @param {KeyboardEvent} e - The keydown event.
 * @returns {boolean} True if handled, false otherwise.
 */
function handlePlayPauseKey(e) {
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
 * Handles the seek functionality with arrow keys.
 * @param {KeyboardEvent} e - The keydown event.
 * @returns {boolean} True if handled, false otherwise.
 */
function handleArrowKey(e) {
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
 * Toggles the scrubbing feature on 'S' key press.
 * @param {KeyboardEvent} e - The keydown event.
 * @returns {boolean} True if handled, false otherwise.
 */
function handleScrubbingToggle(e) {
  if (e.key === "s" && !document.body.classList.contains("scrubbing")) {
    document.body.classList.add("scrubbing");
    window.videoUtil.pauseAllVideos();

    const handleMouseMove = window.util.throttle((event) => {
      const videos = document.querySelectorAll("video");
      const screenWidth = window.innerWidth;
      const mouseX = event.clientX;
      const positionRatio = mouseX / screenWidth;

      videos.forEach((video) => {
        if (!isNaN(video.duration)) {
          video.currentTime = video.duration * positionRatio;
        }
      });
    }, 100);

    document.addEventListener("mousemove", handleMouseMove);

    const exitScrubbing = (event) => {
      if (event.key === "d") {
        document.body.classList.remove("scrubbing");
        window.videoUtil.playAllVideos();
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("keydown", exitScrubbing);
      }
    };

    document.addEventListener("keydown", exitScrubbing);
    return true;
  }

  return false;
}

// Export functions and handlers to window for global use
window.videoUtil = {
  getVideoKey,
  setVideoSource,
  addScrubHandler,
  applyVideosFromPool,
  pauseAllVideos,
  playAllVideos,
};

window.videoHandlers = {
  handlePlayPauseKey,
  handleArrowKey,
  handleScrubbingToggle,
};
