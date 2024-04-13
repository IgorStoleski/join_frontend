let currentDraggedElement;
let currentFilter = "";


/**
 * Update the HTML for all task categories.
 * Calls functions to update HTML for each category.
 */
async function updateHTML() {
  await loadData();
  await loadContactsFromStorage();
  todo();
  inProgress();
  feedback();
  done();
  noTasks();
}


/**
 * Refresh the HTML for all task categories.
 */
function refreshHTML() {
  todo();
  inProgress();
  feedback();
  done();
  noTasks();
}


/**
 * Push the current tasks data into storage.
 */
async function pushData() {
  await setItem("tasks", JSON.stringify(todos));
}


/**
 * Load tasks data from storage into 'todos'.
 */
async function loadData() {
  try {
    todos = JSON.parse(await getItem("tasks"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}


/**
 * Load contact data from storage into 'contacts'.
 */
async function loadContactsFromStorage() {
  try {
    contacts = JSON.parse(await getItem("contacts"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}


/**
 * Renders the assignees in the detail view.
 * @param {object} task the task whose information should be rendered
 */
function boardDetailViewAssignees(task) {
  let container = document.getElementById("board-detail-view-assignees");
  container.innerHTML = "Assigned to:";
  for (let i = 0; i < task.assigned_to.length; i++) {
    const assignee = task.assigned_to[i];
    container.innerHTML += /*html*/ `        
        <div>
            ${htmlTemplateAssigneeIcon(assignee)}
            ${assignee}
        </div> `;
  }
}


/**
 * Update the HTML for the "Todo" description based on the current filter.
 */
function todo() {
  let filteredTodo = todos.filter(
    (task) =>
      task["status"] === "todo" &&
      (task.title.toLowerCase().includes(currentFilter) ||
        task.description.toLowerCase().includes(currentFilter))
  );
  const todoContainer = document.getElementById("todo");
  todoContainer.innerHTML = "";
  if (filteredTodo.length === 0) {
    todoContainer.innerHTML += noTasks();
    todoContainer.innerHTML += cardTaskBorder();
  } else {
    filteredTodo.forEach((task) => {
      todoContainer.innerHTML += generateTasks(task);
    });
    todoContainer.innerHTML += cardTaskBorder();
  }
}


/**
 * Update the HTML for the "In Progress" description based on the current filter.
 */
function inProgress() {
  let filteredInProgress = todos.filter(
    (task) =>
      task["status"] === "inprogress" &&
      (task.title.toLowerCase().includes(currentFilter) ||
        task.description.toLowerCase().includes(currentFilter))
  );
  const inProgressContainer = document.getElementById("in-progress");
  inProgressContainer.innerHTML = "";
  if (filteredInProgress.length === 0) {
    inProgressContainer.innerHTML += noTasks();
    inProgressContainer.innerHTML += cardTaskBorder();
  } else {
    filteredInProgress.forEach((task) => {
      inProgressContainer.innerHTML += generateTasks(task);
    });
    inProgressContainer.innerHTML += cardTaskBorder();
  }
}


/**
 * Update the HTML for the "Feedback" description based on the current filter.
 */
function feedback() {
  let filteredFeedback = todos.filter(
    (task) =>
      task["status"] === "feedback" &&
      (task.title.toLowerCase().includes(currentFilter) ||
        task.description.toLowerCase().includes(currentFilter))
  );
  const feedbackContainer = document.getElementById("feedback");
  feedbackContainer.innerHTML = "";
  if (filteredFeedback.length === 0) {
    feedbackContainer.innerHTML += noTasks();
    feedbackContainer.innerHTML += cardTaskBorder();
  } else {
    filteredFeedback.forEach((task) => {
      feedbackContainer.innerHTML += generateTasks(task);
    });
    feedbackContainer.innerHTML += cardTaskBorder();
  }
}


/**
 * Update the HTML for the "Done" description based on the current filter.
 */
function done() {
  let filteredDone = todos.filter(
    (task) =>
      task["status"] === "done" &&
      (task.title.toLowerCase().includes(currentFilter) ||
        task.description.toLowerCase().includes(currentFilter))
  );
  const doneContainer = document.getElementById("done");
  doneContainer.innerHTML = "";
  if (filteredDone.length === 0) {
    doneContainer.innerHTML += noTasks();
    doneContainer.innerHTML += cardTaskBorder();;
  } else {
    filteredDone.forEach((task) => {
      doneContainer.innerHTML += generateTasks(task);
    });
    doneContainer.innerHTML += cardTaskBorder();
  }
}


/**
 * Generate HTML for the "No Tasks" message.
 * @returns {string} HTML markup for no tasks message.
 */
function noTasks() {
  return /*html*/ `
        <div class="no-tasks-to-do">
            <div class="no-tasks-to-do-text">No Tasks to do</div>
        </div>`;
}


/**
 * Generates an HTML string for a task border.
 * @returns {string} An HTML string representing the task border.
 */
function cardTaskBorder() {
  return /*html*/`
        <div id="show-task-border" class="show-task-border visibility"></div>
    `;
}


/**
 * Display all task borders on the page by removing the 'visibility' class.
 */
function showAllTaskBorders() {
  const elements = document.querySelectorAll('.show-task-border');
  elements.forEach(el => {
    el.classList.remove('visibility');
  });
}


/**
 * Hide all task borders on the page by adding the 'visibility' class.
 */
function hideAllTaskBorders() {
  const elements = document.querySelectorAll('.show-task-border');
  elements.forEach(el => {
    el.classList.add('visibility');
  });
}


/**
 * Sets up event listeners to enable a "click and drag" scrolling functionality on an element with the class `.scroll-container`.
 * Once the DOM content is fully loaded, this script allows users to click and drag horizontally within the `.scroll-container` 
 * to scroll its content. The visual feedback is provided by adding a `grabbing` class to the container during the drag action.
 */
document.addEventListener("DOMContentLoaded", function () {
  let isMouseDown = false,
    startX, scrollLeftStart;

  let container = document.querySelector('.scroll-container');


  container.addEventListener('mousedown', function (e) {
    container.classList.add('grabbing');
    isMouseDown = true;
    startX = e.pageX;
    scrollLeftStart = container.scrollLeft;
  });


  /**
   * Event listener for the mousemove event on the container.
   * Updates the scroll position of the container based on the mouse movement.
   * @param {MouseEvent} e - The mouse event object.
   */
  container.addEventListener('mousemove', function (e) {
    if (!isMouseDown) return;
    let x = e.pageX;
    container.scrollLeft = scrollLeftStart + startX - x;
  });


  /**
  * Event listener for the mouseup event on the document.
  * Ends the drag action and removes the visual feedback.
  */
  document.addEventListener('mouseup', function () {
    container.classList.remove('grabbing');
    isMouseDown = false;
  });
});


/**
 * Generate HTML markup for a task element.
 * @param {Task} element - The task object to generate HTML for.
 * @returns {string} HTML markup for the task element.
 */
function generateTasks(element) {
  const priorityImageSrc = setPriorityImage(element.priority);
  assignedToHTML = renderAssigned(element);
  const completedTasksCount = renderSubtask(element);
  const allTasksCount = element.subtasks.length;
  const progress = (completedTasksCount / allTasksCount) * 100;
  const progressBar = progressBarHTML(element, progress);
  const numberTasks = numberTasksHTML(completedTasksCount);
  const allTasks = allTasksHTML(allTasksCount);
  const generatedHTML = generateTasksHTML(
    element,
    priorityImageSrc,
    assignedToHTML,
    progressBar,
    numberTasks,
    allTasks,
    allTasksCount
  );
  return generatedHTML;
}


/**
 * Extracts initials from a full name.
 * @param {string} name - Full name to extract initials from.
 * @returns {string} Extracted initials.
 */
function extractInitials(name) {
  const names = name.split(" ");
  let initials = "";
  for (const n of names) {
    if (n.length > 0) {
      initials += n[0].toUpperCase();
    }
  }
  return initials;
}


/**
 * Determine the appropriate image source based on priority.
 * @param {string} priority - The priority level (low, medium, high).
 * @returns {string} The URL to the appropriate image.
 */
function setPriorityImage(priority) {
  let imageSrc = "";
  if (priority === "low") {
    imageSrc = "./img/prio-low.png";
  } else if (priority === "medium") {
    imageSrc = "./img/prio-medium.png";
  } else if (priority === "high") {
    imageSrc = "./img/prio-high.png";
  }
  return imageSrc;
}


/**
 * Set the task that's currently being dragged.
 * @param {number} id - ID of the task that's being dragged.
 */
function startDragging(id) {
  currentDraggedElement = id;
  startRotateCard(id);
  showAllTaskBorders();
}


/**
 * Handles the dragover event to allow dropping.
 * @param {Event} ev - The dragover event.
 */
function allowDrop(ev) {
  ev.preventDefault();

}


/**
 * Moves a task to a specified status and updates the UI.
 * @param {string} status - The new status for the dragged task.
 */
function moveTo(status) {
  todos[currentDraggedElement].status = status;
  pushData();
  loadData();
  updateHTML();
}


/**
 * Rotates the element with the given id by adding a 'rotate' class.
 * @param {string} id - The ID of the element to rotate.
 */
function startRotateCard(id) {
  document.getElementById(id).classList.add('rotate');
}


/**
 * Highlights the element with the given id by adding a 'highlight' class.
 * @param {string} id - The ID of the element to highlight.
 */
function highlight(id) {
  document.getElementById(id).classList.add('highlight');
}


/**
 * Removes the highlight from the element with the given id by removing the 'highlight' class.
 * @param {string} id - The ID of the element to remove the highlight from.
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove('highlight');
}