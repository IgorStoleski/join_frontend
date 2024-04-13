/**
 * Creates a success message template.
 * @returns {string} - The HTML template for a success message overlay.
 */
function createdTaskTemplate() {
    return /*html*/ `
        <div id="createTaskOverlay" class="task-overlay">
            <div class="task-success-message">
                <p>Task added to board</p>
                <img class="send-check" src="./img/added_task.png" alt="">
            </div>
        </div>
    `;
}


/**
 * Renders an assigned contact as an HTML element.
 * @param {Object} contact - The contact to render.
 * @param {string} contact.name - The first name of the contact.
 * @param {string} contact.surname - The surname/last name of the contact.
 * @param {string} contact.bgcolor - The background color for the initials container.
 * @param {string} initials - The initials of the contact.
 * @param {boolean} isSelected - A flag indicating if the contact is currently selected.
 * @param {boolean} isCurrentUser - A flag indicating if the contact is the current user.
 * @returns {string} - Returns the rendered HTML string.
 * @example
 * const contact = { name: 'John', surname: 'Doe', bgcolor: '#fafafa' };
 * const htmlString = renderAssignedToHTML(contact, 'JD', true, false);
 */
function renderAssignedToHTML(contact, initials, isSelected, isCurrentUser) {
    let userMarker = isCurrentUser ? " (you)" : "";

    return /*html*/`
        <div class="contact-container ${isSelected ? 'selected' : ''}" onclick="toggleContactSelection('${contact.name}', '${contact.surname}')">
            <div class="select-contact">
                <div class="initial" style="background-color: ${contact.bgcolor}">${initials}</div>
                <div class="select-name">${contact.name} ${contact.surname}${userMarker}</div>
            </div>
            <img class="select-icon" id="selectCheck" src="${isSelected ? 'img/check_contact.png' : 'img/check-button.png'}"  alt="Check Button">
        </div>
    `;
}


/**
 * Generates an HTML string for a contact based on the provided details.
 * @function renderSearchedContactsHTML
 * @param {Object} contact - The contact object containing details of the user.
 * @param {string} contact.name - The first name of the contact.
 * @param {string} contact.surname - The surname of the contact.
 * @param {string} contact.bgcolor - Background color for the initials div.
 * @param {string} initials - The initials of the contact.
 * @param {boolean} isSelected - A flag indicating if the contact is selected.
 * @param {boolean} isCurrentUser - A flag indicating if the contact is the current user.
 * @returns {string} The generated HTML string for the contact.
 */
function renderSearchedContactsHTML(contact, initials, isSelected, isCurrentUser) {
    let userMarker = isCurrentUser ? " (you)" : "";

    return /*html*/`
        <div class="contact-container ${isSelected ? 'selected' : ''}" onclick="toggleContactSelection('${contact.name}', '${contact.surname}')">
            <div class="select-contact">
                <div class="initial" style="background-color: ${contact.bgcolor}">${initials}</div>
                <div class="select-name">${contact.name} ${contact.surname}${userMarker}</div>
            </div>
            <img class="select-icon" id="selectCheck" src="${isSelected ? 'img/check_contact.png' : 'img/check-button.png'}"  alt="Check Button">
        </div>
    `;
}


/**
 * Generates HTML markup for a subtask with the given ID and value.
 * @param {string|number} subtaskId - The unique identifier for the subtask.
 * @param {string} subtaskValue - The display value of the subtask.
 * @returns {string} The HTML string representing the subtask.
 * @example
 * let html = createSubtaskHTML(1, "Do laundry");
 * // Returns the HTML markup for the subtask with ID 1 and value "Do laundry".
 */
function createSubtaskHTML(subtaskId, subtaskValue) {
    return /*html*/`
        <div id="subtask-container-${subtaskId}" class="subtask-container">
            <div class="subtask-item">
                <span class="subtask-dot"></span>           
                <span id="${subtaskId}" data-subtask-id="${subtaskId}" class="subtask-value" contenteditable="false">${subtaskValue}</span>
            </div>
            <div class="hover-content">
                <img onclick="editSubtask('${subtaskId}')" src="./img/edit_subtask.png" class="edit-subtask-button">
                <span class="separator2" id="separator2">|</span> 
                <img onclick="deleteSubtask('${subtaskId}')" data-subtask-id="${subtaskId}" src="./img/delete_subtask.png" class="delete-subtask-button">
            </div>
            <img onclick="deleteSubtask('${subtaskId}')" data-subtask-id="${subtaskId}" src="./img/delete_subtask.png" class="edit-delete-subtask-button">
            <span class="separator3" id="separator3">|</span> 
            <img onclick="finishEditing('${subtaskId}')" src="./img/add_subtask.png" class="save-subtask-button">
        </div>
    `;
}