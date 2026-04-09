import { drawLilyPad } from './lilypad.js';
import { drawLog } from './log.js';
import { drawBridge } from './bridge.js';

const canvas = document.getElementById("koiCanvas");
const ctx = canvas.getContext("2d");

// CSS pixel dimensions (use these for all coordinate/position math)
let cw = 0, ch = 0;

const koiImages = ["images/koi1.png", "images/koi2.png"];
const koiArray = [];
const logImages = ["images/log_adobestock.png"];
let loadedLogImages = [];
let loadedImages = [];
const ripples = [];
let mouse = { x: 0, y: 0 };
let isMouseDown = false;

// Initialize log and lily pad arrays
let logs = [];
let lilyPads = [];

// Use CSS pixels for breakpoints (ignores DPR scaling)
function cssWidth() { return window.innerWidth; }

// Logs - responsive sizing based on viewport
function getResponsiveLogSize(baseSize) {
  if (cssWidth() < 480) return baseSize * 0.28;
  if (cssWidth() < 768) return baseSize * 0.38;
  return baseSize;
}

// Get responsive log dimensions based on screen size
function getResponsiveLogDimensions() {
  if (cssWidth() < 480) return { widthScale: 0.32, heightScale: 0.32 };
  if (cssWidth() < 768) return { widthScale: 0.42, heightScale: 0.42 };
  return { widthScale: 1, heightScale: 1 };
}

// Get responsive lily pad radius
function getResponsiveLilyPadRadius(baseRadius) {
  if (cssWidth() < 480) return baseRadius * 0.5;
  if (cssWidth() < 768) return baseRadius * 0.5;
  return baseRadius;
}

function updateLogsAndLilyPads() {
  const logDims = getResponsiveLogDimensions();
  const isPhone = cssWidth() < 480;
  const isTablet = cssWidth() < 768;

  // Text offsets within logs — adjust per device to reposition text on the log image
  const textOffsetX  = isPhone ? 30  : isTablet ? 50  : 80;
  const textOffsetY  = isPhone ? 10  : isTablet ? 12  : 15;
  const textLineHeight = isPhone ? 25 : isTablet ? 75 : 110;

  // Logs - recreated on resize with responsive sizing
  logs = [
    {
      x: isPhone ? cw / 3 : isTablet ? cw / 2.5 : cw / 4,
      y: isPhone ? 160 : isTablet ? 298 : 348,
      width: 550 * logDims.widthScale, height: 220 * logDims.heightScale, image: null, rotation: 0, text: "Hello,\nI'm", txtsize: getResponsiveLogSize(105),
      textOffsetX, textOffsetY, textLineHeight
    },
    {
      x: isPhone ? cw / 2 : isTablet ? cw / 2.2 : cw / 3,
      y: isPhone ? 250 : isTablet ? 488 : 573,
      width: 700 * logDims.widthScale, height: 220 * logDims.heightScale, image: null, rotation: 0, text: " Ethan \n       Shek", txtsize: getResponsiveLogSize(105),
      textOffsetX, textOffsetY, textLineHeight
    },
    {
      x: cw / 2,
      y: isPhone ? 750 : isTablet ? 668 : 760,
      width: 615 * logDims.widthScale, height: 170 * logDims.heightScale, image: null, rotation: 0, text: "Highlights", txtsize: getResponsiveLogSize(110),
      textOffsetX, textOffsetY, textLineHeight
    },
    ...(!isPhone && !isTablet ? [{
      x: cw / 1.28,
      y: 108,
      width: 550 * logDims.widthScale, height: 70 * logDims.heightScale, image: null, rotation: 0, text: "Click on the water and lillypads!", txtsize: getResponsiveLogSize(30),
      textOffsetX, textOffsetY
    }] : []),
  ];

  // Lily pads - responsive layout based on viewport
  // Phone: single centered column | Tablet: two closer columns | Desktop: original
  const baseXOffset = isPhone ? cw / 2 : isTablet ? cw / 3     : cw / 3;
  const rightXOffset = isPhone ? cw / 2 : isTablet ? cw / 3 * 2 : cw / 3 + 500;

  // Y positions — phone stacks all 4 vertically, tablet/desktop use two rows
  const padY1 = isPhone ? 900  : isTablet ? 1000 : 1100;
  const padY2 = isPhone ? 1150 : isTablet ? 1450 : 1550;
  const padY3 = isPhone ? 1400 : isTablet ? 1000 : 1100;
  const padY4 = isPhone ? 1650 : isTablet ? 1450 : 1550;

  // About pad position
  const aboutX = isPhone ? cw / 2 : isTablet ? cw / 2 + 50 : cw / 2 + 400;
  const aboutY = isPhone ? 450 : isTablet ? 425 : 450;

  // Responsive lily pad sizing
  const mainPadRadius = getResponsiveLilyPadRadius(175);
  const mainPadBackRadius = getResponsiveLilyPadRadius(185);
  const aboutPadRadius = getResponsiveLilyPadRadius(270);
  const aboutPadBackRadius = getResponsiveLilyPadRadius(280);
  const decorPadRadius = getResponsiveLilyPadRadius(60);
  const lilyPadTextSize = isPhone ? 25 : isTablet ? 35 : 50;

  lilyPads = [
    { x: baseXOffset, y: padY1, radius: mainPadBackRadius, color: '#4CAF50' },
    { x: baseXOffset, y: padY1, radius: mainPadRadius, image: 'images/pokeball2 ChatGPT.png', crop: { sx: 0, sy: 0, sw: 1024, sh: 1024 }, text: "Pokemon \n API Finder", txtsize: lilyPadTextSize, link: "client/pokemonAPI.html" },

    { x: baseXOffset, y: padY2, radius: mainPadBackRadius, color: '#4CAF50' },
    { x: baseXOffset, y: padY2, radius: mainPadRadius, image: 'images/Fruit Ninja2 ChatGPT.png', text: "Fruit Ninja", txtsize: lilyPadTextSize, link: "client/fruitNinja.html" },

    { x: rightXOffset, y: padY3, radius: mainPadBackRadius, color: '#4CAF50' },
    { x: rightXOffset, y: padY3, radius: mainPadRadius, image: 'images/anime-collage wallpapercom.jpg', crop: { sx: 0, sy: 0, sw: 400, sh: 490 }, text: "Crunchtime \n Magazine", txtsize: lilyPadTextSize, link: "client/crunchtime.html" },

    { x: rightXOffset, y: padY4, radius: mainPadBackRadius, color: '#4CAF50' },
    { x: rightXOffset, y: padY4, radius: mainPadRadius, image: 'images/pudgie_logo.png', text: "Logo Redesign", txtsize: lilyPadTextSize, link: "client/logoRedesign.html" },

    { x: aboutX, y: aboutY, radius: aboutPadBackRadius, color: '#4CAF50' },
    { x: aboutX, y: aboutY, radius: aboutPadRadius, image: 'images/EVS.png', crop: { sx: 900, sy: 1000, sw: 1500, sh: 1500 }, link: "client/about.html" },

    // Additional decor lily pads - responsive positioning and sizing
    { x: isPhone ? cw * 0.08 : isTablet ? cw * 0.1 : 135, y: 860,  radius: decorPadRadius, color: '#4CAF50', lotusImage: 'images/lotus flower ChatGPT.png' },   //left top
    { x: isPhone ? cw * 0.1  : isTablet ? cw * 0.15 : 200, y: 1300, radius: decorPadRadius, color: '#4CAF50', lotusImage: 'images/Wlotus flower ChatGPT.png' },  //left middle
    { x: isPhone ? cw * 0.09 : isTablet ? cw * 0.12 : 180, y: 1700, radius: decorPadRadius, color: '#4CAF50', lotusImage: 'images/lotus flower ChatGPT.png' },   //left bottom

    { x: isPhone ? cw * 0.92 : isTablet ? cw * 0.9  : cw - 135, y: 900,  radius: decorPadRadius, color: '#4CAF50', lotusImage: 'images/Wlotus flower ChatGPT.png' }, //right top
    { x: isPhone ? cw * 0.88 : isTablet ? cw * 0.85 : cw - 200, y: 1320, radius: decorPadRadius, color: '#4CAF50', lotusImage: 'images/lotus flower ChatGPT.png' },  //right middle
    { x: isPhone ? cw * 0.9  : isTablet ? cw * 0.88 : cw - 180, y: 1700, radius: decorPadRadius, color: '#4CAF50', lotusImage: 'images/Wlotus flower ChatGPT.png' }, //right bottom
  ];
}

function resizeCanvas() {
  const container = canvas.parentElement;
  cw = container.clientWidth;
  ch = container.clientHeight;

  canvas.width = cw;
  canvas.height = ch;

  // Recalculate logs and lily pads positions when canvas resizes
  updateLogsAndLilyPads();
}

window.addEventListener("resize", resizeCanvas);

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ripples.push({
    x,
    y,
    radius: 0,
    opacity: 0.6,
    growth: 1 + Math.random() * 2
  });
});

canvas.addEventListener("mouseup", () => {
  isMouseDown = false;
});

// Touch event support for mobile devices
canvas.addEventListener("touchmove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  mouse.x = touch.clientX - rect.left;
  mouse.y = touch.clientY - rect.top;
}, { passive: true });

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  ripples.push({
    x,
    y,
    radius: 0,
    opacity: 0.6,
    growth: 1 + Math.random() * 2
  });
}, false);

canvas.addEventListener("touchend", (e) => {
  e.preventDefault();
}, false);

const bridge = {
  image: 'images/bridge ChatGPT.png',
  y: 1930,  // adjust based on your pond height
  scale: 0.6,
};


function loadImages(callback) {
  let count = 0;
  koiImages.forEach((src, index) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      loadedImages[index] = img;
      count++;
      if (count === koiImages.length) callback();
    };
    img.onerror = () => {
      console.error(`Failed to load ${src}`);
      count++;
      if (count === koiImages.length) callback();
    };
  });
}

function loadLogImages(callback) {
  let count = 0;
  logImages.forEach((src, index) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      loadedLogImages[index] = img;
      count++;
      if (count === logImages.length) callback();
    };
    img.onerror = () => {
      console.error(`Failed to load ${src}`);
      count++;
      if (count === logImages.length) callback();
    };
  });
}

// Assign log images to log objects
function assignLogImages() {
  logs.forEach((log, i) => {
    log.image = loadedLogImages.length > 0 ? loadedLogImages[i % loadedLogImages.length] : null;
  });
}

class Koi {
  constructor(img) {
    this.img = img;
    this.x = Math.random() * cw;
    this.y = Math.random() * ch;

    // Scale fish size based on screen size - half size on mobile/tablet
    const sizeScale = cssWidth() < 768 ? 0.5 : 1;
    
    this.size = (70 + Math.random() * 50) * sizeScale;
    this.baseSpeed = 0.2 + Math.random() * 0.3;
    this.speedVariation = 0.05 + Math.random() * 0.1;
    this.speedPhase = Math.random() * Math.PI * 2;
    this.angle = Math.random() * Math.PI * 2;
    this.turnSpeed = 0.01 + Math.random() * 0.015;
    this.targetTurn = 0;
  }

  update() {
    this.speedPhase += 0.02;
    const currentSpeed = this.baseSpeed + Math.sin(this.speedPhase) * this.speedVariation;
    if (Math.random() < 0.02) this.targetTurn = (Math.random() - 0.5) * 0.3;
    this.angle += (this.targetTurn - this.angle * 0.0001) * this.turnSpeed;
    this.x += Math.cos(this.angle) * currentSpeed * 1.5;
    this.y += Math.sin(this.angle) * currentSpeed * 1.5;

    const margin = this.size / 2;
    if (this.x < margin) { this.x = margin; this.angle = Math.PI - this.angle + (Math.random() - 0.5) * 0.2; }
    if (this.x > cw - margin) { this.x = cw - margin; this.angle = Math.PI - this.angle + (Math.random() - 0.5) * 0.2; }
    if (this.y < margin) { this.y = margin; this.angle = -this.angle + (Math.random() - 0.5) * 0.2; }
    if (this.y > ch - margin) { this.y = ch - margin; this.angle = -this.angle + (Math.random() - 0.5) * 0.2; }
    this.angle = (this.angle + Math.PI * 2) % (Math.PI * 2);
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    const tilt = Math.sin(this.targetTurn * 1.25) * 0.3;
    const rotationOffset = -3 * Math.PI / 4;
    ctx.rotate(this.angle + rotationOffset + tilt);
    ctx.globalAlpha = 0.9;
    ctx.drawImage(this.img, -this.size / 2, -this.size / 2, this.size, this.size);
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

// Wait for full layout before sizing canvas and starting animation
// This fixes iOS Safari where clientHeight = 0 on initial script execution
window.addEventListener("load", () => {
  resizeCanvas();

  loadImages(() => {
    const koiCount = window.innerWidth < 480 ? 25 : window.innerWidth < 768 ? 25 : 50;
    for (let i = 0; i < koiCount; i++) {
      koiArray.push(new Koi(loadedImages[i % loadedImages.length]));
    }

    loadLogImages(() => {
      assignLogImages();
      animate();
    });
  });
}, { once: true });

function animate(time) {
  try {
    ctx.clearRect(0, 0, cw, ch);

    // Draw fading ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      const ripple = ripples[i];
      ripple.radius += 2;
      ripple.opacity -= 0.01;

      if (ripple.opacity <= 0) {
        ripples.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(100, 200, 255, ${ripple.opacity})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(100, 200, 255, 0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Water background
    ctx.fillStyle = "rgba(173, 216, 230, 0.07)";
    ctx.fillRect(0, 0, cw, ch);

    // Draw koi fish
    koiArray.forEach(koi => {
      koi.update();
      koi.draw();
    });

    // Draw logs
    logs.forEach(log => {
      drawLog(ctx, log, time);
    });

    // Draw lily pads on top
    lilyPads.forEach(pad => {
      drawLilyPad(ctx, pad, time, mouse);
    });

    // Draw bridge near bottom
    drawBridge(ctx, canvas, bridge);
  } catch (e) {
    console.error('animate error:', e);
  }
  requestAnimationFrame(animate);
}

// Page click handling - supports both mouse and touch
function handleCanvasClick(mouseX, mouseY) {
  lilyPads.forEach(pad => {
    const dx = mouseX - pad.x;
    const dy = mouseY - pad.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < pad.radius) {
      // Create ripple at click point
      ripples.push({ x: mouseX, y: mouseY, radius: 0, opacity: 1 });

      // Delay page transition slightly for effect
      setTimeout(() => {
        if (pad.link) window.location.href = pad.link;
      }, 500); // 0.5s delay so ripple is visible
    }
  });
}

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  handleCanvasClick(mouseX, mouseY);
});

// Touch click handler
canvas.addEventListener("touchend", (event) => {
  if (event.changedTouches.length > 0) {
    const rect = canvas.getBoundingClientRect();
    const touch = event.changedTouches[0];
    const mouseX = touch.clientX - rect.left;
    const mouseY = touch.clientY - rect.top;
    handleCanvasClick(mouseX, mouseY);
  }
});

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;

  // Check if hovering over a clickable lily pad
  let hoveringClickable = false;
  for (const pad of lilyPads) {
    if (!pad.link) continue; // skip non-clickable pads

    const dx = mouse.x - pad.x;
    const dy = mouse.y - pad.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < pad.radius) {
      hoveringClickable = true;
      break;
    }
  }

  // Change cursor based on hover state
  canvas.style.cursor = hoveringClickable ? "pointer" : "default";
});

