// DOM utility functions for video element creation and manipulation
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

function createInputElement(id, accept = "video/*", multiple = true) {
  const input = document.createElement("input");
  input.type = "file";
  input.id = id;
  input.accept = accept;
  input.multiple = multiple;
  return input;
}

function setStyles(element, styles) {
  Object.assign(element.style, styles);
}

function toggleVideoStyles(video, isFullscreen = false, styles = {}) {
  const defaultFullscreenStyles = {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    zIndex: "1000",
    backgroundColor: "#000",
  };

  const defaultResetStyles = {
    position: "",
    top: "",
    left: "",
    width: "",
    height: "",
    zIndex: "",
    backgroundColor: "",
  };

  const appliedStyles = isFullscreen
    ? { ...defaultFullscreenStyles, ...styles }
    : { ...defaultResetStyles, ...styles };

  Object.assign(video.style, appliedStyles);
}

window.dom = {
  createVideoElement,
  createInputElement,
  setStyles,
  toggleVideoStyles,
};
