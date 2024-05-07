/**
 * Edits the specified contact.
 * @param {number} index - The index of the contact to edit.
 */
function editContact(index) {
    let contact = contacts[index];
    openEditModal();
    generateEditContactModal(index);
    document.getElementById("editName").value = contact.name;
    document.getElementById("editSurname").value = contact.surname;
    document.getElementById("editNewEmail").value = contact.email;
    document.getElementById("editNewTelefon").value = contact.telefon;

    const editModalForm = document.getElementById("editModal");
    editModalForm.onsubmit = function (event) {
        event.preventDefault();
        updateContact(index);
    };

    returnToContactsMobile();
}


/**
 * Generates the edit modal for a specific contact.
 * @param {number} index - The index of the contact to edit.
 */
function generateEditContactModal(index) {
    let contact = contacts[index];
    let initials = `${contact.name.charAt(0)}${contact.surname.charAt(0)}`.toUpperCase();
    let editContainer = document.getElementById('editModal');
    editContainer.innerHTML = generateEditContactModalHTML(index, initials, contact);
}


/**
 * Opens the edit modal.
 */
function openEditModal() {
    document.body.style.overflow = 'hidden';
    let modal = document.getElementById("editModal");
    let overlay = document.querySelector(".background-overlay");
    modal.style.display = "flex";
    overlay.style.display = "block";
    modal.classList.remove('editModal-slide-out');
    modal.classList.add('editModal-slide-in');
}


/**
 * Closes the edit modal.
 */
function closeEditModal() {
    let modal = document.getElementById("editModal");
    let overlay = document.querySelector(".background-overlay");
    modal.classList.remove('editModal-slide-in');
    modal.classList.add('editModal-slide-out');
    overlay.style.display = "none";
    document.body.style.overflow = 'auto';
}


/**
 * Deletes the specified contact after user confirmation.
 * @param {number} index - The index of the contact to delete.
 */
async function deleteContact(index) {
    const pk = contacts[index].id;	
    
    await deleteContactBackend(pk);
    let detailsContainer = document.getElementById('contact-details');
    detailsContainer.innerHTML = '';
    closeEditModal();
    initContact();
    returnToContactsMobile();
}


/**
 * Displays a notification indicating that a contact was successfully added.
 */
function showContactAdded() {
    let contactAddedContainer = document.getElementById('contactAddedContainer');
    contactAddedContainer.innerHTML = /*html*/ `    <div> Contact successfully created </div> 
                                                    <div> <img src="./img/vector.svg"></div> `;
    contactAddedContainer.style.display = 'flex';
    setTimeout(() => {
        contactAddedContainer.classList.add('show');
    }, 10);
    setTimeout(() => {
        contactAddedContainer.classList.remove('show');
        setTimeout(() => {
            contactAddedContainer.style.display = 'none';
        }, 500);
    }, 2000);
}


/**
 * Saves a new contact to the contacts array.
 */
async function saveNewContact() {
    let newEmailInput = document.getElementById('newEmail');
    let newTelefonInput = document.getElementById("newTelefon");
    let nameInput = document.getElementById("Name");
    let surNameInput = document.getElementById("Surname");
    let newName = nameInput.value;
    let newsurname = surNameInput.value;
    let newEmail = newEmailInput.value;
    let newTelefon = newTelefonInput.value;
    let newContact = createNewContactObject(newName, newsurname, newEmail, newTelefon);
    saveContact(newContact);
    clearFormFields(nameInput, surNameInput, newEmailInput, newTelefonInput);
    showContactAdded();
}


/**
 * Extracts the first and last name from a full name string.
 * @param {string} fullName - The full name string.
 * @returns {Object} An object containing the first and last name.
 */
function extractNameParts(fullName) {
    let nameParts = fullName.trim().split(' ');
    return { newName: nameParts[0], newsurname: nameParts[1] };
}


/**
 * Validates the contact fields for correctness.
 * @param {string} newName - The first name.
 * @param {string} newEmail - The email address.
 * @param {string} newTelefon - The phone number.
 * @returns {boolean} True if all fields are valid, false otherwise.
 */
function validateContactFields(newName, newEmail, newTelefon) {
    if (!areAllFieldsFilled(newName, newEmail, newTelefon)) {
        return false;
    }
    if (!isValidName(newName)) {
        return false;
    }
    if (!isValidEmail(newEmail)) {
        return false;
    }
    if (!isValidPhoneNumber(newTelefon)) {
        return false;
    }
    return true;
}


/**
 * Checks if all the provided fields have values.
 * @param {string} newName - The new name value.
 * @param {string} newEmail - The new email value.
 * @param {string} newTelefon - The new telephone value.
 * @returns {boolean} Returns true if all fields are filled; otherwise, false.
 */
function areAllFieldsFilled(newName, newEmail, newTelefon) {
    return newName && newEmail && newTelefon;
}


/**
 * Checks if the provided name is valid based on a regular expression pattern.
 * @param {string} newName - The name to validate.
 * @returns {boolean} Returns true if the name is valid; otherwise, false.
 */
function validateForm() {
    let emailInput = document.getElementById('newEmail');

    if (!emailInput.checkValidity()) {
        emailInput.reportValidity();
        return false; 
    }
    return true;
}

/**
 * Checks if the provided email address is valid based on a regular expression pattern.
 * @param {string} email - The email address to validate.
 * @returns {boolean} Returns true if the email is valid; otherwise, false.
 */
function isValidEmail(email) {
    let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
}


/**
 * Checks if the provided phone number is valid based on a regular expression pattern.
 * @param {string} phone - The phone number to validate.
 * @returns {boolean} Returns true if the phone number is valid; otherwise, false.
 */
function isValidPhoneNumber(phone) {
    let phonePattern = /^[0-9]+$/;
    return phonePattern.test(phone);
}


/**
 * Clears the form fields after saving a contact.
 * @param {HTMLInputElement} fullNameInput - The input element for full name.
 * @param {HTMLInputElement} newEmailInput - The input element for email.
 * @param {HTMLInputElement} newTelefonInput - The input element for phone number.
 */
function clearFormFields(nameInput, surNameInput, newEmailInput, newTelefonInput) {
    nameInput.value = "";
    surNameInput.value = "";
    newEmailInput.value = "";
    newTelefonInput.value = "";
    let saveContactBtn = document.getElementById("saveContactBtn");
    saveContactBtn.disabled = false;
}


/**
 * Creates a new contact object.
 * @param {string} newName - The first name.
 * @param {string} newsurname - The last name.
 * @param {string} newEmail - The email address.
 * @param {string} newTelefon - The phone number.
 * @returns {Object} The new contact object.
 */
function createNewContactObject(newName, newsurname, newEmail, newTelefon) {   
    const bgcolor = getRandomColor(); 
    return {
        name: newName,
        surname: newsurname,
        email: newEmail,
        telefon: newTelefon,
        bgcolor: bgcolor
    };
}


/**
 * Saves a contact to the contacts array and updates local storage.
 * @param {Object} newContact - The contact object to save.
 */
async function saveContact(newContact) {
    contacts.push(newContact);
    await setContact(newContact);
    closeModal();
    await initContact();
}


/**
 * Updates an existing contact in the contacts array.
 * @param {number} index - The index of the contact to update.
 */
async function updateContact(index) {
    let newName = document.getElementById("editName").value;
    let newsurname = document.getElementById("editSurname").value;
    let newEmail = document.getElementById("editNewEmail").value;
    let newTelefon = document.getElementById("editNewTelefon").value;
    let originalContact = contacts[index];
    let updatedContact = createUpdatedContactObject(originalContact, newName, newsurname, newEmail, newTelefon);
    await updateAndSaveContact(index, updatedContact);
}


/**
 * Creates an updated contact object based on the original contact and new data.
 * @param {Object} originalContact - The original contact object.
 * @param {string} newName - The updated first name.
 * @param {string} newsurname - The updated last name.
 * @param {string} newEmail - The updated email address.
 * @param {string} newTelefon - The updated phone number.
 * @returns {Object} The updated contact object.
 */
function createUpdatedContactObject(originalContact, newName, newsurname, newEmail, newTelefon) {
    return {
        bgcolor: originalContact.bgcolor,
        id: originalContact.id,
        name: newName,
        surname: newsurname,
        email: newEmail,
        telefon: newTelefon,
    };
}


/**
 * Updates a contact in the contacts array and saves the updated list to local storage.
 * @param {number} index - The index of the contact to update.
 * @param {Object} updatedContact - The updated contact object.
 */
async function updateAndSaveContact(index, updatedContact) {
    contacts[index] = updatedContact;
    const pk = contacts[index].id;
    await setUpdateContact(updatedContact, pk);
    closeEditModal();
    await initContact();
    showContactDetails(index);
}