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
  let initials = `${contact.name.charAt(0)}${contact.surname.charAt(
    0
  )}`.toUpperCase();
  let editContainer = document.getElementById("editModal");
  editContainer.innerHTML = generateEditContactModalHTML(
    index,
    initials,
    contact
  );
}

/**
 * Opens the edit modal.
 */
function openEditModal() {
  document.body.style.overflow = "hidden";
  let modal = document.getElementById("editModal");
  let overlay = document.querySelector(".background-overlay");
  modal.style.display = "flex";
  overlay.style.display = "block";
  modal.classList.remove("editModal-slide-out");
  modal.classList.add("editModal-slide-in");
}

/**
 * Closes the edit modal.
 */
function closeEditModal() {
  let modal = document.getElementById("editModal");
  let overlay = document.querySelector(".background-overlay");
  modal.classList.remove("editModal-slide-in");
  modal.classList.add("editModal-slide-out");
  overlay.style.display = "none";
  document.body.style.overflow = "auto";
}

/**
 * Deletes the specified contact after user confirmation.
 * @param {number} index - The index of the contact to delete.
 */
async function deleteContact(index) {
  const pk = contacts[index].id;

  await deleteContactBackend(pk);
  let detailsContainer = document.getElementById("contact-details");
  detailsContainer.innerHTML = "";
  closeEditModal();
  initContact();
  returnToContactsMobile();
}

/**
 * Displays a notification indicating that a contact was successfully added.
 */
function showContactAdded() {
  let contactAddedContainer = document.getElementById("contactAddedContainer");
  contactAddedContainer.innerHTML = /*html*/ `    <div> Contact successfully created </div> 
                                                    <div> <img src="./img/vector.svg"></div> `;
  contactAddedContainer.style.display = "flex";
  setTimeout(() => {
    contactAddedContainer.classList.add("show");
  }, 10);
  setTimeout(() => {
    contactAddedContainer.classList.remove("show");
    setTimeout(() => {
      contactAddedContainer.style.display = "none";
    }, 500);
  }, 2000);
}

function validateAll() {
  const fields = [
    {
      el: document.getElementById("Name"),
      fn: isValidName,
      msg: "Only letters are allowed",
    },
    {
      el: document.getElementById("Surname"),
      fn: isValidName,
      msg: "Only letters are allowed",
    },
    {
      el: document.getElementById("newEmail"),
      fn: isValidEmail,
      msg: "Please enter a valid e-mail address",
    },
    {
      el: document.getElementById("newTelefon"),
      fn: isValidPhone,
      msg: "Digits only (7-15 digits)",
    },
  ];
  let ok = true;

  fields.forEach(({ el, fn, msg }) => {
    clearError(el);
    if (!fn(el.value.trim())) {
      showError(el, msg);
      ok = false;
    }
  });

  return ok;
}

/**
 * Saves a new contact to the contacts array.
 */
async function saveNewContact() {
  // erst prüfen, ob Name, Surname, Email & Phone valid sind
  if (!validateAll()) {
    // Abbruch – Fehlermeldungen werden über reportValidity() angezeigt
    return;
  }

  // alle Felder sind ok → weiter wie gehabt:
  let newEmailInput = document.getElementById("newEmail");
  let newTelefonInput = document.getElementById("newTelefon");
  let nameInput = document.getElementById("Name");
  let surNameInput = document.getElementById("Surname");

  let newName = nameInput.value.trim();
  let newsurname = surNameInput.value.trim();
  let newEmail = newEmailInput.value.trim();
  let newTelefon = newTelefonInput.value.trim();

  let newContact = createNewContactObject(
    newName,
    newsurname,
    newEmail,
    newTelefon
  );

  await saveContact(newContact);
  clearFormFields(nameInput, surNameInput, newEmailInput, newTelefonInput);
  showContactAdded();
}


/**
 * Displays an error message for a specific input element.
 * Adds the "invalid" CSS class to the input element and sets the corresponding error message
 * in the element with the ID `error-[inputEl.id]`.
 * @param {HTMLElement} inputEl - The input element where the error occurred.
 * @param {string} message - The error message to be displayed.
 */
function showError(inputEl, message) {
  inputEl.classList.add("invalid");
  document.getElementById(`error-${inputEl.id}`).textContent = message;
}


/**
 * Clears the error message for a specific input element.
 * Removes the "invalid" CSS class from the input element and clears the content
 * of the corresponding error message element with the ID `error-[inputEl.id]`.
 * @param {HTMLElement} inputEl - The input element whose error should be cleared.
 */
function clearError(inputEl) {
  inputEl.classList.remove("invalid");
  document.getElementById(`error-${inputEl.id}`).textContent = "";
}

/**
 * Extracts the first and last name from a full name string.
 * @param {string} fullName - The full name string.
 * @returns {Object} An object containing the first and last name.
 */
function extractNameParts(fullName) {
  let nameParts = fullName.trim().split(" ");
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
  let emailInput = document.getElementById("newEmail");

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
  // einfacher Standard‐Regex für E‑Mail
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Checks if the provided phone number is valid based on a regular expression pattern.
 * @param {string} phone - The phone number to validate.
 * @returns {boolean} Returns true if the phone number is valid; otherwise, false.
 */
function isValidPhone(phone) {
  // nur Ziffern, z.B. zwischen 7 und 15 Stellen
  return /^\d{7,15}$/.test(phone.trim());
}

function isValidName(name) {
  // nur Buchstaben (auch Umlaute), mindestens 1 Zeichen
  return /^[A-Za-zÄÖÜäöüß]+$/.test(name.trim());
}

/**
 * Clears the form fields after saving a contact.
 * @param {HTMLInputElement} fullNameInput - The input element for full name.
 * @param {HTMLInputElement} newEmailInput - The input element for email.
 * @param {HTMLInputElement} newTelefonInput - The input element for phone number.
 */
function clearFormFields(
  nameInput,
  surNameInput,
  newEmailInput,
  newTelefonInput
) {
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
    bgcolor: bgcolor,
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
  if (!validateEditAll()) {
    return;
  }
  let newName = document.getElementById("editName").value.trim();
  let newsurname = document.getElementById("editSurname").value.trim();
  let newEmail = document.getElementById("editNewEmail").value.trim();
  let newTelefon = document.getElementById("editNewTelefon").value.trim();

  let originalContact = contacts[index];
  let updatedContact = createUpdatedContactObject(
    originalContact,
    newName,
    newsurname,
    newEmail,
    newTelefon
  );
  await updateAndSaveContact(index, updatedContact);
}


/**
 * Displays an error message for a specific input element.
 * Adds the "invalid" CSS class to the input element and sets the corresponding error message
 * in the element with the ID `error-[inputEl.id]`.
 * @param {HTMLElement} inputEl - The input element where the error occurred.
 * @param {string} message - The error message to be displayed.
 */
function showError(inputEl, message) {
  inputEl.classList.add("invalid");
  document.getElementById(`error-${inputEl.id}`).textContent = message;
}


/**
 * Clears the error message for a specific input element.
 * Removes the "invalid" CSS class from the input element and clears the content
 * of the corresponding error message element with the ID `error-[inputEl.id]`.
 * @param {HTMLElement} inputEl - The input element whose error should be cleared.
 */
function clearError(inputEl) {
  inputEl.classList.remove("invalid");
  document.getElementById(`error-${inputEl.id}`).textContent = "";
}


/**
 * Validates multiple input fields from an edit form.
 * This function checks the validity of name, surname, email, and phone input fields
 * using corresponding validation functions. If a field is invalid, it displays an
 * appropriate error message and sets the validation state to false.
 * @returns {boolean} Returns `true` if all fields are valid, otherwise `false`.
 */
function validateEditAll() {
  const fields = [
    {
      el: document.getElementById("editName"),
      fn: isValidName,
      msg: "Only letters are allowed",
    },
    {
      el: document.getElementById("editSurname"),
      fn: isValidName,
      msg: "Only letters are allowed",
    },
    {
      el: document.getElementById("editNewEmail"),
      fn: isValidEmail,
      msg: "Please enter a valid e-mail address",
    },
    {
      el: document.getElementById("editNewTelefon"),
      fn: isValidPhone,
      msg: "Digits only (7-15 digits)",
    },
  ];
  let ok = true;

  fields.forEach(({ el, fn, msg }) => {
    clearError(el);
    if (!fn(el.value.trim())) {
      showError(el, msg);
      ok = false;
    }
  });

  return ok;
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
function createUpdatedContactObject(
  originalContact,
  newName,
  newsurname,
  newEmail,
  newTelefon
) {
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
