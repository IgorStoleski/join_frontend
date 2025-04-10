const filepickerBoard = document.getElementById("filepickerBoard");
/* const galleryBoard = document.getElementById("galleryBoard"); */
const errorBoard = document.getElementById("errorBoard");
const buttonsBoard = document.querySelectorAll(".addTaskViewerButton");
let myGallery;


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

function saveGalleryBoard() {
  let arrayAsString = JSON.stringify(allImages);
  localStorage.setItem("allImages", arrayAsString);
}

function loadGalleryBoard() {
  let arrayAsString = localStorage.getItem("allImages");
  if (arrayAsString) {
    allImages = JSON.parse(arrayAsString);
    renderGalleryBoard();
  }
}

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
 * Erstellt ein Wrapper-Element für ein Bild mit einem Mülleimer-Button
 * @param {Object} image - Das Bildobjekt aus allImages
 * @param {number} index - Der Index des Bildes im Array
 * @returns {HTMLElement} - Das erstellte Bild-Wrapper-Element
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
 * Erstellt einen Mülleimer-Button, der ein Bild löschen kann
 * @param {number} index - Der Index des Bildes im Array
 * @returns {HTMLElement} - Der erstellte Button
 */
function createDeleteButton(index) {
  const button = document.createElement("button");
  button.classList.add("delete-button");

  button.addEventListener("click", () => deleteImageBoard(index));

  return button;
}

/**
 * Löscht ein Bild aus dem Array und aktualisiert die Anzeige
 * @param {number} index - Der Index des zu löschenden Bildes
 */
function deleteImageBoard(index) {
  allImages.splice(index, 1);
  saveGalleryBoard();
  loadGalleryBoard();
}

function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

/**
 * Komprimiert ein Bild auf eine Zielgröße oder -qualität
 * @param {File} file - Die Bilddatei, die komprimiert werden soll
 * @param {number} maxWidth - Die maximale Breite des Bildes
 * @param {number} maxHeight - Die maximale Höhe des Bildes
 * @param {number} quality - Qualität des komprimierten Bildes (zwischen 0 und 1)
 * @returns {Promise<string>} - Base64-String des komprimierten Bildes
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
