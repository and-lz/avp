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

function shouldReshufflePool(forceReload) {
  return (
    forceReload ||
    shuffledVideoPool.length === 0 ||
    shownVideos.size >= videoPool.length
  );
}

function reshuffleVideoPool() {
  shuffledVideoPool = shuffleArray(videoPool);
  shownVideos.clear();
}

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

function canScrub(video) {
  return video.readyState >= 1 && !!video.duration;
}

function scrubVideoToMouse(video, e) {
  const rect = video.getBoundingClientRect();
  const percent = Math.min(
    Math.max((e.clientX - rect.left) / rect.width, 0),
    1
  );
  video.currentTime = percent * video.duration;
}

function attachFullscreenHandlers() {
  const videos = document.querySelectorAll("video");
  videos.forEach((video) => {
    video.addEventListener("dblclick", () => handleFullscreen(video, videos));
  });
}

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

function pauseOtherVideos(current, videos) {
  videos.forEach((v) => {
    if (v !== current) v.pause();
  });
}

function playAllVideos(videos) {
  videos.forEach((v) => v.play());
}
// Utility: Get a unique key for a video source
function getVideoKey(src) {
  if (src instanceof File) return src.name;
  if (src instanceof Blob && src.name) return src.name;
  if (typeof src === "string") return src;
  return String(src);
}

// Utility: Set video source and optionally play
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

function tryPlayVideo(video) {
  video.play().catch((error) => {
    console.error("Video playback failed:", error);
  });
}

// Export functions to window for global use
window.videoUtil = {
  getVideoKey,
  setVideoSource,
  addScrubHandler,
  attachFullscreenHandlers,
  applyVideosFromPool,
};
