// Voice Command Script
// This script listens for the user to say "change" and simulates pressing the 'R' key.

// Check for browser support
if (
  !("webkitSpeechRecognition" in window) &&
  !("SpeechRecognition" in window)
) {
  alert(
    "Your browser does not support speech recognition. Please use a compatible browser."
  );
} else {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.lang = "en-US";
  recognition.interimResults = true; // Enable interim results for faster detection

  let lastCommandTime = 0; // To debounce commands
  const CONFIDENCE_THRESHOLD = 0.8; // Minimum confidence level

  let isRecognitionActive = false;

  recognition.onresult = function (event) {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const command = event.results[i][0].transcript.trim().toLowerCase();
      const confidence = event.results[i][0].confidence;
      console.log("Heard command:", command, "with confidence:", confidence);

      if (
        confidence >= CONFIDENCE_THRESHOLD &&
        event.results[i].isFinal &&
        command === "change"
      ) {
        const now = Date.now();
        if (now - lastCommandTime > 2000) {
          // Debounce: 2 seconds
          lastCommandTime = now;

          // Simulate pressing the 'R' key
          const event = new KeyboardEvent("keydown", { key: "r" });
          document.dispatchEvent(event);

          // Show a toast notification
          const toast = document.createElement("div");
          toast.textContent = 'Command "change" detected!';
          toast.style.position = "fixed";
          toast.style.bottom = "20px";
          toast.style.left = "50%";
          toast.style.transform = "translateX(-50%)";
          toast.style.backgroundColor = "#333";
          toast.style.color = "#fff";
          toast.style.padding = "10px 20px";
          toast.style.borderRadius = "5px";
          toast.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.3)";
          toast.style.zIndex = "1000";
          document.body.appendChild(toast);
          setTimeout(() => document.body.removeChild(toast), 3000);
        }
      }
    }
  };

  recognition.onerror = function (event) {
    if (event.error === "not-allowed") {
      alert(
        "Microphone access denied. Please enable it in your browser settings."
      );
    } else {
      console.error("Speech recognition error:", event.error);
    }
  };

  recognition.onstart = function () {
    // Removed micIndicator display logic
  };

  recognition.onend = function () {
    // Removed micIndicator display logic
    console.log("Speech recognition ended. Restarting...");
    recognition.start(); // Restart recognition
  };

  function toggleSpeechRecognition() {
    if (isRecognitionActive) {
      recognition.stop();
      isRecognitionActive = false;
      console.log("Speech recognition stopped.");
    } else {
      recognition.start();
      isRecognitionActive = true;
      console.log("Speech recognition started.");
    }
  }

  // Start listening
  recognition.start();
}
