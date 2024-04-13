/**
 * Edits the specified contact.
 * @param {number} index - The index of the contact to edit.
 */
function editContact(index) {
    let contact = contacts[index];
    openEditModal();
    generateEditContactModal(index);
    document.getElementById("editFullName").value = `${contact.name} ${contact.surname}`;
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
    contacts.splice(index, 1);
    for (let i = 0; i < contacts.length; i++) {
        contacts[i].id = i + 1;
    }
    await setItem('contacts', JSON.stringify(contacts));
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
    let fullNameInput = document.getElementById("fullName");
    let nameValidationResult = validateNameParts(fullNameInput);
    let newName = nameValidationResult.newName;
    let newsurname = nameValidationResult.newsurname;
    let newEmail = newEmailInput.value;
    let newTelefon = newTelefonInput.value;
    let newContact = createNewContactObject(newName, newsurname, newEmail, newTelefon);
    saveContact(newContact);
    clearFormFields(fullNameInput, newEmailInput, newTelefonInput);
    showContactAdded();
}


/**
 * Validates the name input for new contacts.
 * @param {HTMLInputElement} fullNameInput - The input element containing the full name.
 * @returns {Object} An object containing the first and last name.
 */
function validateNameParts(fullNameInput) {
    let nameParts = extractNameParts(fullNameInput.value);
    let newName = nameParts.newName;
    let newsurname = nameParts.newsurname || '';
    return { newName, newsurname };
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
function clearFormFields(fullNameInput, newEmailInput, newTelefonInput) {
    fullNameInput.value = "";
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
    let maxContactId = Math.max(...contacts.map(contact => contact.id), -1);
    let nextContactId = maxContactId + 1;
    return {
        bgcolor: getRandomColor(),
        id: nextContactId,
        name: newName,
        surname: newsurname,
        email: newEmail,
        telefon: newTelefon
    };
}


/**
 * Saves a contact to the contacts array and updates local storage.
 * @param {Object} newContact - The contact object to save.
 */
async function saveContact(newContact) {
    contacts.push(newContact);
    await setItem('contacts', JSON.stringify(contacts));
    closeModal();
    await initContact();
}


/**
 * Updates an existing contact in the contacts array.
 * @param {number} index - The index of the contact to update.
 */
async function updateContact(index) {
    let newEmailInput = document.getElementById("editNewEmail");
    let newTelefonInput = document.getElementById("editNewTelefon");
    let fullNameInput = document.getElementById("editFullName");
    let nameValidationResult = validateNameParts(fullNameInput);

    let newName = nameValidationResult.newName;
    let newsurname = nameValidationResult.newsurname;
    let newEmail = newEmailInput.value;
    let newTelefon = newTelefonInput.value;
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
        password: originalContact.password
    };
}


/**
 * Updates a contact in the contacts array and saves the updated list to local storage.
 * @param {number} index - The index of the contact to update.
 * @param {Object} updatedContact - The updated contact object.
 */
async function updateAndSaveContact(index, updatedContact) {
    contacts[index] = updatedContact;
    await setItem('contacts', JSON.stringify(contacts));
    closeEditModal();
    await initContact();
    showContactDetails(index);
}