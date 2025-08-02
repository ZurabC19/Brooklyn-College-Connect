
activityForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("activity-title").value;
  const date = document.getElementById("activity-date").value;

  // Add to calendar mapping
  if (!activityMap[date]) activityMap[date] = [];
  activityMap[date].push(title);
  buildCalendar(); // Refresh calendar with new activity

  const desc = document.getElementById("activity-desc").value;

  // Create activity card
  const card = document.createElement("div");
  card.className = "activity-card";
  card.innerHTML = `...`; // includes RSVP form

  // RSVP form logic
  const rsvpForm = card.querySelector(".rsvp-form");
  const rsvpList = card.querySelector(".rsvp-list");
  card.rsvps = [];

  rsvpForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Input validation
    let inputs = rsvpForm.querySelectorAll("input");
    let hasErrors = false;
    const emailInput = rsvpForm.querySelector(".rsvp-email");
    const emailValue = emailInput.value.trim();

    inputs.forEach(input => {
      const value = input.value.trim();
      if (input !== emailInput && value.length < 2) {
        input.classList.add("error");
        hasErrors = true;
      } else if (input !== emailInput) {
        input.classList.remove("error");
      }
    });

    // Validate optional email
    if (emailValue.length > 0 && !emailValue.includes("@")) {
      emailInput.classList.add("error");
      emailInput.placeholder = "Invalid email (must include @)";
      emailInput.value = "";
      hasErrors = true;
    } else {
      emailInput.classList.remove("error");
    }

    if (hasErrors) return;

    // Add RSVP entry
    const name = rsvpForm.querySelector(".rsvp-name").value.trim();
    const state = rsvpForm.querySelector(".rsvp-state").value.trim();
    const newEntry = `🎟️ ${name} from ${state} has RSVP'd.`;
    card.rsvps.push(newEntry);

    // Update RSVP list display
    rsvpList.innerHTML = "";
    for (let i = 0; i < Math.min(3, card.rsvps.length); i++) {
      const entry = document.createElement("div");
      entry.className = "rsvp-entry";
      entry.textContent = card.rsvps[i];
      rsvpList.appendChild(entry);
    }

    // Show summary if too many
    if (card.rsvps.length > 5) {
      const othersCount = card.rsvps.length - 3;
      const summary = document.createElement("div");
      summary.className = "rsvp-entry";
      summary.textContent = `…and ${othersCount} others have RSVP'd.`;
      rsvpList.appendChild(summary);
    } else if (card.rsvps.length > 3) {
      for (let i = 3; i < card.rsvps.length; i++) {
        const entry = document.createElement("div");
        entry.className = "rsvp-entry";
        entry.textContent = card.rsvps[i];
        rsvpList.appendChild(entry);
      }
    }

    rsvpForm.reset();
  });

  activityList.appendChild(card);
  activityForm.reset();
});

// Video carousel navigation
document.getElementById("prev-video").addEventListener("click", () => {
  currentVideoIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
  videoFrame.src = videos[currentVideoIndex];
});

document.getElementById("next-video").addEventListener("click", () => {
  currentVideoIndex = (currentVideoIndex + 1) % videos.length;
  videoFrame.src = videos[currentVideoIndex];
});

// Build calendar grid with events
function buildCalendar(month = currentMonth, year = currentYear) {
  calendar.innerHTML = "";
  const firstDay = new Date(year, month, 1).getDay(); 
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-day";
    calendar.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dayCell = document.createElement("div");
    dayCell.className = "calendar-day";
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    dayCell.innerHTML = `<span>${d}</span>`;

    // Add events if any
    if (activityMap[dateKey]) {
      activityMap[dateKey].forEach(title => {
        const event = document.createElement("div");
        event.className = "event";
        event.textContent = title;
        dayCell.appendChild(event);
      });
    }

    calendar.appendChild(dayCell);
  }
}

buildCalendar();

// Toggle bright/dark mode
themeToggle.addEventListener("click", () => {
  brightMode = !brightMode;
  document.body.classList.toggle("bright-mode", brightMode);
  themeToggle.textContent = brightMode ? "🌙" : "☀️";
});
