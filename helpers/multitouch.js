/**
 * MultiTouchManager handles multitouch gestures for mobile devices.
 */
class MultiTouchManager {
  constructor(gridContainer, callbacks) {
    this.gridContainer = gridContainer;
    this.callbacks = callbacks;
    this.startX = 0;
    this.startY = 0;
    this.initialPinchDistance = null;
    this.isTwoFingerTap = false;
    this.isThreeFingerTap = false;
    this.attachListeners();
  }

  /**
   * Attaches touch event listeners to the grid container.
   */
  attachListeners() {
    if (!this.gridContainer) {
      console.warn(
        "Grid container element not found. Gesture listeners not attached."
      );
      return;
    }

    this.gridContainer.addEventListener("touchstart", (e) =>
      this.handleTouchStart(e)
    );
    this.gridContainer.addEventListener("touchmove", (e) =>
      this.handleTouchMove(e)
    );
    this.gridContainer.addEventListener("touchend", (e) =>
      this.handleTouchEnd(e)
    );
  }

  /**
   * Handles the touchstart event.
   * @param {TouchEvent} e - The touchstart event.
   */
  handleTouchStart(e) {
    if (e.touches.length === 2) {
      this.isTwoFingerTap = true;
      this.isThreeFingerTap = false;
      this.initialPinchDistance = this.calculateDistance(
        e.touches[0],
        e.touches[1]
      );
    } else if (e.touches.length === 3) {
      this.isThreeFingerTap = true;
      this.isTwoFingerTap = false;
    } else {
      this.isTwoFingerTap = false;
      this.isThreeFingerTap = false;
    }

    const touch = e.touches[0];
    this.startX = touch.clientX;
    this.startY = touch.clientY;
  }

  /**
   * Handles the touchmove event.
   * @param {TouchEvent} e - The touchmove event.
   */
  handleTouchMove(e) {
    if (e.touches.length === 2 && this.initialPinchDistance !== null) {
      const currentDistance = this.calculateDistance(
        e.touches[0],
        e.touches[1]
      );
      if (currentDistance < this.initialPinchDistance * 0.7) {
        console.log("Gesture: Pinch In");
        this.callbacks.onPinchIn?.();
        this.initialPinchDistance = null; // Reset to avoid multiple triggers
      }
    }
  }

  /**
   * Handles the touchend event.
   * @param {TouchEvent} e - The touchend event.
   */
  handleTouchEnd(e) {
    if (this.isTwoFingerTap) {
      console.log("Gesture: Two-Finger Tap");
      this.callbacks.onTwoFingerTap?.();
    } else if (this.isThreeFingerTap) {
      console.log("Gesture: Three-Finger Tap");
      this.callbacks.onThreeFingerTap?.();
    }

    this.initialPinchDistance = null; // Reset when touch ends
  }

  /**
   * Calculates the distance between two touch points.
   * @param {Touch} touch1 - The first touch point.
   * @param {Touch} touch2 - The second touch point.
   * @returns {number} The distance between the two touch points.
   */
  calculateDistance(touch1, touch2) {
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  }
}

// Expose MultiTouchManager globally
window.MultiTouchManager = MultiTouchManager;
