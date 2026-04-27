const FIGJAM_URL =
  "https://www.figma.com/board/1eYF85itScr19igQmpvTk3/GD-202--Omni-Channel-Experience-UX---UI-Final-Project?node-id=0-1&t=veaBHRrScm5HD7HH-1";

const START_TIME = new Date("2026-04-28T13:15:00");
const END_TIME   = new Date("2026-04-28T13:30:00");

// Tick instances are set via data-did-init callbacks below
let minTick = null;
let secTick = null;

// Called by the Tick library when each counter initialises
function initMinTick(tick) { minTick = tick; }
function initSecTick(tick) { secTick = tick; }

const statusEl = document.getElementById("status");
let hasOpenedDestination = false;

function updateDisplay(minutes, seconds) {
  // Always pass a zero-padded 2-char string.
  // Tick's `split` transform breaks "05" → ["0","5"] and assigns
  // each character to the corresponding flip panel.
  if (minTick) minTick.value = String(minutes).padStart(2, "0");
  if (secTick) secTick.value = String(seconds).padStart(2, "0");
}

function openFigjam() {
  if (hasOpenedDestination) return;
  hasOpenedDestination = true;
  const popup = window.open(FIGJAM_URL, "_blank");
  if (!popup) window.location.assign(FIGJAM_URL);
}

function setStatus(now, remainingSec) {
  if (now < START_TIME) {
    statusEl.textContent = "Starts at 1:15 PM on Apr 28";
    return;
  }
  if (remainingSec > 0) {
    statusEl.textContent = "";
    return;
  }
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
  const minutes      = Math.floor(remainingSec / 60);
  const seconds      = remainingSec % 60;

  updateDisplay(minutes, seconds);
  setStatus(now, remainingSec);

  if (remainingSec <= 0) openFigjam();
}

tick();
window.setInterval(tick, 1000);
