/**
 * @fileOverview DOM utility functions for video element creation and manipulation
 */

/**
 * Creates a video element with the given id.
 * @param {string} id - The id for the video element.
 * @returns {HTMLVideoElement} The created video element.
 */
function createVideoElement(id) {
  const video = document.createElement("video");
  video.id = id;
  video.controls = false;
  video.preload = "auto";
  video.muted = true;
  video.style.cursor = "default";
  video.style.userSelect = "none";
  video.style.viewTransitionName = `video-element-${id}`; // Add unique viewTransitionName
  return video;
}

/**
 * Creates a file input element with the given id.
 * @param {string} id - The id for the input element.
 * @param {string} [accept="video/*"] - The accepted file types.
 * @param {boolean} [multiple=true] - Whether multiple files can be selected.
 * @returns {HTMLInputElement} The created input element.
 */
function createInputElement(id, accept = "video/*", multiple = true) {
  const input = document.createElement("input");
  input.type = "file";
  input.id = id;
  input.accept = accept;
  input.multiple = multiple;
  return input;
}

/**
 * Sets the given styles on the element.
 * @param {HTMLElement} element - The element to set styles on.
 * @param {Object} styles - The styles to set.
 */
function setStyles(element, styles) {
  Object.assign(element.style, styles);
}

/**
 * Toggles the video element's styles between fullscreen and default.
 * @param {HTMLVideoElement} video - The video element to toggle styles for.
 * @param {boolean} [isFullscreen=false] - Whether to apply fullscreen styles.
 */
function toggleVideoStyles(video, isFullscreen = false) {
  if (isFullscreen) {
    video.classList.add("fullscreen");
  } else {
    video.classList.remove("fullscreen");
  }
}

window.dom = {
  createVideoElement,
  createInputElement,
  setStyles,
  toggleVideoStyles,
};
