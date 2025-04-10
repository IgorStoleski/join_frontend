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

async function loadAllContacts() {
  const authToken = getAuthToken();
  if (!authToken) {
    return;
  }

  const response = await fetch(STORAGE_URL + "contacts/", {
    method: "GET",
    headers: new Headers({
      Authorization: `Token ${authToken}`,
      "Content-Type": "application/json",
    }),
  });

  try {
    if (response.ok) {
      const data = await response.json();
      contacts = data;
      return contacts;
    } else {
      throw new Error(
        "Failed to load contacts. Server responded with status: " +
          response.status
      );
    }
  } catch (e) {
    console.error("Loading error:", e.message);
  }
}

async function setContact(contact) {
  const token = getAuthToken();
  const payload = {
    ...contact,
  };
  return fetch(STORAGE_URL + "contacts/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
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
      console.error("Error creating contact:", error.message);
      return null;
    });
}

async function setUpdateContact(contact, pk) {
  const token = getAuthToken();
  const payload = { ...contact };
  return fetch(STORAGE_URL + "contacts/" + pk + "/", {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  })
    .then(async (res) => {
      const responseData = await res.json();
      if (!res.ok) {
        console.error(
          "Error updating contact:",
          responseData.detail || "Unknown error"
        );
        throw new Error("Failed to update contact. Status: " + res.status);
      }
      return responseData;
    })
    .catch((error) => {
      console.error("Error updating contact:", error.message);
    });
}

async function deleteContactBackend(pk) {
  const token = getAuthToken();
  return fetch(STORAGE_URL + "contacts/" + pk + "/", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
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

function saveAuthToken(token) {
  localStorage.setItem("authToken", token);
  STORAGE_TOKEN = token;
}

function getAuthToken() {
  return STORAGE_TOKEN || localStorage.getItem("authToken");
}

function removeAuthToken() {
  localStorage.removeItem("authToken");
  STORAGE_TOKEN = null;
}

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
