const activityForm = document.getElementById("activity-form");
const activityList = document.getElementById("activity-list");

const modal = document.getElementById("success-modal");
const modalText = document.getElementById("modal-text");
const modalImage = document.getElementById("modal-image");
let rotateFactor = 0;
let animationInterval = null;

function animateImage() {
  rotateFactor = rotateFactor === 0 ? -10 : 0;
  modalImage.style.transform = `rotate(${rotateFactor}deg)`;
}

function toggleModal(person) {
  modal.style.display = "flex";
  modalText.textContent = `Thanks for RSVPing, ${person.name}! We can't wait to see you at the event!`;

  animationInterval = setInterval(animateImage, 500);

  setTimeout(() => {
    modal.style.display = "none";
    clearInterval(animationInterval);
  }, 5000);
}

activityForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("activity-title").value;
  const date = document.getElementById("activity-date").value;
if (!activityMap[date]) activityMap[date] = [];
activityMap[date].push(title);
buildCalendar();

  const desc = document.getElementById("activity-desc").value;

  const card = document.createElement("div");
  card.className = "activity-card";

  card.innerHTML = `
    <h4>${title}</h4>
    <p>${desc}</p>
    <form class="rsvp-form">
      <input type="text" class="rsvp-name" placeholder="Your Name" required>
      <input type="text" class="rsvp-state" placeholder="Your State" required>
      <input type="text" class="rsvp-email" placeholder="Your Email (optional)">
      <button type="submit">RSVP</button>
    </form>
    <div class="rsvp-list"></div>
  `;

  const rsvpForm = card.querySelector(".rsvp-form");
  const rsvpList = card.querySelector(".rsvp-list");
  card.rsvps = [];

rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();

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

  if (emailValue.length > 0 && !emailValue.includes("@")) {
    emailInput.classList.add("error");
    emailInput.placeholder = "Invalid email (must include @)";
    emailInput.value = "";
    hasErrors = true;
  } else {
    emailInput.classList.remove("error");
  }

 if (hasErrors) return;

const person = {
  name: rsvpForm.querySelector(".rsvp-name").value.trim(),
  state: rsvpForm.querySelector(".rsvp-state").value.trim(),
  email: rsvpForm.querySelector(".rsvp-email").value.trim()
};

const newEntry = `🎟️ ${person.name} from ${person.state} has RSVP'd.`;
card.rsvps.push(newEntry);

rsvpList.innerHTML = "";

for (let i = 0; i < Math.min(3, card.rsvps.length); i++) {
  const entry = document.createElement("div");
  entry.className = "rsvp-entry";
  entry.textContent = card.rsvps[i];
  rsvpList.appendChild(entry);
}

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

toggleModal(person); // Show the thank-you modal

rsvpForm.reset();
});

  activityList.appendChild(card);
  activityForm.reset();
});

const videos = [
  "https://www.youtube.com/embed/JxwD_vrFxQw",
  "https://www.youtube.com/embed/nGRjjsqFTwI",
  "https://www.youtube.com/embed/GbfMh2WuAVY"
];

let currentVideoIndex = 0;
const videoFrame = document.getElementById("video-frame");

document.getElementById("prev-video").addEventListener("click", () => {
  currentVideoIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
  videoFrame.src = videos[currentVideoIndex];
});

document.getElementById("next-video").addEventListener("click", () => {
  currentVideoIndex = (currentVideoIndex + 1) % videos.length;
  videoFrame.src = videos[currentVideoIndex];
});

const calendar = document.getElementById("calendar");
const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
const activityMap = {}; 

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

const themeToggle = document.getElementById("theme-toggle");
let brightMode = false;

themeToggle.addEventListener("click", () => {
  brightMode = !brightMode;
  document.body.classList.toggle("bright-mode", brightMode);
  themeToggle.textContent = brightMode ? "🌙" : "☀️";
});
