/**
 * Marks the active link in the navigation based on the current URL.
 */
function markDesktopLink() {
    let currentURL = window.location.href;
    let links = document.querySelectorAll('.links');

    links.forEach(link => {
        if (currentURL.includes(link.href)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
document.addEventListener('DOMContentLoaded', markDesktopLink);


/**
 * Adjusts the mobile navigation links images based on the current screen width.
 */
function markMobileLink() {
    let screenWidth = window.innerWidth;
    let links = document.querySelectorAll('.links');

    if (screenWidth < 1024) {
        for (let i = 0; i < links.length; i++) {
            updateLinkImage(links[i]);
        }
    }
}


/**
 * Updates the image of a navigation link based on its active state.
 * @param {HTMLElement} link - The navigation link element.
 */
function updateLinkImage(link) {
    let image = link.querySelector('img');
    let isActive = link.classList.contains('active');

    if (isActive) {
        updateMobileLinkImage(link, image);
    } else {
        updateDesktopLinkImage(link, image);
    }
}


/**
 * Updates the image of a navigation link for mobile view based on the link's ID.
 * @param {HTMLElement} link - The navigation link element.
 * @param {HTMLImageElement} image - The image element within the navigation link.
 */
function updateMobileLinkImage(link, image) {
    switch (link.id) {
        case 'summary-link':
            image.src = 'img/summary_mobile.png';
            break;
        case 'add_task-link':
            image.src = 'img/edit_square_mobile.png';
            break;
        case 'board-link':
            image.src = 'img/board_sidebar_mobile.png';
            break;
        case 'contact-link':
            image.src = 'img/contacts_mobile.png';
            break;
        default:
            break;
    }
}


/**
 * Updates the image of a navigation link for desktop view based on the link's ID. 
 * @param {HTMLElement} link - The navigation link element.
 * @param {HTMLImageElement} image - The image element within the navigation link.
 */
function updateDesktopLinkImage(link, image) {
    switch (link.id) {
        case 'summary-link':
            image.src = 'img/summary.png';
            break;
        case 'add_task-link':
            image.src = 'img/edit_square.png';
            break;
        case 'board-link':
            image.src = 'img/board_sidebar.png';
            break;
        case 'contact-link':
            image.src = 'img/contacts.png';
            break;
        default:
            break;
    }
}

window.addEventListener('resize', markMobileLink);


/**
 * Toggles the display of a menu.
 * @param {Event} event - The event triggered by the toggle action.
 */
function toggleMenu(event) {
    let menuItems = document.getElementById("logoutBtn");

    event.stopPropagation();

    if (menuItems.style.display === "" || menuItems.style.display === "none") {
        menuItems.style.display = "flex";
        menuItems.style.animationName = "slideInFromRight";
    } else {
        menuItems.style.animationName = "slideOutToRight";
        setTimeout(() => {
            menuItems.style.display = "none";
        }, 100);
    }
}


/**
 * Closes the menu when clicking outside of it or on certain navigation links.
 * @param {Event} event - The event triggered by the click action.
 */
function closeMenuOnClickAndOutside(event) {
    let menuItems = document.getElementById("logoutBtn");
    let clickedElement = event.target;

    if (!menuItems.contains(clickedElement) || clickedElement.classList.contains("nav-link")) {
        menuItems.style.animationName = "slideOutToRight";
        setTimeout(() => {
            menuItems.style.display = "none";
        }, 100);
    }
}

document.addEventListener("click", closeMenuOnClickAndOutside);


/**
 * Logs the user out by clearing stored data and redirecting to the login page.
 */
function logOut() {
    let loggedInUserJSON = localStorage.getItem('loggedInUser');
    if (loggedInUserJSON) {
        let loggedInUser = JSON.parse(loggedInUserJSON);
        if (!loggedInUser.rememberStatus) {
            localStorage.clear();
        }
    }
    window.location.replace('index.html');
}


/**
 * Retrieves the user's initials from local storage.
 * @returns {string} - User's initials or 'G' if not available.
 */
function getInitials() {
    let userData = JSON.parse(localStorage.getItem('loggedInUser'));

    if (userData && userData.initials) {
        return userData.initials;

    } else {
        return 'G';
    }
}


/**
 * Displays the user's initials in the designated HTML element.
 */
function showLoggedInUserInitials() {
    let loggedInUserData = getInitials();
    let initials = document.getElementById('initials');

    if (initials) {
        initials.textContent = loggedInUserData;
    }
}


/**
 * Opens the provided URL in a new browser tab or window.
 * @param {string} url - The URL to be opened in a new tab.
 */
function openInNewTab(url) {
    window.open(url, '_blank');
}


/**
 * Closes the current browser tab.
 * This function calls the `window.close()` method to close the currently
 * active browser tab or window.
 * @example
 * Close the current tab
 * closeCurrentTab();
 */
function closeCurrentTab() {
    window.close();
}