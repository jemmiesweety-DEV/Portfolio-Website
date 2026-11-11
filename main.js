// Mobile navigation menu toggle (runs on every page)
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

function setMenu(open) {
  mainNav.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

navToggle.addEventListener("click", function () {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  setMenu(!isOpen);
});

// Close the menu after a link is tapped
mainNav.addEventListener("click", function (event) {
  if (event.target.tagName === "A") {
    setMenu(false);
  }
});

// Close the menu with the Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    setMenu(false);
  }
});
