// Particle animation with Canvas

// Get the canvas and context
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

// Responsive canvas resize
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle class definition
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity; // { x: dx, y: dy }
    this.alpha = 1; // for fading, optional
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }

  update(canvasWidth, canvasHeight) {
    // Move particle
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // Bounce off edges
    if (this.x - this.radius < 0 || this.x + this.radius > canvasWidth) {
      this.velocity.x *= -1;
    }
    if (this.y - this.radius < 0 || this.y + this.radius > canvasHeight) {
      this.velocity.y *= -1;
    }

    // Optional: fade out over time
    // this.alpha -= 0.001;
    // if (this.alpha < 0) this.alpha = 0;
  }
}

// Utility: Generate a random color
function randomColor() {
  const colors = ['#ffffff', '#e1e1e1', '#99ccff', '#00e6e6', '#ffd700', '#00ff00', '#ffff00', '#ffa500', '#800080' ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Initialize particles
const particles = [];
const NUM_PARTICLES = 250;
for (let i = 0; i < NUM_PARTICLES; i++) {
  const radius = Math.random() * 2 + 1; // 1-3px
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const color = randomColor();
  const angle = Math.random() * 2 * Math.PI;
  const speed = Math.random() * 1.2 + 0.2;
  const velocity = {
    x: Math.cos(angle) * speed,
    y: Math.sin(angle) * speed
  };
  particles.push(new Particle(x, y, radius, color, velocity));
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw lines between close particles (optional)
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.save();
        ctx.globalAlpha = 1 - dist / 120;
        ctx.strokeStyle = '#444';
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  // Update & draw particles
  for (let p of particles) {
    p.update(canvas.width, canvas.height);
    p.draw(ctx);
  }

  requestAnimationFrame(animate);
}

animate();
