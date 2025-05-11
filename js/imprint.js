document.addEventListener("DOMContentLoaded", function () {
  const imprintLinks = document.querySelectorAll(".nav-link-imprint");

  // Setzt die aktive Klasse basierend auf der aktuellen URL
  imprintLinks.forEach(link => {
      if (window.location.pathname.endsWith(link.getAttribute("href"))) {
          link.classList.add("active");
      }

      // Listener zum Wechseln der aktiven Klasse beim Klicken
      link.addEventListener("click", function () {
          imprintLinks.forEach(l => l.classList.remove("active")); // alle entfernen
          this.classList.add("active"); // aktuelle aktivieren
      });
  });
});