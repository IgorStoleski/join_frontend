let formSubmitted = false;
let rememberLogIn = false;


/**
 * Initializes the login process by loading user data.
 */
async function initLogIn() {
    await loadAllContacts();
}


/**
 * Loads users from storage
 */
async function loadAllContacts() {
    try {
        contacts = JSON.parse(await getItem('contacts'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}


/**
 * Listens for the form submission event and handles login process.
 */
document.getElementById('logInForm').addEventListener('submit', function (event) {
    event.preventDefault();
    formSubmitted = true;
    handleLogIn();
}
);


/**
 * Attempts to log in the user with the email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {boolean} - Returns true if the login is successful, false otherwise.
 */
function logIn(email, password) {
    let isLoggedIn = false;
    for (let i = 0; i < contacts.length; i++) {
        const user = contacts[i];
        if (user.email === email && user.password === password) {
            isLoggedIn = true;
            break;
        }
    }
    if (!isLoggedIn && formSubmitted) {
        shakePasswordInput();
    }
    formSubmitted = false;
    return isLoggedIn;
}


/**
* Handles the user login process.
*/
function handleLogIn() {
    let email = getEmailInputValue();
    let password = getPasswordInputValue();

    if (!email || !password) {
        return;
    }

    let isLoggedIn = logIn(email, password);

    if (isLoggedIn) {
        handleSuccessfulLogIn(email, password);
    } else {
        handleFailedLogIn();
    }
}


/**
* Handles the actions after a successful login.
* @param {string} email - The user's email.
* @param {string} password - The user's password.
*/
function handleSuccessfulLogIn(email, password) {
    let loggedInUser = findLoggedInUser(email, password);

    if (loggedInUser) {
        let initials = extractInitials(loggedInUser.name, loggedInUser.surname);

        let userData = {
            email: loggedInUser.email,
            name: loggedInUser.name,
            surname: loggedInUser.surname,
            password: loggedInUser.password,
            initials: initials,
            rememberStatus: rememberLogIn,
            isLoggedIn: true
        };
        saveLoggedInUserData(userData);
        window.location.href = 'summary.html';
    }
}


/**
Handles the actions after a failed login attempt. 
*/
function handleFailedLogIn() {
    resetFormStyle();
    showPasswordMatchError();
}


/**
 * Finds and returns the user object for a given email and password combination.
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 * @returns {Object | undefined} The user object if found; otherwise, undefined.
 */
function findLoggedInUser(email, password) {
    return contacts.find(contact => contact.email === email && contact.password === password);
}


/**
 * Extracts the initials from the given name and surname.
 * @param {string} name - The name from which to extract the initial.
 * @param {string} surname - The surname from which to extract the initial.
 * @returns {string} The initials of the name and surname (e.g., "JD" for "John Doe").
 */
function extractInitials(name, surname) {
    let initials = '';

    if (name) {
        initials += name.charAt(0).toUpperCase();
    }
    if (surname) {
        initials += surname.charAt(0).toUpperCase();
    }
    return initials;
}


/**
 * Saves the logged-in user data to the browser's local storage.
 * @param {Object} userData - The user data to be saved.
 */
function saveLoggedInUserData(userData) {
    localStorage.setItem('loggedInUser', JSON.stringify(userData));
}


/**
 * Adds a click event listener to the login button.
 */
function addLoginButtonListener() {
    let loginButton = document.getElementById('loginBtn');
    loginButton.addEventListener('click', handleLogIn);
}