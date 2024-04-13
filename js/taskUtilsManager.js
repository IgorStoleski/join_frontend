/**
 * Clears the input fields and resets various elements on the task creation form.
 * - Clears the task title input field.
 * - Clears the task description input field.
 * - Clears the due date input field.
 * - Calls functions to reset buttons, assigned to selection, category selection, and subtasks.
 */
function addResetTaskForm() {
    document.getElementById('addTaskTitle').value = '';
    document.getElementById('addTaskDescription').value = '';
    document.getElementById('addDueDate').value = '';
    addResetButtons();
    addResetAssignedToSelection();
    addResetCategorySelection();
    addResetSubtasks();
}


/**
 * Resets the selected contacts, clears the search input field, and updates the UI.
 * This function clears the selectedContacts array, resets the value of the
 * search input field with the id 'addSearchInput', and updates the user interface
 * by calling the functions addRenderAssignedTo and addDisplayChosenContacts.
 */
function addResetAssignedToSelection() {
    selectedContacts = [];
    let searchInput = document.getElementById('addSearchInput');
    searchInput.value = '';
    addRenderAssignedTo();
    addDisplayChosenContacts();
}


/**
 * Resets the selected category and updates the UI display.
 * Clears the selected category and hides the category display, 
 * while displaying the select text.
 */
function addResetCategorySelection() {
    selectedCategory = '';
    let selectedCategoryDisplay = document.getElementById('addSelectedCategoryDisplay');
    selectedCategoryDisplay.textContent = '';

    let selectText = document.querySelector('.select-text');
    selectText.style.display = 'inline';
}


/**
 * Clears the subtasks array, resets the subtasks container, and closes the subtask input.
 */
function addResetSubtasks() {
    subtasks = [];
    let subtasksContainer = document.getElementById('addSubtask-add-container');
    let subtasksInput = document.getElementById('addSubtaskInput');
    subtasksContainer.innerHTML = '';
    subtasksInput.value = '';
    addCloseSubtaskInput();
}


/**
 * Resets the selected priority and clears highlighting and styles for priority choice buttons.
 */
function addResetButtons() {
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
 * Adds an error message and changes the border color of the title input element
 * to indicate that a title is required.
 */
function addShowTitleInputError() {
    let titleError = document.getElementById('addRequiredTitle');
    titleError.style.display = 'block';
    let titleInput = document.querySelector('.add-task-titel-textcontainer');
    titleInput.style.borderColor = '#FF8190';
}


/**
 * Hides the error message and resets the border color of the title input field
 * in the add task form.
 * @example
 * // Call this function to reset the title input field in the add task form
 * addResetTitleInput();
 */
function addResetTitleInput() {
    let titleError = document.getElementById('addRequiredTitle');
    titleError.style.display = 'none';
}


/**
 * Add an event listener to the document's body to handle input events on elements
 * with the 'add-task-description-textfield' class.
 * @param {Event} event - The input event triggered.
 */
document.body.addEventListener('input', function (event) {
    if (event.target.classList.contains('add-task-titel-textfield')) {
        addResetTitleInput();
    }
});


/**
 * Displays an error message and highlights the description input field
 * when a required description is missing.
 */
function addShowDescriptionInputError() {
    let descriptionError = document.getElementById('addRequiredDescription');
    descriptionError.style.display = 'block';
    let descriptionInput = document.querySelector('.add-task-description-textfield');
    descriptionInput.style.borderColor = '#FF8190';
}


/**
 * Hides the error message related to a required description input
 * and resets the border color of the description input field.
 */
function addResetDescriptionInput() {
    let descriptionError = document.getElementById('addRequiredDescription');
    descriptionError.style.display = 'none';
}


/**
 * Add an event listener to the document body to capture input events on elements
 * with the 'add-task-description-textfield' class and trigger the 'addResetDescriptionInput' function.
 * @param {Event} event - The input event object.
 */
document.body.addEventListener('input', function (event) {
    if (event.target.classList.contains('add-task-description-textfield')) {
        addResetDescriptionInput();
    }
});


/**
 * Displays an error message and highlights the date input field when a required date is missing.
 */
function addShowDateInputError() {
    let dateError = document.getElementById('addRequiredDate');
    dateError.style.display = 'block';
    let dateInput = document.querySelector('.due-date-input-container');
    dateInput.style.borderColor = '#FF8190';
}


/**
 * Hides the date error message and resets the border color of the date input container
 * if the date input is not focused.
 */
function addResetDateInput() {
    let dateError = document.getElementById('addRequiredDate');
    dateError.style.display = 'none';
}


/**
 * Attaches an event listener to the document body for the 'input' event.
 * @param {Event} event - The input event object.
 */
document.body.addEventListener('input', function (event) {
    if (event.target.id === 'addDueDate') {
        addResetDateInput();
    }
});


/**
 * Displays an error message for a required priority field in a user interface.
 * This function retrieves an HTML element with the ID 'addRequiredPriority' and sets its
 * style to 'block', making it visible as an error message.
 */
function addShowPriorityError() {
    let priorityError = document.getElementById('addRequiredPriority');
    priorityError.style.display = 'block';
}


/**
 * Hides the priority error message element with the specified ID.
 * @example
 * Example usage:
 * Assuming you have an HTML element with the ID 'addRequiredPriority':
 * <div id="addRequiredPriority">This is an error message</div>
 * addHidePriorityError();
 */
function addHidePriorityError() {
    let priorityError = document.getElementById('addRequiredPriority');
    priorityError.style.display = 'none';
}


/**
 * Displays an error message and updates the border color of a category dropdown input
 * to indicate that a category selection is required.
 */
function addShowSelectCategoryError() {
    let assignedError = document.getElementById('addRequiredCategory');
    assignedError.style.display = 'block';
    let assignedInput = document.querySelector('.category-dropdown');
    assignedInput.style.borderColor = '#FF8190';
}


/**
 * Hides the category error message, resets the border color of the category input field,
 * and checks if the input is not in focus to apply the reset.
 */
function addResetSelectCategory() {
    let categoryError = document.getElementById('addRequiredCategory');
    categoryError.style.display = 'none';

    let categoryInput = document.querySelector('.category-choicefield')
    categoryInput.style.borderColor = '#D1D1D1';
}


/**
 * Sets up an event listener for click events on the body of the document.
 * When any element with the class `category-dropdown` is clicked, this script calls the 
 * `addResetSelectCategory` function to handle the category reset logic.
 */
document.body.addEventListener('click', function (event) {
    if (event.target.classList.contains('category-dropdown')) {
        addResetSelectCategory();
    }
});