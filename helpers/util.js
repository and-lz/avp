/**
 * Utility functions for throttling and grid templates
 */

/**
 * Throttle a function, ensuring that it is not called again until
 * `wait` milliseconds have passed since the last call.
 *
 * @param {Function} fn - The function to throttle.
 * @param {number} wait - The number of milliseconds to wait before allowing
 *                        another call to `fn`.
 * @returns {Function} A new function that throttles calls to `fn`.
 */
function throttle(fn, wait) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    }
  };
}

/**
 * Get a grid template object for a given size, with the number of columns
 * calculated to form a roughly square grid.
 *
 * @param {number} size - The number of items for the grid.
 * @returns {Object} An object containing the number of columns (`cols`).
 */
function getGridTemplate(size) {
  return { cols: Math.ceil(Math.sqrt(size)) };
}

/**
 * Debounce a function, delaying its execution until after `delay`
 * milliseconds have passed since the last time it was invoked.
 *
 * @param {Function} fn - The function to debounce.
 * @param {number} delay - The number of milliseconds to wait before
 *                        invoking `fn` again.
 * @returns {Function} A new function that debounces calls to `fn`.
 */
function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Shuffle an array, returning a new array with the elements in random order.
 *
 * @param {Array} arr - The array to shuffle.
 * @returns {Array} A new array containing the shuffled elements.
 */
function shuffleArray(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.slice().sort(() => Math.random() - 0.5);
}

window.util = {
  throttle,
  getGridTemplate,
  debounce,
  shuffleArray,
};
