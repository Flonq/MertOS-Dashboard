// ==============================
// MertOS Dashboard - Script
// ==============================

// Elements
const clockEl = document.getElementById("clock");
const dateEl = document.getElementById("date");

const quoteText = document.getElementById("quoteText");

const focusInput = document.getElementById("focusInput");
const saveFocusBtn = document.getElementById("saveFocusBtn");

const todoInput = document.getElementById("todoInput");
const addTodoBtn = document.getElementById("addTodoBtn");
const todoList = document.getElementById("todoList");

const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

// LocalStorage keys
const STORAGE_KEYS = {
  todos: "mertosTodos",
  focus: "mertosFocus"
};

// Quotes
const quotes = [
  "Bugün küçük bir ilerleme bile sistemi ileri taşır.",
  "Kod yaz, sadeleştir, geliştir.",
  "Odaklanmak, gürültüyü kısmaktır.",
  "Bugünün en iyi yatırımı: bitirdiğin küçük bir iş.",
  "Mükemmel olmasını bekleme, çalışan hâlini üret."
];

// ==============================
// Clock
// ==============================

function updateClock() {
  const now = new Date();

  clockEl.textContent = now.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit"
  });

  dateEl.textContent = now.toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

// ==============================
// Quote
// ==============================

function setRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteText.textContent = quotes[randomIndex];
}

// ==============================
// Focus
// ==============================

function loadFocus() {
  focusInput.value = localStorage.getItem(STORAGE_KEYS.focus) || "";
}

function saveFocus() {
  const focusValue = focusInput.value.trim();

  localStorage.setItem(STORAGE_KEYS.focus, focusValue);

  saveFocusBtn.textContent = "Kaydedildi";

  setTimeout(() => {
    saveFocusBtn.textContent = "Odağı Kaydet";
  }, 1200);
}

// ==============================
// Todos
// ==============================

let todos = JSON.parse(localStorage.getItem(STORAGE_KEYS.todos)) || [];

function saveTodos() {
  localStorage.setItem(STORAGE_KEYS.todos, JSON.stringify(todos));
}

function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach((todo, index) => {
    const todoItem = document.createElement("li");

    todoItem.textContent = todo.text;

    if (todo.done) {
      todoItem.classList.add("done");
    }

    todoItem.addEventListener("click", () => {
      todos[index].done = !todos[index].done;
      saveTodos();
      renderTodos();
    });

    todoItem.addEventListener("dblclick", () => {
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    });

    todoList.appendChild(todoItem);
  });
}

function addTodo() {
  const todoText = todoInput.value.trim();

  if (!todoText) return;

  todos.push({
    text: todoText,
    done: false
  });

  todoInput.value = "";

  saveTodos();
  renderTodos();
}

// ==============================
// Pomodoro
// ==============================

const POMODORO_START_SECONDS = 25 * 60;

let totalSeconds = POMODORO_START_SECONDS;
let timerInterval = null;
let isTimerRunning = false;

function updateTimerDisplay() {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  timerEl.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function finishTimer() {
  clearInterval(timerInterval);

  isTimerRunning = false;
  startBtn.textContent = "Başlat";

  alert("Pomodoro tamamlandı!");
}

function startTimer() {
  if (isTimerRunning) {
    pauseTimer();
    return;
  }

  isTimerRunning = true;
  startBtn.textContent = "Duraklat";

  timerInterval = setInterval(() => {
    if (totalSeconds <= 0) {
      finishTimer();
      return;
    }

    totalSeconds--;
    updateTimerDisplay();
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);

  isTimerRunning = false;
  startBtn.textContent = "Devam Et";
}

function resetTimer() {
  clearInterval(timerInterval);

  totalSeconds = POMODORO_START_SECONDS;
  isTimerRunning = false;
  startBtn.textContent = "Başlat";

  updateTimerDisplay();
}

// ==============================
// Events
// ==============================

addTodoBtn.addEventListener("click", addTodo);

todoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTodo();
  }
});

startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);

saveFocusBtn.addEventListener("click", saveFocus);

// ==============================
// Init
// ==============================

updateClock();
setInterval(updateClock, 1000);

setRandomQuote();
loadFocus();
renderTodos();
updateTimerDisplay();