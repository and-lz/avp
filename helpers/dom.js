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

function setFullscreenVideoStyles(video) {
  video.style.position = "fixed";
  video.style.top = "0";
  video.style.left = "0";
  video.style.width = "100vw";
  video.style.height = "100vh";
  video.style.zIndex = "1000";
  video.style.backgroundColor = "#000";
}

function resetVideoStyles(video) {
  video.style.position = "";
  video.style.top = "";
  video.style.left = "";
  video.style.width = "";
  video.style.height = "";
  video.style.zIndex = "";
  video.style.backgroundColor = "";
}

window.dom = {
  createVideoElement,
  createInputElement,
  setStyles,
  setFullscreenVideoStyles,
  resetVideoStyles,
};
