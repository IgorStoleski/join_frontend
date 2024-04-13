let currentSelectedTask;
let updatedSubtasks = [];
let currentTaskId;


/** 
 * Starts the task editing process by rendering the task and starting the slide animation.
 * @param {number} id - The ID of the task to be edited.
 */
function editTask(id) {
  document.body.style.overflow = 'hidden';
  const slideEditTask = document.getElementById("task-slide");
  slideEditTask.innerHTML = renderEditTask(id);
  const element = todos[id];
  currentTaskId = id;
  currentSelectedTask = element;
  addSubtaskToEdit(element);
  loadSelectedPriority(element);
  loadDisplayChosenContacts();
  addToSelectedContacts(element);
  loadRenderCategory(element);
}


/**
 * Aktualisiert das gegebene Eigenschaft des Elements mit dem Wert eines Input-Elements.
 * @param {HTMLElement} element - Das zu aktualisierende Element.
 * @param {string} inputId - Die ID des Input-Elements, von dem der Wert abgerufen werden soll.
 * @param {string} prop - Die Eigenschaft des Elements, die aktualisiert werden soll.
 */
function updateElementFromInput(element, inputId, prop) {
  element[prop] = document.getElementById(inputId).value;
}


/**
 * Updates the properties of a given element based on various input sources.
 * @param {Object} element - The element object to be updated.
 * @property {string} [element.title] - The title of the element.
 * @property {string} [element.description] - The description of the element.
 * @property {string|Date} [element.dueDate] - The due date of the element.
 * @property {string} [element.status] - The current status of the element.
 * @property {string} [element.category] - The category of the element.
 * @property {string} [element.priority] - The priority level of the element.
 * @property {Array} [element.assignedTo] - The list of contacts assigned to the element.
 * @property {Array} [element.subtasks] - The list of subtasks associated with the element.
 * @example
 * updateElementProperties(myTask);
 * @todo: Handle properties like 'selectedCategory', 'selectedPriority', and others
 * which aren't passed as function arguments but are used in the function.
 */
function updateElementProperties(element) {
  updateElementFromInput(element, "edit-task-title", "title");
  updateElementFromInput(element, "edit-task-description", "description");
  updateElementFromInput(element, "edit-due-date", "dueDate");
  element.status = element.status;
  element.category = selectedCategory;
  element.priority = selectedPriority;
  element.assignedTo = selectedContacts.filter(contact => contact !== undefined);
  element.bgcolor = extractColor(element);
  element.subtasks = processAndSaveSubtasks(element);
}


/** 
 * Saves the edited task by overwriting its properties and updating the local storage.
 * @param {number} id - The ID of the task being saved.
 */
async function saveEditedTask(id) {
  const element = todos[id];
  updateElementProperties(element);
  todos[id] = element;
  await setItem("tasks", JSON.stringify(todos));
  openEditedTask(element.id);
  selectedContacts = [];
  document.body.style.overflow = 'auto';
}


/**
 * Opens the edited task by rendering the slide card based on the given task id.
 * It also makes the slide card visible and adjusts the relevant container styles.
 * @param {string|number} id - The ID of the task to be opened.
 */
function openEditedTask(id) {
  const slideCard = document.getElementById('task-slide');
  slideCard.innerHTML = renderSlideCard(id);
  document.getElementById('task-slide').classList.remove('d-none');
  document.getElementById('slide-container').classList.add('open-task');

}


/**
 * Loads and highlights the priority of a given task in the UI.
 * The function resets other buttons, identifies the task priority, and then
 * sets the highlight for the respective priority button.
 * @param {Object} task - The task object.
 * @param {string} task.priority - The priority of the task ("high", "medium", or "low").
 */
function loadSelectedPriority(task) {
  const priorities = {
    high: {
      buttonId: "edit-prio-urgent",
      color: "#FF3D00",
      img: "./img/prio_high_active.png"
    },
    medium: {
      buttonId: "edit-prio-medium",
      color: "#FFA800",
      img: "./img/prio_medium_active.png"
    },
    low: {
      buttonId: "edit-prio-low",
      color: "#7AE229",
      img: "./img/prio_low_active.png"
    }
  };

  resetButtons();

  if (priorities[task.priority]) {
    const prio = priorities[task.priority];
    const button = document.getElementById(prio.buttonId);
    highlightButton(button, prio.color, prio.img);
    selectedPriority = task.priority;
  }
}


/**
 * Sets the priority based on the clicked button.
 * The function resets other buttons and then sets the highlight for the respective priority button.
 * @param {HTMLElement} button - The clicked priority button.
 */
function priority(button) {
  resetButtons();

  if (button.id === "edit-prio-urgent") {
    highlightButton(button, "#FF3D00", "./img/prio_high_active.png");
    selectedPriority = "high";
  } else if (button.id === "edit-prio-medium") {
    highlightButton(button, "#FFA800", "./img/prio_medium_active.png");
    selectedPriority = "medium";
  } else if (button.id === "edit-prio-low") {
    highlightButton(button, "#7AE229", "./img/prio_low_active.png");
    selectedPriority = "low";
  }
}


/** 
 * Resets the style of the priority buttons to their default state.
 */
function resetButtons() {
  selectedPriority = "";

  let buttons = document.querySelectorAll(".edit-priority-choice-inner");
  for (let i = 0; i < buttons.length; i++) {
    let btn = buttons[i];
    btn.classList.remove("highlighted");
    btn.style.backgroundColor = "";
    btn.style.color = "black";

    let originalImage = btn.querySelector(".edit-priority-choice-inner-pic img");
    originalImage.src = "./img/" + originalImage.getAttribute("data-image");
  }
}


/**
 * Highlights a given button by changing its background color, image source, and text color.
 * @param {HTMLElement} button - The button to be highlighted.
 * @param {string} bgColor - The desired background color for the button.
 * @param {string} imageSrc - The source URL for the image to be displayed inside the button.
 */
function highlightButton(button, bgColor, imageSrc) {
  button.classList.add("highlighted");
  button.style.backgroundColor = bgColor;
  let image = button.querySelector(".edit-priority-choice-inner-pic img");
  image.src = imageSrc;
  button.style.color = "white";
}


/** 
 * Adds a new subtask to the UI based on the value of the input field.
 */
function addNewSubtask() {
  const subInput = document.getElementById('edit-subtask-input');
  const subInputValue = subInput.value.trim();
  const subtaskContainer = document.getElementById("edit-subtask-add-container");

  if (!currentSelectedTask.subtasks) {
    currentSelectedTask.subtasks = [];
  }

  const newSubtaskId = currentSelectedTask.subtasks.length + 1;
  subtaskContainer.innerHTML += subtaskToAddHTML(subInputValue, newSubtaskId);

  currentSelectedTask.subtasks.push({ id: newSubtaskId, title: subInputValue, status: false });

  subInput.value = '';
  closeSubtaskInput();
}


/**
 * Handles the Enter key press event on the edit-new-subtask textfield.
 * If the Enter key is pressed and the target element has the 'edit-new-subtask-textfield' class,
 * it prevents the default Enter key behavior, adds a new subtask, and blurs the active element.
 * @param {KeyboardEvent} event - The keyboard event object.
 */
function handleEditSubtaskInput(event) {
  if (event.key === 'Enter' && event.target.classList.contains('edit-new-subtask-textfield')) {
    event.preventDefault();
    addNewSubtask();
    document.activeElement.blur();
  }
}
document.addEventListener('keypress', handleEditSubtaskInput);


/** 
 * Renders subtasks of a given task for editing.
 * @param {Object} element - The task object containing subtasks.
 */
function addSubtaskToEdit(element) {
  let subtasksHTML = "";
  if (element.subtasks && Array.isArray(element.subtasks)) {
    for (let i = 0; i < element.subtasks.length; i++) {
      const subtask = element.subtasks[i];
      if (subtask.title) {
        subtasksHTML += subtaskToEditHTML(subtask, i);
      }
    }
    const subtaskContainer = document.getElementById("edit-subtask-add-container");
    subtaskContainer.innerHTML = subtasksHTML;
  }
}


/**
 * Adds contacts to the selected contacts based on the given element's assigned contacts.
 * @param {Object} element - The element containing assigned contacts.
 */
function addToSelectedContacts(element) {
  const assigneds = element.assignedTo;

  for (let name of assigneds) {
    const contact = contacts.find(c => `${c.name} ${c.surname}` === name);
    if (contact) {
      if (!selectedContacts[contact.id]) {
        selectedContacts[contact.id] = `${contact.name} ${contact.surname}`;
      }
    }
  }
  loadRenderAssignedTo(selectedContacts);
  loadDisplayChosenContacts();
}


/**
 * Retrieves the logged-in user's data from local storage.
 * @returns {Object} The logged-in user's data, or an empty object if no data is found.
 */
function getLoggedInUserData() {
  return JSON.parse(localStorage.getItem('loggedInUser')) || {};
}


/**
 * Asynchronously renders the selected contacts to the UI.
 * @param {Object} selectedContacts - The list of selected contacts.
 */
async function loadRenderAssignedTo(selectedContacts) {
  let loggedInUserData = getLoggedInUserData();

  let assignedToContainer = document.getElementById('edit-loaded-contacts');
  assignedToContainer.innerHTML = '';

  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    let initials = `${contact.name.charAt(0)}${contact.surname.charAt(0)}`.toUpperCase();
    const isSelected = selectedContacts[contact.id] || false;
    let isCurrentUser = loggedInUserData && contact.email === loggedInUserData.email;

    assignedToContainer.innerHTML += renderAssignedToHTML(contact, initials, isSelected, isCurrentUser);
  }
}


/**
 * Renders the searched contacts to the UI.
 * @param {Array} contacts - The list of contacts to render.
 */
function loadSearchedContact(contacts) {
  let loggedInUserData = getLoggedInUserData();

  let loadAssignedToContainer = document.getElementById('edit-loaded-contacts');
  loadAssignedToContainer.innerHTML = '';

  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    let initials = `${contact.name.charAt(0)}${contact.surname.charAt(0)}`.toUpperCase();
    const isSelected = selectedContacts[contact.id] || false;
    let isCurrentUser = loggedInUserData && contact.email === loggedInUserData.email;

    loadAssignedToContainer.innerHTML += loadRenderSearchedContactsHTML(contact, initials, isSelected, isCurrentUser);
  }
}


/** 
 * Search and display contacts based on a given query.
 * @param {string} query - The query string to search for.
 */
function loadSearchContacts(query) {
  let filteredContacts = contacts.filter(contact => {
    return (
      contact.name.toLowerCase().startsWith(query.toLowerCase()) ||
      contact.surname.toLowerCase().startsWith(query.toLowerCase())
    );
  });
  loadSearchedContact(filteredContacts);
}


/**
 * Toggles the selection of a contact based on the given name and surname. If the contact is already selected,
 * it will be removed from the selection; otherwise, it will be added to the selection. After toggling the contact
 * selection, various rendering functions are called to update the UI.
 * @param {string} name - The first name of the contact to be toggled.
 * @param {string} surname - The surname of the contact to be toggled.
 * @see loadRenderAssignedTo
 * @see loadSearchedContact
 * @see renderDisplayChosenContacts
 */
function loadToggleContactSelection(name, surname) {
  const contact = contacts.find(c => c.name === name && c.surname === surname);

  if (!contact) {
    return;
  }

  if (selectedContacts[contact.id]) {
    delete selectedContacts[contact.id];
  } else {
    selectedContacts[contact.id] = `${contact.name} ${contact.surname}`;
  }
  loadRenderAssignedTo(selectedContacts);
  loadSearchedContact(contacts);
  renderDisplayChosenContacts();
}


/** 
 * Toggles the selection state of a given contact.
 * @param {string} name - The first name of the contact.
 * @param {string} surname - The surname of the contact.
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
  loadRenderAssignedTo(selectedContacts);
  loadSearchedContact(contacts);
  renderDisplayChosenContacts();
}