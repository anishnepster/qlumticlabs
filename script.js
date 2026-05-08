const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

let particles = [];
let mouse = {
  x: -9999,
  y: -9999,
  radius: 150
};

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2.5 + 0.5;
    this.speedX = Math.random() * 0.6 - 0.3;
    this.speedY = Math.random() * 0.6 - 0.3;
    this.opacity = Math.random() * 0.6 + 0.4;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = "#60a5fa";
    ctx.shadowBlur = 8;
    ctx.shadowColor = "#3b82f6";

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 140) {
        ctx.save();
        ctx.strokeStyle = `rgba(147, 197, 253, ${0.15 * (1 - distance / 140)})`;
        ctx.lineWidth = 0.8;

        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();

        ctx.restore();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }

  connectParticles();

  for (let i = 0; i < particles.length; i++) {
    const dx = mouse.x - particles[i].x;
    const dy = mouse.y - particles[i].y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius) {
      particles[i].x -= dx / 15;
      particles[i].y -= dy / 15;
    }
  }

  requestAnimationFrame(animate);
}

function initParticles() {
  particles = [];
  const count = Math.floor((canvas.width * canvas.height) / 9000);

  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

window.addEventListener("resize", () => {
  resizeCanvas();
  initParticles();
});

canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

canvas.addEventListener("mouseout", () => {
  mouse.x = -9999;
  mouse.y = -9999;
});

function init() {
  resizeCanvas();
  initParticles();
  animate();
}

window.onload = init;