let isChecked = false;


/**
 * Initializes the registration process by loading user data.
 */
async function initRegister() {
    await loadAllContacts();
}


/**
 * 
 */
async function loadAllContacts() {
    try {
        contacts = JSON.parse(await getItem('contacts'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}


/**
 * Listens for the form submission event and handles registration process.
 */
document.getElementById('signUpForm').addEventListener('submit', function (event) {
    event.preventDefault();
    signUpUser();
});


/**
 * Registers a new user.
 * @throws {Error} An error if the registration fails.
 */
async function signUpUser() {
    const username = document.getElementById('username').value;
    const passWord = getPasswordInputValue();
    const confirmPassword = getConfirmPasswordInputValue();
    const emailValue = email.value;

    resetSignUpFormStyle();

    if (!validatePasswordMatch(passWord, confirmPassword)) {
        return;
    }

    if (isEmailAlreadyRegistered(emailValue)) {
        showEmailAlreadyRegisteredError();
        return;
    }

    if (!isChecked) {
        return;
    }

    if (!isValidUsername(username)) {
        return;
    }

    let newContact = createNewContact(username, emailValue, passWord);
    registerContact(newContact);
}


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
function createNewContact(username, email, password) {
    let maxContactId = Math.max(...contacts.map(contact => contact.id), -1);
    let nextContactId = maxContactId + 1;
    let { newName, newsurname } = extractNameParts(username);

    return {
        bgcolor: getRandomColor(),
        id: nextContactId,
        name: newName,
        surname: newsurname,
        email,
        telefon: '',
        password,
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
 * Registers a new contact, updates the storage, and performs related actions.
 * @param {Object} newContact - The contact object to be registered.
 */
async function registerContact(newContact) {
    contacts.push(newContact);
    await setItem('contacts', JSON.stringify(contacts));
    showSuccessMessageAndRedirect();
    resetForm();
}