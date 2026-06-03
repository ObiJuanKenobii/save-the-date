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
// RSVP Action logic with Web3Forms
// ----------------------------------------------------
const yesBtn = document.getElementById('rsvp-yes');
const noBtn = document.getElementById('rsvp-no');
const guestNameInput = document.getElementById('guest-name');
const feedbackContainer = document.getElementById('rsvp-feedback');
const feedbackMessage = feedbackContainer.querySelector('.feedback-message');
const WEB3FORMS_ACCESS_KEY = "94efdaf5-d649-4c81-a5e6-12082b9fb85d";

// Check local storage for pre-existing RSVPs
const savedRsvp = localStorage.getItem('elena-rsvp');
const savedName = localStorage.getItem('elena-guest-name');
if (savedRsvp) {
    if (savedName) {
        guestNameInput.value = savedName;
        guestNameInput.disabled = true;
    }
    showRsvpFeedback(savedRsvp === 'yes');
}

// Remove error class on focus/type
guestNameInput.addEventListener('input', () => {
    guestNameInput.classList.remove('error');
});

yesBtn.addEventListener('click', () => handleRsvpSubmission(true));
noBtn.addEventListener('click', () => handleRsvpSubmission(false));

async function handleRsvpSubmission(isAttending) {
    const guestName = guestNameInput.value.trim();
    
    if (!guestName) {
        guestNameInput.classList.add('error');
        guestNameInput.focus();
        return;
    }

    // Set UI to loading state
    setLoadingState(true);
    feedbackContainer.className = 'rsvp-feedback success';
    feedbackMessage.innerHTML = 'Sending RSVP... ⏳';
    feedbackContainer.classList.remove('hidden');

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                access_key: WEB3FORMS_ACCESS_KEY,
                subject: `RSVP: Elena's 1st Birthday - ${isAttending ? 'Count Me In! 🎉' : "Can't Make It 😔"}`,
                from_name: "Elena Save the Date",
                guest_name: guestName,
                attending: isAttending ? "Yes" : "No"
            })
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
            localStorage.setItem('elena-rsvp', isAttending ? 'yes' : 'no');
            localStorage.setItem('elena-guest-name', guestName);
            guestNameInput.disabled = true;
            
            showRsvpFeedback(isAttending);
            if (isAttending) {
                startConfetti();
            }
        } else {
            throw new Error(result.message || "Failed to submit RSVP");
        }
    } catch (error) {
        console.error("RSVP Submission Error:", error);
        feedbackContainer.className = 'rsvp-feedback failure';
        feedbackMessage.innerHTML = 'Oops! Something went wrong. Please try again. ⚠️';
        setLoadingState(false);
    }
}

function setLoadingState(isLoading) {
    yesBtn.disabled = isLoading;
    noBtn.disabled = isLoading;
    guestNameInput.disabled = isLoading;
    if (isLoading) {
        yesBtn.style.opacity = '0.5';
        noBtn.style.opacity = '0.5';
    } else {
        yesBtn.style.opacity = '1';
        noBtn.style.opacity = '1';
    }
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
