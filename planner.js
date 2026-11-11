// Academic Planner: add, complete, and delete tasks

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskError = document.getElementById("taskError");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyMessage = document.getElementById("emptyMessage");

// The array that holds every task. Each task is an object.
let tasks = loadTasks();

function loadTasks() {
  try {
    const saved = localStorage.getItem("plannerTasks");
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem("plannerTasks", JSON.stringify(tasks));
  } catch (error) {
    // Saving is a bonus. The planner still works without it.
  }
}

// Redraw the list from the array whenever something changes
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach(function (task) {
    const item = document.createElement("li");
    item.className = "task-item" + (task.done ? " done" : "");
    item.dataset.id = task.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.id = "task-" + task.id;
    checkbox.setAttribute("aria-label", "Mark as completed");

    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", "Delete task: " + task.text);

    item.append(checkbox, label, deleteButton);
    taskList.appendChild(item);
  });

  updateSummary();
}

function updateSummary() {
  const remaining = tasks.filter(function (task) {
    return !task.done;
  }).length;

  emptyMessage.hidden = tasks.length > 0;
  taskCount.textContent = tasks.length === 0
    ? ""
    : remaining + " of " + tasks.length + " tasks still to do";
}

// ADD a task
taskForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const text = taskInput.value.trim();

  if (text === "") {
    taskError.textContent = "Please type a task before adding it.";
    return;
  }

  taskError.textContent = "";
  tasks.push({ id: Date.now(), text: text, done: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
  taskInput.focus();
});

// COMPLETE and DELETE use one listener on the list (event delegation)
taskList.addEventListener("click", function (event) {
  const item = event.target.closest(".task-item");
  if (!item) return;
  const id = Number(item.dataset.id);

  if (event.target.classList.contains("delete-btn")) {
    tasks = tasks.filter(function (task) {
      return task.id !== id;
    });
    saveTasks();
    renderTasks();
  }
});

taskList.addEventListener("change", function (event) {
  if (event.target.type !== "checkbox") return;
  const id = Number(event.target.closest(".task-item").dataset.id);

  tasks.forEach(function (task) {
    if (task.id === id) {
      task.done = event.target.checked;
    }
  });
  saveTasks();
  renderTasks();
});

renderTasks();
