/**
 * Initializes the login animation by hiding the large logo 
 * after a delay of 500 milliseconds. This function is typically
 * used to synchronize UI changes with a login animation.
 */
function initLogIn() {
    // Mitten in der Animation (z. B. nach 500ms)
    setTimeout(() => {
        const logo = document.getElementById('logoLarge');
        if (logo) {
            logo.style.display = 'none';
        }
    }, 500);
}