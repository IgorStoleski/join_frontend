let counter = [];


/**
 * Asynchronously loads data and counts tasks in various categories.
 * @throws {Error} Throws an error if there's a problem during the data loading or counting process.
 */
async function count() {
    await loadData();
    countUrgent();
    countBoard()
    countTodo();
    countInProgress();
    countFeedback();
    countDone();
}


/**
 * Asynchronously loads data.
 * @throws {Error} Throws an error if the data cannot be parsed or loaded.
 */
async function loadData(){
    const getTodos = await getItem('tasks');
    counter = JSON.parse(getTodos);
}


/**
 * Converts a due date string into a formatted string of the form "Month Day, Year".
 * @param {string} dueDateString - A string representation of a date (e.g., "YYYY-MM-DD").
 * @returns {string} A formatted string representing the due date.
 * @example
 * returns "September 30, 2023"
 * loadDueDate("2023-09-30");
 */
function loadDueDate(dueDateString) {
    const dueDate = new Date(dueDateString);
    const day = dueDate.getDate(); 
    const month = dueDate.getMonth(); 
    const year = dueDate.getFullYear(); 
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];    
    const formattedMonth = monthNames[month];
    return `${formattedMonth} ${day}, ${year}`;
}


/**
 * Finds the nearest due date from a list of tasks.
 * Iterates through the `counter` array of tasks, checks for tasks with `dueDate`,
 * and finds the one that is closest to the current time.
 * @returns {Date|null} The nearest due date as a Date object or null if no tasks with due dates are found.
 * @example
 * const counter = [{dueDate: '2023-09-30T12:00:00'}, {dueDate: '2023-09-29T11:00:00'}];
 * findNearestDueDate(); // Returns Date object representing '2023-09-29T11:00:00'
 * @todo Update the function to accept tasks array as parameter rather than using a global variable.
 */
function findNearestDueDate() {
    const now = new Date().getTime();
    let nearestDueDate = null;
    for (const task of counter) {
        if (task.dueDate) {
            const taskDueDate = new Date(task.dueDate).getTime();
            if (!nearestDueDate || Math.abs(taskDueDate - now) < Math.abs(nearestDueDate - now)) {
                nearestDueDate = taskDueDate;
            }
        }
    }
    return nearestDueDate ? new Date(nearestDueDate) : null;
}


/**
 * Renders the nearest due date in the 'deadline' DOM element.
 * If there's no due date found, it sets the content to "No Due Date".
 * @example
 * Assuming there's an element with the ID 'deadline' and 
 * findNearestDueDate returns a valid due date
 * renderDueDate();
 * The 'deadline' element will display the nearest due date or "No Due Date" if none found.
 * @todo
 * - Perhaps expand this function to accept a target DOM element ID as a parameter.
 * - Handle potential errors or exceptions while fetching or formatting dates.
 */
function renderDueDate() {
    const deadlineElement = document.getElementById('deadline');
    const nearestDueDate = findNearestDueDate();
    if (nearestDueDate) {
        const formattedDueDate = loadDueDate(nearestDueDate);
        deadlineElement.innerHTML = formattedDueDate;
    } else {
        deadlineElement.innerHTML = "No Due Date"; 
    }
}


/**
 * Counts and displays the number of items with 'high' priority.
 * It then updates the element with ID 'urgent-task' to display the count
 * and triggers a re-render of due dates.
 * @requires counter - An external array or object that contains a list of items.
 *                     Each item should have a 'priority' property.
 * @throws Will throw an error if the 'urgent-task' element is not found.
 * @see renderDueDate - For further information about the re-rendering process of due dates.
 */
function countUrgent() {
    const urgent = counter.filter(item => item.priority === 'high').length;
    const countUrgentElement = document.getElementById('urgent-task');
    countUrgentElement.innerHTML = urgent;
    renderDueDate();
}


/**
 * Updates the innerHTML of the element with id 'board-task' to the length of the global `counter` array.
 * @todo Ideally, the `counter` variable should be passed as an argument to avoid global dependencies.
 */
function countBoard() {
    const todoCountElement = document.getElementById('board-task');
    todoCountElement.innerHTML = counter.length; 
}


/**
 * Counts and displays the number of todo items in the counter array.
 * Assumes the counter array contains objects with a `status` property 
 * and an element with the id 'todo-task' exists in the DOM.
 */
function countTodo(){
    const todoCount = counter.filter(item => item.status === 'todo').length;
    const todoCountElement = document.getElementById('todo-task');
    todoCountElement.innerHTML = todoCount; 
}


/**
 * Counts the number of items with the status 'inprogress' from the global 'counter' array
 * and updates the innerHTML of the 'in-progress-task' element with the count.
 * @requires counter - An external/global array that contains items with a status property.
 * @example
 * Assuming the global 'counter' array has items with different statuses
 * countInProgress();
 * If there are 3 'inprogress' items in the 'counter' array, the innerHTML of 'in-progress-task' will be updated to 3.
 */
function countInProgress(){
    const inProgressCount = counter.filter(item => item.status === 'inprogress').length;
    const inProgressElement = document.getElementById('in-progress-task');
    inProgressElement.innerHTML = inProgressCount; 
}


/**
 * Counts and displays the number of items with status 'feedback'.
 * Assumes there is a global variable `counter` which is an array of objects
 * with a `status` property, and a DOM element with the id 'feedback-task' to
 * display the count.
 */
function countFeedback(){
    const feedbackCount = counter.filter(item => item.status === 'feedback').length;
    const feedbackCountElement = document.getElementById('feedback-task');
    feedbackCountElement.innerHTML = feedbackCount; 
}


/**
 * Counts the number of items with a status of 'done' and displays the count
 * in an element with the id 'done-task'.
 */
function countDone(){
    const doneCount = counter.filter(item => item.status === 'done').length;
    const doneCountElement = document.getElementById('done-task');
    doneCountElement.innerHTML = doneCount; 
}