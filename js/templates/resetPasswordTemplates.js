/**
 * Generates the HTML content for the "Forgot Password" form.
 * @returns {string} - The generated HTML content for the form.
 */
function generateForgotContent() {
    return /*html*/ `<img class="white-small-logo" src="img/join_logo_large.png" alt="Join Logo">
    <form onsubmit="showForgotAndRedirect(event)" id="resetPasswordForm" class="forgot-password-container">
        <section class="arrow-container">
            <a href="index.html" class="arrow-left-icon"></a>
        </section>
        <section class="forgot-info-container">
            <div class="forgot-info-title">I forgot my password</div>
            <div class="forgot-info-line"></div>
        </section>
        <section class="forgot-password-info">Don't worry! We will send you an email with the instructions to reset your
            password.
        </section>

        <section class="email-input-container">
            <div class="email-input-section">
                <div class="email-input-frame">
                    <input id="emailForgot" required type="email" class="email-input" name="email" autocomplete="email" placeholder="Email">
                    <img class="email-icon" src="img/mail.png" alt="Email">
                </div>
            </div>
            <div class="forgot-match-error" id="forgotMatchError">Your Email don´t match. Try again</div>
        </section>

        <section class="send-email-container">
            <button type="submit" class="send-email-btn" id="sendEmailButton">Send me the email</button>
        </section>
    </form>
    `;
}


/**
 * Creates the HTML template for the "Forgot Password" overlay message.
 * @returns {string} - The generated HTML content for the overlay message.
 */
function createForgotTemplate() {
    return /*html*/ `
        <div id="forgotOverlay" class="overlay">
            <div class="message">
                <img class="send-check" src="img/send_check.png" alt="">
                <p>An E-Mail has been sent to you</p>
            </div>
        </div>
    `;
}


/**
 * Generates the HTML content for the "Reset Password" form.
 * @returns {string} - The generated HTML content for the reset form.
 */
function generateResetContent() {
    return /*html*/ `<img class="white-small-logo" src="img/join_logo_large.png" alt="Join Logo">
    <form onsubmit="validateAndSubmitResetForm(); return false;" id="resetPasswordReset" class="reset-password-container">
        <section class="arrow-container">
        <a href="index.html" class="arrow-left-icon"></a>
        </section>
        <section class="reset-info-container">
            <div class="reset-info-title">Reset your password</div>
            <div class="reset-info-line"></div>
        </section>
        <section class="change-password-info">Change your account password here</section>
        <section class="password-input-container">
            <div class="password-input-frame">
                <div class="password-input-section">
                    <div class="password-input-line">
                        <input id="resetPassword" required type="text" class="password-input" placeholder="New password" autocomplete="current-password" minlength="4">
                    </div>
                </div>
            </div>
            <div class="confirm-password-frame">
                <div class="password-input-section">
                    <div id="password-input-line" class="password-input-line">
                        <input id="confirmResetPassword" required type="text" class="password-input" placeholder="Confirm password" autocomplete="current-password" minlength="4">
                    </div>
                </div>
                <div class="reset-match-error" id="resetMatchError">Your Passwords don´t match. Try again</div>
            </div>
        </section>
        <section class="continue-btn-container">
            <button type="submit" id="resetButton" class="continue-btn">Continue</button>
        </section>
    </form>
    `;
}


/**
 * Creates the HTML template for the "Reset Password" overlay message.
 * @returns {string} - The generated HTML content for the overlay message.
 */
function createResetTemplate() {
    return /*html*/ `
        <div id="resetOverlay" class="overlay">
            <div class="message">
                <p>You reset your password</p>
            </div>
        </div>
    `;
}