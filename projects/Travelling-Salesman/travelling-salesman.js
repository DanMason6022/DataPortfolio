const canvas = document.getElementById("tspCanvas");
const ctx = canvas.getContext("2d");
const info = document.getElementById("info");
const algoSelect = document.getElementById("algo-select");

let coords = [];
let paths = [];
let lengths = [];
let currentStep = 0;
let animationId;
let speed = 50;
let isPlaying = false;
let bestTour = null;
let bestLength = Infinity;
let convergenceData = [];

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

function generateCoords(numCities) {
  const rng = mulberry32(42);
  return Array.from({ length: numCities }, () => [
    rng() * canvas.width * 0.8 + canvas.width * 0.1,
    rng() * canvas.height * 0.8 + canvas.height * 0.1
  ]);
}

function computeDistance(tour) {
  let d = 0;
  for (let i = 0; i < tour.length; i++) {
    const a = coords[tour[i]];
    const b = coords[tour[(i + 1) % tour.length]];
    d += Math.hypot(b[0] - a[0], b[1] - a[1]);
  }
  return d;
}

async function loadAnimation(file) {
  try {
    const res = await fetch(`Documents/${file}`);
    const json = await res.json();

    bestTour = null;
    bestLength = Infinity;
    convergenceData = [];

    if (Array.isArray(json)) {
      coords = generateCoords(json[0].tour.length);
      paths = json.map(entry => entry.tour);
      lengths = json.map(entry => entry.length ?? computeDistance(entry.tour));
    } else {
      coords = json.cities;
      paths = json.paths;
      lengths = paths.map(computeDistance);
    }

    for (let i = 0; i < paths.length; i++) {
      if (lengths[i] < bestLength) {
        bestLength = lengths[i];
        bestTour = paths[i];
      }
      convergenceData.push(lengths[i]);
    }

    currentStep = 0;
    stepSlider.max = paths.length - 1;
    stepSlider.value = currentStep;

    const stepLabel = document.getElementById("stepLabel");
    if (stepLabel && paths.length > 0) {
      stepLabel.textContent = `Step: ${currentStep + 1} / ${paths.length}`;
    }

    cancelAnimationFrame(animationId);
    drawFrame();
  } catch (err) {
    console.error("Failed to load animation file:", err);
  }
}

function drawFrame() {
  if (!coords.length || !paths.length) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCities();
  if (currentStep > 0) drawDeltaPath(paths[currentStep - 1], paths[currentStep], "#bbb", 1);
  drawPath(paths[currentStep], "#8C1E7F", 2); // current path
  const showBest = document.getElementById("toggleBest");
  if (bestTour && showBest?.checked) {
    drawPath(bestTour, "#547aa5", 1.5); // best path
  }

  drawConvergenceChart();
  updateInfo();

  stepSlider.value = currentStep;
  const stepLabel = document.getElementById("stepLabel");
  if (stepLabel && paths.length > 0) {
    stepLabel.textContent = `Step: ${currentStep + 1} / ${paths.length}`;
  }

  if (isPlaying) {
    if (currentStep < paths.length - 1) {
      currentStep++;
      setTimeout(() => (animationId = requestAnimationFrame(drawFrame)), speed);
    } else {
      isPlaying = false;
      const playBtn = document.getElementById("playPauseBtn");
      if (playBtn) playBtn.textContent = "Play";
    }
  }
}

function drawCities() {
  coords.forEach((c, i) => {
    ctx.beginPath();
    ctx.arc(c[0], c[1], 6, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fill();
    ctx.strokeStyle = "#222";
    ctx.stroke();
    ctx.fillStyle = "#222";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(i, c[0], c[1] - 10);
  });
}

function drawPath(tour, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  const start = coords[tour[0]];
  ctx.moveTo(start[0], start[1]);
  for (let i = 1; i < tour.length; i++) {
    const city = coords[tour[i]];
    ctx.lineTo(city[0], city[1]);
  }
  ctx.lineTo(start[0], start[1]);
  ctx.stroke();
}

function drawDeltaPath(prev, curr, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  for (let i = 0; i < curr.length; i++) {
    if (curr[i] !== prev[i]) {
      const a = coords[prev[i]];
      const b = coords[curr[i]];
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
    }
  }
  ctx.stroke();
}

function drawConvergenceChart() {
  const w = 150, h = 80, x = canvas.width - w - 20, y = 20;
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "#333";
  ctx.strokeRect(x, y, w, h);

  const min = Math.min(...convergenceData);
  const max = Math.max(...convergenceData);
  ctx.strokeStyle = "#0077cc";
  ctx.beginPath();
  for (let i = 0; i < convergenceData.length; i++) {
    const cx = x + (i / convergenceData.length) * w;
    const cy = y + h - ((convergenceData[i] - min) / (max - min)) * h;
    if (i === 0) ctx.moveTo(cx, cy);
    else ctx.lineTo(cx, cy);
  }
  ctx.stroke();

  ctx.fillStyle = "#000";
  ctx.font = "10px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(max.toFixed(0), x - 5, y + 10);
  ctx.fillText(min.toFixed(0), x - 5, y + h);

  ctx.textAlign = "center";
  ctx.fillText("Steps", x + w / 2, y + h + 12);
}

function updateInfo() {
  const currentLength = lengths[currentStep].toFixed(2);
  const improvement = bestLength !== Infinity ? ((lengths[currentStep] - bestLength) / bestLength * 100).toFixed(2) : "0";
  info.innerHTML = `
    Current Tour Length: <strong>${currentLength}</strong><br>
    Best Tour Length: <strong>${bestLength.toFixed(2)}</strong><br>
    Δ from Best: <strong>${improvement}%</strong>
  `;
}

// Step Slider (persistent)
const sliderHTML = `
  <div id="stepSliderContainer" style="text-align: center; margin-top: 1rem;">
    <label id="stepLabel" style="display: block; font-weight: bold; margin-bottom: 0.25rem;">
      Step: 1 / 1
    </label>
    <input type="range" id="stepSlider" min="0" max="0" value="0"
      style="width: 100%; accent-color: var(--primary-color);">
  </div>
`;
info.insertAdjacentHTML("beforebegin", sliderHTML);
const stepSlider = document.getElementById("stepSlider");
stepSlider.addEventListener("input", (e) => {
  currentStep = parseInt(e.target.value);
  const stepLabel = document.getElementById("stepLabel");
  if (stepLabel && paths.length > 0) {
    stepLabel.textContent = `Step: ${currentStep + 1} / ${paths.length}`;
  }
  if (!isPlaying) {
    cancelAnimationFrame(animationId);
    drawFrame();
  }
});

// Controls
algoSelect.addEventListener("change", () => {
  loadAnimation(algoSelect.value);
});

const controlsHTML = `
  <div id="tsp-controls" style="margin: 1rem auto; max-width: 600px; text-align: center;">
    <button id="playPauseBtn">Play</button>
    <button id="resetBtn" style="margin-left: 1rem;">Reset</button>
    <label for="speedSlider"> Speed: </label>
    <input type="range" id="speedSlider" min="10" max="300" value="${speed}" style="vertical-align: middle;">
    <label class="switch-toggle">
        <input type="checkbox" id="toggleBest">
        <span class="slider"></span>
        <span class="label-text">Show Best Tour</span>
    </label>

  </div>
`;
info.insertAdjacentHTML("beforebegin", controlsHTML);

const playPauseBtn = document.getElementById("playPauseBtn");
const resetBtn = document.getElementById("resetBtn");
const speedSlider = document.getElementById("speedSlider");
const toggleBest = document.getElementById("toggleBest");

playPauseBtn.onclick = () => {
  isPlaying = !isPlaying;
  playPauseBtn.textContent = isPlaying ? "Pause" : "Play";
  if (isPlaying) drawFrame();
};

resetBtn.onclick = () => {
  currentStep = 0;
  if (!isPlaying) drawFrame();
};

speedSlider.oninput = (e) => {
  const sliderValue = parseInt(e.target.value);
  speed = 310 - sliderValue;
};

toggleBest.addEventListener("change", () => {
  if (!isPlaying) {
    cancelAnimationFrame(animationId);
    drawFrame();
  }
});

// Initial Load
loadAnimation(algoSelect.value);

// Smooth Scrolling
document.querySelectorAll('nav a').forEach(anchor => {
  if (!anchor.getAttribute('href').includes('index.html')) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});


document.querySelectorAll('.nav-menu a, .nav-menu button').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('nav-toggle').checked = false;
  });
});
