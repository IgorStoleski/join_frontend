const filepickerBoard = document.getElementById("filepickerBoard");
const errorBoard = document.getElementById("errorBoard");
const buttonsBoard = document.querySelectorAll(".addTaskViewerButton");
let myGallery;


/**
 * Initializes an event listener for the file upload element "filepickerBoard".
 * When selecting files, the system checks whether they are images.
 * Invalid files are displayed with an error message in the “errorBoard”.
 * Valid images are compressed, saved in Base64 format and uploaded to a gallery.
 * Prerequisites: The function `compressImage`, as well as the functions `saveGalleryBoard`, 
 * `renderGalleryBoard` and `loadGalleryBoard` must be available. 
 * In addition, the global variable `allImages` is accessed.
 * @function
 */
function aktiviereFilePickerListener() {
  const filepickerBoard = document.getElementById("filepickerBoard");
  const errorBoard = document.getElementById("errorBoard");

  if (!filepickerBoard || !errorBoard) {
    console.warn("Dateiupload-Elemente nicht gefunden!");
    return;
  }

  filepickerBoard.addEventListener("change", async () => {
    errorBoard.style.display = "none";
    errorBoard.textContent = "";

    const files = filepickerBoard.files;
    if (files.length > 0) {
      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          errorBoard.textContent = `Die Datei "${file.name}" ist kein gültiges Bild.`;
          errorBoard.style.display = "block";
          return;
        }

        const compressedBase64 = await compressImage(file, 800, 800, 0.7);

        allImages.push({
          filename: file.name,
          fileType: file.type,
          base64: compressedBase64,
        });

        saveGalleryBoard();
        renderGalleryBoard();
        loadGalleryBoard();
      }
    }
  });
}


/**
 * Saves the current gallery board to localStorage.
 * Converts the `allImages` array into a JSON string and stores it
 * under the key "allImages" in the browser's localStorage.
 * This allows the gallery state to persist across page reloads.
 */
function saveGalleryBoard() {
  let arrayAsString = JSON.stringify(allImages);
  localStorage.setItem("allImages", arrayAsString);
}


/**
 * Deletes the gallery board from local storage.
 * This function removes the "allImages" key from local storage,
 */
function deleteGalleryBoard() {
  localStorage.removeItem("allImages");
}


/**
 * Loads the image gallery board from local storage.
 * Retrieves a JSON string of all stored images from local storage,
 * parses it into the `allImages` array, and renders the gallery board.
 * If no images are found in local storage, the function does nothing.
 */
function loadGalleryBoard() {
  let arrayAsString = localStorage.getItem("allImages");
  if (arrayAsString) {
    allImages = JSON.parse(arrayAsString);
    renderGalleryBoard();
  }
}


/**
 * Renders the gallery board by clearing its current content and appending all images.
 * This function retrieves the DOM element with the ID "galleryBoard". If the element
 * is found, it clears its contents and iterates through the `allImages` array,
 * creating and appending a new image element for each image using the `createImageElement` function.
 * If the "galleryBoard" element is not found, a warning is logged to the console.
 */
function renderGalleryBoard() {
  const galleryBoard = document.getElementById("galleryBoard");
  if (!galleryBoard) {
    console.warn("galleryBoard nicht gefunden!");
    return;
  }

  galleryBoard.innerHTML = "";
  allImages.forEach((image, index) => {
    const imageElement = createImageElement(image, index);
    galleryBoard.appendChild(imageElement);
  });
}


/**
 * Creates a wrapper element for an image with a trashcan button
 * @param {Object} image - The image object from allImages
 * @param {number} index - The index of the image in the array
 * @returns {HTMLElement} - The created image wrapper element
 */
function createImageElement(image, index) {
  // Äußere Card-Box
  const card = document.createElement("div");
  card.classList.add("image-card-base");
  card.classList.add("image-card-small"); 

  // Wrapper für Bild + Button
  const wrapper = document.createElement("div");
  wrapper.style.position = "relative";
  wrapper.style.display = "inline-block";
  wrapper.style.margin = "10px";
  wrapper.style.textAlign = "center";

  const img = document.createElement("img");
  img.src = image.base64;

  const deleteButton = createDeleteButton(index);

  wrapper.appendChild(img);
  wrapper.appendChild(deleteButton);
  new Viewer(img);

  card.appendChild(wrapper);
  return card;
}

/**
 * Creates a trashcan button that can delete an image
 * @param {number} index - The index of the image in the array
 * @returns {HTMLElement} - The created button
 */
function createDeleteButton(index) {
  const button = document.createElement("button");
  button.classList.add("delete-button");

  button.addEventListener("click", () => deleteImageBoard(index));

  return button;
}

/**
 * Deletes an image from the array and updates the display
 * @param {number} index - The index of the image to be deleted
 */
function deleteImageBoard(index) {
  allImages.splice(index, 1);
  saveGalleryBoard();
  loadGalleryBoard();
}


/**
 * Converts a blob object into a Base64-encoded string.
 * @param {Blob} blob - The blob object to be converted.
 * @returns {Promise<string | ArrayBuffer | null>} A Promise that is resolved,
 * as soon as the conversion is complete. The result is a Base64-encoded
 * Data URL as a string or null if an error occurs.
 */
function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

/**
 * Compresses an image to a target size or quality.
 * @param {File} file - The image file to be compressed.
 * @param {number} maxWidth - The maximum width of the output image.
 * @param {number} maxHeight - The maximum height of the output image.
 * @param {number} quality - Compression quality (between 0 and 1).
 * @returns {Promise<string>} - A promise that resolves to the base64 string of the compressed image.
 */
function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Berechnung der neuen Größe, um die Proportionen beizubehalten
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          } else {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Zeichne das Bild in das Canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Exportiere das Bild als Base64
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };

      img.onerror = () => reject("Fehler beim Laden des Bildes.");
      img.src = event.target.result;
    };

    reader.onerror = () => reject("Fehler beim Lesen der Datei.");
    reader.readAsDataURL(file);
  });
}
