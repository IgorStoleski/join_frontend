let passwordMatchError = document.getElementById('signUpMatchError');


/**
 * Retrieves the value of the password input field.
 * @returns {string} The value of the password input field.
 */
function getPasswordInputValue() {
    let passwordInput = document.getElementById('password');
    return passwordInput.value;
}


/**
 * Retrieves the value of the confirm password input field.
 * @returns {string} The value of the confirm password input field.
 */
function getConfirmPasswordInputValue() {
    let confirmPasswordInput = document.getElementById('confirmPassword');
    return confirmPasswordInput.value;
}


/**
 * Resets the style of the form inputs and hides the password match error message.
 */
function resetSignUpFormStyle() {
    let signUpInfoBoxes = document.querySelectorAll('.sign-up-info-box');
    signUpInfoBoxes.forEach(box => {
        box.style.borderColor = '#D1D1D1';
    });
}


/**
 * Displays the password match error message and highlights the last sign-up info box.
 */
function showPasswordMatchError() {
    passwordMatchError.style.display = 'block';
    let signUpInfoBoxes = document.querySelectorAll('.sign-up-info-box');
    let lastSignUpInfoBox = signUpInfoBoxes[signUpInfoBoxes.length - 1];
    lastSignUpInfoBox.style.borderColor = '#FF8190';
}


/**
 * Applies a shake animation to the password input frame element.
 */
function shakePasswordInput() {
    let passwordInput = document.getElementById('sign-up-input-frame');
    passwordInput.classList.add('shake-password');

    setTimeout(() => {
        passwordInput.classList.remove('shake-password');
    }, 500);
}


/**
 * Hides the password match error text.
 */
function errorTextSignUp() {
    passwordMatchError.style.display = 'none';
}
let confirmPassword = document.getElementById('confirmPassword');
confirmPassword.addEventListener('input', errorTextSignUp);


/**
 * Resets the input fields of the registration form.
 */
function resetForm() {
    username.value = '';
    email.value = '';
    password.value = '';
    confirmPassword.value = '';
}


/**
 * Adds blur event listeners to sign-up input sections.
 * Changes the border color of the input section when focused and blurred.
 */
function addFocusBlurEvents() {
    let signUpInfoBoxes = document.querySelectorAll('.sign-up-info-box');
    signUpInfoBoxes.forEach(box => {
        let input = box.querySelector('.sign-up-text-input');

        input.addEventListener('focus', () => {
            box.style.borderColor = '#4589FF';
        });

        input.addEventListener('blur', () => {
            box.style.borderColor = '#D1D1D1';
        });
    });
}
document.addEventListener('DOMContentLoaded', addFocusBlurEvents);


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
const privacyCheck = document.getElementById('privacyCheck');
privacyCheck.addEventListener('click', togglePrivacyCheck);


/**
 * Sets the checked state for the privacy check checkbox and adds/removes event listeners for hover effects.
 */
function setCheckedState() {
    privacyCheck.src = 'img/checked.png';
    privacyCheck.removeEventListener('mouseenter', applyHoverCheckedBackground);
    privacyCheck.removeEventListener('mouseleave', removeHoverCheckedBackground);
    privacyCheck.addEventListener('mouseenter', applyHoverCheckedBackground);
    privacyCheck.addEventListener('mouseleave', removeHoverCheckedBackground);
}


/**
 * Sets the unchecked state for the privacy check checkbox and adds/removes event listeners for hover effects.
 */
function setUncheckedState() {
    privacyCheck.src = 'img/check-button.png';
    privacyCheck.removeEventListener('mouseenter', applyHoverCheckedBackground);
    privacyCheck.removeEventListener('mouseleave', removeHoverCheckedBackground);
    privacyCheck.addEventListener('mouseenter', applyHoverButtonBackground);
    privacyCheck.addEventListener('mouseleave', removeHoverButtonBackground);
}


/**
 * Apply a hover background image to the privacy check checkbox when checked.
 */
function applyHoverCheckedBackground() {
    privacyCheck.style.backgroundImage = 'url(../img/hover_checked.png)';
}


/**
 * Apply a hover background image to the privacy check checkbox when unchecked.
 */
function applyHoverButtonBackground() {
    privacyCheck.style.backgroundImage = 'url(../img/check-button-hover.png)';
}


/**
 * Remove the hover background image from the privacy check checkbox when checked.
 */
function removeHoverCheckedBackground() {
    privacyCheck.style.backgroundImage = 'none';
}


/**
 * Remove the hover background image from the privacy check checkbox when unchecked.
 */
function removeHoverButtonBackground() {
    privacyCheck.style.backgroundImage = 'none';
}


let passwordInput = document.getElementById('password');
let passwordIcon = document.getElementById('passwordIcon');
let confirmPasswordInput = document.getElementById('confirmPassword');
let confirmPasswordIcon = document.getElementById('confirmPasswordIcon');


/**
 * Handle the visibility icon based on the input value.
 * @param {HTMLElement} inputElement - The password input element.
 * @param {HTMLElement} iconElement - The visibility icon element.
 */
function handlePasswordInput(inputElement, iconElement) {
    if (inputElement.value.length > 0) {
        if (inputElement.type === 'password') {
            iconElement.src = 'img/visibility_off.png';
        } else {
            iconElement.src = 'img/visibility.png';
        }
    } else {
        iconElement.src = 'img/lock.png';
    }
}


/**
 * Event listener for the password input field.
 * Calls the handlePasswordInput function to update the visibility icon.
 */
passwordInput.addEventListener('input', function () {
    handlePasswordInput(passwordInput, passwordIcon);
});


/**
 * Event listener for the confirm-password input field.
 * Calls the handlePasswordInput function to update the visibility icon.
 */
confirmPasswordInput.addEventListener('input', function () {
    handlePasswordInput(confirmPasswordInput, confirmPasswordIcon);
});


/**
 * Toggles the visibility of a password input field and updates the icon.
 * @param {HTMLInputElement} inputElement - The password input element to toggle.
 * @param {HTMLImageElement} iconElement - The icon element associated with the input.
 */
function togglePasswordVisibility(inputElement, iconElement) {
    if (inputElement.type === 'password') {
        inputElement.type = 'text';
        iconElement.src = 'img/visibility.png';
    } else {
        inputElement.type = 'password';
        iconElement.src = 'img/visibility_off.png';
    }
}


/**
 * Event listener for the password input field.
 * Calls the togglePasswordVisibility function to update the password visibility.
 */
passwordIcon.addEventListener('click', function () {
    togglePasswordVisibility(passwordInput, passwordIcon);
});


/**
 * Event listener for the confirm-password input field.
 * Calls the togglePasswordVisibility function to update the password visibility.
 */
confirmPasswordIcon.addEventListener('click', function () {
    togglePasswordVisibility(confirmPasswordInput, confirmPasswordIcon);
});


/**
 * Creates a success message template.
 * @returns {string} - The HTML template for a success message overlay.
 */
function createSuccessMessageTemplate() {
    return /*html*/ `
        <div id="successOverlay" class="overlay">
            <div class="success-message">
                <p>You Signed Up successfully</p>
            </div>
        </div>
    `;
}


/**
 * Shows a success message overlay and redirects to the index page.
 */
function showSuccessMessageAndRedirect() {
    document.body.innerHTML += createSuccessMessageTemplate();

    setTimeout(function () {
        let successOverlay = document.getElementById('successOverlay');
        document.body.removeChild(successOverlay);

        window.location.href = 'index.html';
    }, 1600);
}


/**
 * Displays an error message indicating that the email is already registered.
 */
function showEmailAlreadyRegisteredError() {
    let emailExists = document.getElementById('emailExistsError');
    emailExists.style.display = 'block';
    let signUpInfoBoxes = document.querySelectorAll('.sign-up-info-box');
    let lastSignUpInfoBox = signUpInfoBoxes[signUpInfoBoxes.length - 1];
    lastSignUpInfoBox.style.borderColor = '#FF8190';
}


/**
 * Hides the password match error text.
 */
function errorEmailExists() {
    let emailExists = document.getElementById('emailExistsError');
    emailExists.style.display = 'none';
}
let newEmail = document.getElementById('confirmPassword');
newEmail.addEventListener('input', errorEmailExists);