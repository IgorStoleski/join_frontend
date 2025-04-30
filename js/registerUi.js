let passwordMatchError = document.getElementById("signUpMatchError");

/**
 * Retrieves the value of the password input field.
 * @returns {string} The value of the password input field.
 */
function getPasswordInputValue() {
  let passwordInput = document.getElementById("password");
  return passwordInput.value;
}

/**
 * Retrieves the value of the confirm password input field.
 * @returns {string} The value of the confirm password input field.
 */
function getConfirmPasswordInputValue() {
  let confirmPasswordInput = document.getElementById("confirmPassword");
  return confirmPasswordInput.value;
}

/**
 * Resets the style of the form inputs and hides the password match error message.
 */
function resetSignUpFormStyle() {
  let signUpInfoBoxes = document.querySelectorAll(".sign-up-info-box");
  signUpInfoBoxes.forEach((box) => {
    box.style.borderColor = "#D1D1D1";
  });
}

/**
 * Displays the password match error message and highlights the last sign-up info box.
 */
function showPasswordMatchError() {
  passwordMatchError.style.display = "block";
  let signUpInfoBoxes = document.querySelectorAll(".sign-up-info-box");
  let lastSignUpInfoBox = signUpInfoBoxes[signUpInfoBoxes.length - 1];
  lastSignUpInfoBox.style.borderColor = "#FF8190";
}

/**
 * Applies a shake animation to the password input frame element.
 */
function shakePasswordInput() {
  let passwordInput = document.getElementById("sign-up-input-frame");
  passwordInput.classList.add("shake-password");

  setTimeout(() => {
    passwordInput.classList.remove("shake-password");
  }, 500);
}


/**
 * Resets the input fields of the registration form.
 */
function resetForm() {
  username.value = "";
  email.value = "";
  password.value = "";
  confirmPassword.value = "";
}

/**
 * Adds blur event listeners to sign-up input sections.
 * Changes the border color of the input section when focused and blurred.
 */
function addFocusBlurEvents() {
  let signUpInfoBoxes = document.querySelectorAll(".sign-up-info-box");
  signUpInfoBoxes.forEach((box) => {
    let input = box.querySelector(".sign-up-text-input");

    input.addEventListener("focus", () => {
      box.style.borderColor = "#4589FF";
    });

    input.addEventListener("blur", () => {
      box.style.borderColor = "#D1D1D1";
    });
  });
}
document.addEventListener("DOMContentLoaded", addFocusBlurEvents);

/**
 * Toggle the checked state of the privacy check checkbox.
 */
function togglePrivacyCheck() {
  isChecked = !isChecked;
  if (isChecked) {
    setCheckedState();
  } else {
    setUncheckedState();
  }
}

/**
 * The privacy check element.
 * @type {HTMLImageElement}
 */
const privacyCheck = document.getElementById("privacyCheck");
privacyCheck.addEventListener("click", togglePrivacyCheck);

/**
 * Sets the checked state for the privacy check checkbox and adds/removes event listeners for hover effects.
 */
function setCheckedState() {
  privacyCheck.src = "img/checked.png";
  privacyCheck.removeEventListener("mouseenter", applyHoverCheckedBackground);
  privacyCheck.removeEventListener("mouseleave", removeHoverCheckedBackground);
  privacyCheck.addEventListener("mouseenter", applyHoverCheckedBackground);
  privacyCheck.addEventListener("mouseleave", removeHoverCheckedBackground);
}

/**
 * Sets the unchecked state for the privacy check checkbox and adds/removes event listeners for hover effects.
 */
function setUncheckedState() {
  privacyCheck.src = "img/check-button.png";
  privacyCheck.removeEventListener("mouseenter", applyHoverCheckedBackground);
  privacyCheck.removeEventListener("mouseleave", removeHoverCheckedBackground);
  privacyCheck.addEventListener("mouseenter", applyHoverButtonBackground);
  privacyCheck.addEventListener("mouseleave", removeHoverButtonBackground);
}

/* /**
 * Apply a hover background image to the privacy check checkbox when checked.
 */

function applyHoverCheckedBackground() {
  privacyCheck.style.backgroundImage = "url(img/hover_checked.png)";
} 

/**
 * Apply a hover background image to the privacy check checkbox when unchecked.
 */

function applyHoverButtonBackground() {
  privacyCheck.style.backgroundImage = "url(img/check-button-hover.png)";
} 

/**
 * Remove the hover background image from the privacy check checkbox when checked.
 */
function removeHoverCheckedBackground() {
  privacyCheck.style.backgroundImage = "none";
}

/**
 * Remove the hover background image from the privacy check checkbox when unchecked.
 */
function removeHoverButtonBackground() {
  privacyCheck.style.backgroundImage = "none";
}

function togglePasswordVisibility(input, icon) {
  if (input.type === "password") {
    input.type = "text";
    icon.src = "./img/visibility.png";
  } else {
    input.type = "password";
    icon.src = "./img/visibility_off.png";
  }
}

function handlePasswordInput(input, icon) {
  icon.src = input.value.length
    ? input.type === "password"
      ? "./img/visibility_off.png"
      : "./img/visibility.png"
    : "./img/lock.png";
}

function initPasswordToggle() {
  const pwd = document.getElementById("password");
  const icon = document.getElementById("passwordIcon");
  if (!pwd || !icon) return;
  icon.addEventListener("click", () => togglePasswordVisibility(pwd, icon));
  pwd.addEventListener("input", () => handlePasswordInput(pwd, icon));
}

function initConfirmPasswordToggle() {
  const cpw = document.getElementById("confirmPassword");
  const icon2 = document.getElementById("confirmPasswordIcon");
  if (!cpw || !icon2) return;
  icon2.addEventListener("click", () => togglePasswordVisibility(cpw, icon2));
  cpw.addEventListener("input", () => handlePasswordInput(cpw, icon2));
}

document.addEventListener("DOMContentLoaded", () => {
  // 1) Hier alle DOM-Zugriffe
  const pwd = document.getElementById("password");
  const pwdIc = document.getElementById("passwordIcon");
  const cpwd = document.getElementById("confirmPassword");
  const cpwdIc = document.getElementById("confirmPasswordIcon");
  // 2) Listener NUR binden, wenn pwd && pwdIc existieren
  if (pwd && pwdIc) {
    pwdIc.addEventListener("click", () => togglePasswordVisibility(pwd, pwdIc));
    pwd.addEventListener("input", () => handlePasswordInput(pwd, pwdIc));
  }
  if (cpwd && cpwdIc) {
    cpwdIc.addEventListener("click", () =>
      togglePasswordVisibility(cpwd, cpwdIc)
    );
    cpwd.addEventListener("input", () => handlePasswordInput(cpwd, cpwdIc));
  }
  // … dasselbe für errorTextSignUp(), errorEmailExists() etc.
});

/**
 * Creates a success message template.
 * @returns {string} - The HTML template for a success message overlay.
 */
function createSuccessMessageTemplate() {
  return /*html*/ `
        <section id="successOverlay" class="overlay">
            <div class="success-message">
                <p>You Signed Up successfully</p>
            </div>
        </section>
    `;
}

/**
 * Shows a success message overlay and redirects to the index page.
 */
function showSuccessMessageAndRedirect() {
  document.body.innerHTML += createSuccessMessageTemplate();

  setTimeout(function () {
    let successOverlay = document.getElementById("successOverlay");
    document.body.removeChild(successOverlay);

    window.location.href = "index.html";
  }, 1600);
}

/**
 * Displays an error message indicating that the email is already registered.
 */
function showEmailAlreadyRegisteredError() {
  let emailExists = document.getElementById("emailExistsError");
  emailExists.style.display = "block";
  let signUpInfoBoxes = document.querySelectorAll(".sign-up-info-box");
  let lastSignUpInfoBox = signUpInfoBoxes[signUpInfoBoxes.length - 1];
  lastSignUpInfoBox.style.borderColor = "#FF8190";
}