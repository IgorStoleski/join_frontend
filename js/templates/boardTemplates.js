/**
 * Returns an HTML representation of a subtask for editing purposes.
 * @param {Object} subtask - The subtask object to be converted into HTML.
 * @param {string} subtask.title - The title of the subtask.
 * @param {number} i - The index or ID associated with the subtask, used for data attributes and action handlers.
 */
function subtaskToEditHTML(subtask, i) {
    return /*html*/ `
        <div id="subtask-container-${i}" class="edit-subtask-container">
            <div class="edit-subtask-item">
                <span id="editDot" class="edit-subtask-dot"></span>           
                <span id="${i}" class="edit-subtask-value" data-index="${i}" contenteditable="false" value="${subtask.title}">${subtask.title}</span>
            </div>
            <div class="hover-content">
                <img onclick="editEditedSubtask(${i})" data-index="${i}" src="./img/edit_subtask.png" class="edit-edit-subtask-button">
                <span class="separator2" id="separator2">|</span> 
                <img onclick="deleteEditSubtask(${i})" data-index="${i}" src="./img/delete_subtask.png" class="edit-delete-subtask-button">
            </div>
            <img onclick="deleteEditSubtask(${i})" data-index="${i}" src="./img/delete_subtask.png" class="edit-edit-delete-subtask-button">
            <span class="separator3" id="separator3">|</span> 
            <img onclick="finishEditing(${i})" data-index="${i}" src="./img/add_subtask.png" class="edit-save-subtask-button">
        </div>
    `;
}


/**
 * Generates the HTML markup for the task edit view. 
 * @param {number} id - The ID of the task to be edited.
 */
function renderEditTask(id) {
    const task = todos.find((todo) => todo.id === id);
    return /* html */ `
        <div id="edit-slide-container" class="edit-slide-container">
            <form id="edit-taskForm" onsubmit="saveEditedTask(${id}); return false;" class="edit-task-slide-container">
                <div class="edit-add-task-container scroll-slide-edit-container">
                    <div class="edit-add-task-container-first">
                        <div class="edit-add-task-container-titel">
                            <div class="edit-add-task-titel-textcontainer">
                                <input id="edit-task-title" class="edit-add-task-titel-textfield" placeholder="Enter a title" value="${task.title}">
                            </div>
                        </div>
                        <div id="edit-required-title" class="edit-add-task-field-required">
                            This field is required
                        </div>
                    </div>
                    <div class="edit-add-task-container-description">
                        <div class="edit-add-task-description-header">Description</div>
                        <textarea id="edit-task-description" class="edit-add-task-description-textfield"
                            placeholder="Enter a Description" cols="30" rows="4">${task.description}</textarea>
                        <div id="edit-required-description" class="edit-add-task-field-required">
                            This field is required
                        </div>
                    </div>
                    <div class="edit-due-date-container">
                        <div class="edit-due-date-header">
                            Due date
                        </div>
                        <div class="edit-due-date-input-container">
                            <input id="edit-due-date" class="edit-due-date-textfield" type="date">
                        </div>
                        <div id="edit-required-date" class="edit-add-task-field-required">
                            This field is required
                        </div>
                    </div>
                    <div class="edit-add-task-container-priority">
                        <div class="edit-add-task-priority-header">
                        Priority
                        </div>
                    </div>
                    <div class="edit-priority-choice">
                        <button type="button" onclick="priority(this)" id="edit-prio-urgent"
                            class="edit-priority-choice-inner prio-urgent">
                            Urgent
                            <div class="edit-priority-choice-inner-pic">
                                <img src="./img/prio-high.png" id="edit-prio-urgent-img" class="edit-original-image"
                                    data-image="prio-high.png">
                            </div>
                        </button>
                        <button type="button" onclick="priority(this)" id="edit-prio-medium"
                            class="edit-priority-choice-inner prio-medium">
                            Medium
                            <div class="edit-priority-choice-inner-pic">
                                <img src="./img/prio-medium.png" id="edit-prio-medium-img" class="edit-original-image"
                                    data-image="prio-medium.png">
                            </div>
                        </button>
                        <button type="button" onclick="priority(this)" id="edit-prio-low" class="edit-priority-choice-inner prio-low">
                            Low
                            <div class="edit-priority-choice-inner-pic">
                                <img src="./img/prio-low.png" id="edit-prio-low-img" class="edit-original-image"
                                    data-image="prio-low.png">
                            </div>
                        </button>
                    </div>
                    <div id="edit-required-priority" class="edit-add-task-field-required">
                        This field is required
                    </div>
                    <div class="edit-assigned-to-container">
                        <div class="edit-assigned-to-header">
                        Assigned to
                        </div>
                    </div>
                    <div class="edit-assigned-to-choicefield">
                        <div class="edit-assigned-to-dropdown" onclick="loadToggleAssignedToContainer()">
                            <div class="edit-assigned-dropdown-header">
                                <input oninput="loadSearchContacts(this.value)" id="edit-search-input" class="edit-assigned-select-text"
                                    placeholder="Select contacts to assign" type="text">
                            </div>
                            <div class="edit-assigned-dropdown-arrow"></div>
                        </div>
                    </div>
                    <div id="edit-required-contact" class="edit-add-task-field-required">
                        This field is required
                    </div>
                    <div class="edit-contacts-container">
                        <div id="edit-loaded-contacts" class="loaded-contacts">
                        </div>
                        <button id="edit-addContactBtn" onclick="openModal()" class="add-person-btn">
                            Add new contact
                            <img src="./img/person_add.svg" class="button-icon">
                        </button>
                    </div>
                    <div id="edit-chosen-contacts" class="chosen-contacts"></div>
                    <div class="edit-subtasks-container">
                        <div class="edit-subtasks-header">
                            Subtasks
                        </div>
                        <div class="add-subtask-input">
                            <input onclick="openSubtaskInput()" type="text" id="edit-subtask-input" class="edit-new-subtask-textfield" placeholder="Add new subtask">
                            <img onclick="openSubtaskInput()" class="open-subtask-button" src="./img/open_subtask.png">
                            <img onclick="closeSubtaskInput()" class="add-subtask-button hidden" id="edit-close-subtask" src="./img/close_subtask.png"> 
                            <span class="separator" id="edit-separator">|</span> 
                            <img onclick="addNewSubtask()" class="add-subtask-button hidden" id="edit-add-new-subtask" src="./img/add_subtask.png">
                        </div>
                        <div id="edit-required-subtask" class="edit-add-task-field-required">
                            This field is required
                        </div>
                        <div id="edit-subtask-add-container" class="edit-subtask-add-container"></div>
                    </div>
                </div>
                <div class="edit-add-task-buttons">
                    <div class="edit-add-task-buttons-inner">                            
                        <button type="submit" id="createTaskButton" class="edit-button-create-task">
                            <div class="edit-button-create-task-text">Ok</div>
                            <div class="edit-button-create-task-pic"><img src="./img/check.svg"></div>
                        </button>
                    </div>
                </div>                
            </form>
        </div>
    `;
}


/**
 * Renders the HTML for a given searched contact, including initials and selected state.
 * @param {Object} contact - The contact to render.
 * @param {string} initials - The initials of the contact.
 * @param {boolean} isSelected - Whether the contact is selected or not.
 */
function loadRenderSearchedContactsHTML(contact, initials, isSelected, isCurrentUser) {
    let userMarker = isCurrentUser ? " (you)" : "";

    return /*html*/`
      <div class="contact-container ${isSelected ? 'selected' : ''}" onclick="toggleContactSelection('${contact.name}', '${contact.surname}')">
          <div class="select-contact">
              <div class="initial" style="background-color: ${contact.bgcolor}">${initials}</div>
              <div class="select-name">${contact.name} ${contact.surname}${userMarker}</div>
          </div>
          <img class="select-icon" id="edit-select-check" src="${isSelected ? 'img/check_contact.png' : 'img/check-button.png'}"  alt="Check Button">
      </div>`;
}


/**
 * Renders the HTML for a given contact, including initials and selected state.
 * @param {Object} contact - The contact to render.
 * @param {string} initials - The initials of the contact.
 * @param {boolean} isSelected - Whether the contact is selected or not.
 */
function renderAssignedToHTML(contact, initials, isSelected, isCurrentUser) {
    let userMarker = isCurrentUser ? " (you)" : "";

    return /* html */`
      <div class="contact-container ${isSelected ? 'selected' : ''}" onclick="toggleContactSelection('${contact.name}', '${contact.surname}')">
          <div class="select-contact">
              <div class="initial" style="background-color: ${contact.bgcolor}">${initials}</div>
              <div class="select-name">${contact.name} ${contact.surname}${userMarker}</div>
          </div>
          <img class="select-icon" id="edit-select-check" src="${isSelected ? 'img/check_contact.png' : 'img/check-button.png'}"  alt="Check Button">
      </div>`;
}


/**
 * Generates an HTML string for a subtask item based on the provided input value and index.
 * @param {string} subInputValue - The value of the subtask to be displayed.
 * @param {number} i - The unique index or identifier for the subtask.
 */
function subtaskToAddHTML(subInputValue, i) {
    return /*html*/ `
        <div id="subtask-container-${i}" class="edit-subtask-container">
            <div class="edit-subtask-item">
                <span id="editDot" class="edit-subtask-dot"></span>           
                <span id="${i}" class="edit-subtask-value" data-subtask-id="${i}" contenteditable="false">${subInputValue}</span>
            </div>
            <div class="hover-content">
                <img onclick="editEditedSubtask(${i})" data-subtask-id="${i}" src="./img/edit_subtask.png" class="edit-edit-subtask-button">
                <span class="separator2" id="separator2">|</span> 
                <img onclick="deleteEditSubtask(${i})" data-subtask-id="${i}" src="./img/delete_subtask.png" class="edit-delete-subtask-button">
            </div>
            <img onclick="deleteEditSubtask(${i})" data-subtask-id="${i}" src="./img/delete_subtask.png" class="edit-edit-delete-subtask-button">
            <span class="separator3" id="separator3">|</span> 
            <img onclick="finishEditing(${i})" data-subtask-id="${i}" src="./img/add_subtask.png" class="edit-save-subtask-button">
        </div>
    `;
}


/**
 * Processes and saves subtasks based on elements with the class "edit-subtask-value".
 * @param {Object} task - The main task object that contains the subtasks.
 * @param {Array} task.subtasks - The list of subtasks. Each subtask is an object with at least a "title" attribute.
 */
function processAndSaveSubtasks(task) {
    let subtaskElements = document.querySelectorAll('.edit-subtask-value');
    let updatedSubtasks = [];

    subtaskElements.forEach((element, index) => {
        let editedTitle = element.innerText;

        if (index >= 0 && index < task.subtasks.length) {
            let editedSubtask = task.subtasks[index];
            editedSubtask.title = editedTitle;

            let updatedTitle = {
                title: editedTitle,
                status: false
            };
            updatedSubtasks.push(updatedTitle);
        } else {
            console.error("Subtask mit dem Index", index, "wurde nicht gefunden.");
        }
    });

    return updatedSubtasks;
}


/**
 * Renders the HTML for a subtask in the slide view.
 * @param {Object} subtask - The subtask details.
 * @param {number} i - The index of the subtask.
 * @param {number} id - The ID of the parent task element.
 */
function renderSlideSubtaskHTML(subtask, i, id) {
    return /*html*/`
        <div class="task-slide-subtask">
            <input type="checkbox" id="subtaskCheckbox${i}" ${subtask.status ? 'checked' : ''} onchange="updateSubtaskStatus(${id}, ${i}, this.checked)">
            <label for="subtaskCheckbox${i}">${subtask.title}</label>
        </div>
    `;
}


/**
 * Renders the HTML for an assigned user in the slide view.
 * @param {string} initials - The initials of the assigned user.
 * @param {string} name - The full name of the assigned user.
 * @param {string} bgcolor - The background color for the user mark.
 */
function renderSlideAssignedHTML(initials, name, bgcolor) {
    return /*html*/`
        <div class="task-slide-assigned-user">
            <div class="user-marked blue" style="background-color: ${bgcolor}">${initials}</div>
            <span class="task-slide-assigned-user-name">${name}</span>
        </div>
    `;
}


/**
 * Generates the HTML for a given task element.
 * @param {Object} element - The task element containing its details.
 * @param {string} priorityImageSrc - The source URL for the priority image.
 * @param {string} assignedToHTML - The HTML string representing assigned users.
 * @param {string} progressBar - The HTML string representing the task's progress bar.
 * @param {string} numberTasks - The count of completed tasks.
 * @param {string} allTasks - The total count of tasks.
 */
function generateTasksHTML(element, priorityImageSrc, assignedToHTML, progressBar, numberTasks, allTasks, allTasksCount) {
    const backgroundColor = getCategoryBackgroundColor(element.category);
    return /*html*/`
    <div id="${element.id}" onclick="slideCard(${element.id})" draggable="true" ondragstart="startDragging(${element.id})" class="content-container task-touch">
        <div class="content-container-inner">
            <div class="card-header">
                <div class="board-category" style="background-color: ${backgroundColor};">${element.category}</div>
                <div id="dropdown-mobile" class="dropdown hide">
                    <img src="./img/hamburger_menu.svg" alt="Dropdown Trigger" onclick="event.stopPropagation()">
                    <div class="dropdown-content"  onclick="event.stopPropagation()">
                        ${getStatusLinkHTML(element, 'todo', 'Todo')}
                        ${getStatusLinkHTML(element, 'inprogress', 'In progress')}
                        ${getStatusLinkHTML(element, 'feedback', 'Await feedback')}
                        ${getStatusLinkHTML(element, 'done', 'Done')}
                    </div>
                </div>
            </div>
            <div class="title-content">
                <div class="title">${element.title}</div>
                <div id="description" class="content">${element.description}</div>
            </div>
            <div id="subtasks-board" class="board-subtasks-container" style="display: ${getSubtasksDisplayStyle(allTasksCount)};">
                <div class="progress-bar-container">
                    ${progressBar}
                </div>
                <div class="subtasks">${numberTasks} / ${allTasks} Subtasks</div>
            </div>
            <div class="prio-container">
                <div id="assigned-to" class="user-container-board">
                    ${assignedToHTML}
                </div>
                <div class="prio-icon"><img src="${priorityImageSrc}" alt=""></div>
            </div>
        </div>
    </div>`;
}

/**
 * Generates the HTML representation of a single subtask.
 * @param {Object} subtask - The subtask data.
 */
function generateSubtaskHTML(subtask) {
    return /*html*/`
        <div class="task-slide-subtask">
            <input type="checkbox" ${subtask.status ? 'checked' : ''} disabled>
            <label>${subtask.title}</label>
        </div>
    `;
}


/**
 * Generates the HTML representation of a progress bar.
 * @param {Object} element - The task or entity the progress bar is associated with.
 * @param {number} progress - The current progress percentage.
 */
function progressBarHTML(element, progress) {
    return /*html*/`
        <div class="progress-bar" id="progress-bar${element.id}" style="width: ${progress}%;"></div>
    `;
}


/**
 * Generates the HTML representation showing the number of completed tasks.
 * @param {number} completedTasksCount - Count of completed tasks.
 */
function numberTasksHTML(completedTasksCount) {
    return /*html*/`
        <span id="number-tasks">${completedTasksCount}</span>
    `;
}


/**
 * Generates the HTML representation showing the total number of tasks.
 * @param {number} allTasksCount - Total count of tasks.
 */
function allTasksHTML(allTasksCount) {
    return /*html*/`
        <span id="all-tasks">${allTasksCount}</span>
    `;
}