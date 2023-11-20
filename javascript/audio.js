document.addEventListener("DOMContentLoaded", function() {
    const audio = document.getElementById("audio");
    const playPauseButton = document.getElementById("sound");
    
  
    // Function to play audio on click
    playPauseButton.addEventListener("click", () => {
      if (audio.paused) {
        audio.currentTime = 0;
        audio.play();
        playPauseButton.textContent = "Pause";
      } else {
        audio.pause();
        playPauseButton.textContent = "Play";
      }
    });
  
    audio.addEventListener("ended", () => {
      audio.currentTime = 0;
      audio.play();
    });
  });