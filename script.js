let isValidUsername, isValidPassword, isConfirmed;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}

fillHeader();
loginContainer();
fillFooter();

// Content functions //

/**
 * Fills in the header dynamically.
 * @param {string} name The Username to display
 */
function fillHeader(name) {
  const header = document.querySelector("header");
  header.innerHTML = `
    <div class="header-content">
      <img src="./icons/icon.svg" class="icon" alt="StegaNotes Icon">
      <img src="./icons/name.svg" class="name" alt="StegaNotes Name">
    </div>
  `;

  if (name !== undefined) {
    header.innerHTML = `
      <div class="header-content">
        <img src="" class="userTitle" style="" alt="User's Name">
      </div>
    `;
    createPNG(name);
  }
}

/**
 * Fills the content section dynamically with the login page.
 */
function loginContainer() {
  const container = document.querySelector(".page");
  container.innerHTML = `
    <div class="container">
      <label for="username" id="username-label">Username</label>
      <input type="text" class="username" name="username" title="If the username is invalid, nothing will happen." placeholder="type here" required>

      <label for="password" id="password-label">Password</label>
      <input type="password" class="password" name="password" title="If the password is invalid, nothing will happen." placeholder="type here" required>

      <div class="button-group">
        <button type="submit" class="login-button">Login</button>
        <button type="submit" class="register-button">Register</button>
      </div>
    </div>
  `;

  const loginButton = document.querySelector(".login-button");
  loginButton.addEventListener("click", function (event) {
    event.preventDefault();
    login();
  });

  const registerButton = document.querySelector(".register-button");
  registerButton.addEventListener("click", registerContainer);
}

/**
 * Dynamically fill the content section with the register form.
 */
function registerContainer() {
  const footer = document.querySelector("footer");
  footer.classList.remove('footer');
  footer.innerHTML = "";
  footer.style.display = "none";

  const container = document.querySelector(".page");
  container.innerHTML = `
    <div class="container">
      <label for="username" id="username-label">New Username</label>
      <input type="text" class="username" name="username" pattern="^.*(?=.{4,8}).*$" title="The username must be 4 to 8 characters long." placeholder="min: 4, max: 8" required>

      <label for="password" id="password-label">New Password</label>
      <input type="password" class="password" name="password" pattern="^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?:{}|<>]).*$" title="The password must be at least 8 characters long, have at least 1 of each case letter, a number and a special character." placeholder="A-Z, a-z, 0-9, symbol" required>

      <label for="password" id="confirm-label">Confirm Password</label>
      <input type="password" class="confirm" name="confirm" placeholder="1x each, min. 8 chars" required>

      <div class="button-group">
        <button type="submit" class="register-button">Register</button>
        <button type="submit" class="cancel-button">Cancel</button>
      </div>
    </div>
  `;

  const usernameInput = document.querySelector(".username");
  usernameInput.addEventListener("keyup", validateUsername);

  const passwordInput = document.querySelector(".password");
  passwordInput.addEventListener("keyup", validatePassword);
  passwordInput.addEventListener("keyup", validateConfirm);

  const confirmInput = document.querySelector(".confirm");
  confirmInput.addEventListener("keyup", validateConfirm);

  const registerButton = document.querySelector(".register-button");
  registerButton.addEventListener("click", registerUser);

  const cancelButton = document.querySelector(".cancel-button");
  cancelButton.addEventListener("click", function () {
    fillHeader();
    loginContainer();
    fillFooter();
  });
}

/**
 * Dynamically fill the content section with notes.
 */
function fillNotes() {
  // TODO: add notes
  
  closeNew();
}

function fillFooter(name) {
  const footer = document.querySelector("footer");
  footer.classList.add('footer');
  footer.style.display = "block"
  footer.innerHTML = `
  <div class="footer-content">
    <a href="https://github.com/n-c0de-r/StegaNotes">
      <span style="color: var(--mainGreen);">n-c0de-r @ </span>
      <span style="color: var(--mainRed);">GitHub 2023</span>
    </a>
	</div>
  `;

  if (name !== undefined) {
    footer.innerHTML = ``;
  }
}

function createPNG(name) {
  const svg = createSVG(name);
  const url = serializeSVG(svg);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();

  img.onload = function () {
    canvas.width = (900 + (name.length - 4) * 100);
    canvas.height = 210;
    ctx.drawImage(img, 0, 0);
    const pngDataURL = canvas.toDataURL("image/png");
    const userTitle = document.querySelector(".userTitle");
    userTitle.src = pngDataURL;
    canvas.remove();
  };

  img.src = url;
}

/**
 * Creates a SVG from a given name.
 * @param {string} name The username to turn to a SVG
 * @returns A SVG holding the users name
 */
function createSVG(name) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const textWidth = (900 + (name.length - 4) * 100);
  svg.setAttribute("width", `${textWidth}`);
  svg.setAttribute("height", "210");
  svg.setAttribute("viewBox", `0 0 ${textWidth} 210`);

  const text = createText(`${name}`);
  svg.appendChild(text);

  return svg;
}

/**
 * Creates a text element to nest inside a SVG.
 * @param {string} content Text to make an SVG from
 * @returns The text as an SVG element
 */
function createText(content) {
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", "50%");
  text.setAttribute("y", "50%");
  text.setAttribute("dominant-baseline", "middle");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("font-family", "OpenDyslexic3");
  text.setAttribute("font-size", "100");
  text.setAttribute("stroke-width", "5");
  text.setAttribute("stroke", "#000000");
  text.setAttribute("xml:space", "preserve");

  const tspan1 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
  tspan1.setAttribute("fill", "#6dca4d");
  tspan1.textContent = `${content}'s `;
  const tspan2 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
  tspan2.setAttribute("fill", "#ed1c24");
  tspan2.textContent = "Notes";

  text.appendChild(tspan1);
  text.appendChild(tspan2);

  return text;
}

/**
 * Serializes a SVG as a Base64 URL to use as a src for an image.
 * @param {object} svg The SVG to convert
 * @returns Base64 Data URL
 */
function serializeSVG(svg) {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);
  const dataURL = "data:image/svg+xml;base64," + btoa(svgString);

  return dataURL;
}

// Note functions //

function newNote() {
  const newContainer = document.querySelector('.page');
  newContainer.innerHTML=`
    <div class="newNote animate">
      <button type="submit" class="noteButton close" title="Close Modal">&times;</button>
      <label for="noteTitle">Note Title</label>
      <input type="text" class="title" name="noteTitle" placeholder="Enter Title">

      <label for="noteText">Note Text</label>
      <textarea class="text" name="noteText" placeholder="Enter original text" rows="5"></textarea>

      <div class="button-group">
        <button type="submit" class="noteButton encrypt-button">Encrypt</button>
        <button type="submit" class="noteButton save-button">Save</button>
      </div>
    </div>
  `;

  document.querySelector('.newNote').style.display = 'block';

  const closeButton = document.querySelector(".close");
  closeButton.addEventListener("click", function(event) {
    event.preventDefault();
    closeNew();
  });

  const encryptButton = document.querySelector(".encrypt-button");
  encryptButton.addEventListener("click", function (event) {
    event.preventDefault();
    encryptNote();
  });

  const saveButton = document.querySelector(".save-button");
  saveButton.addEventListener("click", function (event) {
    event.preventDefault();
    saveNote();
  });
}

function closeNew() {
  const newContainer = document.querySelector('.page');
  newContainer.innerHTML=`
  <div class="button-group">
    <button type="submit" class="add-button">+</button>
  </div>`;

  const addButton = document.querySelector(".add-button");
  addButton.addEventListener("click", function(event) {
    event.preventDefault();
    newNote();
  });

  newContainer.style.display = 'block';
}

function encryptNote() {
  // TODO: encrypt here
}

function saveNote() {
  // TODO: save here
}

// Login functions //

/**
 * Logins a User and Opens their database.
 */
async function login() {
  const username = document.querySelector(".username").value;
  const password = document.querySelector(".password").value;
  const usedName = await existsDB(username);

  if (username.length > 0 && usedName) {
    const request = indexedDB.open(username, 1);

    request.onsuccess = function () {
      const db = request.result;
      const transaction = db.transaction("logins", "readonly");
      const logins = transaction.objectStore("logins");

      const login = logins.get(username);

      login.onsuccess = async function () {
        let creds = await login.result;
        const pass = creds.pass;
        const salt = creds.salt;
        const hash = await hashPassword(password, salt);

        if (hash === pass) {
          fillHeader(username);
          fillNotes();
          fillFooter(username);
        } else {
          alert(`Entered credentials seem to be wrong!\nTry again.`);
        }
      };

      transaction.oncomplete = function () {
        db.close();
      };
    };
  } else {
    alert(`Entered credentials seem to be wrong!\nTry again.`);
  }
}

/**
 * Registers a new User and creates a new database with their name.
 */
function registerUser() {
  if (isValidUsername && isValidPassword && isConfirmed) {
    const username = document.querySelector(".username").value;
    const password = document.querySelector(".password").value;
    openDatabase(username, password);
  }
}

/**
 * Validates if a username is already used for a database.
 * And also if it is of the correct length of 4-8 chars.
 */
async function validateUsername() {
  const minLength = 4;
  const maxLength = 8;
  const username = document.querySelector(".username").value;
  const userLabel = document.querySelector("#username-label");

  if (username.trim() === "") {
    userLabel.innerHTML = 'New Username';
    return;
  }
  const usedName = await existsDB(username);

  isValidUsername = !usedName && username.length >= minLength && username.length <= maxLength;

  if (isValidUsername) {
    userLabel.innerHTML = 'New Username' + '✔️';
  } else {
    userLabel.innerHTML = 'New Username' + '❌';
  }
}

/**
 * Validates the structure of a given password.
 * Passwords must have both cases, special characters, 
 * numbers and be at least 8 chars long.
 */
function validatePassword() {
  const password = document.querySelector(".password").value;
  const passLabel = document.querySelector("#password-label");

  if (password.trim() === "") {
    passLabel.innerHTML = 'New Password';
    return;
  }

  const minLength = 8;
  const hasSpecialChar = /[!@#$%^&*(),.?:{}|<>]/.test(password);
  const hasUpperCase = /[A-Z]/g.test(password);
  const hasLowerCase = /[a-z]/g.test(password);
  const hasNumber = /\d/g.test(password);

  const validPassword = password.length >= minLength &&
    hasSpecialChar &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber;

  if (validPassword) {
    passLabel.innerHTML = 'New Password' + '✔️';
  } else {
    passLabel.innerHTML = 'New Password' + '❌';
  }

  isValidPassword = validPassword;
}

/**
 * Validates if the retype of a pasword is correct.
 */
function validateConfirm() {
  const password = document.querySelector(".password").value;
  const confirm = document.querySelector(".confirm").value;
  const confLabel = document.querySelector("#confirm-label");

  if (confirm.trim() === "") {
    confLabel.innerHTML = 'Confirm Password';
    return;
  }

  if (password === confirm) {
    confLabel.innerHTML = 'Confirm Password' + '✔️';
  } else {
    confLabel.innerHTML = 'Confirm Password' + '❌';
  }

  isConfirmed = password === confirm;
}

/**
 * Checks if a database exsists.
 * @param {string} name DB name to check.
 * @returns True if the DB exists.
 */
async function existsDB(name) {
  let validName = false;

  const dbs = await indexedDB.databases();
  dbs.forEach(db => {
    validName = validName || db.name === name;
  });

  return validName;
}

// Database functions //

/**
 * Creates a new database with the user's name
 * and stores the Password in a new storage.
 * @param {string} username Database name.
 * @param {string} password User password.
 */
async function openDatabase(username, password) {
  if (!window.indexedDB) {
    alert('IndexedDB not supported');
    return;
  }

  const saltHash = generateSalt();
  const passHash = await hashPassword(password, saltHash);

  const request = indexedDB.open(username, 1);

  request.onupgradeneeded = function () {
    const db = request.result;
    if (!db.objectStoreNames.contains('logins')) {
      db.createObjectStore("logins", { keyPath: 'user' });
      db.createObjectStore("notes", { keyPath: 'title' });
    }
  };

  request.onsuccess = function () {
    const db = request.result;
    const transaction = db.transaction("logins", "readwrite");
    const logins = transaction.objectStore("logins");

    const login = { user: username, pass: passHash, salt: saltHash };
    logins.add(login);

    transaction.oncomplete = function () {
      alert(`User \"${username}\" successfully created.\n
      Please be sure to remember your password.\n
      There's no way to retrieve it for now!`);
      db.close();
      loginContainer();
      fillFooter();
    };
  };
}

function addNote() {
  // TODO: add function
}

// Crypto functions //

/**
 * Hashes a salted password string.
 * @param {string} password Original password 
 * @param {string} salt Generated salt.
 * @returns Hash of salted password
 */
async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return hexString(hash);
}

/**
 * Generates a hexadecimal salt for passwords.
 * @returns Returns a hexadecimal salt string.
 */
function generateSalt() {
  const buffer = new Uint8Array(64);
  crypto.getRandomValues(buffer);
  return hexString(buffer);
}

/**
 * Converts a buffer array to hexstring.
 * @param {Uint8Array} buffer The input buffer.
 * @returns Hexadecimal of the buffer.
 */
function hexString(buffer) {
  const byteArray = new Uint8Array(buffer);
  const hexCodes = [...byteArray].map((value) => {
    const hexCode = value.toString(16);
    const paddedHexCode = hexCode.padStart(2, "0");
    return paddedHexCode;
  });
  return hexCodes.join("");
}