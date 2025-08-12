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

/**
 * Applies videos from the pool to the grid.
 * @param {number} gridSize - The size of the grid.
 * @param {Array} videoPool - The pool of videos to apply.
 * @param {Array} pinnedVideos - The array indicating pinned videos.
 */
function applyVideosToGrid(gridSize, videoPool, pinnedVideos) {
  for (let i = 0; i < gridSize; i++) {
    const video = document.getElementById(`video${i}`);
    let src = "";
    if (pinnedVideos[i] && video.src) {
      continue;
    }
    if (videoPool[i]) {
      if (videoPool[i] instanceof File) {
        src = URL.createObjectURL(videoPool[i]);
      } else {
        src = videoPool[i];
      }
    }
    if (src) {
      window.videoUtil.setVideoSource(video, src, true);
    } else {
      video.src = "";
    }
  }
}

/**
 * Initializes the grid with the given size.
 * @param {number} gridSize - The size of the grid.
 */
function initializeGrid(gridSize) {
  const gridElement = document.getElementById("grid");
  if (!gridElement) return;
  gridElement.innerHTML = ""; // Clear existing grid
  for (let i = 0; i < gridSize; i++) {
    const container = window.grid.createVideoContainer(i);
    gridElement.appendChild(container);
  }
  window.grid.setGridStyles(gridElement, Math.sqrt(gridSize));
}

// Ensure window.grid is initialized
window.grid = window.grid || {};

// Export the function for use in other files
window.grid.initializeGrid = initializeGrid;

window.grid = {
  createVideoContainer,
  setGridStyles,
  applyVideosToGrid,
};
