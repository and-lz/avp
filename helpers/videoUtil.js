// Utility: Get a unique key for a video source
function getVideoKey(src) {
  if (src instanceof File) return src.name;
  if (src instanceof Blob && src.name) return src.name;
  if (typeof src === "string") return src;
  return String(src);
}

// Utility: Set video source and optionally play
function setVideoSource(video, src, play = true) {
  if (video && src) {
    if (video.src) {
      URL.revokeObjectURL(video.src);
    }
    video.src = src;
    video.muted = true;
    video.load();
    video.onloadedmetadata = function () {
      video.currentTime = video.duration * 0.5;
      if (play) {
        video.play().catch((error) => {
          console.error("Video playback failed:", error);
        });
      }
    };
  } else if (video) {
    video.src = "";
  }
}

// Utility: Shuffle array
function shuffleArray(arr) {
  return arr.slice().sort(() => Math.random() - 0.5);
}

// Export functions to window for global use
window.videoUtil = {
  getVideoKey,
  setVideoSource,
  shuffleArray,
};
