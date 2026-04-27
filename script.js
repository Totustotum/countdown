const FIGJAM_URL = "https://totustotum.github.io/attendance-app/instructor.html";

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
  window.location.assign(FIGJAM_URL);
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
  statusEl.textContent = "";
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
