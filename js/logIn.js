let formSubmitted = false;
let rememberLogIn = false;
let userId;

/**
 * Initializes the login process by loading user data.
 */
async function initLogIn() {
  await loadAllContacts();
}


function guestLogin() {
  const email = "gast@login.de";
  const password = "gastlogin";

  document.getElementById("emailLogin").value = email;
  document.getElementById("passwordLogin").value = password;

  logIn(email, password, false);
}

/**
 * Listens for the form submission event and handles login process.
 */
document
  .getElementById("logInForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    formSubmitted = true;
    handleLogIn();
  });

/**
 * Attempts to log in the user with the email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {boolean} - Returns true if the login is successful, false otherwise.
 */
async function logIn(email, password, formSubmitted = true) {
  let isLoggedIn = false;
  let userToken = null;
  let id = null;
  let newUserContact = null;

  try {
    const response = await fetch(STORAGE_URL + "login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      newUserContact = getContactData();
      userToken = data.token;
      id = data.user_id;
      saveAuthToken(userToken);
      isLoggedIn = true;
      userId = id;
      handleSuccessfulLogIn(id);
    } else {
      if (formSubmitted) shakePasswordInput();
    }
  } catch (e) {
    console.error("Netzwerkfehler beim Login:", e);
    if (formSubmitted) shakePasswordInput();
  }

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

  if (!isLoggedIn) {
    handleFailedLogIn();
  }
}


/**
 * Handles the actions after a successful login.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 */
async function handleSuccessfulLogIn(pk) {
  const loggedInUser = await fetchUserDetails(pk);
  if (loggedInUser) {
    let initials = extractInitials(
      loggedInUser.username,
      loggedInUser.last_name
    );
    let userData = {
      email: loggedInUser.email,
      name: loggedInUser.username,
      surname: loggedInUser.last_name,
      initials: initials,
      isLoggedIn: true,
    };
    saveLoggedInUserData(userData);
    window.location.href = "summary.html";
    saveContactToBackend();
  } else {
    console.error("Could not retrieve user data");
  }
}

async function fetchUserDetails(pk) {
  const token = getAuthToken();
  const response = await fetch(STORAGE_URL + "users/" + pk + "/", {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    return await response.json();
  } else {
    console.error("Failed to fetch user details");
    return null;
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
function extractInitials(username, lastName) {
  return `${username.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Extracts the initials from the given name and surname.
 * @param {string} name - The name from which to extract the initial.
 * @param {string} surname - The surname from which to extract the initial.
 * @returns {string} The initials of the name and surname (e.g., "JD" for "John Doe").
 */
function extractInitials(name, surname) {
  let initials = "";

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
  localStorage.setItem("loggedInUser", JSON.stringify(userData));
}

/**
 * Adds a click event listener to the login button.
 */
function addLoginButtonListener() {
  let loginButton = document.getElementById("loginBtn");
  loginButton.addEventListener("click", handleLogIn);
}


async function saveContactToBackend() {
  const contactData = getContactData();

  if (!contactData) {
    return;
  }

  try {
    await setContact(contactData);
  } catch (error) {
    console.error("Error saving contact:", error);
  }
}

