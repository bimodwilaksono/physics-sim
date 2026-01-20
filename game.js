/**
 * Physics Collision Momentum Simulation
 * Demonstrates conservation of momentum and kinetic energy in elastic collisions
 */

// Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Physics constants
const ELASTIC_RESTITUTION = 0.95; // Coefficient of restitution (1 = perfectly elastic)
const INELASTIC_RESTITUTION = 0.1; // Low restitution for inelastic collision

// Simulation state
let isRunning = false;
let animationId = null;
let isElastic = true; // Track collision mode

// Ball class representing a physics object
class Ball {
    constructor(x, y, mass, velocity, radius, color) {
        this.x = x;
        this.y = y;
        this.mass = mass;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.initialX = x;
        this.initialVelocity = velocity;
        this.initialMass = mass;
        this.initialRadius = radius;
    }

    draw() {
        // Draw ball
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        // Draw velocity arrow
        const arrowLength = this.velocity * 10;
        if (Math.abs(arrowLength) > 1) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + arrowLength, this.y);
            ctx.strokeStyle = '#e74c3c';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Arrow head
            const headLen = 10;
            const angle = this.velocity > 0 ? 0 : Math.PI;
            ctx.beginPath();
            ctx.moveTo(this.x + arrowLength, this.y);
            ctx.lineTo(this.x + arrowLength - headLen * Math.cos(angle - Math.PI / 6), this.y - headLen * Math.sin(angle - Math.PI / 6));
            ctx.moveTo(this.x + arrowLength, this.y);
            ctx.lineTo(this.x + arrowLength - headLen * Math.cos(angle + Math.PI / 6), this.y + headLen * Math.sin(angle + Math.PI / 6));
            ctx.stroke();
        }

        // Display mass and velocity
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`m: ${this.mass}kg`, this.x, this.y - this.radius - 15);
        ctx.fillText(`v: ${this.velocity.toFixed(1)} m/s`, this.x, this.y - this.radius - 30);
    }

    update() {
        this.x += this.velocity;
    }

    reset() {
        this.x = this.initialX;
        this.velocity = this.initialVelocity;
    }
}

// Collision detection and response
function checkCollision(ball1, ball2) {
    const distance = Math.abs(ball2.x - ball1.x);
    const minDistance = ball1.radius + ball2.radius;
    return distance <= minDistance;
}

function resolveCollision(ball1, ball2) {
    const m1 = ball1.mass;
    const m2 = ball2.mass;
    const v1 = ball1.velocity;
    const v2 = ball2.velocity;

    const v1Final = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
    const v2Final = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);

    // Use different restitution based on collision mode
    const restitution = isElastic ? ELASTIC_RESTITUTION : INELASTIC_RESTITUTION;

    ball1.velocity = v1Final * restitution;
    ball2.velocity = v2Final * restitution;

    // For perfectly inelastic collision, balls stick together
    if (!isElastic && restitution < 0.2) {
        // Combined velocity after perfectly inelastic collision
        const combinedVelocity = (m1 * v1 + m2 * v2) / (m1 + m2);
        ball1.velocity = combinedVelocity;
        ball2.velocity = combinedVelocity;
    }

    // Separate balls to prevent overlap
    const overlap = (ball1.radius + ball2.radius) - Math.abs(ball2.x - ball1.x);
    if (overlap > 0) {
        ball1.x -= overlap / 2;
        ball2.x += overlap / 2;
    }
}

// Calculate momentum and kinetic energy
function calculatePhysics(ball1, ball2) {
    const p1 = ball1.mass * ball1.velocity;
    const p2 = ball2.mass * ball2.velocity;
    const totalMomentum = p1 + p2;

    const ke1 = 0.5 * ball1.mass * ball1.velocity ** 2;
    const ke2 = 0.5 * ball2.mass * ball2.velocity ** 2;
    const totalKE = ke1 + ke2;

    return { p1, p2, totalMomentum, ke1, ke2, totalKE };
}

// Update display values
function updateDisplay(ball1, ball2) {
    const physics = calculatePhysics(ball1, ball2);

    const momentumAEl = document.getElementById('momentumA');
    const momentumBEl = document.getElementById('momentumB');
    const totalMomentumEl = document.getElementById('totalMomentum');
    const kineticAEl = document.getElementById('kineticA');
    const kineticBEl = document.getElementById('kineticB');
    const totalKineticEl = document.getElementById('totalKinetic');

    if (momentumAEl) momentumAEl.textContent = physics.p1.toFixed(2) + ' kg·m/s';
    if (momentumBEl) momentumBEl.textContent = physics.p2.toFixed(2) + ' kg·m/s';
    if (totalMomentumEl) totalMomentumEl.textContent = physics.totalMomentum.toFixed(2) + ' kg·m/s';
    if (kineticAEl) kineticAEl.textContent = physics.ke1.toFixed(2) + ' J';
    if (kineticBEl) kineticBEl.textContent = physics.ke2.toFixed(2) + ' J';
    if (totalKineticEl) totalKineticEl.textContent = physics.totalKE.toFixed(2) + ' J';
}

// Initialize balls
let ball1, ball2;

function initBalls() {
    const massA = parseFloat(document.getElementById('massA').value);
    const velocityA = parseFloat(document.getElementById('velocityA').value);
    const radiusA = parseFloat(document.getElementById('radiusA').value);

    const massB = parseFloat(document.getElementById('massB').value);
    const velocityB = parseFloat(document.getElementById('velocityB').value);
    const radiusB = parseFloat(document.getElementById('radiusB').value);

    ball1 = new Ball(200, canvas.height / 2, massA, velocityA, radiusA, '#ff6b6b');
    ball2 = new Ball(600, canvas.height / 2, massB, velocityB, radiusB, '#4ecdc4');

    // Update value displays
    const massAValue = document.getElementById('massAValue');
    const velocityAValue = document.getElementById('velocityAValue');
    const radiusAValue = document.getElementById('radiusAValue');
    const massBValue = document.getElementById('massBValue');
    const velocityBValue = document.getElementById('velocityBValue');
    const radiusBValue = document.getElementById('radiusBValue');

    if (massAValue) massAValue.textContent = massA + ' kg';
    if (velocityAValue) velocityAValue.textContent = velocityA.toFixed(1) + ' m/s';
    if (radiusAValue) radiusAValue.textContent = radiusA + ' px';
    if (massBValue) massBValue.textContent = massB + ' kg';
    if (velocityBValue) velocityBValue.textContent = velocityB.toFixed(1) + ' m/s';
    if (radiusBValue) radiusBValue.textContent = radiusB + ' px';

    updateDisplay(ball1, ball2);
}

// Draw floor line
function drawFloor() {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, canvas.height / 2 + 60);
    ctx.lineTo(750, canvas.height / 2 + 60);
    ctx.stroke();
}

// Main animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawFloor();

    // Update and draw balls
    ball1.update();
    ball2.update();

    // Check for collision
    if (checkCollision(ball1, ball2)) {
        resolveCollision(ball1, ball2);
    }

    // Draw balls
    ball1.draw();
    ball2.draw();

    // Update physics display
    updateDisplay(ball1, ball2);

    // Continue animation if running
    if (isRunning) {
        animationId = requestAnimationFrame(animate);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize balls first
    initBalls();

    // Draw initial state
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFloor();
    ball1.draw();
    ball2.draw();

    // Set initial formula text
    const formulaEl = document.querySelector('.formula');
    if (formulaEl) {
        formulaEl.innerHTML = 'p = m × v &nbsp;&nbsp;|&nbsp;&nbsp; KE = ½mv²<br><small>Elastic: KE conserved</small>';
    }

    // Button event listeners
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');

    if (startBtn) {
        startBtn.addEventListener('click', function() {
            if (!isRunning) {
                isRunning = true;
                animate();
            }
        });
    }

    if (pauseBtn) {
        pauseBtn.addEventListener('click', function() {
            isRunning = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            isRunning = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            initBalls();

            // Clear canvas and redraw
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawFloor();
            ball1.draw();
            ball2.draw();
        });
    }

    // Collision mode buttons
    const elasticBtn = document.getElementById('elasticBtn');
    const inelasticBtn = document.getElementById('inelasticBtn');

    if (elasticBtn && inelasticBtn) {
        elasticBtn.addEventListener('click', function() {
            isElastic = true;
            elasticBtn.classList.add('active');
            inelasticBtn.classList.remove('active');
            // Update formula display
            const formulaEl = document.querySelector('.formula');
            if (formulaEl) {
                formulaEl.innerHTML = 'p = m × v &nbsp;&nbsp;|&nbsp;&nbsp; KE = ½mv²<br><small>Elastic: KE conserved</small>';
            }
        });

        inelasticBtn.addEventListener('click', function() {
            isElastic = false;
            inelasticBtn.classList.add('active');
            elasticBtn.classList.remove('active');
            // Update formula display
            const formulaEl = document.querySelector('.formula');
            if (formulaEl) {
                formulaEl.innerHTML = 'p = m × v &nbsp;&nbsp;|&nbsp;&nbsp; KE = ½mv²<br><small>Inelastic: KE lost to heat/sound</small>';
            }
        });
    }

    // Slider event listeners for real-time updates
    ['massA', 'velocityA', 'radiusA', 'massB', 'velocityB', 'radiusB'].forEach(function(id) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', function() {
                if (!isRunning) {
                    initBalls();

                    // Clear canvas and redraw
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    drawFloor();
                    ball1.draw();
                    ball2.draw();
                }
            });
        }
    });
});
