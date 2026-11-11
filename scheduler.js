// Front Desk Appointment Scheduler: book and cancel appointments

const scheduleForm = document.getElementById("scheduleForm");
const clientName = document.getElementById("clientName");
const apptDate = document.getElementById("apptDate");
const apptTime = document.getElementById("apptTime");
const scheduleError = document.getElementById("scheduleError");
const scheduleSuccess = document.getElementById("scheduleSuccess");
const scheduleBody = document.getElementById("scheduleBody");
const scheduleEmpty = document.getElementById("scheduleEmpty");

let appointments = loadAppointments();

// Today's date as yyyy-mm-dd (local time), used to block past dates
function getToday() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return now.getFullYear() + "-" + month + "-" + day;
}
apptDate.min = getToday();

function loadAppointments() {
  try {
    const saved = localStorage.getItem("appointments");
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
}

function saveAppointments() {
  try {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  } catch (error) {
    // The scheduler still works if saving is blocked
  }
}

function renderAppointments() {
  scheduleBody.innerHTML = "";

  // Sort a copy so the earliest appointment comes first
  const sorted = appointments.slice().sort(function (a, b) {
    return (a.date + a.time).localeCompare(b.date + b.time);
  });

  sorted.forEach(function (appt) {
    const row = document.createElement("tr");
    row.dataset.id = appt.id;

    [appt.name, appt.date, appt.time].forEach(function (text) {
      const cell = document.createElement("td");
      cell.textContent = text;
      row.appendChild(cell);
    });

    const actionCell = document.createElement("td");
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "mini-btn";
    cancel.dataset.action = "cancel";
    cancel.textContent = "Cancel";
    cancel.setAttribute("aria-label", "Cancel appointment for " + appt.name);
    actionCell.appendChild(cancel);
    row.appendChild(actionCell);

    scheduleBody.appendChild(row);
  });

  scheduleEmpty.hidden = appointments.length > 0;
}

// Returns an error message, or "" if the booking is fine
function validateBooking(name, date, time) {
  if (name === "" || date === "" || time === "") {
    return "Please fill in the name, date, and time.";
  }
  if (date < getToday()) {
    return "That date has already passed. Please choose today or later.";
  }
  const taken = appointments.some(function (appt) {
    return appt.date === date && appt.time === time;
  });
  if (taken) {
    return "That time slot is already booked. Please choose another.";
  }
  return "";
}

scheduleForm.addEventListener("submit", function (event) {
  event.preventDefault();
  scheduleSuccess.textContent = "";

  const name = clientName.value.trim();
  const error = validateBooking(name, apptDate.value, apptTime.value);
  scheduleError.textContent = error;
  if (error !== "") return;

  appointments.push({ id: Date.now(), name: name, date: apptDate.value, time: apptTime.value });
  saveAppointments();
  renderAppointments();
  scheduleSuccess.textContent = "Appointment booked for " + name + ".";
  scheduleForm.reset();
});

scheduleBody.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button || button.dataset.action !== "cancel") return;
  const id = Number(button.closest("tr").dataset.id);

  appointments = appointments.filter(function (appt) {
    return appt.id !== id;
  });
  saveAppointments();
  renderAppointments();
});

renderAppointments();
