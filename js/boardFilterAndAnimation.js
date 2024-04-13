/**
 * Filter tasks based on a search term and status.
 * @param {string} searchTerm - The search term to filter tasks.
 * @param {string} status - The status to filter tasks.
 * @returns {Task[]} Array of filtered tasks.
 */
function filterTasks(searchTerm, status) {
    let filteredTasks = todos.filter((task) => {
        let lowerCaseSearchTerm = searchTerm.toLowerCase();
        return (
            task.status === status &&
            (task.title.toLowerCase().startsWith(lowerCaseSearchTerm) ||
                task.description.toLowerCase().startsWith(lowerCaseSearchTerm))
        );
    });
    return filteredTasks;
}


/**
 * Set the current filter based on the value in the input field and refresh the UI.
 */
function setFilter() {
    let searchText = document.getElementById("input-field");
    currentFilter = searchText.value.toLowerCase();
    updateHTML();
}


/**
 * Handles the input and click event for the search functionality.
 * Updates the filter and displays or hides the reset button based on the search input value.
 */
document.addEventListener("DOMContentLoaded", function () {
    let input = document.getElementById("input-field");
    let resetButton = document.getElementById("reset-search");

    input.addEventListener("input", function () {
        let searchValue = input.value.trim().toLowerCase();
        if (searchValue !== "") {
            setFilter();
            resetButton.style.display = "block";
        } 
        else {
            setFilter();
            resetButton.style.display = "none";
        }
    });

    let inputBtn = document.getElementById("search");
    inputBtn.addEventListener("click", function () {
        let searchValue = input.value.trim().toLowerCase();
        if (searchValue !== "") {
            setFilter();
            resetButton.style.display = "block";
        } else {
            setFilter();
            resetButton.style.display = "none";
        }
    });
});


/**
 * Handles the click event for the reset button in the search functionality.
 * Clears the search input field, hides the reset button, and triggers the filter update.
 * Resets the search input field and triggers the filter update when the reset button is clicked.
 * @listens click
 * @param {Event} event - The click event.
 */
document.addEventListener("DOMContentLoaded", function () {
    function handleResetButtonClick() {
        let searchText = document.getElementById("input-field");
        searchText.value = "";  
        resetButton.style.display = "none";
        setFilter(); 
    }

    let resetButton = document.getElementById("reset-search");
    resetButton.addEventListener("click", handleResetButtonClick);
});


/**
 * Close the task card with a slide out animation.
 */
function closeCard() {
    document.getElementById("slide-container").classList.remove("slide-in-board");
    setTimeout(() => {
        document.getElementById("task-slide").classList.add("d-none");
        document.getElementById("noscroll").classList.remove("noscroll");
    }, 100);
    document.body.style.overflow = 'auto';
}


/**
 * Sets up a global click event listener to close the card if the click occurs outside of its content. 
 * When a click event is detected on the document, this script checks if the clicked target is the 
 * element with the ID `slide-container`. If it is, the `closeCard` function is called to close or 
 * hide the card.
 */
document.addEventListener("click", function(event) {
    const slideContainer = document.getElementById("slide-container");
    if (slideContainer && event.target === slideContainer) {
        closeCard();
    }
});


/**
 * Triggers the slide in animation for the task card.
 */
function slideCardAnimation() {
    document.getElementById("task-slide").classList.remove("d-none");
    setTimeout(() => {
        document.getElementById("slide-container").classList.add("slide-in-board");
    }, 50);
}


/**
 * Render and slide open the task card.
 * @param {number} id - ID of the task to render in the card.
 */
function slideCard(id) {
    document.body.style.overflow = 'hidden';
    const slideCard = document.getElementById("task-slide");
    slideCard.innerHTML = renderSlideCard(id);
    slideCardAnimation();
    document.getElementById("noscroll").classList.add("noscroll");
}


/**
 * Generates the HTML markup for the slide card.
 * @param {number} id - ID of the task to generate markup for.
 * @returns {string} HTML markup for the slide card.
 */
function renderSlideCard(id) {
    const element = todos[id];
    const priorityImageSrc = setPriorityImage(element.priority);
    assignedToHTML = renderSlideAssigned(element);
    subtasksHTML = renderSlideSubtask(element, id);
    const generateSlideHTML = renderSlideCardHTML(
        element,
        priorityImageSrc,
        assignedToHTML,
        subtasksHTML
    );
    return generateSlideHTML;
}


/**
 * Remove a task from the 'todos' list and update the UI.
 * @param {number} id - ID of the task to delete.
 */
function deleteTask(id) {
    const indexToDelete = todos.findIndex((task) => task.id === id);
    if (indexToDelete === -1) {
        return;
    }
    todos.splice(indexToDelete, 1);
    deleteCard(id);
    updateIDs();
    closeCard();
    pushData();
    loadData();
    updateHTML();
}


/**
 * Updates the 'id' property for each item in the 'todos' array.
 * @example
 * Assuming todos = [{id: 0}, {id: 1}]
 * updateIDs();
 * todos will be: [{id: 0}, {id: 1}]
 */
function updateIDs() {
    for (let i = 0; i < todos.length; i++) {
        todos[i].id = i + 1;
        todos[i].id = i;
    }
}


/**
 * Deletes the specified card element from the document based on the provided ID.
 * @param {string|number} id - The ID of the card element to be removed.
 */
function deleteCard(id) {
    const elementToRemove = document.getElementById(`board-card${id}`);
    if (elementToRemove) {
        elementToRemove.remove();
    }
}


/**
 * Calculates the progress of a todo item based on its subtasks.
 * @param {Array} todos - The array of todo items.
 * @param {number} todoId - The ID of the todo item for which to calculate progress.
 * @returns {number} The progress percentage of the todo item.
 */
function calculateProgress(todos, todoId) {
    const todo = todos.find(t => t.id === todoId);
    if (!todo || !todo.subtasks) return 0;

    const completedSubtasks = todo.subtasks.filter(subtask => subtask.status).length;
    return (completedSubtasks / todo.subtasks.length) * 100;
}


/**
 * Updates the status of a specific subtask and pushes the updated data.
 * @param {number} taskId - ID of the task.
 * @param {number} subtaskIndex - Index of the subtask to be updated.
 * @param {boolean} isChecked - New status of the subtask.
 */
function updateSubtaskStatus(todoId, subtaskId, isChecked) {
    const todo = todos.find(t => t.id === todoId);
    if (todo && todo.subtasks && todo.subtasks[subtaskId]) {
        todo.subtasks[subtaskId].status = isChecked;
    }
    updateProgressBar(todos, todoId);
    pushData();
    refreshHTML();
}


/**
 * Updates the progress bar for a specific todo item based on the current progress.
 * @param {Array<Object>} todos - The array of todo objects.
 * @param {string} todoId - The ID of the todo item to update the progress bar for.
 */
function updateProgressBar(todos, todoId) {
    const progress = calculateProgress(todos, todoId);
    const progressBar = document.getElementById(`progress-bar${todoId}`);
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}


/**
 * Renders a list of assigned elements with a maximum number of contacts to show.
 * @param {Element} element - The element to render.
 * @returns {string} The rendered HTML content.
 */
function renderAssigned(element) {
    const maxContactsToShow = 3;
    const { filteredAssignedTo, bgcolors } = filterAndColor(element);
    const { rendered, leftPosition } = renderContacts(filteredAssignedTo, bgcolors, maxContactsToShow);
    return rendered + renderAdditionalContacts(leftPosition, filteredAssignedTo.length - maxContactsToShow);
}


/**
 * Filters out undefined values from the 'assignedTo' array and retrieves the 'bgcolor'.
 * @param {Object} element - The input element containing 'assignedTo' and 'bgcolor' properties.
 * @param {Array<string>} element.assignedTo - An array of assignedTo values.
 * @param {string} element.bgcolor - The background color to be retrieved.
 * @returns {Object} An object containing the filtered 'assignedTo' array and the 'bgcolor'.
 */
function filterAndColor(element) {
    return {
        filteredAssignedTo: element.assignedTo.filter(name => name !== undefined),
        bgcolors: element.bgcolor
    };
}


/**
 * Renders a list of contacts with customized background colors and maximum items to display.
 * @param {Array} contacts - An array of contact objects to render.
 * @param {Array} bgcolors - An array of background colors corresponding to each contact.
 * @param {number} max - The maximum number of contacts to render.
 * @returns {Object} An object containing the rendered HTML and the final leftPosition value.
 */
function renderContacts(contacts, bgcolors, max) {
    let result = '', leftPosition = -7;
    for (let i = 0; i < Math.min(contacts.length, max); i++) {
        if (contacts[i]) {
            const additionalClass = `negativ-gap-${leftPosition}`;
            result += generateAssignedHTML(additionalClass, bgcolors[i], extractInitials(contacts[i]));
            leftPosition -= 7;
        }
    }
    return { rendered: result, leftPosition: leftPosition };
}


/**
 * Renders additional contacts with a specified left position and remaining count.
 * @param {number} leftPosition - The left position for rendering the additional contacts.
 * @param {number} remaining - The number of remaining additional contacts to render.
 * @returns {string} The HTML representation of additional contacts, or an empty string if no additional contacts are to be rendered.
 */
function renderAdditionalContacts(leftPosition, remaining) {
    return remaining > 0 ? /*html*/`
        <div class="user-marked media negativ-gap-${leftPosition}" style="background-color: #4589FF">+${remaining}</div>` : '';
}


/**
 * Generates HTML for a specific assigned user.
 * @param {string} additionalClass - Additional CSS class for the user.
 * @param {string} bgcolor - Background color for the user's badge.
 * @param {string} initials - Initials of the assigned user.
 * @returns {string} HTML string for the assigned user.
 */
function generateAssignedHTML(additionalClass, bgcolor, initials) {
    return /* html */`
        <div class="user-marked media ${additionalClass}" style="background-color: ${bgcolor}">
            ${initials}
        </div>
    `;
}


/**
 * Generates the HTML representation of a subtask and counts completed subtasks.
 * @param {Object} element - The parent task containing subtasks.
 * @returns {Object} An object containing the generated HTML and the count of completed subtasks.
 */
function renderSubtask(element) {
    let subtasksHTML;
    let completedTasksCount = 0;

    if (element.subtasks && Array.isArray(element.subtasks)) {
        for (const subtask of element.subtasks) {
            if (subtask.title) {
                subtasksHTML += generateSubtaskHTML(subtask);
                if (subtask.status) {
                    completedTasksCount++;
                };
            }
        }
    }
    return completedTasksCount;
}


/**
 * Gets the background color based on the category.
 * @param {string} category - The category of the task.
 * @returns {string} The background color for the category.
 */
function getCategoryBackgroundColor(category) {
    switch (category) {
        case 'User Story':
            return '#FF7A00';
        case 'Technical Task':
            return '#0038FF';
        default:
            return ''; // Default background color (if any)
    }
}


/**
 * Returns the appropriate display style based on the count of all tasks.
 * @param {number} allTasksCount - The total number of tasks.
 * @returns {string} - Returns 'none' if there are no tasks, otherwise 'block'.
 */
function getSubtasksDisplayStyle(allTasksCount) {
    return allTasksCount === 0 ? 'none' : 'flex';
}


/**
 * Renders the assigned users for a task in the slide view.
 * @param {Object} element - The task element containing its details.
 * @returns {string} The generated HTML string for assigned users.
 */
function renderSlideAssigned(element) {
    let assignedToHTML = '';
    const filteredAssignedTo = element.assignedTo.filter(name => name !== null);
    const bgcolors = element.bgcolor || [];
    for (let i = 0; i < filteredAssignedTo.length; i++) {
        const name = filteredAssignedTo[i];
        const bgcolor = bgcolors[i] || '';
        if (name) {
            const initials = extractInitials(name);
            assignedToHTML += renderSlideAssignedHTML(initials, name, bgcolor);
        }
    }
    return assignedToHTML;
}