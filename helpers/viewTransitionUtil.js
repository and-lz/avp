// Utility functions for View Transition API

/**
 * Checks if the View Transition API is supported in the current browser.
 * @returns {boolean} True if supported, false otherwise.
 */
function isViewTransitionSupported() {
  return typeof document.startViewTransition === "function";
}

/**
 * Executes a callback within a View Transition if supported.
 * @param {Function} callback - The function to execute during the transition.
 */
function executeViewTransition(callback) {
  if (isViewTransitionSupported()) {
    document.startViewTransition(callback);
  } else {
    callback();
  }
}

// Export functions to window for global use
window.viewTransitionUtil = {
  isViewTransitionSupported,
  executeViewTransition,
};
