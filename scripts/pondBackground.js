// pondBackground.js
import { drawLilyPad } from './lilypad.js';

const canvas = document.getElementById("koiCanvas");
const ctx = canvas.getContext("2d");

// Mouse tracking (optional)
let mouse = { x: 0, y: 0 };
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

// Lily pads array
let lilyPads = [];

// Setup lilyPads positions dynamically
function setupLilyPads() {
  const w = parseFloat(canvas.style.width) || window.innerWidth;
  const isMobile = w < 768;

  lilyPads = [
    { x: isMobile ? w * 0.08 : 135, y: 160, radius: 60, color: '#4CAF50', lotusImage: '../images/lotus flower ChatGPT.png' }, //left top
    { x: isMobile ? w * 0.12 : 200, y: 400, radius: 60, color: '#4CAF50', lotusImage: '../images/Wlotus flower ChatGPT.png' }, //left middle
    { x: isMobile ? w * 0.10 : 180, y: 670, radius: 60, color: '#4CAF50', lotusImage: '../images/lotus flower ChatGPT.png' }, //left bottom

    { x: isMobile ? w * 0.92 : 1280, y: 160, radius: 60, color: '#4CAF50', lotusImage: '../images/Wlotus flower ChatGPT.png' }, //right top
    { x: isMobile ? w * 0.88 : 1380, y: 400, radius: 60, color: '#4CAF50', lotusImage: '../images/lotus flower ChatGPT.png' }, //right middle
    { x: isMobile ? w * 0.90 : 1280, y: 670, radius: 60, color: '#4CAF50', lotusImage: '../images/Wlotus flower ChatGPT.png' }, //right bottom

    { x: isMobile ? w * 0.08 : 135, y: 950, radius: 60, color: '#4CAF50', lotusImage: '../images/lotus flower ChatGPT.png' }, //left top
    { x: isMobile ? w * 0.12 : 200, y: 1300, radius: 60, color: '#4CAF50', lotusImage: '../images/Wlotus flower ChatGPT.png' }, //left middle
    { x: isMobile ? w * 0.10 : 180, y: 1700, radius: 60, color: '#4CAF50', lotusImage: '../images/lotus flower ChatGPT.png' }, //left bottom

    { x: isMobile ? w * 0.92 : 1450, y: 900, radius: 60, color: '#4CAF50', lotusImage: '../images/Wlotus flower ChatGPT.png' }, //right top
    { x: isMobile ? w * 0.88 : 1380, y: 1320, radius: 60, color: '#4CAF50', lotusImage: '../images/lotus flower ChatGPT.png' }, //right middle
    { x: isMobile ? w * 0.90 : 1240, y: 1700, radius: 60, color: '#4CAF50', lotusImage: '../images/Wlotus flower ChatGPT.png' }, //right bottom
  ];
}

// Resize canvas to cover entire page height
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const pageWidth = document.documentElement.scrollWidth;
  const pageHeight = document.documentElement.scrollHeight;

  canvas.width = pageWidth * dpr;
  canvas.height = pageHeight * dpr;

  canvas.style.width = pageWidth + "px";
  canvas.style.height = pageHeight + "px";

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  setupLilyPads();
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("scroll", resizeCanvas);
resizeCanvas();

// Koi images
const koiImages = ["../images/koi1.png", "../images/koi2.png"];
const loadedImages = [];
const koiArray = [];

//Koi class — same movement behavior as your reference koi.js
class Koi {
  constructor(img) {
    this.img = img;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    const sizeScale = (parseFloat(canvas.style.width) || window.innerWidth) < 768 ? 0.5 : 1;
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
    const visibleWidth = canvas.width / (window.devicePixelRatio || 1);
    const visibleHeight = canvas.height / (window.devicePixelRatio || 1);

    // Bounce logic (corrected for DPR)
    if (this.x < margin) {
      this.x = margin;
      this.angle = Math.PI - this.angle + (Math.random() - 0.5) * 0.2;
    }
    if (this.x > visibleWidth - margin) {
      this.x = visibleWidth - margin;
      this.angle = Math.PI - this.angle + (Math.random() - 0.5) * 0.2;
    }
    if (this.y < margin) {
      this.y = margin;
      this.angle = -this.angle + (Math.random() - 0.5) * 0.2;
    }
    if (this.y > visibleHeight - margin) {
      this.y = visibleHeight - margin;
      this.angle = -this.angle + (Math.random() - 0.5) * 0.2;
    }

    this.angle = (this.angle + Math.PI * 2) % (Math.PI * 2);
  }

  draw() {
    if (!this.img.complete) return;
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

// Load koi images
function loadImages(callback) {
  let loadedCount = 0;
  koiImages.forEach((src, i) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      loadedImages[i] = img;
      loadedCount++;
      if (loadedCount === koiImages.length) callback();
    };
    img.onerror = () => console.error("Failed to load", src);
  });
}

// Animation loop
function animate(timestamp = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw koi first
  koiArray.forEach(koi => {
    koi.update();
    koi.draw();
  });

  // Then lily pads
  lilyPads.forEach(pad => {
    if (!pad) return;
    drawLilyPad(ctx, pad, timestamp, mouse);
  });

  requestAnimationFrame(animate);
}

// Initialize after images load
loadImages(() => {
  for (let i = 0; i < 50; i++) {
    koiArray.push(new Koi(loadedImages[i % loadedImages.length]));
  }
  animate();
});
