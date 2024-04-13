/**
 * Adds a new subtask to the container.
 * This function retrieves the value from the new subtask input field, trims it, and
 * adds it to the subtask container with a generated subtask ID. If the input is empty,
 * it does nothing.
 */
function addAddSubtask() {
    let subtaskInput = document.querySelector('.new-subtask-textfield');
    let subtaskValue = subtaskInput.value.trim();

    if (!subtaskValue) {
        return;
    }
    subtaskIdCounter++;

    let subtaskId = 'subtask-' + subtaskIdCounter;

    addAddSubtaskToContainer(subtaskId, subtaskValue);
    subtaskInput.value = '';
    addCloseSubtaskInput();
}


/**
 * Handles the 'Enter' key press event for a text input field with the class 'new-subtask-textfield'.
 * @param {Event} event - The keyboard event object.
 */
function addHandleSubtaskInput(event) {
    if (event.key === 'Enter' && event.target.classList.contains('new-subtask-textfield')) {
        event.preventDefault();
        addAddSubtask();
        document.activeElement.blur();
    }
}
document.addEventListener('keypress', addHandleSubtaskInput);


/**
 * Adds a new subtask to a container and updates the DOM with the new subtask HTML.
 * @param {string} subtaskId - The unique identifier for the subtask.
 * @param {string} subtaskValue - The title or content of the subtask.
 */
function addAddSubtaskToContainer(subtaskId, subtaskValue) {
    subtasks.push({
        id: subtaskId,
        title: subtaskValue,
        status: false
    });
    let subtasksContainer = document.getElementById('addSubtask-add-container');
    subtasksContainer.innerHTML += addCreateSubtaskHTML(subtaskId, subtaskValue);
}


/**
 * Removes a subtask from the subtasks array and the corresponding HTML element from the DOM.
 * @param {string} subtaskId - The ID of the subtask to be deleted.
 */
function addDeleteSubtask(subtaskId) {
    const indexToDelete = subtasks.findIndex(subtask => subtask.id === subtaskId);

    if (indexToDelete !== -1) {
        subtasks.splice(indexToDelete, 1);

        let subtaskElement = document.getElementById(subtaskId);
        if (subtaskElement) {
            subtaskElement.parentElement.parentElement.remove();
        }
    }
}


/**
 * Enables editing mode for a subtask element identified by its ID.
 * This function sets the `contentEditable` property of the subtask element to true,
 * allowing the user to edit its content, and gives it focus for immediate editing.
 * @param {string} subtaskId - The ID of the subtask element to be edited.
 */
function addEditSubtask(subtaskId) {
    let subtaskElement = document.getElementById(subtaskId);

    if (subtaskElement) {
        subtaskElement.contentEditable = true;
        subtaskElement.focus();
    }
    let subtaskContainer = document.getElementById(`add-subtask-container-${subtaskId}`);
    if (subtaskContainer) {
        addAddEditingClasses(subtaskContainer);
    }
}


/**
 * Disables content editing for a subtask element and performs necessary cleanup actions.
 * @param {string} subtaskId - The ID of the subtask element to finish editing.
 */
function addFinishEditing(subtaskId) {
    let subtaskElement = document.getElementById(subtaskId);

    if (subtaskElement) {
        subtaskElement.contentEditable = false;
    }

    let subtaskContainer = document.getElementById(`add-subtask-container-${subtaskId}`);
    if (subtaskContainer) {
        addRemoveEditingClasses(subtaskContainer);
    }
    addSaveEditedTitle(subtaskId);
}


/**
 * Updates the title of a subtask based on user-edited content and saves it.
 * @param {string} subtaskId - The unique identifier of the subtask to update.
 */
function addSaveEditedTitle(subtaskId) {
    let subtaskElement = document.getElementById(subtaskId);
    let editedTitle = subtaskElement.textContent;

    let editedSubtask = subtasks.find(subtask => subtask.id === subtaskId);

    if (editedSubtask) {
        editedSubtask.title = editedTitle;
    }
}


/**
 * Adds an open subtask input field and shows related buttons.
 * This function hides the "open-subtask-button," focuses on the "addSubtaskInput" element,
 * and displays the "addSeparator" and "add-subtask-button" elements.
 */
function addOpenSubtaskInput() {
    document.querySelector('.open-subtask-button').style.display = 'none';
    document.getElementById('addSubtaskInput').focus();
    document.getElementById('addSeparator').style.display = 'inline-flex'
    let otherButtons = document.querySelectorAll('.add-subtask-button');
    for (let i = 0; i < otherButtons.length; i++) {
        otherButtons[i].style.display = 'inline-block';
    }
}


/**
 * Adds a close action to a subtask input section.
 * This function hides the open subtask button, clears the new subtask textfield,
 * resets the border of the add subtask input, hides the separator, and hides
 * other add subtask buttons.
 */
function addCloseSubtaskInput() {
    document.querySelector('.open-subtask-button').style.display = 'inline-block';
    document.querySelector('.new-subtask-textfield').value = '';
    document.querySelector('.add-subtask-input').style.borderBottom = "1px solid #D1D1D1";
    document.getElementById('addSeparator').style.display = 'none'
    let otherButtons = document.querySelectorAll('.add-subtask-button');
    for (let i = 0; i < otherButtons.length; i++) {
        otherButtons[i].style.display = 'none';
    }
}


/**
 * Adds editing-related CSS classes and styles to a given container element.
 * @param {HTMLElement} container - The container element to which editing classes and styles will be added.
 */
function addAddEditingClasses(container) {
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
 * Removes editing-related CSS classes and styles from a container element.
 * @param {HTMLElement} container - The container element to remove classes and styles from.
 */
function addRemoveEditingClasses(container) {
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