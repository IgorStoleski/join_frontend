/**
 * Checks whether the user is currently logged in.
 * This function retrieves the authentication token from localStorage.
 * If a token is found, the user is considered logged in.
 * @returns {boolean} Returns `true` if the auth token exists, otherwise `false`.
 */
function isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return token !== null;
}


/**
 * Redirects unauthenticated users to the home page when the DOM is fully loaded.
 * This event listener checks if the user is not authenticated using `isAuthenticated()`
 * and ensures they are not already on the home page. If both conditions are met,
 * it redirects the user to `/index.html`.
 */
document.addEventListener('DOMContentLoaded', function() {
    if (!isAuthenticated() && window.location.pathname !== '/index.html') {
        window.location.href = '/index.html';
    }
});