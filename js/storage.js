let selectedPriority = "";
let selectedCategory = "";
let selectedStatus = "";
let selectedContacts = [];
let subtasks = [];
let subtaskIdCounter = 0;
let contacts = [];
let todos = [];
let allImages = [];

let STORAGE_TOKEN;
/* const STORAGE_URL = 'https://backend.kanban-join.de/'; */
const STORAGE_URL = "http://localhost:8000/";


/**
 * Asynchronously loads all contacts from the backend API.
 * Retrieves the authentication token using `getAuthToken()`. If the token is not available,
 * the function exits early. Sends a GET request to the contacts endpoint and, if successful,
 * parses the response JSON and assigns it to the global `contacts` variable.
 * If the request fails, an error is thrown and caught, and the error message is logged to the console.
 * @returns {Promise<Array|undefined>} A promise that resolves to the list of contacts if successful, or undefined if not.
 */
async function loadAllContacts() {
  const authToken = getAuthToken();
  if (!authToken) {
    return;
  }

  const response = await fetch(STORAGE_URL + "contacts/", {
    method: "GET",
    headers: new Headers({Authorization: `Token ${authToken}`, "Content-Type": "application/json"}),
  });

  try {
    if (response.ok) {
      const data = await response.json();
      contacts = data;
      return contacts;
    } else {
      throw new Error("Failed to load contacts. Server responded with status: " + response.status);
    }
  } catch (e) {
    console.error("Loading error:", e.message);
  }
}


/**
 * Sends a new contact object to the backend API and attempts to create it.
 * This function uses a POST request to send contact data to the server.
 * It includes an authorization token in the headers and returns the created
 * contact object as JSON if the request is successful.
 * In case of an error, it logs the error message and returns `null`.
 * @param {Object} contact - The contact data to be created.
 * @returns {Promise<Object|null>} The created contact object if successful, or `null` if an error occurs.
 */
async function setContact(contact) {
  const token = getAuthToken();
  const payload = {
    ...contact,
  };
  return fetch(STORAGE_URL + "contacts/", {
    method: "POST",
    headers: {"Content-Type": "application/json", Authorization: `Token ${token}`},
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(`Failed to create contact: ${res.status}`);
      }
    })
    .catch((error) => {
      return null;
    });
}


/**
 * Updates an existing contact on the server using a PUT request.
 * Sends the updated contact data as JSON to the specified contact endpoint.
 * Uses an authentication token for authorization. If the update fails,
 * an error is logged and an exception is thrown.
 * @param {Object} contact - The contact object containing updated data.
 * @param {number|string} pk - The primary key (ID) of the contact to update.
 * @returns {Promise<Object|undefined>} The updated contact data from the server, or undefined if an error occurs.
 */
async function setUpdateContact(contact, pk) {
  const token = getAuthToken();
  const payload = { ...contact };
  return fetch(STORAGE_URL + "contacts/" + pk + "/", {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: {"Content-Type": "application/json", Authorization: `Token ${token}`},
  })
    .then(async (res) => {
      const responseData = await res.json();
      if (!res.ok) {
        console.error("Error updating contact:", responseData.detail || "Unknown error");
        throw new Error("Failed to update contact. Status: " + res.status);
      }
      return responseData;
    })
    .catch((error) => {
      console.error("Error updating contact:", error.message);
    });
}


/**
 * Deletes a contact from the backend using the provided primary key (pk).
 * Sends an authenticated DELETE request to the backend API. If the request is successful,
 * a success message is returned. If the request fails, an error message is logged and
 * an exception is thrown.
 * @param {number|string} pk - The primary key of the contact to delete.
 * @returns {Promise<{message: string} | void>} A promise that resolves with a success message or logs an error if the deletion fails.
 */
async function deleteContactBackend(pk) {
  const token = getAuthToken();
  return fetch(STORAGE_URL + "contacts/" + pk + "/", {
    method: "DELETE",
    headers: {"Content-Type": "application/json", Authorization: `Token ${token}`},
  })
    .then(async (res) => {
      if (!res.ok) {
        const responseData = await res.json();
        console.error(
          "Error deleting contact:",
          responseData.detail || "Unknown error"
        );
        throw new Error("Failed to delete contact. Status: " + res.status);
      }
      return { message: "Contact deleted successfully" };
    })
    .catch((error) => {
      console.error("Error deleting contact:", error.message);
    });
}


/**
 * Sends a POST request to register a new user on the server.
 * Converts the `newUser` object to JSON and sends it to the endpoint defined by `STORAGE_URL + "register/"`.
 * If the request is successful, it returns the parsed JSON response.
 * If the request fails or an error occurs, it logs the error and returns `null`.
 * @param {Object} newUser - The user data to be registered.
 * @returns {Promise<Object|null>} A promise that resolves to the server response as a JSON object if successful, or `null` if an error occurs.
 */
async function setRegisterUser(newUser) {
  return fetch(STORAGE_URL + "register/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(`Failed to register user: ${res.status}`);
      }
    })
    .catch((error) => {
      console.error("Error registering user:", error.message);
      return null;
    });
}

/**
 * Gets the value linked to the given key from storage.
 * @param {string} key - The key used for searching..
 * @throws {string} - If data with the given key is not found.
 */
async function getRegisterUser(key) {
  const url = `${STORAGE_URL + "contacts/"}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (res.data) {
        return res.data.value;
      }
      throw `Could not find data with key "${key}".`;
    });
}


/**
 * Asynchronously retrieves a contact value from remote storage using a given key.
 * Sends a GET request to a storage URL with the specified key and token. 
 * If the data is found, returns the associated value. Otherwise, throws an error.
 * @param {string} key - The unique key used to identify the contact in storage.
 * @returns {Promise<*>} A promise that resolves to the value of the contact if found.
 * @throws Will throw an error if no data is found for the given key.
 */
async function getContact(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (res.data) {
        return res.data.value;
      }
      throw `Could not find data with key "${key}".`;
    });
}


/**
 * Sends a new task to the backend for storage.
 * This function sends a POST request to the backend API using the provided task data.
 * If the request is successful, it triggers the saving of the related gallery
 * and clears the local gallery board. If the request fails, an error is logged
 * and `null` is returned.
 * @param {Object} task - The task object to be created and sent to the backend.
 * @returns {Promise<Object|null>} - Returns the created task data from the backend if successful, otherwise `null`.
 */
async function setTask(task) {
  const token = getAuthToken();
  const payload = {
    ...task,
  };
  return fetch(STORAGE_URL + "tasks/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + token,
    },
    body: JSON.stringify(payload),
  })
    .then(async (res) => {
      const data = await res.json();
      if (res.ok) {
        saveGalleryToBackend(data.id);
        deleteGalleryBoard();
        return data;
      } else {
        throw new Error(`Task konnte nicht erstellt werden: ${res.status}`);
      }
    })
    .catch((error) => {
      console.error("Fehler beim Erstellen des Tasks:", error.message);
      return null;
    });
}


/**
 * Sends a PUT request to update an existing task on the server.
 * Uses the provided primary key (`pk`) to identify the task and updates it with the new data from the `task` object.
 * Requires a valid authentication token. If the request is successful, the updated task data is returned.
 * If the request fails, an error is logged to the console.
 * @param {Object} task - The task object containing updated task properties.
 * @param {number|string} pk - The primary key (ID) of the task to be updated.
 * @returns {Promise<Object|undefined>} A promise that resolves to the updated task data, or undefined if an error occurs.
 */
async function setUpdateTask(task, pk) {
  const token = getAuthToken();
  const payload = { ...task };
  return fetch(STORAGE_URL + "tasks/" + pk + "/", {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + token,
    },
  })
    .then(async (res) => {
      const responseData = await res.json();
      if (!res.ok) {
        throw new Error("Failed to update task. Status: " + res.status);
      }
      return responseData;
    })
    .catch((error) => {
      console.error("Error updating task:", error.message);
    });
}


/**
 * Deletes a task from the backend using its primary key (ID).
 * Sends an authenticated DELETE request to the backend API to remove the task.
 * Logs and throws an error if the deletion fails. Uses a token for authorization.
 * @param {number|string} pk - The primary key (ID) of the task to be deleted.
 * @returns {Promise<void>} Resolves when the task is successfully deleted. Errors are logged and thrown on failure.
 */
async function deleteTaskBackend(pk) {
  const token = getAuthToken();
  const response = await fetch(STORAGE_URL + "tasks/" + pk + "/", {
    method: "DELETE",
    headers: new Headers({
      Authorization: "Token " + token,
      "Content-Type": "application/json",
    }),
  })
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.text(); // Fallback auf Text statt JSON
        console.error("Error deleting task:", text);
        throw new Error("Failed to delete task. Status: " + res.status);
      }
      return; // kein res.json()
    })
    .catch((error) => {
      console.error("Error deleting task:", error.message);
    });
}


/**
 * Fetches a list of tasks from the server using a stored authentication token.
 * Sends a GET request to the `tasks/` endpoint with the appropriate authorization header.
 * If the response is successful, the task data is parsed and stored in the global `todos` variable.
 * If the request fails or an error occurs during fetching, an error is logged and thrown.
 * @returns {Promise<Array>} A promise that resolves to an array of task objects.
 * @throws {Error} Throws an error if the request fails or the response is not OK.
 */
async function getTasks() {
  const token = getAuthToken();
  const response = await fetch(STORAGE_URL + "tasks/", {
    method: "GET",
    headers: new Headers({
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    }),
  });
  try {
    if (response.ok) {
      const data = await response.json();
      todos = data;
      return todos;
    } else {
      throw new Error(
        "Failed to fetch tasks. Server responded with status: " +
          response.status
      );
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Could not fetch tasks.");
  }
}


/**
 * Deletes the gallery board by removing all stored images from localStorage.
 */
function deleteGalleryBoard() {
  localStorage.removeItem("allImages");
}


/**
 * Saves the authentication token to localStorage and updates the in-memory `STORAGE_TOKEN`.
 */
function saveAuthToken(token) {
  localStorage.setItem("authToken", token);
  STORAGE_TOKEN = token;
}


/**
 * Retrieves the authentication token from memory or from localStorage if not already cached.
 */
function getAuthToken() {
  return STORAGE_TOKEN || localStorage.getItem("authToken");
}


/**
 * Removes the authentication token from both memory and localStorage.
 */
function removeAuthToken() {
  localStorage.removeItem("authToken");
  STORAGE_TOKEN = null;
}


/**
 * Retrieves the user's contact data from localStorage and parses it as JSON.
 */
function getContactData() {
  return JSON.parse(localStorage.getItem("userContact"));
}

let categories = [
  {
    categoryName: "User Story",
    categoryColor: "#FF7A00",
  },
  {
    categoryName: "Technical Task",
    categoryColor: "#0038FF",
  },
];