/**
 * Toggles the display of the 'edit-loaded-contacts' container.
 * Also manages the display state and class of related elements.
 */
function loadToggleAssignedToContainer() {
    let assignedToContainer = document.getElementById('edit-loaded-contacts');
    let contactsContainer = document.querySelector('.edit-contacts-container');
    let assignedToDropdown = document.querySelector('.edit-assigned-to-dropdown');

    if (assignedToContainer.style.display === 'block') {
        assignedToContainer.style.display = 'none';
        assignedToDropdown.classList.remove('expanded');
    } else {
        assignedToContainer.style.display = 'block';
        assignedToDropdown.classList.add('expanded');
    }
    contactsContainer.style.display = assignedToContainer.style.display;
}


/**
 * Renders and displays the selected contacts.
 */
function renderDisplayChosenContacts() {
  const chosenContactsContainer = document.getElementById('edit-chosen-contacts');
  chosenContactsContainer.innerHTML = '';

  const selectedContactIds = Object.keys(selectedContacts).filter(
    (id) => selectedContacts[id]
  );

  const maxVisible = 4;
  const totalSelected = selectedContactIds.length;

  for (let i = 0; i < Math.min(maxVisible, totalSelected); i++) {
    const contactId = selectedContactIds[i];
    const contact = contacts.find((c) => c.id == contactId);
    if (contact) {
      const initials = `${contact.name.charAt(0)}${contact.surname.charAt(0)}`.toUpperCase();
      chosenContactsContainer.innerHTML += renderDisplayChosenContactsHTML(contact, initials);
    }
  }

  if (totalSelected > maxVisible) {
    const remaining = totalSelected - maxVisible;
    chosenContactsContainer.innerHTML += /*html*/ `
      <section class="chosen-contact">
        <div class="initial" style="background-color: #D1D1D1">+${remaining}</div>
      </section>
    `;
  }
}


/**
 * Renders the HTML for a chosen contact with its initials.
 * @param {Object} contact - The contact information.
 * @param {string} contact.bgcolor - The background color for the initials div.
 * @param {string} initials - The initials of the contact.
 */
function renderDisplayChosenContactsHTML(contact, initials) {
    return /*html*/`
        <div class="chosen-contact">
            <div class="initial" style="background-color: ${contact.bgcolor}">${initials}</div>
        </div>
    `;
}


/**
 * Loads and displays the chosen contacts.
 */
function loadDisplayChosenContacts() {
  const container = document.getElementById('edit-chosen-contacts');
  const ids = Object.keys(selectedContacts).filter(id => selectedContacts[id]);
  const max = 4, total = ids.length;
  let html = '';

  ids.slice(0, max).forEach(id => {
    const c = contacts.find(c => c.id === parseInt(id));
    if (c) {
      const initials = (c.name[0] + c.surname[0]).toUpperCase();
      html += loadDisplayChosenContactsHTML(c, initials);
    }
  });

  if (total > max)
    html += `<section class="chosen-contact"><div class="initial" style="background-color: #D1D1D1">+${total - max}</div></section>`;

  container.innerHTML = html;
}


/**
 * Generiert und gibt einen HTML-String für die Anzeige ausgewählter Kontakte zurück.
 * @param {Object} contact - Das Kontaktobjekt mit notwendigen Informationen.
 * @param {string} contact.bgcolor - Hintergrundfarbe für die Initialen.
 * @param {string} initials - Initialen des Kontakts.
 */
function loadDisplayChosenContactsHTML(contact, initials) {
    return /*html*/`
        <section class="chosen-contact">
            <div class="initial" style="background-color: ${contact.bgcolor}">${initials}</div>
        </section>
    `;
}


/**
 * Toggles the category container's display status and updates category dropdown's visual state.
 */
function loadToggleCategoryContainer() {
    let editSelectText = document.querySelector('.edit-select-text');
    editSelectText.style.display = 'inline';

    let editSelectedCategory = document.getElementById('edit-selected-category-display');
    editSelectedCategory.textContent = '';

    let editCategoryContainer = document.getElementById('edit-loaded-categories');
    let editCategoryDropdown = document.querySelector('.edit-category-dropdown');

    if (editCategoryContainer.style.display === 'block') {
        editCategoryContainer.style.display = 'none';
        editCategoryDropdown.classList.remove('expanded');
    } else {
        editCategoryContainer.style.display = 'block';
        editCategoryDropdown.classList.add('expanded');
        editRenderCategorys();
    }
}


/**
 * Renders the categories for editing.
 */
function editRenderCategorys() {
    let editCategoryContainer = document.getElementById('edit-loaded-categories');
    editCategoryContainer.innerHTML = '';

    for (let i = 0; i < categories.length; i++) {
        let category = categories[i].name;

        editCategoryContainer.innerHTML += /* html */`
        <div class="category" onclick="categorySelected('${category}')">${category}</div>
        `;
    }
}


/**
 * Loads the provided category into the selected category.
 * @param {Object} element - The element containing category data.
 */
function loadRenderCategory(element) {
    const category = element.category;
    selectedCategory = category;
}


/**
 * Handles the logic when a category is selected.
 * @param {string} category - The name of the selected category.
 */
function categorySelected(category) {
    selectedCategory = category;
    let selectedCategoryDisplay = document.getElementById('edit-selected-category-display');
    selectedCategoryDisplay.textContent = `${selectedCategory}`;

    let selectText = document.querySelector('.edit-select-text');
    selectText.style.display = 'none';

    let categoryContainer = document.getElementById('edit-loaded-categories');
    categoryContainer.style.display = 'none';

    let categoryDropdown = document.querySelector('.edit-category-dropdown');
    categoryDropdown.classList.remove('expanded');
}


/**
 * Opens the subtask input and updates relevant display elements.
 */
function openSubtaskInput() {
    document.querySelector('.open-subtask-button').style.display = 'none';
    document.getElementById('edit-subtask-input').focus();
    document.getElementById('edit-separator').style.display = 'inline-flex';
    let otherButtons = document.querySelectorAll('.add-subtask-button');
    for (let i = 0; i < otherButtons.length; i++) {
        otherButtons[i].style.display = 'inline-block';
    }
}


/**
 * Closes the subtask input and resets the relevant display elements.
 */
function closeSubtaskInput() {
    document.querySelector('.open-subtask-button').style.display = 'inline-block';
    document.querySelector('.edit-new-subtask-textfield').value = '';
    document.querySelector('.add-subtask-input').style.borderBottom = "1px solid #D1D1D1";
    document.getElementById('edit-separator').style.display = 'none';
    let otherButtons = document.querySelectorAll('.add-subtask-button');
    for (let i = 0; i < otherButtons.length; i++) {
        otherButtons[i].style.display = 'none';
    }
}


/**
 * Deletes a subtask based on its ID.
 * @param {number|string} subtaskId - The ID of the subtask to delete.
 */
function deleteEditSubtask(subtaskId) {
    // aus dem Array entfernen
  currentSelectedTask.subtasks = currentSelectedTask.subtasks.filter(
    (s) => s.id !== subtaskId
  );
  // aus dem DOM entfernen
  const el = document.getElementById(`subtask-container-${subtaskId}`);
  if (el) el.remove();
}


/**
 * Allows the user to edit a subtask.
 * @param {number} i - The index or unique identifier for the subtask.
 */
function editEditedSubtask(i) {
    let subtaskElement = document.getElementById(`edit-value-${i}`);

    if (subtaskElement) {
        subtaskElement.contentEditable = true;
        subtaskElement.focus();
        subtaskElement.setAttribute('aria-readonly', 'false');
    } else {
        console.warn(`Kein Element mit ID edit-value-${i} gefunden.`);
    }

    let subtaskContainer = document.getElementById(`subtask-container-${i}`);

    if (subtaskContainer) {
        addEditingClasses(subtaskContainer);
    }
}


/**
 * Applies editing classes and styles to the given container. It handles specific 
 * UI changes for entering the editing mode like showing/hiding certain elements 
 * and modifying some styles.
 * @param {HTMLElement} container - The container element to which editing styles and classes will be applied.
 * @example
 * let divElement = document.querySelector(".my-container");
 * addEditingClasses(divElement);
 */
function addEditingClasses(container) {
    addClasses(container);
    setDisplay(container.querySelector(".edit-subtask-dot"), "none");
    setDisplay(container.querySelector(".edit-save-subtask-button"), "block");
    setDisplay(container.querySelector(".edit-edit-delete-subtask-button"), "block");
    setDisplay(container.querySelector(".separator3"), "block");
}


/**
 * Adds specific CSS classes and styles to the given container element.
 * @param {HTMLElement} container - The DOM element to which classes and styles will be added.
 */
function addClasses(container) {
    container.classList.add("editing-mode", "no-hover");
    container.style.borderBottom = "1px solid #4589FF";
}


/**
 * Sets the display style of a DOM element. *
 * @param {HTMLElement|null} element - The DOM element to modify.
 * @param {string} value - The CSS display value to set (e.g. 'none', 'block').
 */
function setDisplay(element, value) {
    if (element) {
        element.style.display = value;
    }
}


/**
 * Finishes the editing mode for a given subtask.
 * @param {string|number} i - The unique identifier (or index) for the subtask.
 * This function achieves the following steps:
 * 1. Gets the subtask element with the provided ID and disables its content editing.
 * 2. Removes editing-related classes from the subtask's container.
 * 3. Saves the edited title.
 * @example
 * finishEditing(3);  // finishes editing for the subtask with id '3'
 */
function finishEditing(i) {
    let subtaskElement = document.getElementById(`edit-value-${i}`);
    if (subtaskElement) {
        subtaskElement.contentEditable = false;
        subtaskElement.setAttribute('aria-readonly', 'true');
    }

    let subtaskContainer = document.getElementById(`subtask-container-${i}`);
    if (subtaskContainer) {
        removeEditingClasses(subtaskContainer);
    }

    saveEditedTitle(i);
}


/**
 * Removes a class from the given element and optionally sets a CSS style property and value.
 * @param {HTMLElement} element - The DOM element from which the class will be removed.
 * @param {string} className - The class name to be removed from the element.
 * @param {string} [styleProperty] - The CSS property to set. If not provided, this step is skipped.
 * @param {string} [styleValue=''] - The value for the CSS property. If `styleProperty` is provided but `styleValue` isn't, it sets the property value to an empty string.
 * @example
 * removeClassAndStyle(document.querySelector('.my-div'), 'hide', 'display', 'block');
 */
function removeClassAndStyle(element, className, styleProperty, styleValue) {
    if (element) {
        element.classList.remove(className);
        if (styleProperty) {
            element.style[styleProperty] = styleValue;
        }
    }
}


/**
 * Removes editing-related classes and styles from the given container element.
 * Specifically, it:
 * - Removes "editing-mode" and "no-hover" classes.
 * - Resets the borderBottom style.
 * - Changes the display styles for the child elements with the classes:
 *   ".edit-subtask-dot", ".edit-save-subtask-button", ".edit-delete-subtask-button", and ".separator3".
 * @param {HTMLElement} container - The container element from which editing-related classes and styles are to be removed.
 */
function removeEditingClasses(container) {
    ['editing-mode', 'no-hover'].forEach(cls => container.classList.remove(cls));
    container.style.borderBottom = "";

    removeClassAndStyle(container.querySelector(".edit-subtask-dot"), null, "display", "inline-block");
    removeClassAndStyle(container.querySelector(".edit-save-subtask-button"), null, "display", "none");
    removeClassAndStyle(container.querySelector(".edit-edit-delete-subtask-button"), null, "display", "none");
    removeClassAndStyle(container.querySelector(".separator3"), null, "display", "none");
}


/**
 * Saves the edited title of the current task.
 * If the current task is not defined or has no subtasks,
 * an error is displayed in the console.
 * @throws {Error} If currentTask is not defined or has no subtasks.
 */
function saveEditedTitle(i) {
    let subtaskElement = document.getElementById(`edit-value-${i}`);
    if (!subtaskElement) {
        return;
    }
    let editedTitle = subtaskElement.textContent.trim();
    if (!editedTitle) {
        currentSelectedTask.subtasks = currentSelectedTask.subtasks.filter(sub => sub.id !== i);
        const subtaskContainer = document.getElementById(`subtask-container-${i}`);
        if (subtaskContainer) {
            subtaskContainer.remove();
        }
        return;
    }
    let subtask = currentSelectedTask.subtasks.find(sub => sub.id === i);
    if (subtask) {
        subtask.title = editedTitle;
    }
}


/**
 * Extracts background colors from an element's assignedTo array by matching
 * first and last names with a list of contacts.
 * @param {Object} element - The element to extract colors from.
 * @param {string[]} element.assignedTo - An array of full names assigned to the element.
 * @param {Object[]} contacts - An array of contact objects with name and bgcolor properties.
 */
function extractColor(element) {
    const colors = [];
    for (let i = 0; i < element.assignedTo.length; i++) {
        const fullName = element.assignedTo[i];
        const [firstName, lastName] = fullName.split(' ');

        const contact = contacts.find(contact =>
            contact.name === firstName && contact.surname === lastName
        );
        colors.push(contact ? contact.bgcolor : '');
    }
    return colors;
} 


/**
 * Event listener for the 'input' event to handle the 'edit-due-date' input field.
 * Sets the minimum date to the current date and ensures selected dates are not in the past.
 * @param {Event} event - The input event object.
 */
document.addEventListener('input', function (event) {
    let editDueDateInput = event.target;
    if (editDueDateInput && editDueDateInput.id === 'edit-due-date') {
        let today = new Date().toISOString().split('T')[0];
        editDueDateInput.min = today;        
        editDueDateInput.addEventListener('change', function () {
            let selectedDate = editDueDateInput.value;
            if (selectedDate < today) {
                editDueDateInput.value = today;
            }
        });
    }
});