function isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return token !== null;
}

document.addEventListener('DOMContentLoaded', function() {
    if (!isAuthenticated() && window.location.pathname !== '/join/index.html') {
        window.location.href = '/join/index.html';
    }
});