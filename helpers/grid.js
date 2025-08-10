// Helper function to create video and input containers
function createVideoContainer(id) {
  const container = document.createElement("div");
  container.className = "video-container";

  const video = window.dom.createVideoElement(`video${id}`);
  const input = window.dom.createInputElement(`input${id}`);

  container.appendChild(video);
  container.appendChild(input);
  return container;
}

// Helper function to initialize grid styles
function setGridStyles(grid, cols, rows) {
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  grid.style.gridAutoRows = "1fr"; // Let rows auto-flow
}

window.grid = {
  createVideoContainer,
  setGridStyles,
};
