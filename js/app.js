function isUserLoggedIn() {
    const token = localStorage.getItem('authToken');
    return token !== null;
}


function toggleAside() {
    const imprintSection = document.getElementById('imprint-section');
    const asideSection = document.getElementById('aside-section');

    if (isUserLoggedIn()) {
        // User ist eingeloggt → Zeige aside, verstecke imprint
        imprintSection.style.display = 'none';
        asideSection.style.display = 'block';
    } else {
        // Nicht eingeloggt → Zeige imprint, verstecke aside
        imprintSection.style.display = 'block';
        asideSection.style.display = 'none';
    }
}