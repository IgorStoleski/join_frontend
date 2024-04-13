/**
 * Displays the reset content, hiding the specified element and showing the reset content.
 * @param {string} hideId - The id of the element to hide.
 * @param {string} showId - The id of the element to show.
 */
function displayResetContent(hideId, showId) {
    let forgotContent = document.getElementById(hideId);
    let resetContent = document.getElementById(showId);

    if (resetContent) {
        forgotContent.style.display = 'none';
        resetContent.innerHTML = generateResetContent();
        resetContent.style.display = 'flex';
    }
}


/**
 * Adds blur event listeners to password input section.
 * Changes the border color of the input section when focused and blurred.
 */
function addResetBlurEvents() {
    let resetPasswordInput = document.querySelectorAll('.password-input-section');
    resetPasswordInput.forEach(box => {
        let input = box.querySelector('.password-input');

        input.addEventListener('focus', () => {
            box.style.borderColor = '#4589FF';
        });

        input.addEventListener('blur', () => {
            box.style.borderColor = '#D1D1D1';
        });
    });
}
document.addEventListener('DOMContentLoaded', addResetBlurEvents);



/**
 * Displays the reset redirect, showing a success overlay and redirecting to the index page after a delay.
 */
function showResetAndRedirect() {
    resetButton.disabled = true;
    document.body.innerHTML += createResetTemplate();
    let resetContent = document.getElementById('reset-content');
    resetContent.style.display = 'none';

    setTimeout(function () {
        let successOverlay = document.getElementById('resetOverlay');
        document.body.removeChild(successOverlay);


        window.location.href = 'index.html';
    }, 1600);
    // event.preventDefault();
}


/**
 * Event listener function that handles form submission for password reset.
 * Prevents the default form submission, validates the password reset
 * and triggers the appropriate actions based on the form submission.
 * @param {Event} event - The event object triggered by the form submission.
 */
function handlePasswordResetSubmission(event) {
    if (event.target.id === 'resetPasswordReset') {
        event.preventDefault();
        validateAndSubmitResetForm();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const resetFormWrapper = document.getElementById('reset-content');
    resetFormWrapper.addEventListener('submit', handlePasswordResetSubmission);
});


/**
 * Resets the password reset form style, checks if passwords match,
 * and triggers appropriate actions based on the outcome.
 */
function validateAndSubmitResetForm() {
    let passWord = getResetPasswordValue();
    let confirmPassword = getResetConfirmPasswordValue();

    resetPasswordInputStyles();

    if (passWord !== confirmPassword) {
        showResetMatchError();
        shakeResetPasswordInput();
        return;
    }
    showResetAndRedirect();
    resetForm();
}


/**
 * Enables the submit button of a form that was previously disabled.
 */
function resetForm() {
    resetButton.disabled = false;
}


/**
 * Retrieves the value of the password input field.
 * @returns {string} The value of the password input field.
 */
function getResetPasswordValue() {
    let passwordInput = document.getElementById('resetPassword');
    return passwordInput.value;
}


/**
 * Retrieves the value of the confirm password input field.
 * @returns {string} The value of the confirm password input field.
 */
function getResetConfirmPasswordValue() {
    let confirmPasswordInput = document.getElementById('confirmResetPassword');
    return confirmPasswordInput.value;
}


/**
 * Resets the style of the form inputs and hides the password match error message.
 */
function resetPasswordInputStyles() {
    let passwordInputSections = document.querySelectorAll('.password-input-section');
    for (let i = 0; i < passwordInputSections.length; i++) {
        if (passwordInputSections[i]) {
            passwordInputSections[i].style.borderColor = '#D1D1D1';
        }
    }
}


/**
 * Displays the password match error message and highlights the last password input section.
 */
function showResetMatchError() {
    let passwordInputSections = document.querySelectorAll('.password-input-section');
    if (passwordInputSections.length > 0) {
        let lastPasswordInputSection = passwordInputSections[passwordInputSections.length - 1];
        lastPasswordInputSection.style.borderColor = '#FF8190';
    }
}


/**
 * Applies a shake animation to the password input frame element.
 */
function shakeResetPasswordInput() {
    let passwordInput = document.getElementById('password-input-line');
    passwordInput.classList.add('shake-reset-password');

    setTimeout(() => {
        passwordInput.classList.remove('shake-reset-password');
    }, 500);
}


/**
 * Hides the password match error text.
 */
function hideResetMatchError() {
    let resetMatchError = document.getElementById('resetMatchError');
    if (resetMatchError) {
        resetMatchError.style.display = 'none';
    }
}


/**
 * Adds an input event listener to the confirm password field.
 * The listener triggers the hideResetMatchError function when user input is detected.
 */
document.addEventListener('DOMContentLoaded', function () {
    let confirmResetPassword = document.getElementById('confirmResetPassword');
    if (confirmResetPassword) {
        confirmResetPassword.addEventListener('input', hideResetMatchError);
    }
});