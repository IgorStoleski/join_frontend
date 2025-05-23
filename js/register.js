let isChecked = false;
let isPrivacyChecked = false;

/**
 * Validates whether the entered passwords match.
 * @param {string} password - The password entered by the user.
 * @param {string} confirmPassword - The confirmation of the entered password.
 */
function validatePasswordMatch(password, confirmPassword) {
    if (password !== confirmPassword) {
        showPasswordMatchError();
        shakePasswordInput();
        return false;
    }
    return true;
}


/**
 * Checks if the provided email is already registered.
 * @param {string} email - The email to check.
 * @returns {boolean} - Returns true if the email is already registered, false otherwise.
 */
function isEmailAlreadyRegistered(email) {
    return contacts.find(contact => contact.email === email);
}


/**
 * Tests if the username adheres to the specified format.
 * @param {string} username - The username to be validated.
 * @returns {boolean} Returns true if the username is in a valid format, false otherwise.
 */
function isValidUsername(username) {
    return /^[a-zA-Z][^0-9!@#$%^&*(),.?":{}|<>']*$/.test(username);
}


/**
 * Creates a new contact object based on provided information.
 * @param {string} username - The username or full name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} password - The password associated with the contact.
 * @returns {Object} Returns a new contact object.
 */
function createNewContact(username, usersurname, email, password) {
    const bgcolor = getRandomColor(); 
    return {
      name: username,
      surname: usersurname,
      email: email,
      password: password,
      telefon: '',
      bgcolor: bgcolor,
    };
  }


/**
 * Extracts the first and last name parts from a full name.
 * @param {string} username - The full name to extract parts from.
 * @returns {Object} Returns an object with the properties `newName` and `newsurname`.
 */
function extractNameParts(username) {
    let nameParts = username.trim().split(' ');
    let newName = nameParts[0];
    let newsurname = nameParts[1] || '';
    return { newName, newsurname };
}


/**
 * Creates a new user contact object with a randomly assigned background color.
 * @param {string} username - The first name of the user.
 * @param {string} usersurname - The surname of the user.
 * @param {string} email - The email address of the user.
 * @returns {Object} A user contact object containing name, surname, email, 
 *                   an empty phone number, and a random background color.
 */
function createNewUserContact (username, usersurname, email) {
    const bgcolor = getRandomColor();
    return {
        name: username,
        surname: usersurname,
        email: email,
        telefon: '',
        bgcolor: bgcolor
    };
}


/**
 * Registers a new contact, updates the storage, and performs related actions.
 * @param {Object} newContact - The contact object to be registered.
 */
async function registerContact(newContact) {
    const userContact = createNewUserContact(
        newContact.username,
        newContact.last_name,
        newContact.email
    );
    setContactData(userContact);
    try {
        const response = await setRegisterUser(newContact);
        if (response) {
            showSuccessMessageAndRedirect();
        } else {
            throw new Error('Failed to register user: ' + (response.message || JSON.stringify(response)));
        }
    } catch (error) {
        
    }
    resetForm();
}


/**
 * Saves the provided contact data to local storage.
 * @param {Object} contact - The contact data to be stored.
 */
function setContactData(contact) {
    localStorage.setItem('userContact', JSON.stringify(contact));
}
