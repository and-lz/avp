// Scrubbing is now per-video: mousemove over a video sets only that video's currentTime
function addScrubHandler(video) {
  let isDragging = false;
  const throttledScrub = window.util.throttle(function (e) {
    if (!isDragging) return;
    if (video.readyState < 1 || !video.duration) return;
    const rect = video.getBoundingClientRect();
    const percent = Math.min(
      Math.max((e.clientX - rect.left) / rect.width, 0),
      1
    );
    video.currentTime = percent * video.duration;
  }, 100);
  video.addEventListener("mousedown", function () {
    isDragging = true;
  });
  window.addEventListener("mouseup", function () {
    isDragging = false;
  });
  video.addEventListener("mousemove", throttledScrub);
}

function attachFullscreenHandlers() {
  const videos = document.querySelectorAll("video");
  videos.forEach((video) => {
    video.addEventListener("dblclick", function fullscreenHandler() {
      videos.forEach((v) => {
        if (v !== video) {
          v.pause();
        }
      });

      window.dom.toggleVideoStyles(video, true);

      video.addEventListener(
        "dblclick",
        function exitFullscreenHandler() {
          window.dom.toggleVideoStyles(video, false);

          videos.forEach((v) => {
            v.play();
          });

          video.removeEventListener("dblclick", exitFullscreenHandler);
        },
        { once: true }
      );
    });
  });
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
  addScrubHandler,
  attachFullscreenHandlers,
};
