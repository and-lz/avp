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
 * Attaches fullscreen handlers to all videos.
 */
function attachFullscreenHandlers() {
  const videos = document.querySelectorAll("video");
  videos.forEach((video) => {
    video.addEventListener("dblclick", () => handleFullscreen(video, videos));
  });
}

/**
 * Handles fullscreen mode for the video.
 * @param {HTMLVideoElement} video - The video element to handle.
 * @param {NodeListOf<HTMLVideoElement>} videos - All video elements.
 */
function handleFullscreen(video, videos) {
  pauseOtherVideos(video, videos);
  window.dom.toggleVideoStyles(video, true);
  video.addEventListener(
    "dblclick",
    function exitFullscreenHandler() {
      window.dom.toggleVideoStyles(video, false);
      playAllVideos(videos);
      video.removeEventListener("dblclick", exitFullscreenHandler);
    },
    { once: true }
  );
}

/**
 * Pauses all videos except the current one.
 * @param {HTMLVideoElement} current - The current video element.
 * @param {NodeListOf<HTMLVideoElement>} videos - All video elements.
 */
function pauseOtherVideos(current, videos) {
  videos.forEach((v) => {
    if (v !== current) v.pause();
  });
}

/**
 * Plays all videos in the list.
 * @param {NodeListOf<HTMLVideoElement>} videos - All video elements to play.
 */
function playAllVideos(videos) {
  videos.forEach((v) => v.play());
}

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

// Export functions to window for global use
window.videoUtil = {
  getVideoKey,
  setVideoSource,
  addScrubHandler,
  attachFullscreenHandlers,
  applyVideosFromPool,
  pauseAllVideos,
  playAllVideos,
};
