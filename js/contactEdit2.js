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