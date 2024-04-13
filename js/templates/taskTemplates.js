/**
 * Renders the HTML content for the "Add Task" modal.
 * @returns {string} The HTML content of the modal.
 */
function renderAddTask() {
    const currentDate = new Date().toISOString().split('T')[0];

    return /* html */ `
<div class="float-add-task-container">
    <div class="header">
        <h1 class="title-add-task">Add Task</h1>
        <img class="close-add-task" onclick="closeAddTaskModal()" src="./img/close_subtask.png" alt="Close Task">
    </div>
    <div class="add-task-content">
        <div class="add-task-container-first">
            <div class="add-task-container-titel">
                <div id="add-task-titel-textcontainer" class="add-task-titel-textcontainer">
                    <input id="addTaskTitle" class="add-task-titel-textfield" placeholder="Enter a title">
                </div>
                <div id="addRequiredTitle" class="add-task-field-required">
                    This field is required
                </div>
            </div>
            <div class="add-task-container-description">
                <div class="add-task-description-header">Description</div>
                <textarea id="addTaskDescription" class="add-task-description-textfield"
                    placeholder="Enter a Description" cols="30" rows="4"></textarea>
                <div id="addRequiredDescription" class="add-task-field-required">
                    This field is required
                </div>
            </div>
            <div class="due-date-container">
                <div class="due-date-header">
                    Due date
                </div>
                <div class="due-date-input-container">
                    <input id="addDueDate" class="due-date-textfield" type="date">
                </div>
                <div id="addRequiredDate" class="add-task-field-required">
                    This field is required
                </div>
            </div>
        </div>
        <div class="add-task-container-priority">
            <div class="add-task-priority-header">
                Priority
            </div>
            <div class="priority-choice">
                <button type="button" onclick="addPriority(this)" id="addPrioUrgent"
                    class="priority-choice-inner prio-urgent">
                    Urgent
                    <div class="priority-choice-inner-pic">
                        <img src="./img/prio-high.png" id="addPrioUrgentImg" class="original-image"
                            data-image="prio-high.png">
                    </div>
                </button>
                <button type="button" onclick="addPriority(this)" id="addPrioMedium"
                    class="priority-choice-inner prio-medium">
                    Medium
                    <div class="priority-choice-inner-pic">
                        <img src="./img/prio-medium.png" id="addPrioMediumImg" class="original-image"
                            data-image="prio-medium.png">
                    </div>
                </button>
                <button type="button" onclick="addPriority(this)" id="addPrioLow"
                    class="priority-choice-inner prio-low">
                    Low
                    <div class="priority-choice-inner-pic">
                        <img src="./img/prio-low.png" id="addPrioLowImg" class="original-image"
                            data-image="prio-low.png">
                    </div>
                </button>
            </div>
            <div id="addRequiredPriority" class="add-task-field-required">
                This field is required
            </div>
        </div>
        <div class="assigned-to-container">
            <div class="assigned-to-header">
                Assigned to
            </div>
            <div class="assigned-to-choicefield" id="add-assigned-to-choicefield">
                <div class="assigned-to-dropdown" onclick="addToggleAssignedToContainer()">
                    <div class="assigned-dropdown-header">
                        <input oninput="addSearchContacts(this.value)" id="addSearchInput" class="assigned-select-text"
                            placeholder="Select contacts to assign" type="text">
                    </div>
                    <div class="assigned-dropdown-arrow"></div>
                </div>
            </div>
            <div class="contacts-container">
                <div id="addLoadedContacts" class="loaded-contacts">
                </div>
                <button id="addContactBtn" onclick="openModal()" class="add-person-btn" type="button">
                    Add new contact
                    <img src="./img/person_add.svg" class="button-icon">
                </button>
            </div>
            <div id="addChosenContacts" class="chosen-contacts"></div>
        </div>
        <div class="category-container">
            <div class="category-header">
                Category
            </div>
            <div class="category-choicefield">
                <div class="category-dropdown" onclick="addToggleCategoryContainer()">
                    <div class="dropdown-header" id="addDropdownHeader">
                        <span class="select-text">Select task category</span>
                        <span id="addSelectedCategoryDisplay"></span>
                    </div>
                    <div class="dropdown-arrow"></div>
                </div>
            </div>
            <div id="addRequiredCategory" class="add-task-field-required">
                This field is required
            </div>
            <div id="addLoadedCategories" class="loaded-categories"></div>
        </div>
        <div class="subtasks-container">
            <div class="subtasks-header">
                Subtasks
            </div>
            <div class="add-subtask-input">
                <input onclick="addOpenSubtaskInput()" type="text" id="addSubtaskInput" class="new-subtask-textfield"
                    placeholder="Add new subtask">
                <img onclick="addOpenSubtaskInput()" class="open-subtask-button" src="./img/open_subtask.png">
                <img onclick="addCloseSubtaskInput()" class="add-subtask-button hidden" id="closeSubtask"
                    src="./img/close_subtask.png">
                <span class="separator" id="addSeparator">|</span>
                <img onclick="addAddSubtask()" class="add-subtask-button hidden" id="addNewSubtask"
                    src="./img/add_subtask.png">
            </div>
            <div id="addSubtask-add-container" class="subtask-add-container"></div>
        </div>
    </div>
    <div class="add-task-bottom-container">
        <button type="submit" id="addCreateTaskButton" class="create-task-btn">
            Create Task
            <img class="button-create-task-pic" src="./img/check.svg">
        </button>
    </div>
</div>
    `;
}


/**
 * Creates a success message template.
 * @returns {string} - The HTML template for a success message overlay.
 */
function addCreatedTaskTemplate() {
    return /*html*/ `
        <div id="addCreateTaskOverlay" class="task-overlay">
            <div class="task-success-message">
                <p>Task added to board</p>
                <img class="send-check" src="./img/added_task.png" alt="">
            </div>
        </div>
    `;
}


/**
 * Renders a contact as HTML with optional selection and current user indicator.
 * @param {object} contact - The contact object with properties like name, surname, and bgcolor.
 * @param {string} initials - The initials to display.
 * @param {boolean} isSelected - Whether the contact is selected.
 * @param {boolean} isCurrentUser - Whether the contact is the current user.
 * @returns {string} The HTML representation of the contact with optional selection and user indicator.
 */
function addRenderAssignedToHTML(contact, initials, isSelected, isCurrentUser) {
        let userMarker = isCurrentUser ? " (you)" : "";

    return /*html*/`
        <div class="contact-container ${isSelected ? 'selected' : ''}" onclick="addToggleContactSelection('${contact.name}', '${contact.surname}')">
            <div class="select-contact">
                <div class="initial" style="background-color: ${contact.bgcolor}">${initials}</div>
                <div class="select-name">${contact.name} ${contact.surname}${userMarker}</div>
            </div>
            <img class="select-icon" id="addSelectCheck" src="${isSelected ? 'img/check_contact.png' : 'img/check-button.png'}"  alt="Check Button">
        </div>
    `;
}


/**
 * Generates HTML markup for rendering a contact in a search result.
 * @param {Object} contact - The contact information.
 * @param {string} contact.name - The contact's first name.
 * @param {string} contact.surname - The contact's last name.
 * @param {string} contact.bgcolor - The background color for the contact's initial.
 * @param {string} initials - The initials of the contact.
 * @param {boolean} isSelected - Indicates whether the contact is selected.
 * @param {boolean} isCurrentUser - Indicates whether the contact is the current user.
 * @returns {string} The HTML markup for rendering the contact.
 */
function addRenderSearchedContactsHTML(contact, initials, isSelected, isCurrentUser) {
        let userMarker = isCurrentUser ? " (you)" : "";

    return /*html*/`
        <div class="contact-container ${isSelected ? 'selected' : ''}" onclick="addToggleContactSelection('${contact.name}', '${contact.surname}')">
            <div class="select-contact">
                <div class="initial" style="background-color: ${contact.bgcolor}">${initials}</div>
                <div class="select-name">${contact.name} ${contact.surname}${userMarker}</div>
            </div>
            <img class="select-icon" id="addSelectCheck" src="${isSelected ? 'img/check_contact.png' : 'img/check-button.png'}"  alt="Check Button">
        </div>
    `;
}


/**
 * Generates HTML for a subtask container with edit and delete buttons.
 * @param {string} subtaskId - The ID of the subtask container.
 * @param {string} subtaskValue - The value/content of the subtask.
 * @returns {string} The HTML markup for the subtask container.
 */
function addCreateSubtaskHTML(subtaskId, subtaskValue) {
    return /*html*/`
        <div id="add-subtask-container-${subtaskId}" class="subtask-container">
            <div class="subtask-item">
                <span class="subtask-dot"></span>           
                <span id="${subtaskId}" data-subtask-id="${subtaskId}" class="subtask-value" contenteditable="false">${subtaskValue}</span>
            </div>
            <div class="hover-content">
                <img onclick="addEditSubtask('${subtaskId}')" src="./img/edit_subtask.png" class="edit-subtask-button">
                <span class="separator2" id="separator2">|</span> 
                <img onclick="addDeleteSubtask('${subtaskId}')" data-subtask-id="${subtaskId}" src="./img/delete_subtask.png" class="delete-subtask-button">
            </div>
            <img onclick="addDeleteSubtask('${subtaskId}')" data-subtask-id="${subtaskId}" src="./img/delete_subtask.png" class="edit-delete-subtask-button">
            <span class="separator3" id="separator3">|</span> 
            <img onclick="addFinishEditing('${subtaskId}')" src="./img/add_subtask.png" class="save-subtask-button">
        </div>
    `;
}