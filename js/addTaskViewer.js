const filepicker = document.getElementById("filepicker");
const gallery = document.getElementById("gallery");
const error = document.getElementById("error");
let myGallery;


/**
 * Event listener for changing the file input.
 * - Hides a possible error message.
 * - Checks whether selected files are valid images.
 * - Compresses valid images asynchronously with `compressImage`.
 * Saves the compressed images in an array (`allImages`) including file name, type and Base64 data.
 * Then updates the gallery display by calling `renderGallery`.
 * Displays an error message if one or more files are not an image.
 * @listens change
 */
filepicker.addEventListener("change", async () => {
  error.style.display = "none";
  error.textContent = "";

  const files = filepicker.files;
  if (files.length > 0) {
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        error.textContent = `Die Datei "${file.name}" ist kein gültiges Bild.`;
        error.style.display = "block";
        return;
      }

      const compressedBase64 = await compressImage(file, 800, 800, 0.7);

      allImages.push({
        filename: file.name,
        fileType: file.type,
        base64: compressedBase64,
      });

      renderGallery();
    }
  }
});


/**
 * Renders the gallery by emptying the existing content and
 * Creates and adds a new image element for each image in `allImages`.
 * Uses the `createImageElement` function to create HTML elements for each image.
 * Adds these to the gallery container `gallery`.
 */
function renderGallery() {
  gallery.innerHTML = "";
  allImages.forEach((image, index) => {
    const imageElement = createImageElement(image, index);
    gallery.appendChild(imageElement);
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
  card.classList.add("image-card");

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

  button.addEventListener("click", () => deleteImage(index, globalIsEditMode));

  return button;
}

/**
 * Deletes an image from the array and updates the display
 * @param {number} index - The index of the image to be deleted
 */
function deleteImage(index, isEditMode = null) {
  const effectiveEditMode = isEditMode !== null ? isEditMode : globalIsEditMode;
  const image = allImages[index];

  if (effectiveEditMode && image.isRemote && image.id) {
    deleteSingleImageFromBackend(currentSelectedTask.id, image.id);
  }

  allImages.splice(index, 1);

  if (effectiveEditMode) {
    loadEditPreview();
  } else {
    saveGallery();
    loadGallery();
  }
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
 * Compresses an image to a target size or quality
 * @param {File} file - The image file to be compressed
 * @param {number} maxWidth - The maximum width of the image
 * @param {number} maxHeight - The maximum height of the image
 * @param {number} quality - Quality of the compressed image (between 0 and 1)
 * @returns {Promise<string>} - Base64 string of the compressed image
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


/**
 * Resets the file picker and clears the selected images.
 * This function clears the `allImages` array, resets the file input value,
 * and clears the preview container in the DOM.
 */
function resetFilePicker() {
  allImages = [];
  const fileInput = document.getElementById('filepicker');
  if (fileInput) {
    fileInput.value = '';
  }
  const previewContainer = document.getElementById('gallery');
  if (previewContainer) {
    previewContainer.innerHTML = '';
  }
}