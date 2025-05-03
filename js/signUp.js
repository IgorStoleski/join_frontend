/**
 * Displays an error message for a given input element and marks it as invalid.
 * @param {HTMLInputElement} inp - The input element to mark as invalid.
 * @param {string} msg - The error message to display.
 */
function showError(inp, msg) {
  inp.classList.add("invalid");
  document.getElementById(`error-${inp.id}`).textContent = msg;
}

/**
 * Clears the error message for a given input element and removes its invalid styling.
 * @param {HTMLInputElement} inp - The input element to clear the error for.
 */
function clearError(inp) {
  inp.classList.remove("invalid");
  const errEl = document.getElementById(`error-${inp.id}`);
  if (errEl) {
    errEl.textContent = "";
  }
}


/**
 * Checks if the given name contains only alphabetic characters (including German umlauts and ß).
 * @param {string} name - The name to validate.
 * @returns {boolean} True if the name is valid, otherwise false.
 */
function isValidName(name) {
  return /^[A-Za-zÄÖÜäöüß]+$/.test(name.trim());
}


/**
 * Validates whether the provided email has a correct email format.
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email format is valid, otherwise false.
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}


/**
 * Compares two passwords to check if they match.
 * @param {string} pw - The original password.
 * @param {string} cpw - The confirmation password.
 * @returns {boolean} True if both passwords match, otherwise false.
 */
function validatePasswordMatch(pw, cpw) {
  return pw === cpw;
}


/**
 * Checks whether the given email address is already registered.
 * @param {string} email - The email address to check.
 * @returns {boolean} False (placeholder implementation).
 */
function isEmailAlreadyRegistered(email) {
  return false;
}

["username", "usersurname", "email", "password", "confirmPassword"].forEach(
  (id) => {
    document
      .getElementById(id)
      .addEventListener("input", (e) => clearError(e.target));
  }
);

function validateFields() {
  ["username", "usersurname", "email", "password", "confirmPassword"].forEach(
    (id) => clearError(document.getElementById(id))
  );
  let ok = true;
  const u = document.getElementById("username"),
    s = document.getElementById("usersurname"),
    e = document.getElementById("email"),
    pw = document.getElementById("password"),
    cpw = document.getElementById("confirmPassword");

  if (!isValidName(u.value)) {
    showError(u, "Nur Buchstaben erlaubt");
    ok = false;
  }
  if (!isValidName(s.value)) {
    showError(s, "Nur Buchstaben erlaubt");
    ok = false;
  }
  if (!isValidEmail(e.value)) {
    showError(e, "Ungültige E-Mail");
    ok = false;
  }
  if (pw.value.length < 4) {
    showError(pw, "Mind. 4 Zeichen");
    ok = false;
  }
  if (!validatePasswordMatch(pw.value, cpw.value)) {
    showError(cpw, "Passwörter stimmen nicht überein");
    ok = false;
  }
  return ok;
}


/**
 * Validates if the entered email address is unique.
 * Clears any previous error messages for the email input.
 * If the email is already registered, shows an error message.
 * @returns {boolean} Returns true if the email is unique, false otherwise.
 */
function validateEmailUnique() {
  const e = document.getElementById("email");
  clearError(e);
  if (isEmailAlreadyRegistered(e.value)) {
    showError(e, "E-Mail bereits registriert");
    return false;
  }
  return true;
}


/**
 * Validates whether the privacy policy checkbox has been accepted.
 * Clears any previous error messages.
 * If the checkbox is not checked, displays an error message.
 * @returns {boolean} Returns true if the privacy policy is accepted, false otherwise.
 */
function validatePrivacy() {
  const msg = document.getElementById("error-privacy");
  msg.textContent = "";
  if (!isPrivacyChecked) {
    msg.textContent = "Bitte Privacy Policy akzeptieren";
    return false;
  }
  return true;
}


/**
 * Sets up input validation and form submission handling once the DOM is loaded.
 * - Clears errors on input changes for form fields.
 * - Toggles the privacy policy checkbox status and clears related messages.
 * - Handles form submission, validates fields, and registers the user.
 */
document.addEventListener("DOMContentLoaded", () => {
  const fields = [
    "username",
    "usersurname",
    "email",
    "password",
    "confirmPassword",
  ];
  fields.forEach((id) => {
    const inp = document.getElementById(id);
    if (!inp) return;
    inp.addEventListener("input", () => clearError(inp));
  });
  const privacyCheck = document.getElementById("privacyCheck");
  if (privacyCheck) {
    privacyCheck.addEventListener("click", () => {
      isPrivacyChecked = !isPrivacyChecked;
      document.getElementById("error-privacy").textContent = "";
    });
  }
  const form = document.getElementById("signUpForm");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateFields() || !validateEmailUnique() || !validatePrivacy())
      return;
    registerContact(
      createNewContact(
        document.getElementById("username").value.trim(),
        document.getElementById("usersurname").value.trim(),
        document.getElementById("email").value.trim(),
        document.getElementById("password").value
      )
    );
  });
});
