function isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return token !== null;
}

document.addEventListener('DOMContentLoaded', function() {
    if (!isAuthenticated() && window.location.pathname !== '/index.html') {
        window.location.href = '/index.html';
    }
});