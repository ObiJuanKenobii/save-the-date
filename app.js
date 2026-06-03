// Target Date: October 11, 2026 at 2:00 PM (14:00)
const TARGET_DATE = new Date('October 11, 2026 14:00:00').getTime();

// Countdown Timer logic
function updateCountdown() {
    const now = new Date().getTime();
    const difference = TARGET_DATE - now;

    if (difference < 0) {
        document.getElementById('countdown').innerHTML = `<div class="time-block" style="grid-column: span 4; font-weight: bold; font-size: 1.2rem; color: var(--primary);">It's Party Time! 🥳</div>`;
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = String(days).padStart(2, '0');
    document.getElementById('hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
}

// Start interval
setInterval(updateCountdown, 1000);
updateCountdown();

// ----------------------------------------------------
// Custom Canvas Confetti System (Zero-dependency)
// ----------------------------------------------------
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId = null;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class ConfettiParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 8 + 4;
        this.speedX = Math.random() * 10 - 5;
        this.speedY = Math.random() * -15 - 5; // upward burst
        this.gravity = 0.3;
        this.color = ['#2A6B77', '#EAA850', '#D97A62', '#1E4E57', '#FAF8F5'][Math.floor(Math.random() * 5)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
        this.opacity = 1;
    }

    update() {
        this.speedY += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        if (this.y > canvas.height) {
            this.opacity = 0;
        } else {
            this.opacity -= 0.005;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

function startConfetti() {
    // Start particles from center bottom area
    const startX = canvas.width / 2;
    const startY = canvas.height * 0.7;

    for (let i = 0; i < 150; i++) {
        particles.push(new ConfettiParticle(startX, startY));
    }

    if (!animationId) {
        animateConfetti();
    }
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.opacity > 0);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    if (particles.length > 0) {
        animationId = requestAnimationFrame(animateConfetti);
    } else {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

// ----------------------------------------------------
// Add to Calendar Generator (.ics File format)
// ----------------------------------------------------
document.getElementById('calendar-btn').addEventListener('click', () => {
    const event = {
        title: "Elena's 1st Birthday Party!",
        description: "Save the date to celebrate Elena turning ONE! Formal invitation to follow.",
        location: "Waukegan, IL",
        startDate: "20261011T140000", // Oct 11, 2026 at 2:00 PM
        endDate: "20261011T170000"     // Oct 11, 2026 at 5:00 PM
    };

    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Elena Birthday Website//EN",
        "BEGIN:VEVENT",
        `UID:${Date.now()}@elenallagun.com`,
        `DTSTAMP:20260601T000000Z`,
        `DTSTART:${event.startDate}`,
        `DTEND:${event.endDate}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description}`,
        `LOCATION:${event.location}`,
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Elena_First_Birthday_Save_The_Date.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Let's burst some quiet celebratory confetti for saving the date!
    startConfetti();
});

// ----------------------------------------------------
// RSVP Action logic
// ----------------------------------------------------
const yesBtn = document.getElementById('rsvp-yes');
const noBtn = document.getElementById('rsvp-no');
const feedbackContainer = document.getElementById('rsvp-feedback');
const feedbackMessage = feedbackContainer.querySelector('.feedback-message');

// Check local storage for pre-existing RSVPs
const savedRsvp = localStorage.getItem('elena-rsvp');
if (savedRsvp) {
    showRsvpFeedback(savedRsvp === 'yes');
}

yesBtn.addEventListener('click', () => {
    localStorage.setItem('elena-rsvp', 'yes');
    showRsvpFeedback(true);
    startConfetti();
    sendEmailNotification(true);
});

noBtn.addEventListener('click', () => {
    localStorage.setItem('elena-rsvp', 'no');
    showRsvpFeedback(false);
    sendEmailNotification(false);
});

function sendEmailNotification(isAttending) {
    const email = "juanjllm@duck.com";
    const subject = encodeURIComponent(isAttending ? "RSVP: Elena's 1st Birthday - Count Me In! 🎉" : "RSVP: Elena's 1st Birthday - Can't Make It 😔");
    const body = encodeURIComponent(isAttending 
        ? "Hi Juan,\n\nI will be attending Elena's 1st Birthday Party on October 11th!\n\nGuest Name(s): [Please enter your name(s) here]\nNumber of guests: [Please enter total count]" 
        : "Hi Juan,\n\nI won't be able to make it to Elena's 1st Birthday Party, but wishing her the happiest birthday!\n\nWarmly,\n[Please enter your name]");
    
    // Open the user's default email client
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}

function showRsvpFeedback(isYes) {
    feedbackContainer.className = 'rsvp-feedback'; // reset classes
    if (isYes) {
        feedbackContainer.classList.add('success');
        feedbackMessage.innerHTML = 'Yay! We are so excited to celebrate with you! 🎈';
        yesBtn.classList.add('hidden');
        noBtn.classList.remove('hidden');
    } else {
        feedbackContainer.classList.add('failure');
        feedbackMessage.innerHTML = "We will miss you! We'll send cake thoughts your way. 🍰";
        noBtn.classList.add('hidden');
        yesBtn.classList.remove('hidden');
    }
    feedbackContainer.classList.remove('hidden');
}
