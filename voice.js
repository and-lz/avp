// Voice Command Script
// This script listens for the user to say "go" and simulates pressing the 'R' key.

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

  let isRecognitionActive = false;

  recognition.onresult = function (event) {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const command = event.results[i][0].transcript.trim().toLowerCase();
      console.log("Heard command:", command);

      console.debug(
        "Processing command:",
        command,
        "| Is Final:",
        event.results[i].isFinal
      );

      if (
        event.results[i].isFinal &&
        (command === "go" || command.includes("go")) // Match command
      ) {
        // Simulate pressing the 'R' key
        const event = new KeyboardEvent("keydown", { key: "r" });
        document.dispatchEvent(event);

        // Show a toast notification
        const toast = document.createElement("div");
        toast.textContent = 'Command "go" detected!';
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

        // Restart recognition after processing a command
        if (isRecognitionActive) {
          recognition.stop();
          setTimeout(() => recognition.start(), 500); // Restart after a short delay
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

  recognition.onspeechend = function () {
    console.log("Speech ended, but recognition is still active.");
  };

  recognition.onend = function () {
    console.log("Speech recognition ended. Restarting...");
    if (isRecognitionActive) {
      setTimeout(() => recognition.start(), 1000); // Restart after a delay
    }
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
