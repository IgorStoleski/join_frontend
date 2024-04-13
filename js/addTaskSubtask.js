/**
 * Adds a subtask based on the input from the '.new-subtask-textfield' element.
 * If the input is empty or just whitespace, the function returns without adding a subtask.
 * Otherwise, a new subtask is created with a unique ID and added to the subtask container.
 * After adding the subtask, the input field is cleared and closed.
 */
function addSubtask() {
    let subtaskInput = document.querySelector('.new-subtask-textfield');
    let subtaskValue = subtaskInput.value.trim();

    if (!subtaskValue) {
        return;
    }
    subtaskIdCounter++;

    let subtaskId = 'subtask-' + subtaskIdCounter;

    addSubtaskToContainer(subtaskId, subtaskValue);
    subtaskInput.value = '';
    closeSubtaskInput();
}


/**
 * Handles the input event for a subtask. If the user presses 'Enter' on an input
 * element with the 'new-subtask-textfield' class, it will prevent the default behavior,
 * add a new subtask, and remove focus from the active element.
 * @param {Event} event - The event object triggered by the input action.
 */
function handleSubtaskInput(event) {
    if (event.key === 'Enter' && event.target.classList.contains('new-subtask-textfield')) {
        event.preventDefault();
        addSubtask();
        document.activeElement.blur();
    }
}
let subtaskInput = document.querySelector('.new-subtask-textfield');
subtaskInput.addEventListener('keypress', handleSubtaskInput);


/**
 * Adds a subtask to the global subtasks array and appends its HTML representation
 * to the subtask container in the DOM.
 * @param {number|string} subtaskId - The unique identifier for the subtask.
 * @param {string} subtaskValue - The title or value of the subtask.
 */
function addSubtaskToContainer(subtaskId, subtaskValue) {
    subtasks.push({
        id: subtaskId,
        title: subtaskValue,
        status: false
    });
    let subtasksContainer = document.getElementById('subtask-add-container');
    subtasksContainer.innerHTML += createSubtaskHTML(subtaskId, subtaskValue);
}


/**
 * Deletes a subtask with the given ID from the subtasks array and removes its corresponding element from the DOM.
 * @param {string|number} subtaskId - The ID of the subtask to delete.
 * @throws Will throw an error if `subtasks` is not defined in the scope.
 */
function deleteSubtask(subtaskId) {
    let indexToDelete = subtasks.findIndex(subtask => subtask.id === subtaskId);

    if (indexToDelete !== -1) {
        subtasks.splice(indexToDelete, 1);

        let subtaskElement = document.getElementById(subtaskId);
        if (subtaskElement) {
            subtaskElement.parentElement.parentElement.remove();
        }
    }
}


/**
 * Makes the specified subtask editable and focuses on it. Also adds editing classes to its container.
 * @param {string} subtaskId - The ID of the subtask element to be edited.
 * @example
 * Assuming there's a DOM element with the ID "subtask1" and another with the ID "subtask-container-subtask1".
 * editSubtask('subtask1');  // This will make the "subtask1" element editable and add editing classes to its container.
 */
function editSubtask(subtaskId) {
    let subtaskElement = document.getElementById(subtaskId);

    if (subtaskElement) {
        subtaskElement.contentEditable = true;
        subtaskElement.focus();
}

    let subtaskContainer = document.getElementById(`subtask-container-${subtaskId}`);
    if (subtaskContainer) {
        addEditingClasses(subtaskContainer);
    }
}


/**
 * Finishes the editing mode for a given subtask, disables content editing,
 * removes editing-related classes, and saves the edited title.
 * @param {string} subtaskId - The ID of the subtask to finish editing.
 * @example
 * Assuming there's a subtask with ID "subtask-1" in the DOM.
 * finishEditing('subtask-1');
 */
function finishEditing(subtaskId) {
    let subtaskElement = document.getElementById(subtaskId);

    if (subtaskElement) {
        subtaskElement.contentEditable = false;
    }

    let subtaskContainer = document.getElementById(`subtask-container-${subtaskId}`);
    if (subtaskContainer) {
        removeEditingClasses(subtaskContainer);
    }
    saveEditedTitle(subtaskId);
}


/**
 * Updates the title of a subtask with the given ID.
 * @param {string} subtaskId - The ID of the subtask to be updated.
 * @example
 * let subtasks = [
 *   {id: 'subtask1', title: 'Original Title'},
 *   ... other subtasks ...
 * ];
 * saveEditedTitle('subtask1');
 */
function saveEditedTitle(subtaskId) {
    let subtaskElement = document.getElementById(subtaskId);
    let editedTitle = subtaskElement.textContent;

    let editedSubtask = subtasks.find(subtask => subtask.id === subtaskId);

    if (editedSubtask) {
        editedSubtask.title = editedTitle;
    }
}


/**
 * Opens the subtask input by hiding the 'open-subtask-button', focusing the 'subtaskInput', 
 * and displaying the separator and all 'add-subtask-button' elements.
 */
function openSubtaskInput() {
    document.querySelector('.open-subtask-button').style.display = 'none';
    document.getElementById('subtaskInput').focus();
    document.getElementById('separator').style.display = 'inline-flex';
    let otherButtons = document.querySelectorAll('.add-subtask-button');
    for (let i = 0; i < otherButtons.length; i++) {
        otherButtons[i].style.display = 'inline-block';
    }
}


/**
 * Closes the subtask input field and updates the display of related UI elements.
 * - Hides the new subtask textfield and its associated input elements.
 * - Resets the styling of the add-subtask-input.
 * - Hides the separator.
 * - Hides all add-subtask-buttons.
 */
function closeSubtaskInput() {
    document.querySelector('.open-subtask-button').style.display = 'inline-block';
    document.querySelector('.new-subtask-textfield').value = '';
    document.querySelector('.add-subtask-input').style.borderBottom = "1px solid #D1D1D1";
    document.getElementById('separator').style.display = 'none';
    let otherButtons = document.querySelectorAll('.add-subtask-button');
    for (let i = 0; i < otherButtons.length; i++) {
        otherButtons[i].style.display = 'none';
    }
}


/**
 * Adds editing classes and styles to a given container element.
 * - Adds "editing-mode" and "no-hover" classes.
 * - Updates the border at the bottom of the container.
 * - Adjusts display properties for various child elements of the container such as ".subtask-dot",
 *   ".save-subtask-button", ".edit-delete-subtask-button", and ".separator3".
 * @param {HTMLElement} container - The container element to modify.
 */

function addEditingClasses(container) {
    container.classList.add("editing-mode");
    container.classList.add("no-hover");
    container.style.borderBottom = "1px solid #4589FF";

    let dot = container.querySelector(".subtask-dot");
    let saveButton = container.querySelector(".save-subtask-button");
    let cancelButton = container.querySelector(".edit-delete-subtask-button");
    let separator3 = container.querySelector(".separator3");

    if (dot) {
        dot.style.display = "none";
    }

    if (saveButton) {
        saveButton.style.display = "block";
    }

    if (cancelButton) {
        cancelButton.style.display = "block";
    }

    if (separator3) {
        separator3.style.display = "block";
    }
}


/**
 * Removes editing-related classes and styles from a given container element.
 * @param {HTMLElement} container - The container element to clean up.
 * @example
 * const container = document.querySelector('.some-container');
 * removeEditingClasses(container);
 */
function removeEditingClasses(container) {
    container.classList.remove("editing-mode");
    container.classList.remove("no-hover");
    container.style.borderBottom = "";

    let dot = container.querySelector(".subtask-dot");
    let saveButton = container.querySelector(".save-subtask-button");
    let cancelButton = container.querySelector(".edit-delete-subtask-button");
    let separator3 = container.querySelector(".separator3");

    if (dot) {
        dot.style.display = "inline-block";
    }

    if (saveButton) {
        saveButton.style.display = "none";
    }

    if (cancelButton) {
        cancelButton.style.display = "none";
    }

    if (separator3) {
        separator3.style.display = "none";
    }
}