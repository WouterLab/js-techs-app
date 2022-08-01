const modal = document.getElementById("modal");
const backdrop = document.getElementById("backdrop");
const content = document.getElementById("content");
const progress = document.getElementById("progress");
const form = document.getElementById("form");

content.addEventListener("click", openCard);
backdrop.addEventListener("click", closeModal);
modal.addEventListener("change", toggleTech);
form.addEventListener("submit", createTech);

const APP_TITLE = document.title;
const LS_KEY = "NEW_TECHS";

const technologies = getState();

function openCard(event) {
  const data = event.target.dataset;
  const tech = technologies.find((i) => i.type === data.type);
  if (!tech) return;
  openModal(toModal(tech), tech.title);
}

function toModal(tech) {
  const checked = tech.done ? "checked" : "";
  return `
  <h2>${tech.title}</h2>
  <p>
    ${tech.description}
  </p>
  <hr />
  <div>
    <input type="checkbox" id="done" ${checked} data-type="${tech.type}"/>
    <label for="done">Выучил</label>
  </div>
  `;
}

function toggleTech(event) {
  const type = event.target.dataset.type;
  const tech = technologies.find((i) => i.type === type);
  tech.done = event.target.checked;
  saveState();
  init();
}

function openModal(html, title = APP_TITLE) {
  document.title = `${title} | ${APP_TITLE}`;
  modal.innerHTML = html;
  modal.classList.add("open");
}

function closeModal() {
  document.title = APP_TITLE;
  modal.classList.remove("open");
}

function init() {
  renderCards();
  renderProgress();
}

function renderCards() {
  if (technologies.length === 0) {
    content.innerHTML = '<p class="empty">Технологий пока нет</p>';
  } else {
    content.innerHTML = technologies.map(toCard).join("");
  }
}

function renderProgress() {
  const percent = calcProgressPercent();
  let background;
  if (percent <= 30) {
    background = "var(--red)";
  } else if (percent <= 70) {
    background = "var(--orange)";
  } else {
    background = "var(--green)";
  }
  progress.style.background = background;
  progress.style.width = `${percent}%`;
  progress.textContent = percent ? `${percent}%` : "";
}

function calcProgressPercent() {
  if (technologies.length === 0) {
    return 0;
  }
  let countDone = 0;
  for (let i = 0; i < technologies.length; i++) {
    if (technologies[i].done) {
      countDone++;
    }
  }
  return Math.round((100 * countDone) / technologies.length);
}

function toCard(tech) {
  const doneClass = tech.done ? "done" : "";
  return `
    <div class="card ${doneClass}" data-type="${tech.type}"><h3 data-type="${tech.type}">${tech.title}</h3></div>
    `;
}

function isInvalid(title, description) {
  return !title.value | !description.value;
}

function createTech(event) {
  event.preventDefault();
  const { title, description } = event.target;
  if (isInvalid(title, description)) {
    if (!title.value) title.classList.add("invalid");
    if (!description.value) description.classList.add("invalid");
    setTimeout(() => {
      title.classList.remove("invalid");
      description.classList.remove("invalid");
    }, 2000);
    return;
  }
  const newTech = {
    title: title.value,
    description: description.value,
    done: false,
    type: title.value.toLowerCase(),
  };
  technologies.push(newTech);
  title.value = "";
  description.value = "";
  saveState();
  init();
}

function saveState() {
  localStorage.setItem(LS_KEY, JSON.stringify(technologies));
}

function getState() {
  const raw = localStorage.getItem(LS_KEY);
  return raw ? JSON.parse(raw) : [];
}

init();
