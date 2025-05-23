/**
 * Generates an HTML string for a letter container.
 * @param {string} letter - The letter to be used in the HTML template.
 * @returns {string} The generated HTML string for the letter container.
 *
 * @example
 * // returns a string containing an HTML template for letter 'A'
 * generateLetterListHTML('A');
 */
function generateLetterListHTML(letter) {
  return /*html*/ `
    <section id="container-${letter}" class="container-letter-item">
        <span class="letter-title"> ${letter} </span>
        <span class="letter-title-underline"> </span>
        <span id="container-contact-${letter}" class="container-contacts"></span>
    </section>
    `;
}

/**
 * Generates and returns an HTML representation of a contact's detailed view.
 * @param {Object} contact - The contact object.
 * @param {string} contact.name - The first name of the contact.
 * @param {string} contact.surname - The surname (or last name) of the contact.
 * @param {string} [contact.bgcolor] - The background color for the initials. Optional.
 * @param {string} contact.email - The email address of the contact.
 * @param {string} contact.telefon - The phone number of the contact.
 * @param {string} initials - The initials of the contact.
 * @param {number} index - The index of the contact in the data source (e.g., an array).
 * @returns {string} - The HTML string representing the contact's detailed view.
 */
function showContactDetailsHTML(contact, initials, index) {
  return /*html*/ `
    <main class="contact-detailed-container">
        <section class="contact-detailed-top">
            <section>
                <div class="initial-big" style="background-color: ${
                  contact.bgcolor || getRandomColor()
                }">
                    ${initials}
                </div>
            </section>
            <section class="contact-detailed-mid">
                <div class="contact-detailed-name">${contact.name} ${
    contact.surname
  }</div>
                <div class="contact-detailed-edit-delete">
                    <div class="contact-detailed-images" onclick="editContact(${index})"><img class="edit-img" src="./img/edit.png">Edit</div>
                    <div class="contact-detailed-images" onclick="deleteContact(${index})"><img class="delete-img" src="./img/delete.png">Delete</div>
                </div>
            </section>
        </section>
        <span class="contact-detailed-information"> Contact Information </span>             
        <span class="contact-detailed-text">Email: </span> <span class="email"> ${
          contact.email
        }</span>
        <span class="contact-detailed-text">Telefon: </span> <span class="phone"> ${
          contact.telefon
        }</span> 
    </main>
    `;
}

/**
 * Generate an HTML string to display detailed contact information in a mobile view.
 * @param {Object} contact - The contact details.
 * @param {string} contact.name - First name of the contact.
 * @param {string} contact.surname - surname of the contact.
 * @param {string} contact.email - Email address of the contact.
 * @param {string} contact.telefon - Telephone number of the contact.
 * @param {string} [contact.bgcolor] - Background color for the contact initials. If not provided, a random color will be used.
 * @param {string} initials - Initials of the contact.
 * @param {number} index - Index of the contact in the list.
 * @returns {string} HTML string representation of the contact details.
 */
function showContactDetailsMobileHTML(contact, initials, index) {
  return /*html*/ `
    <main class="contact-detailed-container">
        <section class="reverse-column">
            <section class="contact-detailed-top">
                
                    <div class="initial-big-mobile" style="background-color: ${
                      contact.bgcolor || getRandomColor()
                    }">
                        ${initials}
                    </div>
                
                <div class="contact-detailed-mid">
                    <div class="contact-detailed-name">${contact.name} ${
                        contact.surname
                    }</div>
                </div>
            </section>
            <section class="contact-detailed-information"> Contact Information </section>   
        </section>          
        <div class="contact-detailed-text">Email: </div> <div class="email"> ${
          contact.email
        }</div>
        <div class="contact-detailed-text">Telefon: </div> <div class="phone"> ${
          contact.telefon
        }</div> 
           
            <div class="contact-detailed-mobile-return" onclick="returnToContactsMobile()"><img src="./img/arrow-left-line.png">
        </div> 
        <div id="contact-detailed-head" onclick="showEditContactsButtonsMobile()">
            <div class="contact-detailed-images-head"><img src="./img/more_vert.svg"></div>
        </div>
        <section id="contact-mobile-buttons" class="contact-detailed-mobile-buttons, hide-it">
            <div id="contact-detailed-button-edit" class="contact-detailed-images-mobile" onclick="editContact(${index})"><img src="./img/edit.png">Edit</div>
            <div id="contact-detailed-button-delete" class="contact-detailed-images-mobile" onclick="deleteContact(${index})"><img src="./img/delete.png">Delete</div>
        </section>
        <div class="add-Contact-Mobile-button">
            <div> </div>
        </div>
    </main> 
    `;
}

/**
 * Generates an HTML string to display a contact.
 * @param {number} i - The index of the contact in the contacts list.
 * @param {string} color - The background color for the initials div.
 * @param {string} initials - The initials of the contact.
 * @param {Object} contact - The contact details.
 * @param {string} contact.name - The first name of the contact.
 * @param {string} contact.surname - The surname of the contact.
 * @param {string} contact.email - The email address of the contact.
 * @param {boolean} isCurrentUser - A flag to determine if the contact is the current user.
 * @returns {string} An HTML string representation of the contact.
 */
function showContactsHTML(i, color, initials, contact, isCurrentUser) {
  let userMarker = isCurrentUser ? " (you)" : "";

  return /*html*/ `
        <section class="contact" data-contact-index="${i}" onclick="handleContactClick(${i})">
            <div class="initial" style="background-color: ${color}">${initials}</div>
            <div class="container-name-email">
                <div class="name">${contact.name} ${contact.surname}${userMarker}</div>
                <div class="email">${contact.email}</div>
            </div>
        </section>
    `;
}

/**
 * Generates the HTML string for the "Add Contact" modal.
 * @returns {string} The HTML content for the "Add Contact" modal.
 * @example
 * const modalHTML = generateAddContactModalHTML();
 * document.body.insertAdjacentHTML('beforeend', modalHTML);
 */
function generateAddContactModalHTML() {
  return /*html*/ `
    <section class="modal-content">
            <section class="modal-content-top">
                <div id="closeContactModalBtn" onclick="closeModal()"><img class="close" src="./img/close_contact.png"
                        alt="Close Modal"></div>
                <div class="modal-logo"><img src="./img/join_logo.png"></div>
                <div class="modal-headline">Add contact</div>
                <div class="modal-text">Tasks are better with a team!</div>
            </section>
            <section class="modal-input-img">
                    <img src="./img/person_add.png">
            </section>
            <section class="modal-input-container">                
                <section class="modal-input-row">
                    <div class="modal-input-frame">
                        <div class="error-msg" id="error-Name"></div>
                        <section class="modal-input-dflex">
                            <input class="modal-input-field"  type="text" id="Name" placeholder="Name">
                            <img class="modal-input-icon" src="img/person.png" alt="Name">
                        </section>
                    </div>
                    <div class="modal-input-frame">
                        <div class="error-msg" id="error-Surname"></div>
                        <section class="modal-input-dflex">
                            <input class="modal-input-field"  type="text" id="Surname" placeholder="Surname">
                            <img class="modal-input-icon" src="img/person.png" alt="Name">
                        </section>
                    </div>
                    <div class="modal-input-frame">
                        <div class="error-msg" id="error-newEmail"></div>
                        <section class="modal-input-dflex">
                            <input class="modal-input-field" type="text" id="newEmail" placeholder="Email" >
                            <img class="modal-input-icon" src="img/mail.png" alt="Email">
                        </section>
                    </div>
                    <div class="modal-input-frame">
                        <div class="error-msg" id="error-newTelefon"></div>
                        <section class="modal-input-dflex">
                            <input class="modal-input-field"  type="tel" id="newTelefon" placeholder="Phone">
                            <img class="modal-input-icon" src="img/call.svg" alt="Phone">
                        </section>
                    </div>
                </section>
                <section class="add-contact-buttons">
                    <div class="add-contact-buttons-inner">
                        <button onclick="closeModal()" type="button" class="button-clear">
                            Cancel
                            <img class="button-clear-pic" src="./img/cancel-icon.svg">
                        </button>
                        <button type="submit" value="submit" id="saveContactBtn" class="button-create-task">
                            Create contact
                            <img class="button-create-task-pic" src="./img/check.svg">
                        </button>
                    </div>
                </section>
            </section>
        </section>
    `;
}

/**
 * Generates the HTML content for the edit contact modal.
 * @param {number} index - The index of the contact in the contacts list.
 * @param {string} initials - The initials of the contact.
 * @param {Object} contact - The contact object.
 * @param {string} contact.bgcolor - The background color for the initials div.
 * @returns {string} The generated HTML string for the edit contact modal.
 * @example
 * const htmlContent = generateEditContactModalHTML(0, 'AB', { bgcolor: '#ff0000' });
 */
function generateEditContactModalHTML(index, initials, contact) {
  return /*html*/ `
 <main class="edit-content" data-index="${index}">
     <section class="edit-content-top">
         <div id="closeEditModalBtn" onclick="closeEditModal()"><img class="close" src="./img/close_contact.png" alt="Close Modal"></div>
         <div class="modal-logo"><img src="./img/join_logo.png"></div>
         <div class="modal-headline">Edit contact</div>
     </section>
     <section class="initial-big" style="background-color: ${contact.bgcolor}">${initials}</section>
     <section class="modal-input-container">             
         <section class="modal-input-row">
             <div class="modal-input-frame">
                 <div class="error-msg" id="error-editName"></div>
                     <section class="modal-input-dflex">
                         <input class="modal-input-field"  type="text" id="editName" placeholder="Name">
                         <img class="modal-input-icon" src="img/person.png" alt="Name"> 
                     </section>
             </div>
             <div class="modal-input-frame">
                 <div class="error-msg" id="error-editSurname"></div>                     
                     <section class="modal-input-dflex">
                         <input class="modal-input-field"  type="text" id="editSurname" placeholder="Surname">
                         <img class="modal-input-icon" src="img/person.png" alt="Name"> 
                     </section>
             </div>
             <div class="modal-input-frame">
                 <div class="error-msg" id="error-editNewEmail"></div>
                 <section class="modal-input-dflex">
                     <input class="modal-input-field" type="email" name="email"id="editNewEmail" 
                         placeholder="Email: example@hotmail.com" required>
                     <img class="modal-input-icon" src="img/mail.png" alt="Email">
                 </section>
             </div>
             <div class="modal-input-frame">
                 <div class="error-msg" id="error-editNewTelefon"></div>
                 <section class="modal-input-dflex">
                     <input class="modal-input-field"  type="tel" id="editNewTelefon" placeholder="Phone">
                     <img class="modal-input-icon" src="img/call.svg" alt="Phone">
                 </section>
             </div>
         </section>
         <section class="add-contact-buttons">
             <div class="add-contact-buttons-inner">
                 <button onclick="deleteContact(${index})" class="button-clear">
                     <div class="button-clear-text">Delete</div>
                 </button>
                 <button type="submit" id="updateContactBtn" class="button-create-task">
                     <div class="button-create-task-text">Save</div>
                     <div class="button-create-task-pic"> <img src="./img/check.svg"></div>
                 </button>
             </div>
         </section>
     </section>
 </main>
`;
}

/**
 * Generates the HTML string for the edit contact modal on mobile.
 * @param {number} index - The index of the contact in the list.
 * @param {string} initials - The initials of the contact name.
 * @param {object} contact - The contact object containing details about the contact.
 * @param {string} contact.bgcolor - The background color for the contact initials display.
 * @returns {string} The HTML string representation of the edit contact modal.
 * @example
 * const contact = { bgcolor: '#FF5733' };
 * const html = generateEditContactMobileHTML(0, 'AB', contact);
 */
function generateEditContactMobileHTML(index, initials, contact) {
  return /*html*/ `
    <main class="edit-content" data-index="${index}">
        <section class="edit-content-top">
            <div id="closeEditModalBtn" onclick="closeEditModal()"><img class="close" src="./img/close_contact.png" alt="Close Modal"></div>
            <div class="modal-logo"><img src="./img/join_logo.png"></div>
            <div class="modal-headline">Edit contact</div>
        </section>
        <div class="initial-big" style="background-color: ${contact.bgcolor}">
                ${initials}
            </div>
        <section class="modal-input-container">
            <section class="modal-input-row">
                <div class="modal-input-frame">
                        <input class="modal-input-field"  type="text" id="editFullName" placeholder="Name">
                        <img class="modal-input-icon" src="img/person.png" alt="Name"> 
                        <div class="error-msg" id="error-editName"></div>
                </div>
                <div class="modal-input-frame">
                    <input class="modal-input-field" type="email" id="editNewEmail" name="email" autocomplete="email"
                        placeholder="Email">
                    <img class="modal-input-icon" src="img/mail.png" alt="Email">
                    <div class="error-msg" id="error-editNewEmail"></div>
                </div>
                <div class="modal-input-frame">
                    <input class="modal-input-field" type="email" id="editNewTelefon" placeholder="Phone">
                    <img class="modal-input-icon" src="img/call.svg" alt="Phone">
                    <div class="error-msg" id="error-editNewTelefon"></div>
                </div>
            </section>
            <section class="add-contact-buttons">
                <div class="add-contact-buttons-inner">
                    <button onclick="deleteContact(${index})" class="button-clear">
                        <div class="button-clear-text">Delete</div>
                    </button>
                    <button type="submit" id="updateContactBtn" class="button-create-task">
                        <div class="button-create-task-text">Save</div>
                        <div class="button-create-task-pic"> <img src="./img/check.svg"></div>
                    </button>
                </div>
            </section>
        </section>
    </main>
    `;
}
