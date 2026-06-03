# Save the Date Website template (elena)

A clean, modern, and whimsical single-page static website built to share event details. It features a responsive layout, a live countdown timer, interactive RSVP with a canvas-based confetti explosion, and dynamic `.ics` calendar generation.

---

## How to Reuse This Template

You can easily reuse this codebase for future events or different years by updating a few key configuration values:

### 1. Update the Target Date & Time (for the Countdown)
Open [`app.js`](file:///C:/Users/Juan/.gemini/antigravity/scratch/elenallagun/app.js) and update the `TARGET_DATE` variable at the top:
```javascript
// Change to the date and time of your future event (YYYY-MM-DD HH:MM:SS)
const TARGET_DATE = new Date('October 11, 2026 14:00:00').getTime();
```

### 2. Update the Text Contents (Names, Venue, Location)
Open [`index.html`](file:///C:/Users/Juan/.gemini/antigravity/scratch/elenallagun/index.html) and search for the following HTML blocks:
- **Title and Subtitle**:
  ```html
  <h1 class="title">Elena is turning <span class="one-highlight">ONE!</span></h1>
  <p class="subtitle">Join us for a fun, whimsical adventure...</p>
  ```
- **Date, Time & Location**:
  ```html
  <p class="highlight-text">Sunday, October 11, 2026</p>
  <p class="highlight-text">Waukegan, Illinois</p>
  ```

### 3. Update the RSVP Email & Calendar Details
Open [`app.js`](file:///C:/Users/Juan/.gemini/antigravity/scratch/elenallagun/app.js):
- **Email Recipient**: Modify `email` inside the `sendEmailNotification` function:
  ```javascript
  const email = "your-email@example.com";
  ```
- **Calendar Event Details**: Modify the `event` configuration inside the calendar click handler:
  ```javascript
  const event = {
      title: "Your Event Title",
      description: "Short description here...",
      location: "Your Location",
      startDate: "20261011T140000", // YYYYMMDDTHHMMSS
      endDate: "20261011T170000"
  };
  ```

### 4. Customizing Theme Colors & Aesthetics
Open [`style.css`](file:///C:/Users/Juan/.gemini/antigravity/scratch/elenallagun/style.css) and customize the variables at the top to change the look and feel completely:
```css
:root {
    --bg-primary: #FAF8F5; /* Main background color */
    --primary: #2A6B77;    /* Primary theme color (e.g. Buttons, Titles) */
    --accent: #EAA850;     /* Highlight accent color (e.g. Gold/Mustard) */
    --terracotta: #D97A62; /* Secondary pop color (e.g. Highlights, Confetti) */
}
```

---

## Local Development
To serve and preview the website locally on your computer:
```bash
python -m http.server 8000
```
Open your browser and navigate to `http://localhost:8000`.
