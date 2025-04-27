/**
 * Checks whether the user is currently logged in.
 * This function retrieves the authentication token from localStorage.
 * If a token is found, the user is considered logged in.
 * @returns {boolean} Returns `true` if the auth token exists, otherwise `false`.
 */
function isUserLoggedIn() {
    const token = localStorage.getItem('authToken');
    return token !== null;
}


/**
 * Handles UI changes based on the user's login status once the DOM is fully loaded.
 * This event listener waits for the DOM content to be fully loaded,
 * then checks if the user is logged in using `isUserLoggedIn()`.
 * Depending on the result, it toggles the visibility of the 
 * imprint and aside sections accordingly.
 */
document.addEventListener('DOMContentLoaded', function() {
    const imprintSection = document.getElementById('imprint-section');
    const asideSection = document.getElementById('aside-section');

    if (isUserLoggedIn()) {
        imprintSection.style.display = 'none';
        asideSection.style.display = 'block';
    } else {
        imprintSection.style.display = 'block';
        asideSection.style.display = 'none';
    }
});