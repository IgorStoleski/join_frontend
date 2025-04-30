

function showError(inp, msg) {
  inp.classList.add("invalid");
  document.getElementById(`error-${inp.id}`).textContent = msg;
}

function clearError(inp) {
    inp.classList.remove("invalid");
    const errEl = document.getElementById(`error-${inp.id}`);
    if (errEl) {
      errEl.textContent = "";
    }
  }

// ========== Validatoren ==========
function isValidName(name) {
  return /^[A-Za-zÄÖÜäöüß]+$/.test(name.trim());
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validatePasswordMatch(pw, cpw) {
  return pw === cpw;
}

// Dummy: ersetze durch Deine Logik
function isEmailAlreadyRegistered(email) {
  return false;
}



// ========== Input-Listener ==========
["username", "usersurname", "email", "password", "confirmPassword"].forEach(
  (id) => {
    document
      .getElementById(id)
      .addEventListener("input", (e) => clearError(e.target));
  }
);

// ========== Feld-Validierung ==========
function validateFields() {
  ["username", "usersurname", "email", "password", "confirmPassword"].forEach(
    (id) => clearError(document.getElementById(id))
  );
  let ok = true;
  const u = document.getElementById("username"),
    s = document.getElementById("usersurname"),
    e = document.getElementById("email"),
    pw = document.getElementById("password"),
    cpw = document.getElementById("confirmPassword");

  if (!isValidName(u.value)) {
    showError(u, "Nur Buchstaben erlaubt");
    ok = false;
  }
  if (!isValidName(s.value)) {
    showError(s, "Nur Buchstaben erlaubt");
    ok = false;
  }
  if (!isValidEmail(e.value)) {
    showError(e, "Ungültige E-Mail");
    ok = false;
  }
  if (pw.value.length < 4) {
    showError(pw, "Mind. 4 Zeichen");
    ok = false;
  }
  if (!validatePasswordMatch(pw.value, cpw.value)) {
    showError(cpw, "Passwörter stimmen nicht überein");
    ok = false;
  }
  return ok;
}

// ========== Einmal-Check E-Mail ==========
function validateEmailUnique() {
  const e = document.getElementById("email");
  clearError(e);
  if (isEmailAlreadyRegistered(e.value)) {
    showError(e, "E-Mail bereits registriert");
    return false;
  }
  return true;
}

// ========== Privacy-Validierung ==========
function validatePrivacy() {
  const msg = document.getElementById("error-privacy");
  msg.textContent = "";
  if (!isPrivacyChecked) {
    msg.textContent = "Bitte Privacy Policy akzeptieren";
    return false;
  }
  return true;
}

/* // ========== Form-Submit ==========
document.getElementById("signUpForm").addEventListener("submit", function (e) {
  e.preventDefault();
  if (!validateFields() || !validateEmailUnique() || !validatePrivacy()) return;

  const username = document.getElementById("username").value.trim(),
    usersurname = document.getElementById("usersurname").value.trim(),
    emailValue = document.getElementById("email").value.trim(),
    password = document.getElementById("password").value;

  let newContact = createNewContact(
    username,
    usersurname,
    emailValue,
    password
  );
  registerContact(newContact);
}); */


document.addEventListener('DOMContentLoaded', () => {
    // Inputs & Error-Container holen
    const fields = ['username','usersurname','email','password','confirmPassword'];
    fields.forEach(id => {
      const inp = document.getElementById(id);
      if (!inp) return;
      inp.addEventListener('input', () => clearError(inp));
    });
  
    // Privacy-Check
    const privacyCheck = document.getElementById('privacyCheck');
    if (privacyCheck) {
      privacyCheck.addEventListener('click', () => {
        isPrivacyChecked = !isPrivacyChecked;
        document.getElementById('error-privacy').textContent = '';
      });
    }
  
    // Form-Submit
    const form = document.getElementById('signUpForm');
    form?.addEventListener('submit', e => {
      e.preventDefault();
      if (!validateFields() || !validateEmailUnique() || !validatePrivacy()) return;
      registerContact(createNewContact(
        document.getElementById('username').value.trim(),
        document.getElementById('usersurname').value.trim(),
        document.getElementById('email').value.trim(),
        document.getElementById('password').value
      ));
    });
  });