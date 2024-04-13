const STORAGE_TOKEN = TOKEN;
const STORAGE_URL = BACKEND_URL;


/**
 * Sets an item using a key-value pair in the storage.
 * @param {string} key - The key for the item.
 * @param {*} value - The value to be stored.
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}


/**
 * Gets the value linked to the given key from storage.
 * @param {string} key - The key used for searching..
 * @throws {string} - If data with the given key is not found.
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) {
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}

let selectedPriority = '';
let selectedCategory = '';
let selectedStatus = '';
let selectedContacts = [];
let subtasks = [];
let subtaskIdCounter = 0;
let contacts = [];
let todos = [];


let categories = [
    {
        categoryName: "User Story",
        categoryColor: "#FF7A00"
    },
    {
        categoryName: "Technical Task",
        categoryColor: "#0038FF"
    },
];