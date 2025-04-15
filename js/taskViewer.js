/**
 * Renders a preview of all images inside the HTML element with the ID "preview".
 * Clears any existing content in the preview container and appends new image elements
 * created from the global `allImages` array. If the preview element is not found,
 * a warning is logged and the function exits.
 */
function renderPreview() {
  const preview = document.getElementById("preview");
  if (!preview) {
    console.warn("Preview-Element nicht gefunden!");
    return;
  }

  preview.innerHTML = "";
  allImages.forEach((image, index) => {
    const imageElement = createPreviewElement(image, index);
    preview.appendChild(imageElement);
  });
}

/**
 * Creates a wrapper element for an image with a trashcan button
 * @param {Object} image - The image object from allImages
 * @param {number} index - The index of the image in the array
 * @returns {HTMLElement} - The created image wrapper element
 */
function createPreviewElement(image, index) {
  // Äußere Card-Box
  const card = document.createElement("div");
  card.classList.add("image-card-base");
  card.classList.add("image-card-preview");

  // Wrapper für Bild + Button
  const wrapper = document.createElement("div");
  wrapper.style.position = "relative";
  wrapper.style.display = "inline-block";
  wrapper.style.margin = "10px";
  wrapper.style.textAlign = "center";

  const img = document.createElement("img");
  img.src = image.base64;

  wrapper.appendChild(img);
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

  button.addEventListener("click", () => deleteImage(index, ));

  return button;
}


/**
 * Saves the current image gallery in the local memory.
 * The gallery is saved as a JSON string under the key “allImages”.
 */
function saveGallery() {
  let arrayAsString = JSON.stringify(allImages);
  localStorage.setItem("allImages", arrayAsString);
}


function deleteGalleryBoard() {
  localStorage.removeItem("allImages");
}

/**
 * Loads the image gallery from the local memory.
 * If the parameter `isEditMode` is true, an edit preview is rendered,
 * otherwise the gallery is displayed.
 * @param {boolean} [isEditMode=false] - Specifies whether the edit mode is activated.
 */
function loadGallery(isEditMode = false) {
  let arrayAsString = localStorage.getItem("allImages");
  if (arrayAsString) {
    allImages = JSON.parse(arrayAsString);
    if (isEditMode) {
      renderEditPreview();      
    } else {
      renderGallery();  
    }
  }
}


/**
 * Renders the image gallery in the DOM.
 * Creates a DOM element for each image and adds it to the gallery.
 */
function renderGallery() {
  gallery.innerHTML = '';
  allImages.forEach((image, index) => {
      const imageElement = createImageElement(image, index);
      gallery.appendChild(imageElement);
  });
}


/**
 * Deletes an image from the array and updates the display
 * @param {number} index - The index of the image to be deleted
 */
function deleteImage(index, isEditMode = null) {
  const effectiveEditMode = isEditMode !== null ? isEditMode : globalIsEditMode;
  const image = allImages[index];

  // Vor dem Entfernen Backend-DELETE aufrufen
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
 * Loads the preview view in edit mode.
 * This function calls `renderEditPreview` to display the edit preview.
 */
function loadEditPreview() {
  renderEditPreview();
}


/**
 * Renders the preview of the editable images in the HTML element with the ID "edit-preview".
 * The function first empties the preview element and then adds a new image element for each image 
 * from the global array `allImages`. 
 * If the preview element is not found, a warning is displayed in the console.
 */
function renderEditPreview() {
  const editPreview = document.getElementById("edit-preview");
  if (!editPreview) {
    console.warn("editPreview nicht gefunden!");
    return;
  }

  editPreview.innerHTML = "";
  allImages.forEach((image, index) => {
    const imageElement = createImageElement(image, index);
    editPreview.appendChild(imageElement);
  });
}


/**
 * Initializes an event listener for the file input field with the ID "editfilepicker".
 * When a file is selected, it is checked whether it is an image.
 * Non-image files generate an error message in the element with the ID “edit-error”.
 * Valid image files are compressed (max. 800x800px, quality 0.7) and saved as a Base64 string.
 * The images are then added to the `allImages` list and the gallery is saved and reloaded.
 */
function aktiviereEditFilePickerListener() {
  const editfilepicker = document.getElementById("editfilepicker");
  const editerror = document.getElementById("edit-error");

  editfilepicker.addEventListener("change", async () => {
    editerror.style.display = "none";
    editerror.textContent = "";

    const files = editfilepicker.files;
    if (files.length > 0) {
      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          editerror.textContent = `Die Datei "${file.name}" ist kein gültiges Bild.`;
          editerror.style.display = "block";
          return;
        }

        const compressedBase64 = await compressImage(file, 800, 800, 0.7);

        allImages.push({
          filename: file.name,
          fileType: file.type,
          base64: compressedBase64,
        });

        saveGallery();
        loadGallery(true);
      }
    }
  });
}