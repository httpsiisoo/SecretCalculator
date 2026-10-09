
const calculator = document.getElementById("calculator");
const display = document.getElementById("display");
const gallery = document.getElementById("gallery");
const photoTrack = document.getElementById("photoTrack");
const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");

let expression = "";
let secretDigits = "";
let galleryOpened = false;

// Calculator buttons
document.querySelectorAll(".buttons button").forEach((button) => {
  button.addEventListener("click", () => {
    if (galleryOpened) return;

    const value = button.dataset.value;
    const action = button.dataset.action;

    if (action === "clear") {
      expression = "";
      secretDigits = "";
      display.value = "";
      return;
    }

    if (action === "delete") {
      expression = expression.slice(0, -1);
      secretDigits = "";
      display.value = expression;
      return;
    }

    if (action === "equals") {
      secretDigits = "";

      if (!expression) return;

      // Only allow basic arithmetic characters.
      if (!/^[0-9+\-*/. ()]+$/.test(expression)) {
        display.value = "Error";
        expression = "";
        return;
      }

      try {
        const result = Function(
          '"use strict"; return (' + expression + ')'
        )();

        if (!Number.isFinite(result)) {
          throw new Error("Invalid calculation");
        }

        expression = String(result);
        display.value = expression;
      } catch {
        display.value = "Error";
        expression = "";
      }

      return;
    }

    if (value !== undefined) {
      expression += value;
      display.value = expression;

      // Secret code: 1, 0, 0, 9, 2, 4
      if (/^\d$/.test(value)) {
        secretDigits += value;
        secretDigits = secretDigits.slice(-6);

        if (secretDigits === "100924") {
          openGallery();
        }
      } else {
        secretDigits = "";
      }
    }
  });
});

// Open gallery
function openGallery() {
  if (galleryOpened) return;

  galleryOpened = true;

  calculator.hidden = true;
  gallery.hidden = false;

  // Duplicate photos once for continuous scrolling.
  photoTrack.innerHTML += photoTrack.innerHTML;

  // Try autoplay. If blocked, the visitor can press the music button.
  music.play()
    .then(() => {
      musicButton.textContent = "♫ Pause Music";
    })
    .catch(() => {
      musicButton.textContent = "♫ Play Music";
    });
}

// Music play/pause
musicButton.addEventListener("click", () => {
  if (music.paused) {
    music.play()
      .then(() => {
        musicButton.textContent = "♫ Pause Music";
      })
      .catch(() => {
        musicButton.textContent = "♫ Play Music";
        alert(
          "Hindi ma-play ang music. Check kung tama ang MP3 filename at kung nasa tamang folder ito."
        );
      });
  } else {
    music.pause();
    musicButton.textContent = "♫ Play Music";
  }
});