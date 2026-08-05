// ─────────────────────────────────────────────────────────────
//  Constants
// ─────────────────────────────────────────────────────────────

export const COLORS = [
  '#FF3366', '#FF6B35', '#FFD700', '#00FF88',
  '#00CFFF', '#7B2FFF', '#FF2FD4', '#FF8C00',
  '#39FF14', '#FF073A', '#0FF0FC', '#FF6EC7',
];

export const MAX_PARTICLES = 300;
export const MAX_RINGS = 30;
export const BURST_THROTTLE_MS = 80;

export const NOTES = [
  { label: 'C', freq: 261.63, color: '#FF3366' },
  { label: 'D', freq: 293.66, color: '#FF8C00' },
  { label: 'E', freq: 329.63, color: '#FFD700' },
  { label: 'F', freq: 349.23, color: '#00FF88' },
  { label: 'G', freq: 392.00, color: '#00CFFF' },
  { label: 'A', freq: 440.00, color: '#7B2FFF' },
  { label: 'B', freq: 493.88, color: '#FF2FD4' },
  { label: 'C', freq: 523.25, color: '#FF3366' },
];

export const ANIMALS = [
  { emoji: '🐄', name: 'Cow',   file: 'sounds/cow.mp3',   color: '#FF3366' },
  { emoji: '🐶', name: 'Dog',   file: 'sounds/dog.mp3',   color: '#FF8C00' },
  { emoji: '🐱', name: 'Cat',   file: 'sounds/cat.mp3',   color: '#FFD700' },
  { emoji: '🐷', name: 'Pig',   file: 'sounds/pig.mp3',   color: '#00FF88' },
  { emoji: '🦆', name: 'Duck',  file: 'sounds/duck.mp3',  color: '#00CFFF' },
  { emoji: '🦁', name: 'Lion',  file: 'sounds/lion.mp3',  color: '#7B2FFF' },
  { emoji: '🐴', name: 'Horse', file: 'sounds/horse.mp3', color: '#FF2FD4' },
  { emoji: '🐑', name: 'Sheep', file: 'sounds/sheep.mp3', color: '#39FF14' },
];


// ─────────────────────────────────────────────────────────────
//  Canvas dimensions — set by index.html via setCanvasDimensions()
// ─────────────────────────────────────────────────────────────

let canvasW = 0;
let canvasH = 0;

export function setCanvasDimensions(w, h) {
  canvasW = w;
  canvasH = h;
}


// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────

export function randColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export function drawStar(ctx, cx, cy, spikes, outerR, innerR) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerR);
  ctx.closePath();
  ctx.fill();
}


// ─────────────────────────────────────────────────────────────
//  Classes
// ─────────────────────────────────────────────────────────────

export class Stream {
  constructor() { this.reset(true); }

  reset(init = false) {
    this.x = Math.random() * canvasW;
    this.y = init ? Math.random() * canvasH : (Math.random() < 0.5 ? -20 : canvasH + 20);
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    if (Math.abs(this.vy) < 0.3) this.vy = 0.3 * Math.sign(this.vy || 1);
    this.color = randColor();
    this.width = 3 + Math.random() * 8;
    this.length = 80 + Math.random() * 200;
    this.alpha = 0.4 + Math.random() * 0.5;
    this.history = [];
    this.maxHistory = Math.floor(this.length / 2);
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = 0.02 + Math.random() * 0.03;
    this.wobbleAmp = 0.3 + Math.random() * 0.8;
  }

  update() {
    this.wobble += this.wobbleSpeed;
    this.vx += Math.sin(this.wobble) * this.wobbleAmp * 0.05;
    this.vy += Math.cos(this.wobble * 0.7) * this.wobbleAmp * 0.05;
    const spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (spd > 2.5) {
      this.vx *= 2.5 / spd;
      this.vy *= 2.5 / spd;
    }
    this.x += this.vx;
    this.y += this.vy;
    this.history.push({ x: this.x, y: this.y });
    if (this.history.length > this.maxHistory) this.history.shift();
    const isOutOfBounds = this.x < -200 || this.x > canvasW + 200
      || this.y < -200 || this.y > canvasH + 200;
    if (isOutOfBounds) this.reset();
  }

  draw(ctx) {
    if (this.history.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(this.history[0].x, this.history[0].y);
    for (let i = 1; i < this.history.length; i++) {
      ctx.lineTo(this.history[i].x, this.history[i].y);
    }
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = this.alpha;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}


export class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 5;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.color = color;
    this.alpha = 1;
    this.size = 2 + Math.random() * 6;
    this.decay = 0.015 + Math.random() * 0.025;
    this.gravity = 0.15 + Math.random() * 0.1;
    this.shape = Math.random() < 0.5 ? 'circle' : 'star';
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= 0.98;
    this.alpha -= this.decay;
    this.size *= 0.99;
  }

  draw(ctx) {
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    if (this.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      drawStar(ctx, this.x, this.y, 5, this.size, this.size * 0.45);
    }
    ctx.globalAlpha = 1;
  }

  dead() { return this.alpha <= 0; }
}


export class Ring {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 10;
    this.maxRadius = 80 + Math.random() * 100;
    this.alpha = 0.8;
    this.width = 3 + Math.random() * 4;
  }

  update() {
    this.radius += (this.maxRadius - this.radius) * 0.12;
    this.alpha -= 0.025;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  dead() { return this.alpha <= 0; }
}


// ─────────────────────────────────────────────────────────────
//  Burst — takes arrays explicitly for testability
// ─────────────────────────────────────────────────────────────

export function burst(particles, rings, x, y) {
  const color = randColor();
  if (particles.length < MAX_PARTICLES) {
    const wanted = 12 + Math.floor(Math.random() * 8);
    const count = Math.min(wanted, MAX_PARTICLES - particles.length);
    for (let i = 0; i < count; i++) {
      const particleColor = i % 3 === 0 ? randColor() : color;
      particles.push(new Particle(x, y, particleColor));
    }
  }
  if (rings.length < MAX_RINGS) {
    const wanted = 2 + Math.floor(Math.random() * 2);
    const numRings = Math.min(wanted, MAX_RINGS - rings.length);
    for (let i = 0; i < numRings; i++) {
      rings.push(new Ring(x, y, i === 0 ? color : randColor()));
    }
  }
}
