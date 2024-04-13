/**
 * Initializes the task by loading contacts, tasks, assigned names, and categories.
 * This function performs asynchronous operations to fetch and render necessary data.
 * @throws {Error} Throws an error if any of the asynchronous operations fail.
 */
async function initTask() {
    await loadContactsFromStorage();
    await loadTasks();
    await renderAssignedTo();
    renderCategorys();
}


/**
 * Asynchronously loads contacts from storage.
 * Parses the stored JSON data for 'contacts' key and assigns it to the contacts variable.
 * Logs an error to the console if any exception occurs during the loading or parsing process.
 * @throws {Error} Throws an error if there's an issue loading or parsing the 'contacts' data.
 */
async function loadContactsFromStorage() {
    try {
        contacts = JSON.parse(await getItem('contacts'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}


/**
 * Asynchronously loads tasks from backend.
 * @throws {Error} When there's an issue parsing the tasks from JSON.
 */
async function loadTasks() {
    try {
        todos = JSON.parse(await getItem('tasks'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}


/**
 * Retrieves the value of a query parameter from a URL.
 * @param {string} name - The name of the query parameter to retrieve.
 * @param {string} [url=window.location.href] - The URL to search for the query parameter (defaults to the current page's URL).
 * @returns {string|null} The value of the query parameter, or null if it is not found.
 */
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

let statusFromURL = getParameterByName('status');


/**
 * Event listener for the 'submit' event on the element with the ID 'taskForm'.
 * Prevents the default form submission and triggers the creation of a task.
 */
document.getElementById('taskForm').addEventListener('submit', function (event) {
    event.preventDefault();
    createTask();
});

/**
 * Asynchronously creates a task using the values from the provided input fields.
 * Before initializing the task, it validates the input values.
 * @throws Will throw an error if the input validation fails.
 * @example
 * createTask().then(() => {
 *     console.log('Task created successfully!');
 * }).catch((error) => {
 *     console.error(`Failed to create task: ${error.message}`);
 * });
 */
async function createTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const dueDate = document.getElementById('dueDate').value;
    validateInput(title, description, dueDate);
}


/**
 * Validates the provided input values for title, description, and dueDate.
 * Shows appropriate error messages if any of the values are missing.
 * If all values are valid, it triggers validation for selections.
 * @param {string} title - The title of the task or item.
 * @param {string} description - The description or details of the task.
 * @param {string} dueDate - The due date for the task in a specified format (e.g., 'YYYY-MM-DD').
 */
function validateInput(title, description, dueDate) {
    if (!title) {
        showTitleInputError();
        return;
    } if (!description) {
        showDescriptionInputError();
        return;
    } if (!dueDate) {
        showDateInputError();
        return;
    }
    validateSelections(title, description, dueDate);
}


/**
 * Validates the selections and calls appropriate error methods if selections are invalid.
 * If all selections are valid, it processes the input.
 * @param {string} title - The title of the item.
 * @param {string} description - The description of the item.
 * @param {string|Date} dueDate - The due date of the item. Can be a string representation of a date or a Date object.
 */
function validateSelections(title, description, dueDate) {
    if (!selectedPriority) {
        showPriorityError();
        return;
    } if (!selectedCategory) {
        showSelectCategoryError();
        return;
    }
    processValidInput(title, description, dueDate);
}


/**
 * Processes and adds a valid todo item to the list.
 * @param {string} title - Title of the new todo.
 * @param {string} description - Description of the new todo.
 * @param {Date|string} dueDate - Due date of the new todo. Can be a Date object or a string representation.
 * @example
 * processValidInput('Finish Assignment', 'Complete the math assignment by end of the week', '2023-10-07');
 * @throws {Error} If any required parameter is not provided or invalid.
 * @see {@link extractBgcolor} for details on how background colors are determined.
 * @see {@link completeTaskCreation} to understand the post-todo-creation process.
 *
 */
function processValidInput(title, description, dueDate) {
    const extractedBgcolors = extractBgcolor(selectedContacts);
    const cleanedSelectedContacts = selectedContacts.filter(contact => contact !== null && contact !== undefined);
    const highestId = todos.reduce((maxId, currentTodo) => {
        return currentTodo.id > maxId ? currentTodo.id : maxId;
    }, 0);
    const newTodoId = highestId + 1;

    const newTodo = {
        id: newTodoId,
        title: title,
        description: description,
        category: selectedCategory, 
        status: statusFromURL || 'todo',
        priority: selectedPriority,
        dueDate: dueDate,
        assignedTo: cleanedSelectedContacts,
        bgcolor: extractedBgcolors,
        subtasks: subtasks
    };
    todos.push(newTodo);
    completeTaskCreation();
}


/**
 * Completes the task creation by storing the tasks and showing relevant messages.
 * @throws {Error} Throws an error if there's a problem during task creation completion.
 */
async function completeTaskCreation() {
    await setItem('tasks', JSON.stringify(todos));
    showCreatedTaskMessage();
    resetTaskForm();
}


/**
 * Shows a success message overlay and redirects to the index page.
 */
function showCreatedTaskMessage() {
    document.body.innerHTML += createdTaskTemplate();

    setTimeout(function () {
        let successOverlay = document.getElementById('createTaskOverlay');
        document.body.removeChild(successOverlay);

        window.location.href = 'board.html';
    }, 1600);
}


/**
 * Searches through the list of contacts for matches based on the given query.
 * Filters contacts whose name or surname starts with the provided query.
 * @param {string} query - The search term to match against contact names and surnames.
 * @example
 * Assume `contacts` is a global array containing contact objects with `name` and `surname` properties.
 * searchContacts('John'); // will call `renderSearchedContact` with all contacts named John or with a surname starting with John.
 * @throws {TypeError} - If the contacts array or its individual items do not have the expected structure, the function might throw.
 * (Note: The actual function provided does not have explicit error handling, so this is a speculative error type.)
 */
function searchContacts(query) {
    let filteredContacts = contacts.filter(contact => {
        return (
            contact.name.toLowerCase().startsWith(query.toLowerCase()) ||
            contact.surname.toLowerCase().startsWith(query.toLowerCase())
        );
    });
    renderSearchedContact(filteredContacts);
}

/**
 * Toggles the selection state of a contact in the list based on their name and surname.
 * @param {string} name - The first name of the contact.
 * @param {string} surname - The surname of the contact.
 * @example
 * Assuming there's a contact {id: 1, name: 'John', surname: 'Doe'} in the `contacts` array
 * toggleContactSelection('John', 'Doe');
 */
function toggleContactSelection(name, surname) {
    const contact = contacts.find(c => c.name === name && c.surname === surname);
    if (!contact) {
        return;
    }
    const contactId = contact.id;
    const contactKey = `${contact.name} ${contact.surname}`;

    if (selectedContacts[contactId]) {
        delete selectedContacts[contactId];
    } else {
        selectedContacts[contactId] = contactKey;
    }
    renderAssignedTo();
    renderSearchedContact(contacts);
    displayChosenContacts();
}



/**
 * Extracts background colors from the provided list of selected contact names.
 * @param {string[]} selectedContacts - An array of contact names, where each name is in the format "name surname".
 * @returns {string[]} - An array of background colors corresponding to the provided contact names.
 * @example
 * const contacts = [
 *    { name: 'John', surname: 'Doe', bgcolor: '#ff0000' },
 *    { name: 'Jane', surname: 'Doe', bgcolor: '#00ff00' }
 * ];
 * extractBgcolor(['John Doe', 'Jane Doe']); // returns ['#ff0000', '#00ff00']
 */
function extractBgcolor(selectedContacts) {
    const bgcolors = [];
    const validContacts = selectedContacts.filter(contactName => contactName);

    for (const contactName of validContacts) {
        const foundContact = contacts.find(c => `${c.name} ${c.surname}` === contactName);
        if (foundContact && foundContact.bgcolor) {
            bgcolors.push(foundContact.bgcolor);
        }
    }
    return bgcolors;
}


/**
 * Sets up the 'dueDate' input field by setting the minimum date to the current date.
 * Listens for changes to ensure selected dates are not in the past.
 */
document.addEventListener('DOMContentLoaded', function () {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById('dueDate').min = today;
});