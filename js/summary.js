document.addEventListener('DOMContentLoaded', function() {
  getGreeting('day-time');
  getGreeting('mobile-day-time');
});


/**
 * Displays the appropriate greeting based on the time of the day and user status.
 * @param {string} id - The ID of the HTML element where the greeting will be displayed.
 */
function getGreeting(id) {
  const dayTime = document.getElementById(id);
  const currentHour = new Date().getHours();
  const isGuest = isGuestUser();
  
  morning(dayTime, currentHour, isGuest);
  afternoon(dayTime, currentHour, isGuest);
  evening(dayTime, currentHour, isGuest);

  showGreeting(isGuest);
  hideUserName(isGuest);
}


/**
 * Displays "Good morning" greeting during the morning hours.
 * @param {HTMLElement} dayTime - The HTML element where the greeting will be displayed.
 * @param {number} currentHour - The current hour of the day.
 * @param {boolean} isGuest - Indicates whether the user is a guest or not.
 */
function morning(dayTime, currentHour, isGuest){
  if (currentHour >= 5 && currentHour < 12) {
    if (isGuest) {
      dayTime.innerHTML = "Good morning";
    } else {
      dayTime.innerHTML = "Good morning, ";
    }
  }
}


/**
 * Displays "Good afternoon" greeting during the afternoon hours.
 * @param {HTMLElement} dayTime - The HTML element where the greeting will be displayed.
 * @param {number} currentHour - The current hour of the day.
 * @param {boolean} isGuest - Indicates whether the user is a guest or not.
 */
function afternoon(dayTime, currentHour, isGuest){
  if (currentHour >= 12 && currentHour < 18) {
    if (isGuest) {
      dayTime.innerHTML = "Good afternoon";
    } else {
      dayTime.innerHTML = "Good afternoon, ";
    }
  }
}


/**
 * Displays "Good evening" greeting during the evening hours.
 * @param {HTMLElement} dayTime - The HTML element where the greeting will be displayed.
 * @param {number} currentHour - The current hour of the day.
 * @param {boolean} isGuest - Indicates whether the user is a guest or not.
 */
function evening(dayTime, currentHour, isGuest){
  if (currentHour >= 18 && currentHour < 24)
    if (isGuest) {
      dayTime.innerHTML = "Good evening";
    } else {
      dayTime.innerHTML = "Good evening, ";
  }
}


/**
 * Toggles the active class for mobile greetings and containers based on window width.
 */
function toggleActiveClass() {
  const greetingsMobile = document.getElementById('greetings-mobile');
  const mobileContainer = document.getElementById('mobile-container');
  if (window.innerWidth < 1400) {
    greetingsMobile.classList.add('active-mobile');
    setTimeout(() => {
      greetingsMobile.classList.add('d-none');
      mobileContainer.classList.add('d-none');
    }, 1000);
  } else {
    greetingsMobile.classList.remove('active-mobile');
    greetingsMobile.classList.remove('d-none');
    mobileContainer.classList.remove('d-none');
  }
}

toggleActiveClass();

window.addEventListener('resize', toggleActiveClass);


/**
 * Retrieves the username of the logged-in user from local storage.
 * @returns {string} The username of the logged-in user, or an empty string if not available.
 */
function getLoggedInUserName() {
  let userData = JSON.parse(localStorage.getItem('loggedInUser'));

  if (userData && userData.name) {
    return `${userData.name} ${userData.surname || ''}`;
  } else {
    return '';
  }
}


/**
 * Checks if the current user is a guest (not logged in).
 * @returns {boolean} True if the user is a guest, otherwise false.
 */
function isGuestUser() {
  let userName = getLoggedInUserName();
  return !userName;
}


/**
 * Displays the user's name in the appropriate elements if they are logged in.
 * @param {boolean} isGuest - Indicates whether the user is a guest or not.
 */
function showGreeting(isGuest) {
  let userName = getLoggedInUserName();
  let userNameDesktop = document.getElementById('user-name');
  let userNameMobile = document.getElementById('user-name-mobile');

  if (!isGuest) {
    if (userNameDesktop) {
      userNameDesktop.textContent = userName;
    }
    if (userNameMobile) {
      userNameMobile.textContent = userName;
    }
  }
}


/**
 * Hides or shows the user's name based on their guest status.
 * @param {boolean} isGuest - Indicates whether the user is a guest or not.
 */
function hideUserName(isGuest) { 
  const userDesktop = document.getElementById('user-name');
  const userMobile = document.getElementById('user-name-mobile');
  if (isGuestUser(isGuest)) {
    userDesktop.classList.add('d-none');
    userMobile.classList.add('d-none');
  } else{
    userDesktop.classList.remove('d-none');
    userMobile.classList.remove('d-none');
  }  
}