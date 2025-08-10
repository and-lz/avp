// Utility functions for throttling and grid templates
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

function getGridTemplate(size) {
  // Dynamically calculate columns for a roughly square grid
  return { cols: Math.ceil(Math.sqrt(size)) };
}

function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

window.util = {
  throttle,
  getGridTemplate,
  debounce,
};
