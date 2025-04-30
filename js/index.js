function initLogIn() {
    // Mitten in der Animation (z. B. nach 500ms)
    setTimeout(() => {
        const logo = document.getElementById('logoLarge');
        if (logo) {
            logo.style.display = 'none';
        }
    }, 500);
}