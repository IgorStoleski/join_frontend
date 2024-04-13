/**
 * Handles the click event when the "Forgot Password" link is clicked.
 * Hides the index container, applies background color, and shows the forgot password content.
 */
function handleForgotPasswordClick() {
    hideIndexContainer();
    applyBackgroundColor();
    displayForgotContent();
}


/**
 * Adds a click event listener to the "Forgot Password" link.
 */
let forgotPasswordLink = document.querySelector('.forgot-password-link');
forgotPasswordLink.addEventListener('click', handleForgotPasswordClick);


/**
 * Hides the index container element.
 */
function hideIndexContainer() {
    let indexContainer = document.querySelector('.index-container');
    indexContainer.style.display = 'none';
}


/**
 * Applies a background color to the body element.
 */
function applyBackgroundColor() {
    document.body.style.background = '#4589FF';
}


/**
 * Displays the forgot password content, generating and inserting the necessary HTML.
 */
function displayForgotContent() {
    let forgotContent = document.getElementById('forgot-content');
    if (forgotContent) {
        forgotContent.innerHTML = generateForgotContent();
        forgotContent.style.display = 'flex';
        addForgotBlurEvents();
    }
}


/**
 * Adds blur event listeners to email input sections.
 * Changes the border color of the input section when focused and blurred.
 */
function addForgotBlurEvents() {
    let emailInputSection = document.querySelectorAll('.email-input-section');
    emailInputSection.forEach(box => {
        let input = box.querySelector('.email-input');

        input.addEventListener('focus', () => {
            box.style.borderColor = '#4589FF';
        });

        input.addEventListener('blur', () => {
            box.style.borderColor = '#D1D1D1';
        });
    });
}
document.addEventListener('DOMContentLoaded', addForgotBlurEvents);


/**
 * Displays the reset password success overlay, switches the displayed content from
 * 'forgot-content' to 'reset-content' and adds blur events. If the email entered
 * is not found in the users array, displays an email not found error.
 * 
 * @param {Event} event - The event object triggered by the form submission.
 */
function showForgotAndRedirect(event) {
    let emailInput = document.getElementById('emailForgot');
    let email = emailInput.value;

    if (!isEmailInUsersArray(email)) {
        showEmailNotFoundError();
        event.preventDefault();
        return;
    }

    createAndShowSuccessOverlay();
    displayResetContent('forgot-content', 'reset-content');
    addResetBlurEvents();
    event.preventDefault();
}


/**
 * Checks if the given email exists in the users array.
 * 
 * @param {string} email - The email to check.
 * @returns {boolean} - True if the email exists in the users array, false otherwise.
 */
function isEmailInUsersArray(email) {
    for (let i = 0; i < contacts.length; i++) {
        if (contacts[i].email === email) {
            return true;
        }
    }
    return false;
}


/**
 * Displays an error message indicating that the email was not found in the users array.
 */
function showEmailNotFoundError() {
    let forgotMatchError = document.getElementById('forgotMatchError');
    if (forgotMatchError) {
        forgotMatchError.style.display = 'block';
    }
    let emailInputSection = document.querySelectorAll('.email-input-section');
    if (emailInputSection.length > 0) {
        let lastEmailInputSection = emailInputSection[emailInputSection.length - 1];
        lastEmailInputSection.style.borderColor = '#FF8190';
    }
}


/**
 * Hides the password match error text.
 */
function hideForgotMatchError() {
    let forgotMatchError = document.getElementById('forgotMatchError');
    if (forgotMatchError) {
        forgotMatchError.style.display = 'none';
    }
}


/**
 * Adds an input event listener to the email input field.
 * The listener triggers the hideForgotMatchError function when user input is detected.
 */
document.addEventListener('DOMContentLoaded', function () {
    let forgotEmail = document.getElementById('emailForgot');
    if (forgotEmail) {
        forgotEmail.addEventListener('input', hideForgotMatchError);
    }
});


/**
 * Creates and displays the success overlay for the forgot password process.
 * The overlay is removed after a delay.
 */
function createAndShowSuccessOverlay() {
    document.body.innerHTML += createForgotTemplate();
    setTimeout(removeSuccessOverlay, 1200);
}


/**
 * Removes the success overlay from the document body.
 */
function removeSuccessOverlay() {
    let successOverlay = document.getElementById('forgotOverlay');
    document.body.removeChild(successOverlay);
}