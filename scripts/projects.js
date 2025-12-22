// project.js
import { drawLilyPad } from './lilypad.js';

const canvas = document.getElementById("koiCanvas");
const ctx = canvas.getContext("2d");
let ripples = [];

// Mouse tracking
let mouse = { x: 0, y: 0 };
canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;

    let hoveringClickable = false;

    for (const pad of lilyPads) {
        if (!pad.link) continue;
        const dx = mouse.x - pad.x;
        const dy = mouse.y - pad.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < pad.radius) {
            hoveringClickable = true;
            break;
        }
    }
    canvas.style.cursor = hoveringClickable ? "pointer" : "default";
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

// Lily pads array
let lilyPads = [];

// Setup lilyPads positions dynamically
function setupLilyPads() {
    lilyPads = [
        { x: 450, y: 350, radius: 135, color: '#4CAF50' },
        { x: 450, y: 350, radius: 125, image: '../images/pokeball2 ChatGPT.png', crop: { sx: 0, sy: 0, sw: 1024, sh: 1024 }, text: "Pokemon \n API Finder", txtsize: 35, link: "../client/pokemonAPI.html" },

        { x: 800, y: 350, radius: 135, color: '#4CAF50' },
        { x: 800, y: 350, radius: 125, image: '../images/Fruit Ninja2 ChatGPT.png', text: "Fruit Ninja", txtsize: 35, link: "../client/fruitNinja.html" },

        { x: 1150, y: 350, radius: 135, color: '#4CAF50' },
        { x: 1150, y: 350, radius: 125, image: '../images/anime-collage wallpapercom.jpg', crop: { sx: 0, sy: 0, sw: 400, sh: 490 }, text: "Crunchtime \n Magazine", txtsize: 35, link: "../client/crunchtime.html" },

        { x: 600, y: 660, radius: 135, color: '#4CAF50' },
        { x: 600, y: 660, radius: 125, image: '../images/pudgie_logo.png', text: "Logo Redesign", txtsize: 35, link: "../client/logoRedesign.html" },


        //decor lilly pads
        { x: 135, y: 160, radius: 60, color: '#4CAF50', lotusImage: '../images/lotus flower ChatGPT.png' }, //left top
        { x: 200, y: 400, radius: 60, color: '#4CAF50', lotusImage: '../images/Wlotus flower ChatGPT.png' }, //left middle
        { x: 180, y: 670, radius: 60, color: '#4CAF50', lotusImage: '../images/lotus flower ChatGPT.png' }, //left bottom

        { x: 1280, y: 160, radius: 60, color: '#4CAF50', lotusImage: '../images/Wlotus flower ChatGPT.png' }, //right top
        { x: 1430, y: 400, radius: 60, color: '#4CAF50', lotusImage: '../images/lotus flower ChatGPT.png' }, //right middle
        { x: 1280, y: 670, radius: 60, color: '#4CAF50', lotusImage: '../images/Wlotus flower ChatGPT.png' }, //right bottom

        { x: 135, y: 950, radius: 60, color: '#4CAF50', lotusImage: '../images/lotus flower ChatGPT.png' }, //left top
        { x: 200, y: 1300, radius: 60, color: '#4CAF50', lotusImage: '../images/Wlotus flower ChatGPT.png' }, //left middle
        { x: 180, y: 1700, radius: 60, color: '#4CAF50', lotusImage: '../images/lotus flower ChatGPT.png' }, //left bottom

        { x: 1450, y: 900, radius: 60, color: '#4CAF50', lotusImage: '../images/Wlotus flower ChatGPT.png' }, //right top
        { x: 1380, y: 1320, radius: 60, color: '#4CAF50', lotusImage: '../images/lotus flower ChatGPT.png' }, //right middle
        { x: 1240, y: 1700, radius: 60, color: '#4CAF50', lotusImage: '../images/Wlotus flower ChatGPT.png' }, //right bottom

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
        this.size = 70 + Math.random() * 50;
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

canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (const pad of lilyPads) {
        const dx = x - pad.x;
        const dy = y - pad.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < pad.radius && pad.link) {
            window.location.href = pad.link; // open that project page
            break;
        }
    }
});

// Animation loop
function animate(timestamp = 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw fading ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        ripple.radius += 2;          // expand size
        ripple.opacity -= 0.01;      // fade out

        if (ripple.opacity <= 0) {
            ripples.splice(i, 1);      // remove finished ripples
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
