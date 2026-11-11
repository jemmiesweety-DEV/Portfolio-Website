// Pharmacy Stock Tracker: add items, change quantities, remove items

const LOW_STOCK_LIMIT = 10; // at or below this number, an item is "low"

const stockForm = document.getElementById("stockForm");
const itemName = document.getElementById("itemName");
const itemQty = document.getElementById("itemQty");
const stockError = document.getElementById("stockError");
const stockBody = document.getElementById("stockBody");
const stockSummary = document.getElementById("stockSummary");
const stockEmpty = document.getElementById("stockEmpty");

let items = loadItems();

function loadItems() {
  try {
    const saved = localStorage.getItem("stockItems");
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
}

function saveItems() {
  try {
    localStorage.setItem("stockItems", JSON.stringify(items));
  } catch (error) {
    // The tracker still works if saving is blocked
  }
}

// Returns the status text for a quantity
function getStatus(quantity) {
  if (quantity === 0) return "Out of stock";
  if (quantity <= LOW_STOCK_LIMIT) return "Low";
  return "In stock";
}

function makeButton(text, action, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "mini-btn";
  button.dataset.action = action;
  button.textContent = text;
  button.setAttribute("aria-label", label);
  return button;
}

function renderItems() {
  stockBody.innerHTML = "";

  items.forEach(function (item) {
    const row = document.createElement("tr");
    row.dataset.id = item.id;

    const nameCell = document.createElement("td");
    nameCell.textContent = item.name;

    const qtyCell = document.createElement("td");
    qtyCell.textContent = item.quantity;

    const statusCell = document.createElement("td");
    const status = getStatus(item.quantity);
    const badge = document.createElement("span");
    badge.className = "badge " + (status === "In stock" ? "badge-ok" : "badge-low");
    badge.textContent = status;
    statusCell.appendChild(badge);

    const actionCell = document.createElement("td");
    actionCell.className = "action-cell";
    actionCell.append(
      makeButton("+1", "increase", "Add one to " + item.name),
      makeButton("-1", "decrease", "Remove one from " + item.name),
      makeButton("Remove", "remove", "Delete " + item.name)
    );

    row.append(nameCell, qtyCell, statusCell, actionCell);
    stockBody.appendChild(row);
  });

  const lowCount = items.filter(function (item) {
    return item.quantity <= LOW_STOCK_LIMIT;
  }).length;

  stockEmpty.hidden = items.length > 0;
  stockSummary.textContent = items.length === 0
    ? ""
    : items.length + " items tracked, " + lowCount + " low or out of stock";
}

// ADD an item, with validation
stockForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = itemName.value.trim();
  const quantity = Number(itemQty.value);

  if (name === "") {
    stockError.textContent = "Please enter the item name.";
    return;
  }
  if (itemQty.value === "" || !Number.isInteger(quantity) || quantity < 0) {
    stockError.textContent = "Quantity must be a whole number, 0 or more.";
    return;
  }

  stockError.textContent = "";
  items.push({ id: Date.now(), name: name, quantity: quantity });
  itemName.value = "";
  itemQty.value = "";
  saveItems();
  renderItems();
  itemName.focus();
});

// INCREASE, DECREASE, REMOVE: one listener on the table body (event delegation)
stockBody.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;
  const id = Number(button.closest("tr").dataset.id);
  const action = button.dataset.action;

  if (action === "remove") {
    items = items.filter(function (item) {
      return item.id !== id;
    });
  } else {
    items.forEach(function (item) {
      if (item.id === id) {
        if (action === "increase") item.quantity += 1;
        if (action === "decrease" && item.quantity > 0) item.quantity -= 1;
      }
    });
  }
  saveItems();
  renderItems();
});

renderItems();
