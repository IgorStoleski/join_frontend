/**
 * Initializes the addition of tasks by loading contacts from storage
 * and loading tasks asynchronously.
 */
async function initAddTask() {
  await addLoadTasks();
}

/**
 * Asynchronously loads tasks from local storage and populates the 'todos' array.
 * If loading fails, it logs an error message to the console.
 * @throws {Error} If there is an issue with parsing the stored tasks.
 */
async function addLoadTasks() {
  try {
    todos = await getTasks();
  } catch (e) {
    console.error("Loading error:", e);
  }
}

/**
 * Sets up an event listener for the submission of the 'taskFormSlider' form.
 * When the form with the ID `taskFormSlider` is submitted, this script prevents the default form submission
 * behavior (which might cause a page reload) and instead calls the `addCreateTask` function to handle the
 * task creation logic.
 */
document
  .getElementById("taskFormSlider")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    addCreateTask();
  });

/**
 * Asynchronously adds a new task with the provided title, description, and due date.
 * Retrieves input values from HTML elements with specific IDs and validates them.
 */
async function addCreateTask() {
  const title = document.getElementById("addTaskTitle").value;
  const description = document.getElementById("addTaskDescription").value;
  const dueDate = document.getElementById("addDueDate").value;
  addValidateInput(title, description, dueDate);
}

/**
 * Validates the input values for title, description, and due date.
 * If any of these values are missing, it shows corresponding input errors.
 * @param {string} title - The title input value.
 * @param {string} description - The description input value.
 * @param {string} dueDate - The due date input value.
 */
function addValidateInput(title, description, dueDate) {
  let isValid = true;

  if (!title) {
    addShowTitleInputError();
    isValid = false;
  }
  if (!description) {
    addShowDescriptionInputError();
    isValid = false;
  }
  if (!dueDate) {
    addShowDateInputError();
    isValid = false;
  }
  if (isValid) {
    addValidateSelections(title, description, dueDate);
  }
}

/**
 * Validates user selections for a task before processing the input.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {Date} dueDate - The due date for the task.
 * @throws {Error} Throws an error if priority or category is not selected.
 */
function addValidateSelections(title, description, dueDate) {
  let isValid = true;
  if (!selectedPriority) {
    addShowPriorityError();
    isValid = false;
  }
  if (!selectedCategory) {
    addShowSelectCategoryError();
    isValid = false;
  }
  if (isValid) {
    processValidInput(title, description, dueDate);
  }
}

/**
 * Processes valid input and adds a new todo item to the 'todos' array.
 * @param {string} title - The title of the todo item.
 * @param {string} description - The description of the todo item.
 * @param {string} dueDate - The due date for the todo item.
 */
function processValidInput(title, description, dueDate) {
  const extractedBgcolors = addExtractBgcolor(selectedContacts);
  const cleanedSelectedContacts = selectedContacts.filter(
    (contact) => contact !== null && contact !== undefined
  );

  const newTodo = {
    title: title,
    description: description,
    category: selectedCategory,
    status: "todo",
    priority: selectedPriority,
    due_date: dueDate,
    assignedTo: cleanedSelectedContacts,
    bgcolor: extractedBgcolors,
    subtasks: subtasks,
  };
  todos.push(newTodo);
  addCompleteTaskCreation(newTodo);
}

/**
 * Completes the task creation process by performing the following steps:
 * 1. Persists the updated 'tasks' to local storage.
 * 2. Displays a message indicating that the task has been created.
 * 3. Closes the opened modal
 * 4. Updates the HTML to reflect the changes.
 * @throws {Error} Throws an error if an error occurs during local storage operation.
 */
async function addCompleteTaskCreation(newTodo) {
  await setTask(newTodo);
  addShowCreatedTaskMessage();
  addResetTaskForm();
  closeAddTaskModal();
  updateHTML();
}

/**
 * Opens a task form for adding a new task. The behavior depends on the window width:
 * - If the window width is greater than or equal to 768 pixels, it displays a modal with a task form.
 * - If the window width is less than 768 pixels, it redirects to the 'addTask.html' page.
 * @throws {Error} If the 'taskFormSlider' element is not found in the DOM.
 */
function addTask(status) {
  document.body.style.overflow = "hidden";
  selectedStatus = status;

  const isSpecialSize = window.matchMedia(
    "(min-width: 1023px) and (max-width: 1120px) and (min-height: 600px) and (max-height: 900px)"
  ).matches;

  const isDesktop = window.innerWidth >= 768;

  if (isSpecialSize) {
    window.location.href = "addTask.html?status=" + encodeURIComponent(status);
  } else if (isDesktop) {
    const modal = document.getElementById("taskFormSlider");
    modal.innerHTML = renderAddTask();
    modal.style.display = "block";
    modal.classList.remove("edditModal-slide-out");
    modal.classList.add("edditModal-slide-in");
    const overlay = document.querySelector(".task-background-overlay");
    overlay.style.display = "block";
    aktiviereFilePickerListenerAddTask();
    
  } else {
    window.location.href = "addTask.html?status=" + encodeURIComponent(status);
  }
}

/**
 * Closes the add task modal and hides the overlay.
 */
function closeAddTaskModal() {
  let modal = document.getElementById("taskFormSlider");
  modal.classList.remove("edditModal-slide-in");
  modal.classList.add("edditModal-slide-out");
  let overlay = document.querySelector(".task-background-overlay");
  overlay.style.display = "none";
  document.body.style.overflow = "auto";
}

/**
 * Handles the click event on the overlay to close the add task modal.
 * @param {Event} event - The click event.
 */
function handleOverlayClick(event) {
  if (event.target.classList.contains("task-background-overlay")) {
    closeAddTaskModal();
    addResetTaskForm();
  }
}
document
  .querySelector(".task-background-overlay")
  .addEventListener("click", handleOverlayClick);

/**
 * Shows a success message overlay and redirects to the index page.
 */
function addShowCreatedTaskMessage() {
  document.body.innerHTML += addCreatedTaskTemplate();

  setTimeout(function () {
    let successOverlay = document.getElementById("addCreateTaskOverlay");
    document.body.removeChild(successOverlay);
  }, 1600);
}

/**
 * Filters the contacts list based on a query and renders the matching contacts.
 * @param {string} query - The search query to filter contacts by.
 */
function addSearchContacts(query) {
  let filteredContacts = contacts.filter((contact) => {
    return (
      contact.name.toLowerCase().startsWith(query.toLowerCase()) ||
      contact.surname.toLowerCase().startsWith(query.toLowerCase())
    );
  });
  addRenderSearchedContact(filteredContacts);
}

/**
 * Toggles the selection of a contact based on their name and surname.
 * @param {string} name - The name of the contact to toggle.
 * @param {string} surname - The surname of the contact to toggle.
 */
function addToggleContactSelection(name, surname) {
  const contact = contacts.find(
    (c) => c.name === name && c.surname === surname
  );

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
  addRenderAssignedTo();
  addRenderSearchedContact(contacts);
  addDisplayChosenContacts();
}

/**
 * Extracts the background colors from an array of selected contact names.
 * @param {string[]} selectedContacts - An array of contact names to extract background colors from.
 * @returns {string[]} An array of background colors corresponding to the selected contact names.
 */
function addExtractBgcolor(selectedContacts) {
  const bgcolors = [];
  const validContacts = selectedContacts.filter((contactName) => contactName);

  for (const contactName of validContacts) {
    const foundContact = contacts.find(
      (c) => `${c.name} ${c.surname}` === contactName
    );
    if (foundContact && foundContact.bgcolor) {
      bgcolors.push(foundContact.bgcolor);
    }
  }
  return bgcolors;
}

/**
 * Event listener for the 'input' event to handle the 'addDueDate' input field.
 * Sets the minimum date to the current date and ensures selected dates are not in the past.
 * @param {Event} event - The input event object.
 */
document.addEventListener("input", function (event) {
  let addDueDateInput = event.target;

  if (addDueDateInput && addDueDateInput.id === "addDueDate") {
    let today = new Date().toISOString().split("T")[0];
    addDueDateInput.min = today;

    addDueDateInput.addEventListener("change", function () {
      let selectedDate = addDueDateInput.value;
      if (selectedDate < today) {
        addDueDateInput.value = today;
      }
    });
  }
});


function setPriorityAdd() {
    const mediumButton = document.getElementById('addPrioMedium');
    if (mediumButton) {
        priorityAdd(mediumButton);
    }
}


/**
 * Sets the priority based on the button clicked. Resets other buttons and hides any priority errors.
 * @param {HTMLElement} button - The button element that was clicked to set the priority.
 * @throws {Error} Throws an error if the button ID does not match any expected priority.
 */
function priorityAdd(button) {
    if (button.id === 'addPrioUrgent') {
        highlightButton(button, '#FF3D00', './img/prio_high_active.png');
        selectedPriority = 'high';
    } else if (button.id === 'addPrioMedium') {
        highlightButton(button, '#FFA800', './img/prio_medium_active.png');
        selectedPriority = 'medium';
    } else if (button.id === 'addPrioLow') {
        highlightButton(button, '#7AE229', './img/prio_low_active.png');
        selectedPriority = 'low';
    }
    button.classList.add('selected');
}


/**
 * Highlights a button by changing its background color, image source, and text color.
 * @param {HTMLElement} button - The button to highlight.
 * @param {string} bgColor - The background color to apply to the button.
 * @param {string} imageSrc - The image source URL for the button's inner image.
 */
function highlightButton(button, bgColor, imageSrc) {
    button.classList.add('highlighted');
    button.style.backgroundColor = bgColor;
    let image = button.querySelector('.priority-choice-inner-pic img');
    image.src = imageSrc;
    button.style.color = 'white';
}