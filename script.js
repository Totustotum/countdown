const FIGJAM_URL =
  "https://www.figma.com/board/1eYF85itScr19igQmpvTk3/GD-202--Omni-Channel-Experience-UX---UI-Final-Project?node-id=0-1&t=veaBHRrScm5HD7HH-1";

// Month is zero-based: 3 = April.
const START_TIME = new Date(2026, 3, 28, 13, 15, 0);
const END_TIME = new Date(2026, 3, 28, 13, 30, 0);

const digitParts = {
  "minutes-tens": document.querySelector('[data-part="minutes-tens"]'),
  "minutes-ones": document.querySelector('[data-part="minutes-ones"]'),
  "seconds-tens": document.querySelector('[data-part="seconds-tens"]'),
  "seconds-ones": document.querySelector('[data-part="seconds-ones"]'),
};

const statusEl = document.getElementById("status");
const spokenNumbers = new Set();
let hasOpenedDestination = false;
let previousTime = "";

function speakNumber(value) {
  if (!("speechSynthesis" in window)) {
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(String(value));
  utterance.rate = 0.9;
  utterance.pitch = 0.75;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

function setDigit(el, newNumber) {
  const top = el.querySelector(".top");
  const bottom = el.querySelector(".bottom");
  const oldNumber = top.textContent;
  if (oldNumber === newNumber) {
    return;
  }

  top.textContent = oldNumber;
  bottom.textContent = newNumber;
  el.classList.remove("flipping");
  // Force reflow so the animation restarts each second.
  void el.offsetWidth;
  el.classList.add("flipping");

  window.setTimeout(() => {
    top.textContent = newNumber;
    el.classList.remove("flipping");
  }, 320);
}

function updateDisplay(minutes, seconds) {
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  const current = `${mm}:${ss}`;

  if (current === previousTime) {
    return;
  }

  previousTime = current;
  setDigit(digitParts["minutes-tens"], mm[0]);
  setDigit(digitParts["minutes-ones"], mm[1]);
  setDigit(digitParts["seconds-tens"], ss[0]);
  setDigit(digitParts["seconds-ones"], ss[1]);
}

function openFigjam() {
  if (hasOpenedDestination) {
    return;
  }
  hasOpenedDestination = true;

  const popup = window.open(FIGJAM_URL, "_blank");
  if (!popup) {
    window.location.assign(FIGJAM_URL);
  }
}

function setStatus(now, remainingSec) {
  if (now < START_TIME) {
    const startsIn = Math.ceil((START_TIME - now) / 1000);
    statusEl.classList.remove("hot");
    statusEl.textContent = `Countdown armed. Starts at 1:15 PM on Apr 28 (in ${startsIn}s).`;
    return;
  }

  if (remainingSec > 10) {
    statusEl.classList.remove("hot");
    statusEl.textContent = "Mission clock is running.";
    return;
  }

  if (remainingSec > 0) {
    statusEl.classList.add("hot");
    statusEl.textContent = "Final sequence started... liftoff imminent.";
    return;
  }

  statusEl.classList.remove("hot");
  statusEl.textContent = "Liftoff complete. Opening FigJam.";
}

function tick() {
  const now = new Date();
  let remainingMs;

  if (now < START_TIME) {
    remainingMs = END_TIME - START_TIME;
  } else if (now < END_TIME) {
    remainingMs = END_TIME - now;
  } else {
    remainingMs = 0;
  }

  const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = Math.floor(remainingSec / 60);
  const seconds = remainingSec % 60;

  updateDisplay(minutes, seconds);
  setStatus(now, remainingSec);

  if (now >= START_TIME && remainingSec <= 10 && remainingSec > 0 && !spokenNumbers.has(remainingSec)) {
    spokenNumbers.add(remainingSec);
    speakNumber(remainingSec);
  }

  if (remainingSec <= 0) {
    openFigjam();
  }
}

tick();
window.setInterval(tick, 1000);
