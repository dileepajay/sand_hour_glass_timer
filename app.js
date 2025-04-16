/*******************************************************
 * 2D Hourglass with Improved Sand Falling & Bottom Fill
 ******************************************************/

// Canvas & context
let canvas, ctx;

// Timer variables
let totalDuration = 60; // default 60s
let timeLeft = totalDuration;
let lastTimestamp = 0;
let isPaused = true;

// Flip variables
let currentAngle = 0;   // rotation angle in radians
let isFlipping = false; // whether flip animation is ongoing

// Particle system for falling sand
const sandParticles = []; // store small "grains"

// UI Elements
const presetSelect = document.getElementById('presetSelect'); 
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const timerDisplay = document.getElementById('timerDisplay');

// Hourglass dimensions for drawing
GLASS_WIDTH = 120;  // width of top/bottom in px
GLASS_HEIGHT = 200; // total height


// We'll assume the hourglass has a 120:200 ratio = 3:5 = 0.6
// (width : height)
// We'll scale it to fit a certain percentage of the canvas
function autoCalculateHourglassSize(canvas, widthRatio = 0.3, heightRatio = 0.5) {
    // widthRatio and heightRatio are fractions (0 < ratio <= 1)
    // that define how much of the canvas the hourglass should occupy.
    
    // First, pick a candidate width/height based on the ratios.
    // For example, 30% of the canvas width and 50% of the canvas height.
    let candidateWidth = canvas.width * widthRatio;
    let candidateHeight = canvas.height * heightRatio;
  
    // The original width : height for the hourglass is 120 : 200 = 3 : 5
    // We'll preserve that aspect ratio by adjusting either width or height.
    const originalAspect = 120 / 200; // = 0.6
  
    // Our candidate aspect ratio
    const currentAspect = candidateWidth / candidateHeight;
  
    // If candidate is too wide or too narrow, fix it:
    if (currentAspect > originalAspect) {
      // It's too wide for the ratio, so recalculate width to match height
      candidateWidth = candidateHeight * originalAspect;
    } else {
      // It's too tall for the ratio, so recalculate height to match width
      candidateHeight = candidateWidth / originalAspect;
    }
  
    // Return an object or assign to your globals
    return {
      width: candidateWidth,
      height: candidateHeight
    };
  }
  
  // Usage example:
  function updateHourglassSize() {
    // Suppose canvas is your global canvas reference
    const { width, height } = autoCalculateHourglassSize(canvas, 0.6, 0.8);
  
    // Then assign these values to your global constants
    GLASS_WIDTH = width;
    GLASS_HEIGHT = height;
  }



/*******************************************************
 * Initialization
 *******************************************************/
window.onload = () => {
  canvas = document.getElementById('hourglassCanvas');
  ctx = canvas.getContext('2d');

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Hook up UI
  startBtn.addEventListener('click', onStart);
  pauseBtn.addEventListener('click', onPause);
  resetBtn.addEventListener('click', onReset);

  // Start render loop
  requestAnimationFrame(update);

  updateTimerDisplay();
};

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  updateHourglassSize();
}

/*******************************************************
 * Main Loop
 *******************************************************/
function update(timestamp) {
  requestAnimationFrame(update);

  const deltaTime = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  if (!isPaused && !isFlipping) {
    timeLeft -= deltaTime;
    if (timeLeft < 0) {
      timeLeft = 0;
      isPaused = true;
      // OPTIONAL: trigger an end-of-timer effect
    }

    // Spawn & update sand particles (for falling effect)
    updateSandParticles(deltaTime);
  }

  draw();                // always draw
  updateTimerDisplay();  // update time display
}

/*******************************************************
 * Drawing the Hourglass & Sand
 *******************************************************/
function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Translate to center
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  ctx.save();
  ctx.translate(cx, cy);

  // Apply current rotation for flipping
  ctx.rotate(currentAngle);

  

  // Calculate fraction of sand that has flowed
  const fraction = 1 - timeLeft / totalDuration;

  // Draw top sand (filling from top edge downward)
  drawTopSand(fraction);

  // Draw bottom sand (filling from bottom edge upward)
  drawBottomSand(fraction);

  // Draw falling sand particles (the "stream")
  drawSandParticles();

  // Draw hourglass outline
  drawHourglassOutline();

  ctx.restore();
}

/*******************************************************
 * Hourglass Outline
 * Just 2 big triangles, top and bottom
 *******************************************************/
function drawHourglassOutline() {
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 3;
  ctx.beginPath();

  // Top triangle (center -> top edge)
  ctx.moveTo(-GLASS_WIDTH / 2, -GLASS_HEIGHT / 2);
  ctx.lineTo(GLASS_WIDTH / 2, -GLASS_HEIGHT / 2);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.stroke();

  // Bottom triangle (center -> bottom edge)
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(GLASS_WIDTH / 2, GLASS_HEIGHT / 2);
  ctx.lineTo(-GLASS_WIDTH / 2, GLASS_HEIGHT / 2);
  ctx.closePath();
  ctx.stroke();
}

/*******************************************************
 * Top Sand Fill (draining from top)
 * fraction=0 => top is 100% full
 * fraction=1 => top is empty
 *******************************************************/
function drawTopSand(fraction) {
    // fraction = 0 => no time passed => the top is 100% full
    // fraction = 1 => all time passed => the top is 0% full (completely empty)
    const topFill = 1 - fraction; // how full the top is [1..0]
    if (topFill <= 0) return;     // no sand to draw
  
    // Clip region for the top triangle
    ctx.save();
    ctx.beginPath();
    // This triangle covers from the center (0,0) to the top edge
    ctx.moveTo(0, 0);
    ctx.lineTo(-GLASS_WIDTH / 2, -GLASS_HEIGHT / 2);
    ctx.lineTo(GLASS_WIDTH / 2, -GLASS_HEIGHT / 2);
    ctx.closePath();
    ctx.clip();
  
    // Amount of vertical space (center to top edge)
    const maxHeight = GLASS_HEIGHT / 2;
    // How much of that space is still filled with sand
    const fillHeight = maxHeight * topFill; // from the center up to some point
  
    // Draw from the center line (y=0) upward
    // So when topFill=1 => fillHeight=maxHeight => fully filled from center to top
    // When topFill=0 => fillHeight=0 => no fill
    ctx.fillStyle = '#FFC966';
  
    // The top of our fill is at y = -fillHeight (negative is above center)
    ctx.fillRect(
      -GLASS_WIDTH,        // left X
      -fillHeight,         // top Y
      GLASS_WIDTH * 2,     // width
      fillHeight           // height
    );
  
    ctx.restore();
  }
  

/*******************************************************
 * Bottom Sand Fill (rising from bottom)
 * fraction=0 => bottom is empty
 * fraction=1 => bottom is 100% full
 *******************************************************/
function drawBottomSand(fraction) {
  if (fraction <= 0) return;

  // Clip region for bottom triangle
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(GLASS_WIDTH / 2, GLASS_HEIGHT / 2);
  ctx.lineTo(-GLASS_WIDTH / 2, GLASS_HEIGHT / 2);
  ctx.closePath();
  ctx.clip();

  // Fill from the bottom up
  const maxHeight = GLASS_HEIGHT / 2; // center to bottom
  const fillHeight = maxHeight * fraction;
  // We'll start at y = bottomEdge - fillHeight
  const bottomEdgeY = maxHeight; // y= +100 if maxHeight=100
  const topY = bottomEdgeY - fillHeight;

  ctx.fillStyle = '#FFC966';
  ctx.fillRect(-GLASS_WIDTH, topY, GLASS_WIDTH * 2, fillHeight);

  ctx.restore();
}

/*******************************************************
 * SIMPLE SAND PARTICLES
 * We'll spawn small "grains" falling from near the top center
 *******************************************************/
function updateSandParticles(deltaTime) {
  // fraction of total sand that remains in top
  const topFill = 1 - (1 - timeLeft / totalDuration);
  const isTopEmpty = topFill <= 0;

  // If top still has sand, spawn some grains
  if (!isTopEmpty) {
    spawnSandGrains(3); // spawn a few each frame
  }

  // Update existing particles
  for (let i = sandParticles.length - 1; i >= 0; i--) {
    const p = sandParticles[i];
    p.y += p.vy * deltaTime; // move downward
    p.x +=p.xy;
    p.vy += 20 * deltaTime;  // basic gravity
    // Once it crosses y>0 (center of glass), remove it
    // (since visually it's "entered" the bottom part)
    if (p.y > -3) {
      sandParticles.splice(i, 1);
    }
  }
}

function spawnSandGrains(count) {
  for (let i = 0; i < count; i++) {
    sandParticles.push({
      x: 0,  // random horizontal offset near center
      xy: (Math.random() - 0.5)/10,
      y: - (GLASS_HEIGHT / 2) ,   // near top edge
      vy: Math.random()                          // vertical speed
    });
  }
}

function drawSandParticles() {
  ctx.fillStyle = '#FFC966';
  for (let i = 0; i < sandParticles.length; i++) {
    const p = sandParticles[i];
    // small circle
    ctx.beginPath();
    ctx.arc(p.x, p.y+(GLASS_HEIGHT / 2), 1, 0, Math.PI * 1);
    ctx.fill();
  }
}

/*******************************************************
 * Timer & UI
 *******************************************************/
function onStart() {

    totalDuration = parseInt(presetSelect.value);
    timeLeft = totalDuration;
    
  isPaused = false;
}

function onPause() {
  isPaused = true;
}

function onReset() {
  // Animate 180° flip
  if (isFlipping) return;

  isFlipping = true;
  isPaused = true; // freeze timer while flipping

  const startAngle = currentAngle;
  const endAngle = currentAngle + Math.PI;

  gsap.to({}, {
    duration: 1,
    onUpdate: function() {
      const progress = this.progress(); // 0->1
      currentAngle = startAngle + (endAngle - startAngle) * progress;
    },
    onComplete: () => {
      currentAngle = endAngle; // finalize angle
      // Reset timer
      totalDuration = parseInt(presetSelect.value);
      timeLeft = totalDuration;
      sandParticles.length = 0; // clear any leftover grains

      isFlipping = false;
      updateTimerDisplay();
    }
  });
}

function updateTimerDisplay() {
    // Suppose timeLeft is your timer variable
    let displayTime = Math.floor(timeLeft);
    if (displayTime < 0) displayTime = 0;
    const minutes = Math.floor(displayTime / 60);
    const seconds = displayTime % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
    // Add the time-change class for a quick pop
    timerDisplay.classList.remove('time-change');
    void timerDisplay.offsetWidth; // Force reflow to restart the animation
    timerDisplay.classList.add('time-change');
  }
  
 
const customTimeModal = document.getElementById('customTimeModal');
const customHours = document.getElementById('customHours');
const customMinutes = document.getElementById('customMinutes');
const addCustomTimeBtn = document.getElementById('addCustomTimeBtn');
const cancelCustomTimeBtn = document.getElementById('cancelCustomTimeBtn');

// Listen for changes in the preset dropdown
presetSelect.addEventListener('change', (e) => {
  if (e.target.value === 'custom') {
    // "Add Custom Time" selected => open modal
    showCustomTimeModal();
  }
});

// Show the modal
function showCustomTimeModal() {
  customTimeModal.classList.remove('hidden');
  customTimeModal.classList.add('flex'); // so the modal is "display: flex"
}

// Hide the modal
function hideCustomTimeModal() {
  customTimeModal.classList.add('hidden');
  customTimeModal.classList.remove('flex');
}

// Cancel button
cancelCustomTimeBtn.addEventListener('click', () => {
  // Reset the dropdown to first option (or whatever you want)
  presetSelect.selectedIndex = 0;
  hideCustomTimeModal();
});

// Add button
addCustomTimeBtn.addEventListener('click', () => {
  // Convert hours & minutes to total seconds
  const hours = parseInt(customHours.value, 10) || 0;
  const minutes = parseInt(customMinutes.value, 10) || 0;
  const totalSeconds = hours * 3600 + minutes * 60;

  // Basic validation
  if (totalSeconds <= 0) {
    alert('Please enter a valid custom time');
    return;
  }

  // Create a new <option> in the dropdown
  const newOption = document.createElement('option');
  newOption.value = String(totalSeconds);
  newOption.textContent = `${hours}h ${minutes}m`;
  // Insert it at the bottom (or wherever you'd like)
  presetSelect.appendChild(newOption);

  // Select the newly created option
  presetSelect.value = String(totalSeconds);

  // Hide modal
  hideCustomTimeModal();
});
