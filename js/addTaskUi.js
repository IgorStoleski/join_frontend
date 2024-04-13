/**
 * Applies border color on focus and blur events to elements within a container.
 * @param {string} containerSelector - CSS selector for the container elements.
 * @param {string} inputSelector - CSS selector for the input elements within the container.
 * @param {string} focusColor - CSS color value applied to the container border when the input is focused.
 * @param {string} blurColor - CSS color value applied to the container border when the input loses focus.
 */
function applyBorderColorOnFocusAndBlur(containerSelector, inputSelector, focusColor, blurColor) {
    const containers = document.querySelectorAll(containerSelector);

    containers.forEach(container => {
        const input = container.querySelector(inputSelector);

        input.addEventListener('focus', () => {
            container.style.borderColor = focusColor;
        });

        input.addEventListener('blur', () => {
            container.style.borderColor = blurColor;
        });
    });
}


/**
 * Sets up event listeners to apply specific border colors to various input fields when they receive focus or lose focus.
 * This function is executed once the DOM content is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    /**
     * Applies border color changes for the title text container and its associated text field.
     */
    applyBorderColorOnFocusAndBlur(
        '.add-task-titel-textcontainer',
        '.add-task-titel-textfield',
        '#4589FF',
        '#D1D1D1'
    );
    applyBorderColorOnFocusAndBlur(
        '.due-date-input-container',
        '.due-date-textfield',
        '#4589FF',
        '#D1D1D1'
    );
    applyBorderColorOnFocusAndBlur(
        '.assigned-to-choicefield',
        '#searchInput',
        '#4589FF',
        '#D1D1D1'
    );
    applyBorderColorOnFocusAndBlur(
        '.add-subtask-input',
        '#subtaskInput',
        '#4589FF',
        '#D1D1D1'
    );
});


/**
 * Changes the border color of a textarea element based on focus, blur, and input events.
 * @param {HTMLTextAreaElement} textarea - The textarea element whose border color needs to be modified.
 * @example
 * Assuming you have a textarea with the id 'myTextarea'
 * const textarea = document.getElementById('myTextarea');
 * changeTextAreaBorderOnFocusBlurInput(textarea);
 */
function changeTextAreaBorderOnFocusBlurInput(textarea) {
    textarea.addEventListener('focus', () => {
        textarea.style.border = '1px solid #4589FF';
    });

    textarea.addEventListener('blur', () => {
        textarea.style.border = '1px solid #D1D1D1';
    });

    textarea.addEventListener('input', () => {
        textarea.style.border = '1px solid #4589FF';
    });
}


/**
 * Sets up an event listener to change the border of a textarea element when it receives focus, loses focus, or has input.
 * This function is executed once the DOM content is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    let textarea = document.getElementById('taskDescription');
    changeTextAreaBorderOnFocusBlurInput(textarea);
});


/**
 * Sets the priority based on the button clicked. Resets other buttons and hides any priority errors.
 * @param {HTMLElement} button - The button element that was clicked to set the priority.
 * @throws {Error} Throws an error if the button ID does not match any expected priority.
 */
function priority(button) {
    resetButtons();
    hidePriorityError();

    if (button.id === 'prioUrgent') {
        highlightButton(button, '#FF3D00', './img/prio_high_active.png');
        selectedPriority = 'high';
    } else if (button.id === 'prioMedium') {
        highlightButton(button, '#FFA800', './img/prio_medium_active.png');
        selectedPriority = 'medium';
    } else if (button.id === 'prioLow') {
        highlightButton(button, '#7AE229', './img/prio_low_active.png');
        selectedPriority = 'low';
    }
}


/**
 * Highlights a button by changing its background color, image source, and text color.
 * @param {HTMLElement} button - The button to highlight.
 * @param {string} bgColor - The background color to apply to the button.
 * @param {string} imageSrc - The image source URL for the button's inner image.
 */
function highlightButton(button, bgColor, imageSrc) {
    button.classList.add('highlighted');
    button.style.backgroundColor = bgColor;
    let image = button.querySelector('.priority-choice-inner-pic img');
    image.src = imageSrc;
    button.style.color = 'white';
}


/**
 * Retrieves the logged-in user's data from local storage.
 * @returns {Object} The logged-in user's data, or an empty object if no data is found.
 */
function getLoggedInUserData() {
    return JSON.parse(localStorage.getItem('loggedInUser')) || {};
}


/**
 * Asynchronously renders the contacts assigned to the user.
 * It fetches the logged-in user data, gets the container for loading contacts,
 * and iterates over the list of contacts to render each contact's assigned information.
 * For each contact, it generates the initials from their name and surname, checks if the contact
 * is selected or if it matches the logged-in user's email, and then updates the container's HTML.
 * @requires getLoggedInUserData - A function to fetch the logged-in user's data.
 * @requires renderAssignedToHTML - A function to generate the HTML representation of a contact's assigned data.
 * @throws {Error} Throws an error if any issues arise while rendering.
 * @example
 * Assuming all required functions and global variables are present and correctly set up:
 * renderAssignedTo();
 */
async function renderAssignedTo() {
    let loggedInUserData = getLoggedInUserData();

    let assignedToContainer = document.getElementById('loadedContacts');
    assignedToContainer.innerHTML = '';

    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let initials = `${contact.name.charAt(0)}${contact.surname.charAt(0)}`.toUpperCase();
        let isSelected = selectedContacts[contact.id] || false;
        let isCurrentUser = loggedInUserData && contact.email === loggedInUserData.email;

        assignedToContainer.innerHTML += renderAssignedToHTML(contact, initials, isSelected, isCurrentUser);
    }
}


/**
 * Renders the contacts that were searched for and updates the HTML container.
 * It goes through each contact, computes the initials from their name and surname,
 * checks if the contact is selected and if the contact is the current logged in user,
 * and finally uses another function `renderSearchedContactsHTML` to update the DOM.
 * @param {Object[]} contacts - An array of contact objects.
 * @param {string} contacts[].name - First name of the contact.
 * @param {string} contacts[].surname - Last name (or surname) of the contact.
 * @param {string} contacts[].email - Email address of the contact.
 * @param {number} contacts[].id - Unique ID of the contact.
 * @example
 * const contacts = [
 *   { id: 1, name: 'John', surname: 'Doe', email: 'john.doe@example.com' },
 *   { id: 2, name: 'Jane', surname: 'Smith', email: 'jane.smith@example.com' }
 * ];
 * renderSearchedContact(contacts);
 */
function renderSearchedContact(contacts) {
    let loggedInUserData = getLoggedInUserData();

    let assignedToContainer = document.getElementById('loadedContacts');
    assignedToContainer.innerHTML = '';

    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let initials = `${contact.name.charAt(0)}${contact.surname.charAt(0)}`.toUpperCase();
        let isSelected = selectedContacts[contact.id] || false;
        let isCurrentUser = loggedInUserData && contact.email === loggedInUserData.email;

        assignedToContainer.innerHTML += renderSearchedContactsHTML(contact, initials, isSelected, isCurrentUser);
    }
}


/**
 * Toggles the visibility of the "assignedToContainer" and synchronizes 
 * the display of the "contactsContainer" accordingly. 
 * Also manages the 'expanded' class of the "assignedToDropdown".
 * @example
 * To toggle the display of the containers
 * toggleAssignedToContainer();
 */
function toggleAssignedToContainer() {
    let assignedToContainer = document.getElementById('loadedContacts');
    let contactsContainer = document.querySelector('.contacts-container');
    let assignedToDropdown = document.querySelector('.assigned-to-dropdown');

    if (assignedToContainer.style.display === 'block') {
        assignedToContainer.style.display = 'none';
        assignedToDropdown.classList.remove('expanded');
        document.removeEventListener('click', clickOutsideHandler);
    } else {
        assignedToContainer.style.display = 'block';
        assignedToDropdown.classList.add('expanded');
        document.addEventListener('click', clickOutsideHandler);
    }
    contactsContainer.style.display = assignedToContainer.style.display;
}


/**
 * Handles the click outside event for assignedToContainer and assignedToDropdown.
 * Hides assignedToContainer and contactsContainer when clicking outside these elements.
 * @param {MouseEvent} event - The click event
 */
function clickOutsideHandler(event) {
    let assignedToContainer = document.getElementById('loadedContacts');
    let assignedToDropdown = document.querySelector('.assigned-to-dropdown');
    let contactsContainer = document.querySelector('.contacts-container');

    if (!assignedToContainer.contains(event.target) && !assignedToDropdown.contains(event.target)) {
        assignedToContainer.style.display = 'none';
        contactsContainer.style.display = 'none';
        assignedToDropdown.classList.remove('expanded');
        document.removeEventListener('click', clickOutsideHandler);
    }
}


/**
 * Display the chosen contacts on the page by appending them to
 * the 'chosenContacts' container. For each chosen contact, their initials
 * are displayed with a specified background color.
 * Assumes the following:
 * 1. An HTML container with the id 'chosenContacts' exists in the DOM.
 * 2. The `contacts` array exists in the current scope, with each contact
 *    object having properties: 'id', 'name', 'surname', and 'bgcolor'.
 * 3. The `selectedContacts` object exists in the current scope, where
 *    each key is a contact's 'id' and its value is a boolean indicating
 *    if the contact is selected.
 */
function displayChosenContacts() {
    let chosenContactsContainer = document.getElementById('chosenContacts');
    chosenContactsContainer.innerHTML = '';

    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let isSelected = selectedContacts[contact.id];

        if (isSelected) {
            let initials = `${contact.name.charAt(0)}${contact.surname.charAt(0)}`.toUpperCase();
            chosenContactsContainer.innerHTML += /*html*/`
                <div class="chosen-contact">
                    <div class="initial" style="background-color: ${contact.bgcolor}">${initials}</div>
                </div>
            `;
        }
    }
}


/**
 * Renders categories into the `loadedCategories` DOM element.
 * Each category will be displayed in a div with the class "category".
 * When a category is clicked, the `categorySelected` function is called with the category name as an argument.
 * @requires categories - An array of objects where each object should have a 'categoryName' property.
 */
function renderCategorys() {
    let categoryContainer = document.getElementById('loadedCategories');
    categoryContainer.innerHTML = '';

    for (let i = 0; i < categories.length; i++) {
        let category = categories[i].categoryName;
        categoryContainer.innerHTML += `
            <div class="category" onclick="categorySelected('${category}')">${category}</div>
            `;
    }
}


/**
 * Toggles the visibility of the category container.
 * - When the category container is displayed, it hides the container and makes necessary style adjustments.
 * - When the category container is not displayed, it shows the container, makes necessary style adjustments, and renders the categories.
 */
function toggleCategoryContainer() {
    let selectText = document.querySelector('.select-text');
    selectText.style.display = 'inline';

    let selectedCategoryDisplay = document.getElementById('selectedCategoryDisplay');
    selectedCategoryDisplay.textContent = '';

    let categoryContainer = document.getElementById('loadedCategories');
    let categoryDropdown = document.querySelector('.category-dropdown');

    if (categoryContainer.style.display === 'block') {
        categoryContainer.style.display = 'none';
        categoryDropdown.classList.remove('expanded');
        categoryDropdown.style.borderBottom = "1px solid #D1D1D1";

    } else {
        categoryContainer.style.display = 'block';
        categoryDropdown.classList.add('expanded');
        categoryDropdown.style.borderBottom = "1px solid #4589FF";
        renderCategorys();
    }
}


/**
 * Updates the UI based on the selected category.
 * @param {string} category - The category that has been selected.
 */
function categorySelected(category) {
    selectedCategory = category;

    let selectedCategoryDisplay = document.getElementById('selectedCategoryDisplay');
    selectedCategoryDisplay.textContent = `${selectedCategory}`;

    let selectText = document.querySelector('.select-text');
    selectText.style.display = 'none';

    let categoryContainer = document.getElementById('loadedCategories');
    categoryContainer.style.display = 'none';

    let categoryDropdown = document.querySelector('.category-dropdown');
    categoryDropdown.classList.remove('expanded');
    categoryDropdown.style.borderBottom = "1px solid #D1D1D1";;
}