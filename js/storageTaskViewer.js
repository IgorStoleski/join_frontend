let globalIsEditMode = false;

/**
 * Lädt alle gültigen Bilder der Galerie zum Backend hoch, sofern eine gültige Task-ID übergeben wurde.
 * Bilder, die übersprungen werden sollen, werden ignoriert.
 * Jedes Bild wird vor dem Upload von Base64 in eine File-Instanz umgewandelt.
 *
 * @async
 * @function
 * @param {string} taskId - Die eindeutige ID der Aufgabe, mit der die Bilder verknüpft werden sollen.
 * @returns {Promise<void>} - Gibt nichts zurück. Bricht den Vorgang ab, wenn keine Task-ID vorhanden ist.
 */
async function saveGalleryToBackend(taskId) {
  if (!taskId) {
    console.warn("Keine gültige Task-ID übergeben – Upload abgebrochen.");
    return;
  }

  for (const image of allImages) {
    if (shouldSkipImage(image)) continue;

    const file = dataURLtoFile(image.base64, image.filename);
    if (!file) {
      console.warn("Fehler beim Konvertieren von Bild:", image.filename);
      continue;
    }

    await uploadImage(file, image, taskId);
  }
}


/**
 * Überprüft, ob ein Bild übersprungen werden sollte.
 * 
 * Ein Bild wird übersprungen, wenn es als remote gekennzeichnet ist (`isRemote`)
 * und seine `base64`-Eigenschaft nicht mit "data:" beginnt, was darauf hinweist,
 * dass es sich nicht um ein lokal neu hochgeladenes Bild handelt.
 *
 * @param {Object} image - Das Bildobjekt, das geprüft werden soll.
 * @param {boolean} image.isRemote - Gibt an, ob das Bild remote gespeichert ist.
 * @param {string} image.base64 - Der base64-codierte String des Bildes.
 * @returns {boolean} Gibt `true` zurück, wenn das Bild übersprungen werden soll, andernfalls `false`.
 */
function shouldSkipImage(image) {
  const isRemoteAndUnchanged =
    image.isRemote && !image.base64.startsWith("data:");
  if (isRemoteAndUnchanged) {
    return true;
  }
  return false;
}


/**
 * Lädt ein Bild für eine bestimmte Aufgabe hoch oder aktualisiert es.
 *
 * @async
 * @function
 * @param {File} file - Das Bild, das hochgeladen werden soll.
 * @param {Object} image - Ein Objekt mit Informationen zum Bild.
 * @param {boolean} image.isRemote - Gibt an, ob das Bild bereits auf dem Server existiert.
 * @param {string} [image.id] - Die ID des Bildes auf dem Server (nur bei Updates erforderlich).
 * @param {string} image.filename - Der Dateiname des Bildes (für Logging-Zwecke).
 * @param {string|number} taskId - Die ID der Aufgabe, zu der das Bild gehört.
 * @returns {Promise<void>} - Ein Promise, das abgeschlossen wird, wenn der Upload beendet ist.
 */
async function uploadImage(file, image, taskId) {
  const isUpdate = image.isRemote && image.id;
  const url = isUpdate
    ? `${STORAGE_URL}tasks/${taskId}/upload-image/${image.id}/`
    : `${STORAGE_URL}tasks/${taskId}/upload-image/`;

  const method = isUpdate ? "PUT" : "POST";

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(url, {
    method: method,
    body: formData,
  });

  if (!response.ok) {
    console.error(`${method} fehlgeschlagen für ${image.filename}`);
  }
}


/**
 * Konvertiert eine DataURL (Base64-codierter String) in ein File-Objekt. *
 * @param {string} dataurl - Die DataURL im Format `data:[<mediatype>][;base64],<data>`.
 * @param {string} filename - Der gewünschte Dateiname für das erzeugte File-Objekt.
 * @returns {File|null} Ein File-Objekt, das die dekodierten Daten enthält, oder `null`, falls die DataURL ungültig ist.
 */
function dataURLtoFile(dataurl, filename) {
  if (!dataurl || !dataurl.includes(",")) {
    console.warn("Ungültiger DataURL-Wert:", dataurl);
    return null;
  }

  const arr = dataurl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch || !arr[1]) {
    console.warn("Ungültiges Base64-Format:", dataurl);
    return null;
  }

  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  const u8arr = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  return new File([u8arr], filename, { type: mime });
}


/**
 * Lädt die Vorschau-Bilder eines bestimmten Tasks vom Server und bereitet sie zur Anzeige vor.
 * @async
 * @function loadPreview
 * @param {number|string} taskId - Die ID des Tasks, dessen Bilder geladen werden sollen.
 * @returns {Promise<void>} - Diese Funktion gibt kein Ergebnis zurück, führt jedoch ein Rendering der Vorschau durch.
 * @throws {Error} Wenn die Anfrage an den Server fehlschlägt oder keine gültige Antwort zurückgegeben wird.
 */
async function loadPreview(taskId) {
  try {
      const response = await fetch(`${STORAGE_URL}tasks/${taskId}/`);
      if (!response.ok) throw new Error('Task konnte nicht geladen werden');

      const task = await response.json();

      allImages = task.images.map(img => ({
          id: img.id,
          filename: img.image.split('/').pop(),
          base64: img.image, // hier ist es eine URL!
          fileType: 'image/jpeg',
          isRemote: true
      }));

      renderPreview();
  } catch (error) {
      console.error('Fehler beim Laden der Galerie:', error.message);
  }
}


/**
 * Lädt die Bildvorschau eines Tasks vom Backend und rendert sie. *
 * @async
 * @function
 * @param {number|string} taskId - Die ID des Tasks, dessen Bilder geladen werden sollen.
 * @param {boolean} [isEditMode=false] - Gibt an, ob sich die Seite im Bearbeitungsmodus befindet.
 * @returns {Promise<void>} - Verspricht keinen Rückgabewert, da das Ergebnis direkt gerendert wird.
 */
async function loadPreviewFromBackend(taskId, isEditMode = false) {
  try {
    const response = await fetch(`${STORAGE_URL}tasks/${taskId}/images/`);
    if (!response.ok) throw new Error("Task konnte nicht geladen werden");

    const images = await response.json();
    allImages = images.map((img) => ({
      id: img.id,
      filename: img.image.split("/").pop(),
      base64: `${STORAGE_URL}${img.image}`,
      fileType: "image/jpeg",
      isRemote: true,
    }));

    if (isEditMode) {
      loadEditPreview();
    } else {
      renderPreview();
    }
  } catch (error) {
    console.error("Fehler beim Laden der Galerie:", error.message);
  }
}


/**
 * Löscht ein Bild, das mit einer bestimmten Task-ID im Backend verknüpft ist.
 * Sendet eine DELETE-Anfrage an den Server, um das Bild zu entfernen, das 
 * der angegebenen `taskId` zugeordnet ist. Gibt bei Fehlern eine entsprechende
 * Fehlermeldung in der Konsole aus. *
 * @async
 * @function
 * @param {string|number} taskId - Die ID der Aufgabe, deren Bild gelöscht werden soll.
 * @returns {Promise<void>} - Gibt keinen Rückgabewert zurück, behandelt jedoch Fehler intern.
 */
async function deleteImageFromBackend(taskId) {
  try {
    const response = await fetch(`${STORAGE_URL}tasks/${taskId}/images/`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Bild konnte nicht gelöscht werden");
  } catch (error) {
    console.error("Fehler beim Löschen des Bildes:", error.message);
  }
}


/**
 * Löscht ein einzelnes Bild aus dem Backend, das einem bestimmten Task zugeordnet ist.
 * @async
 * @function
 * @param {string} taskId - Die ID des Tasks, dem das Bild zugeordnet ist.
 * @param {string} imageId - Die ID des zu löschenden Bildes.
 * @returns {Promise<void>} - Gibt nichts zurück, loggt aber Erfolg oder Fehler in der Konsole.
 * @throws {Error} Wenn die Anfrage fehlschlägt oder das Bild nicht gelöscht werden konnte.
 */
async function deleteSingleImageFromBackend(taskId, imageId) {
  try {
    const response = await fetch(
      `${STORAGE_URL}tasks/${taskId}/images/${imageId}/`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) throw new Error("Bild konnte nicht gelöscht werden");
    console.log("Bild erfolgreich im Backend gelöscht:", imageId);
  } catch (error) {
    console.error("Fehler beim Löschen des Bildes:", error.message);
  }
}


/**
 * Lädt ein Bild für eine bestimmte Aufgabe hoch.
 * @async
 * @function
 * @param {string|number} taskId - Die ID der Aufgabe, zu der das Bild hochgeladen werden soll.
 * @param {File} file - Die Bilddatei, die hochgeladen werden soll.
 * @returns {Promise<void>} - Gibt nichts zurück, aber loggt das Ergebnis in die Konsole.
 */
async function uploadImageToTask(taskId, file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${STORAGE_URL}tasks/${taskId}/upload-image/`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) {
    console.error("Fehler beim Hochladen:", result);
  } else {
    console.log("Bild erfolgreich hochgeladen:", result);
  }
}
