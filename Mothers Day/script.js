// ------------------------------
// Scroll reveal animation
// ------------------------------
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealElements.forEach((el) => revealObserver.observe(el));

// ------------------------------
// Floating hearts particles
// ------------------------------
function createHearts(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) return;

  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement("span");
    heart.className = "heart-particle";
    heart.textContent = Math.random() > 0.5 ? "❤" : "❣";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDuration = `${8 + Math.random() * 8}s`;
    heart.style.animationDelay = `${Math.random() * 6}s`;
    heart.style.opacity = `${0.3 + Math.random() * 0.45}`;
    container.appendChild(heart);
  }
}

createHearts("heroParticles", 24);
createHearts("quoteParticles", 16);

// ------------------------------
// Music autoplay with fallback
// ------------------------------
const bgMusic = document.getElementById("bgMusic");
const musicGate = document.getElementById("musicGate");
const startMusicBtn = document.getElementById("startMusicBtn");

function fadeInAudio(targetVolume = 0.6, step = 0.03, intervalMs = 90) {
  bgMusic.volume = 0;
  const fadeTimer = setInterval(() => {
    if (bgMusic.paused) {
      clearInterval(fadeTimer);
      return;
    }
    if (bgMusic.volume < targetVolume) {
      bgMusic.volume = Math.min(targetVolume, bgMusic.volume + step);
    } else {
      clearInterval(fadeTimer);
    }
  }, intervalMs);
}

async function startMusicWithFallback() {
  try {
    await bgMusic.play();
    fadeInAudio(0.58);
    musicGate.classList.add("hidden");
  } catch (error) {
    // Browser autoplay policy मुळे थेट play न झाल्यास overlay दाखवतो.
    musicGate.classList.remove("hidden");
  }
}

startMusicWithFallback();

startMusicBtn.addEventListener("click", async () => {
  try {
    await bgMusic.play();
    fadeInAudio(0.58);
    musicGate.classList.add("hidden");
  } catch (error) {
    // वापरकर्त्याने पुन्हा प्रयत्न करण्यासाठी overlay ठेवतो.
  }
});

// ------------------------------
// Typing animation for letter lines
// ------------------------------
const typedLines = Array.from(document.querySelectorAll(".typed-line"));

function typeLine(lineEl, text, speed = 45) {
  return new Promise((resolve) => {
    let index = 0;
    lineEl.textContent = "";
    const timer = setInterval(() => {
      lineEl.textContent += text[index];
      index += 1;
      if (index >= text.length) {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

const letterSection = document.getElementById("letter");
let typingStarted = false;

const letterObserver = new IntersectionObserver(
  async (entries) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting && !typingStarted) {
        typingStarted = true;
        for (const line of typedLines) {
          // ओळी अनुक्रमे दिसण्यासाठी await वापरले आहे.
          await typeLine(line, line.dataset.text || "");
        }
      }
    });
  },
  { threshold: 0.35 }
);

letterObserver.observe(letterSection);

// ------------------------------
// Mobile-friendly carousel with touch swipe
// ------------------------------
const carouselTrack = document.getElementById("carouselTrack");
const slides = Array.from(document.querySelectorAll(".slide"));
const prevSlideBtn = document.getElementById("prevSlide");
const nextSlideBtn = document.getElementById("nextSlide");

let currentSlide = 0;
let touchStartX = 0;
let touchEndX = 0;

function goToSlide(index) {
  const safeIndex = (index + slides.length) % slides.length;
  currentSlide = safeIndex;
  carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
}

prevSlideBtn.addEventListener("click", () => goToSlide(currentSlide - 1));
nextSlideBtn.addEventListener("click", () => goToSlide(currentSlide + 1));

carouselTrack.addEventListener(
  "touchstart",
  (event) => {
    touchStartX = event.changedTouches[0].clientX;
  },
  { passive: true }
);

carouselTrack.addEventListener(
  "touchend",
  (event) => {
    touchEndX = event.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) < 45) return;
    if (diff > 0) goToSlide(currentSlide + 1);
    else goToSlide(currentSlide - 1);
  },
  { passive: true }
);

// Auto slide for cinematic feel
setInterval(() => {
  goToSlide(currentSlide + 1);
}, 5200);

// ------------------------------
// Site-wide falling animation
// ------------------------------
const fallingCanvas = document.getElementById("fallingCanvas");
const ctx = fallingCanvas.getContext("2d");

function resizeCanvas() {
  fallingCanvas.width = window.innerWidth;
  fallingCanvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const confettiPieces = Array.from({ length: 90 }).map(() => ({
  x: Math.random() * fallingCanvas.width,
  y: -Math.random() * fallingCanvas.height,
  size: 4 + Math.random() * 7,
  speedY: 0.8 + Math.random() * 2.2,
  speedX: -0.7 + Math.random() * 1.4,
  angle: Math.random() * Math.PI * 2,
  spin: -0.12 + Math.random() * 0.24,
  color: ["#d8958f", "#f4c9d4", "#e8bda6", "#c77f88", "#fff1e2"][Math.floor(Math.random() * 5)]
}));

function drawConfetti() {
  ctx.clearRect(0, 0, fallingCanvas.width, fallingCanvas.height);

  confettiPieces.forEach((piece) => {
    piece.x += piece.speedX;
    piece.y += piece.speedY;
    piece.angle += piece.spin;

    if (piece.y > fallingCanvas.height + 20) {
      piece.y = -10;
      piece.x = Math.random() * fallingCanvas.width;
    }

    if (piece.x < -20) piece.x = fallingCanvas.width + 10;
    if (piece.x > fallingCanvas.width + 20) piece.x = -10;

    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.angle);
    ctx.fillStyle = piece.color;
    ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.6);
    ctx.restore();
  });
}

function animateFalling() {
  drawConfetti();
  requestAnimationFrame(animateFalling);
}

animateFalling();
