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
  if (size === 4) return { cols: 2, rows: 2 };
  if (size === 6) return { cols: 3, rows: 2 };
  if (size === 9) return { cols: 3, rows: 3 };
  if (size === 12) return { cols: 4, rows: 3 };
  return { cols: 3, rows: 2 };
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
