// Contact form validation

const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

// Rules for each field: a function returns an error message, or "" if the value is fine
const rules = {
  name: function (value) {
    return value === "" ? "Please enter your name." : "";
  },
  email: function (value) {
    if (value === "") return "Please enter your email address.";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value) ? "" : "Please enter a valid email, like name@example.com.";
  },
  phone: function (value) {
    if (value === "") return "Please enter your phone number.";
    const digitsOnly = /^[0-9]+$/;
    return digitsOnly.test(value) ? "" : "Phone number must contain digits only.";
  },
  message: function (value) {
    return value === "" ? "Please write a message." : "";
  }
};

function validateField(fieldName) {
  const input = document.getElementById(fieldName);
  const errorBox = document.getElementById(fieldName + "Error");
  const error = rules[fieldName](input.value.trim());

  errorBox.textContent = error;
  input.classList.toggle("invalid", error !== "");
  input.setAttribute("aria-invalid", String(error !== ""));
  return error === "";
}

// Validate each field when the user leaves it
Object.keys(rules).forEach(function (fieldName) {
  document.getElementById(fieldName).addEventListener("blur", function () {
    validateField(fieldName);
  });
});

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();
  formSuccess.textContent = "";

  // Check every field (no short-circuit, so all errors show at once)
  const results = Object.keys(rules).map(validateField);
  const allValid = results.every(Boolean);

  if (allValid) {
    const name = document.getElementById("name").value.trim();
    formSuccess.textContent = "Thank you, " + name + "! Your message has been sent.";
    contactForm.reset();
  } else {
    const firstInvalid = contactForm.querySelector(".invalid");
    if (firstInvalid) firstInvalid.focus();
  }
});
