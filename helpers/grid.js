/**
 * @fileOverview This file provides helper functions to create video containers and set grid styles for the video layout.
 * @module grid
 */

/**
 * Helper function to create video and input containers
 * @function createVideoContainer
 * @param {number} id - The identifier for the video and input elements.
 * @returns {HTMLElement} The container element with the video and input elements appended.
 */
function createVideoContainer(id) {
  const container = document.createElement("div");
  container.className = "video-container";

  const video = window.dom.createVideoElement(`video${id}`);
  video.style.viewTransitionName = `video-${id}`; // Add view-transition-name to the video element

  const input = window.dom.createInputElement(`input${id}`);

  container.appendChild(video);
  container.appendChild(input);
  return container;
}

/**
 * Helper function to initialize grid styles
 * @function setGridStyles
 * @param {HTMLElement} grid - The grid element to which the styles will be applied.
 * @param {number} cols - The number of columns in the grid.
 */
function setGridStyles(grid, cols) {
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  grid.style.gridAutoRows = "1fr"; // Let rows auto-flow
}

window.grid = {
  createVideoContainer,
  setGridStyles,
};
