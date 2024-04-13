/**
 * Displays the details of a selected contact in mobile view.
 * @param {number} index - The index of the selected contact.
 */
function showContactDetailsMobile(index) {
    document.getElementById('addContactBtn').style.display = 'none';
    document.getElementById('contact-list-container').style.display = 'none';
    let detailsContainer = document.getElementById('contact-details-mobile');
    detailsContainer.style.display = 'block';
    document.querySelector('.container').style.display = 'none';
    let contact = contacts[index];
    let initials = `${contact.name.charAt(0)}${contact.surname.charAt(0)}`.toUpperCase();
    detailsContainer.innerHTML = showContactDetailsMobileHTML(contact, initials, index);
}


/**
 * Displays the edit buttons for contacts in mobile view.
 */
function showEditContactsButtonsMobile() {
    let elements = document.getElementById('contact-mobile-buttons');
    let header = document.getElementById('contact-detailed-head');
    header.classList.add('hide-it');
    elements.classList.remove('hide-it');
}


/**
 * Returns to the main contacts view in mobile mode.
 */
function returnToContactsMobile() {
    document.querySelector('.contact-details-mobile-class').style.display = 'none'
    document.querySelector('.container').style.display = 'flex';
    document.querySelector('.add-person-button').style.display = 'flex';
}


/**
 * Closes the edit buttons for contacts in mobile view.
 */
function closeButtonsMobile() {
    let element = document.getElementById('contact-mobile-buttons');
    let header = document.getElementById('contact-detailed-head');
    header.classList.remove('hide-it');
    element.classList.add('hide-it');
}