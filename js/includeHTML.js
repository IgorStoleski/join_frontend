/**
 * Initializes the application by including HTML fragments, marking links, and showing user initials.
 */
async function init() {
    await includeHTML();
    markDesktopLink();
    markMobileLink();
    showLoggedInUserInitials();
}

/**
 * Includes HTML fragments into specific elements with the "w3-include-html" attribute.
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}