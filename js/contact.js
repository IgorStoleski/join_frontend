let colors = ['#0038FF', '#00BEE8', '#1FD7C1', '#6E52FF', '#9327FF', '#9747FF', '#FC71FF', '#FF4646', '#FF745E', '#FF7A00', '#FFA35E', '#FFBB2B', '#FFC701', '#FFE62B'];

let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];


/**
 * main function to initialize the whole site
 */
async function initContact() {
    await loadAllContacts();
    sortContacts();
    initLetters();
    await showContacts();
    removeEmptyLetters();
}


/**
 * Loads all contacts from the storage.
 */
async function loadAllContacts() {
    try {
        contacts = JSON.parse(await getItem('contacts'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}


/**
 * Sorts the contacts array alphabetically by name. 
 */
function sortContacts() {
    contacts.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
}


/**
 * Renders the alphabet letters as headers for the contacts.
 */
function initLetters() {
    let letterList = document.getElementById('container-letter');
    if (!letterList) {
        console.error("Element 'container-letter' not found.");
        return;
    }
    letterList.innerHTML = '';
    for (let i = 0; i < letters.length; i++) {
        let letter = letters[i];
        letterList.innerHTML += generateLetterListHTML(letter);
    }
}


/**
 * Retrieves the logged-in user's data from local storage.
 * @returns {Object} The logged-in user's data.
 */
function getLoggedInUserData() {
    return JSON.parse(localStorage.getItem('loggedInUser')) || {};
}


/**
 * Displays the contacts on the page.
 */
async function showContacts() {
    let loggedInUserData = getLoggedInUserData();
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        if (!contact.bgcolor) {
            contact.bgcolor = getRandomColor();
        }
        let initials = `${contact.name.charAt(0)}${contact.surname.charAt(0)}`.toUpperCase();
        let firstLetter = contact.name.charAt(0).toUpperCase();
        let contactsList = document.getElementById(`container-contact-${firstLetter}`);
        let color = contact.bgcolor;
        let isCurrentUser = loggedInUserData && contact.email === loggedInUserData.email;
        contactsList.innerHTML += showContactsHTML(i, color, initials, contact, isCurrentUser);
    }
}


/**
 * Handles the contact click event to determine the display mode (mobile or desktop).
 * @param {number} index - The index of the clicked contact.
 */
function handleContactClick(index) {
    if (window.innerWidth <= 1200) {
        showContactDetailsMobile(index);
    } else {
        showContactDetails(index);
    }
}


/**
 * Hides the unused alphabet letters that are used as headers.
 */
function removeEmptyLetters() {
    for (let i = 0; i < letters.length; i++) {
        let letter = letters[i];
        let contactsList = document.getElementById(`container-contact-${letter}`);
        if (!contactsList.innerHTML.trim()) {
            let letterContainer = document.getElementById(`container-${letter}`);
            letterContainer.style.display = 'none';
        }
    }
}


let isContainerVisible = false;


/**
 * Shows the details of a contact based on its index.
 * @param {number} index - The index of the contact whose details should be displayed.
 */
function showContactDetails(index) {
    let detailsContainer = document.getElementById('contact-details');
    resetAllContactsSelection();
    let selectedContactElement = document.querySelector(`[data-contact-index="${index}"]`);

    showContactDetailsContent(detailsContainer, index);

    selectedContactElement.classList.add('contact-selected');
    handleAnimationEnd(detailsContainer);
}


/**
* Resets the selection state of all contact elements.
*/
function resetAllContactsSelection() {
    let allContacts = document.querySelectorAll('.contact');
    allContacts.forEach(contactElement => {
        contactElement.classList.remove('contact-selected');
    });
}



/**
 * Displays the contact details content in the specified details container.
 * The content includes information like name, surname, and initials of the contact.
 * The details container is given a "slide-in" animation if it was not visible before.
 * @param {HTMLElement} detailsContainer - The container element where the contact details content will be displayed.
 * @param {number} index - The index of the contact in the contacts array.
 */
function showContactDetailsContent(detailsContainer, index) {
    let contact = contacts[index];
    let initials = `${contact.name.charAt(0)}${contact.surname.charAt(0)}`.toUpperCase();
    detailsContainer.innerHTML = showContactDetailsHTML(contact, initials, index);
    detailsContainer.style.display = 'inline-flex';
    detailsContainer.setAttribute('data-current-index', index);

    if (!isContainerVisible) {
        detailsContainer.classList.add('slide-in');
    }

    isContainerVisible = true;
}


/**
 * Handles the "animationend" event for the specified details container.
 * Removes the "slide-in" class from the details container when the animation ends.
 * @param {HTMLElement} detailsContainer - The container element with the animation to handle.
 */
function handleAnimationEnd(detailsContainer) {
    detailsContainer.addEventListener('animationend', function () {
        detailsContainer.classList.remove('slide-in');
    });
}


/**
 * Returns a random color from the colors array.
 * @returns {string} A random color code.
 */
function getRandomColor() {
    let randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}


/**
 * Opens the modal to add new contacts.
 */
function openModal() {
    document.body.style.overflow = 'hidden';
    let modalHTML = generateAddContactModalHTML();
    let modalContainer = document.getElementById("contactModal");
    modalContainer.innerHTML = modalHTML;
    let overlay = document.querySelector(".background-overlay");
    modalContainer.style.display = "flex";
    overlay.style.display = "flex";
    modalContainer.classList.remove('modal-slide-out');
    modalContainer.classList.add('modal-slide-in');
}


/**
 * Closes the modal used for adding new contacts.
 */
function closeModal() {
    let modal = document.getElementById("contactModal");
    let overlay = document.querySelector(".background-overlay");
    modal.classList.remove('modal-slide-in');
    modal.classList.add('modal-slide-out');
    overlay.style.display = "none";
    document.body.style.overflow = 'auto';
}


/**
 * Closes the 'contactModal' when clicking outside of its content.
 * @param {Event} event - The DOM event triggered from the click.
 */
function closeModalBackAddContact(event) {
    if (event.target.classList.contains('modal')) {
        let modal = document.getElementById("contactModal");
        let overlay = document.querySelector(".background-overlay");
        modal.classList.remove('modal-slide-in');
        modal.classList.add('modal-slide-out');
        overlay.style.display = "none";
        document.body.style.overflow = 'auto';
    }
}


/**
 * Closes the 'editModal' when clicking outside of its content. 
 * @param {Event} event - The DOM event triggered from the click.
 */
function closeModalBackEditContact(event) {
    if (event.target.classList.contains('edit-modal')) {
        let modal = document.getElementById("editModal");
        let overlay = document.querySelector(".background-overlay");
        modal.classList.remove('editModal-slide-in');
        modal.classList.add('editModal-slide-out');
        overlay.style.display = "none";
        document.body.style.overflow = 'auto';
    }
}