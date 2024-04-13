let passwordMatchError = document.getElementById('passwordMatchError');


/**
 * Retrieves the value of the email input field.
 * @returns {string} - The value of the email input field.
 */
function getEmailInputValue() {
    let emailInput = document.getElementById('emailLogin');
    return emailInput.value;
}


/**
 * Retrieves the value of the password input field.
 * @returns {string} - The value of the password input field.
 */
function getPasswordInputValue() {
    let passwordInput = document.getElementById('passwordLogin');
    return passwordInput.value;
}


/**
 * Resets the style of the form inputs and hides the password match error message.
 */
function resetFormStyle() {
    let signUpInfoBoxes = document.querySelectorAll('.log-in-info-box');
    for (let i = 0; i < signUpInfoBoxes.length; i++) {
        signUpInfoBoxes[i].style.borderColor = '#D1D1D1';
    }
}


/**
 * Displays the password match error message and highlights the last sign-up info box.
 */
function showPasswordMatchError() {
    passwordMatchError.style.display = 'block';
    let signUpInfoBoxes = document.querySelectorAll('.log-in-info-box');
    let lastSignUpInfoBox = signUpInfoBoxes[signUpInfoBoxes.length - 1];
    lastSignUpInfoBox.style.borderColor = '#FF8190';
}


/**
 * Applies a shake animation to the password input frame element.
 */
function shakePasswordInput() {
    let passwordInput = document.getElementById('log-in-input-frame');
    passwordInput.classList.add('shake-password');

    setTimeout(() => {
        passwordInput.classList.remove('shake-password');
    }, 500);
}


/**
 * Hides the password match error text.
 */
function errorTextLogIn() {
    passwordMatchError.style.display = 'none';
}
let password = document.getElementById('passwordLogin');
password.addEventListener('input', errorTextLogIn);


/**
 * Adds blur event listeners to log-in input sections.
 * Changes the border color of the input section when focused and blurred.
 */
function addLoginBlurEvents() {
    let signUpInfoBoxes = document.querySelectorAll('.log-in-info-box');
    signUpInfoBoxes.forEach(box => {
        let input = box.querySelector('.log-in-text-input');

        input.addEventListener('focus', () => {
            box.style.borderColor = '#4589FF';
        });

        input.addEventListener('blur', () => {
            box.style.borderColor = '#D1D1D1';
        });
    });
}
document.addEventListener('DOMContentLoaded', addLoginBlurEvents);


let passwordInput = document.getElementById('passwordLogin');
let passwordIcon = document.getElementById('passwordIcon');

/**
 * Updates the visibility icon of a password input field based on its current state.
 * @param {HTMLInputElement} passwordInput - The password input element.
 * @param {HTMLImageElement} passwordIcon - The visibility icon associated with the password input.
 */
function updatePasswordVisibility(passwordInput, passwordIcon) {
    if (passwordInput.value.length > 0) {
        passwordIcon.src = passwordInput.type === 'password' ? 'img/visibility_off.png' : 'img/visibility.png';
    } else {
        passwordIcon.src = 'img/lock.png';
    }
}


/**
 * Toggles the visibility of a password input between masked and visible.
 * @param {HTMLInputElement} passwordInput - The password input element.
 * @param {HTMLImageElement} passwordIcon - The visibility icon associated with the password input.
 */
function togglePasswordVisibility(passwordInput, passwordIcon) {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordIcon.src = 'img/visibility.png';
    } else {
        passwordInput.type = 'password';
        passwordIcon.src = 'img/visibility_off.png';
    }
}


/**
 * Event listener for input changes in a password field to update its visibility icon.
 */
passwordInput.addEventListener('input', function () {
    updatePasswordVisibility(passwordInput, passwordIcon);
});


/**
 * Event listener for the click event on the password visibility icon.
 */
passwordIcon.addEventListener('click', function () {
    togglePasswordVisibility(passwordInput, passwordIcon);
});



/**
 * Toggles the state of the remember check element.
 */
function togglerememberCheck() {
    rememberLogIn = !rememberLogIn;
    if (rememberLogIn) {
        setCheckedState();
    } else {
        setUncheckedState();
    }
}


/**
* The remember check element.
*/
const rememberCheck = document.getElementById('rememberCheck');
rememberCheck.addEventListener('click', togglerememberCheck);


/**
 * Sets the checked state for the remember check element.
 */
function setCheckedState() {
    rememberCheck.src = 'img/checked.png';
    rememberCheck.removeEventListener('mouseenter', applyHoverCheckedBackground);
    rememberCheck.removeEventListener('mouseleave', removeHoverCheckedBackground);
    rememberCheck.addEventListener('mouseenter', applyHoverCheckedBackground);
    rememberCheck.addEventListener('mouseleave', removeHoverCheckedBackground);
}


/**
 * Sets the unchecked state for the remember check element.
 */
function setUncheckedState() {
    rememberCheck.src = 'img/check-button.png';
    rememberCheck.removeEventListener('mouseenter', applyHoverCheckedBackground);
    rememberCheck.removeEventListener('mouseleave', removeHoverCheckedBackground);
    rememberCheck.addEventListener('mouseenter', applyHoverButtonBackground);
    rememberCheck.addEventListener('mouseleave', removeHoverButtonBackground);
}


/**
 * Applies a hover background to the remember check element when checked.
 */
function applyHoverCheckedBackground() {
    rememberCheck.style.backgroundImage = 'url(../img/hover_checked.png)';
}


/**
 * Applies a hover background to the remember check element when unchecked.
 */
function applyHoverButtonBackground() {
    rememberCheck.style.backgroundImage = 'url(../img/check-button-hover.png)';
}


/**
 * Removes the hover background from the remember check element when unchecked.
 */
function removeHoverCheckedBackground() {
    rememberCheck.style.backgroundImage = 'none';
}


/**
 * Removes the hover background from the remember check button element.
 */
function removeHoverButtonBackground() {
    rememberCheck.style.backgroundImage = 'none';
}


/**
 * Saves user data upon login.
 * @param {string} userEmail - The user's email.
 * @param {string} userPassword - The user's password.
 * @param {boolean} rememberStatus - The remember me status.
 */
function saveUserDataOnLogin(userEmail, userPassword, rememberStatus) {
    if (rememberStatus) {
        let userData = {
            email: userEmail,
            password: userPassword,
            rememberStatus: rememberStatus
        };
        saveLoggedInUserData(userData);
    }
}


const emailInput = document.getElementById('emailLogin');
const passwordInputCheck = document.getElementById('passwordLogin');
const loginButton = document.getElementById('loginBtn');


/**
 * Adds a click event listener to the login button.
 * Retrieves user email and password input, and calls the function to save user data on login.
 */
loginButton.addEventListener('click', function () {
    let userEmail = emailInput.value;
    let userPassword = passwordInputCheck.value;
    let rememberStatus = rememberLogIn;
    saveUserDataOnLogin(userEmail, userPassword, rememberStatus);
});


/**
 * Fills in the email and password input fields with saved user data from local storage on page load.
 * If user data with remember status exists, populates the input fields and updates the remember checkbox.
 */
function fillInFromLocalStorage() {
    let localStorageData = localStorage.getItem('loggedInUser');
    if (localStorageData) {
        let userData = JSON.parse(localStorageData);
        if (userData.rememberStatus) {
            emailInput.value = userData.email;
            passwordInputCheck.value = userData.password;
            togglerememberCheck();
        }
    }
}

window.addEventListener('load', fillInFromLocalStorage);