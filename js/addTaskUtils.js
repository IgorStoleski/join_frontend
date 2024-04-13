/**
 * Resets all fields and selections in the task form to their default values.
 * - Clears the input fields for task title, task description, and due date.
 * - Resets the buttons, assigned-to selection, category selection, and subtasks.
 */
function resetTaskForm() {
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('dueDate').value = '';
    resetButtons();
    resetAssignedToSelection();
    resetCategorySelection();
    resetSubtasks();
}


/**
 * Resets the selected contacts and clears the search input.
 * Also calls functions to re-render the assigned contacts and display the chosen ones.
 * @example
 * resetAssignedToSelection();
 */
function resetAssignedToSelection() {
    selectedContacts = [];
    let searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    renderAssignedTo();
    displayChosenContacts();
}


/**
 * Resets the category selection by clearing the selected category and updating the associated DOM elements.
 * @see {@link https://jsdoc.app/|JSDoc}
 * @example
 * Assume there's a category currently selected and displayed in the UI.
 * resetCategorySelection();
 * The category display is now empty and the 'select-text' is shown.
 */
function resetCategorySelection() {
    selectedCategory = '';
    let selectedCategoryDisplay = document.getElementById('selectedCategoryDisplay');
    selectedCategoryDisplay.textContent = '';

    let selectText = document.querySelector('.select-text');
    selectText.style.display = 'inline';
}

/**
 * Clears and resets the subtasks list and input field.
 * This function removes all subtasks, clears the subtask container,
 * and resets the subtask input field's value to an empty string.
 * Additionally, it closes the subtask input if it's open.
 */
function resetSubtasks() {
    subtasks = [];
    let subtasksContainer = document.getElementById('subtask-add-container');
    let subtasksInput = document.getElementById('subtaskInput');
    subtasksContainer.innerHTML = '';
    subtasksInput.value = '';
    closeSubtaskInput();
}


/**
 * Resets the buttons for priority choices in the UI.
 * Clears the selectedPriority, removes highlighting, and restores default styles and images for all buttons.
 */
function resetButtons() {
    selectedPriority = '';

    let buttons = document.querySelectorAll('.priority-choice-inner');
    for (let i = 0; i < buttons.length; i++) {
        let btn = buttons[i];
        btn.classList.remove('highlighted');
        btn.style.backgroundColor = '';
        btn.style.color = 'black';

        let originalImage = btn.querySelector('.priority-choice-inner-pic img');
        originalImage.src = './img/' + originalImage.getAttribute('data-image');
    }
}


/**
 * Displays an error message and highlights the input field when a required title is missing.
 * This function is typically used for form validation.
 */
function showTitleInputError() {
    let titleError = document.getElementById('requiredTitle');
    titleError.style.display = 'block';
    let titleInput = document.querySelector('.add-task-titel-textcontainer');
    titleInput.style.borderColor = '#FF8190';
}


/**
 * Resets the title input field and any associated error messages.
 * If the input is not focused, it resets the border color of the input container.
 */
function resetTitleInput() {
    let titleError = document.getElementById('requiredTitle');
    titleError.style.display = 'none';

    let titleInput = document.querySelector('.add-task-titel-textcontainer');
    let input = titleInput.querySelector('.add-task-titel-textfield');

    if (!input.matches(':focus')) {
        titleInput.style.borderColor = '#D1D1D1';
    }
}
let titleInput = document.getElementById('taskTitle');
titleInput.addEventListener('input', resetTitleInput);


/**
 * Displays an error message and updates the border color of the description input field.
 */
function showDescriptionInputError() {
    let descriptionError = document.getElementById('requiredDescription');
    descriptionError.style.display = 'block';
    let descriptionInput = document.querySelector('.add-task-description-textfield');
    descriptionInput.style.borderColor = '#FF8190';
}


/**
 * Resets the description input field and hides any associated error message.
 */
function resetDescriptionInput() {
    let descriptionError = document.getElementById('requiredDescription');
    descriptionError.style.display = 'none';

    let descriptionInput = document.querySelector('.add-task-description-textfield');
    descriptionInput.style.borderColor = '#D1D1D1';
}
let descriptionInput = document.getElementById('taskDescription');
descriptionInput.addEventListener('input', resetDescriptionInput);


/**
 * Displays an error message and updates the border color of the date input container
 * to indicate an input error.
 */
function showDateInputError() {
    let dateError = document.getElementById('requiredDate');
    dateError.style.display = 'block';
    let dateInput = document.querySelector('.due-date-input-container');
    dateInput.style.borderColor = '#FF8190';
}


/**
 * Resets the date input field and hides any associated error messages.
 * If the input is not focused, it resets the border color of the input container.
 */
function resetDateInput() {
    let dateError = document.getElementById('requiredDate');
    dateError.style.display = 'none';

    let dateInput = document.querySelector('.due-date-input-container');
    let input = dateInput.querySelector('.due-date-textfield');

    if (!input.matches(':focus')) {
        dateInput.style.borderColor = '#D1D1D1';
    }
}
let dateInput = document.getElementById('dueDate');
dateInput.addEventListener('input', resetDateInput);

/**
 * Displays an error message for a required priority field.
 * This function sets the display style of the element with the ID 'requiredPriority' to 'block',
 * making the error message visible.
 */
function showPriorityError() {
    let priorityError = document.getElementById('requiredPriority');
    priorityError.style.display = 'block';
}


/**
 * Hides the priority error message element with the ID 'requiredPriority'.
 * This function sets the 'display' style property to 'none' to hide the error message.
 */
function hidePriorityError() {
    let priorityError = document.getElementById('requiredPriority');
    priorityError.style.display = 'none';
}


/**
 * Displays an error message and updates the border color of the category dropdown input
 * to indicate that a category selection is required.
 */
function showSelectCategoryError() {
    let assignedError = document.getElementById('requiredCategory');
    assignedError.style.display = 'block';
    let assignedInput = document.querySelector('.category-dropdown');
    assignedInput.style.borderColor = '#FF8190';
}


/**
 * Resets the select category input field and error message.
 */
function resetSelectCategory() {
    let categoryError = document.getElementById('requiredCategory');
    categoryError.style.display = 'none';

    let categoryInput = document.querySelector('.category-choicefield')
    let input = categoryInput.querySelector('.select-text');
    if (!input.matches(':focus')) {
        categoryInput.style.borderColor = '#D1D1D1';
    }
}
let categoryDropdown = document.querySelector('.category-dropdown');
categoryDropdown.addEventListener('click', resetSelectCategory);