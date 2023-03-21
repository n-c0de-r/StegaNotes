if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}

let isValidUsername, isValidPassword, isConfirmed;

loginHeader("abcd");
// loginContainer();
// loginFooter();

// Content functions //

function loginHeader(name) {
  let head = `<img src="./icons/icon.svg" class="icon" alt="StegaNotes Icon">
  <img src="./icons/name.svg" class="name" alt="StegaNotes Name">`;

  if(name !== undefined) {
    const svg = createSVG(name);
    const url = serializeSVG(svg);

    head = `
      <img src=${url} style="width: 90%; float: left;" alt="User's Name">
      <input type="checkbox" class="hamburger-input burger-shower" />
			<label class="hamburger-menu" for="hamburger-input">
				<nav class="sidebar-menu">
				<h3>Menu</h3>
				<ul>
					<li><a href="#">About</a></li>
					<li><a href="#">Contact</a></li>
				</ul>
				</nav>
			</label>
    `;
  }

  const header = document.querySelector(".header-content");
  header.innerHTML = `${head}`;
}

function loginContainer() {
  const container = document.querySelector("section");
  container.innerHTML = `
    <div class="container">
      <form id="login-form">
        <div class="form-group">
          <label for="username" id="username-label">Username</label>
          <input type="text" class="username" name="username" title="If the username is invalid, nothing will happen." placeholder="type here" required>
        </div>
        <div class="form-group">
          <label for="password" id="password-label">Password</label>
          <input type="password" class="password" name="password" title="If the password is invalid, nothing will happen." placeholder="type here" required>
        </div>
        <div class="button-group">
          <button type="submit" class="login-button">Login</button>
          <button type="submit" class="register-button">Register</button>
        </div>
      </form>
    </div>
  `;

  const loginButton = document.querySelector(".login-button");
  loginButton.addEventListener("click", function(event) {
    event.preventDefault();
    login();
  });

  const registerButton = document.querySelector(".register-button");
  registerButton.addEventListener("click", registerContainer);
}

function registerContainer() {
  const footer = document.querySelector("footer");
  footer.classList.toggle('footer');
  footer.innerHTML = "";

  const container = document.querySelector("section");
  container.innerHTML = `
    <div class="container">
      <form id="login-form">
        <div class="form-group">
          <label for="username" id="username-label">New Username</label>
          <input type="text" class="username" name="username" pattern="^.*(?=.{4,}).*$" title="The username must be at least 4 characters long." placeholder="min. 4 chars..." required>
        </div>
        <div class="form-group">
          <label for="password" id="password-label">New Password</label>
          <input type="password" class="password" name="password" pattern="^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?:{}|<>]).*$" title="The password must be at least 8 characters long, have at least 1 of each case letter, a number and a special character." placeholder="A-Z, a-z, 0-9, specials" required>
        </div>
        <div class="form-group">
          <label for="password" id="confirm-label">Confirm Password</label>
          <input type="password" class="confirm" name="confirm" placeholder="1 of each, min. 8 chars" required>
        </div>
        <div class="button-group">
          <button type="submit" class="register-button">Confirm</button>
          <button type="submit" class="cancel-button">Cancel</button>
        </div>
      </form>
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
  registerButton.addEventListener("click", function(event) {
    event.preventDefault();
    registerUser();
  });

  const cancelButton = document.querySelector(".cancel-button");
  cancelButton.addEventListener("click", loginContainer);
  cancelButton.addEventListener("click", loginFooter);
}

function notesContainer() {
  const footer = document.querySelector("footer");
  footer.classList.toggle('footer');
  footer.innerHTML = "";

  const container = document.querySelector("section");
  container.innerHTML = `
    <div class="notes">
      <div>
        <h1>notespage for testing</h1>
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
  registerButton.addEventListener("click", function(event) {
    // event.preventDefault();
    registerUser();
  });

  const cancelButton = document.querySelector(".cancel-button");
  cancelButton.addEventListener("click", loginContainer);
  cancelButton.addEventListener("click", loginFooter);
}

function loginFooter() {
  const footer = document.querySelector("footer");
  footer.classList.toggle('footer');
  footer.innerHTML = `
  <div class="footer-content">
			<a href="https://github.com/n-c0de-r/StegaNotes">
      <span style="color: var(--mainGreen);">n-c0de-r</span>
      <span> @ </span>
      <span style="color: var(--mainRed);">GitHub</span>
      <span>2023</span>
    </a>
	</div>
  `;
}

/**
 * Creates a SVG from a given name.
 * @param {string} name The username to turn to a SVG
 * @returns A SVG holding the users name
 */
function createSVG(name) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "1000");
  svg.setAttribute("height", "210");
  svg.setAttribute("viewBox", "0 0 1000 210");
  const size = Math.min(1000/(name.length+2), 100);
  const offset1 = name.length/4;
  const offset2 = name.length/8;
  // TODO Fix the formula
  const text1 = createText(`${name}'s${" ".repeat(offset1+offset2+4)}`, "#6dca4d", "end", size);
  const text2 = createText("Notes "+" ".repeat(offset2), "#ed1c24", "end", size);

  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

  group.appendChild(text1);
  group.appendChild(text2);

  svg.appendChild(group);

  return svg;
}

/**
 * Creates a text element to nest inside a SVG.
 * @param {string} content Text to make an SVG from
 * @param {string} color The color of the text
 * @param {string} anchor How to anchor the text
 * @returns The text as an SVG element
 */
function createText(content, color, anchor, size) {
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", "100%"); // 4=55, 6=60, 8=65 9=67.5 10=72,5 11=70 12=67.5 
  text.setAttribute("y", "50%");
  text.setAttribute("text-anchor", anchor);
  text.setAttribute("font-family", "OpenDyslexic3");
  text.setAttribute("font-size", size);
  text.setAttribute("fill", color);
  text.setAttribute("stroke-width", "3.7772");
  text.setAttribute("stroke", "#000000");
  text.setAttribute("xml:space", "preserve");
  text.textContent = content;

  return text;
}

/**
 * Serializes a SVG as a Base64 URL to use as a src for an image.
 * @param {*} svg The SVG to convert
 * @returns Base64 Data URL
 */
function serializeSVG(svg) {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);
  const dataURL = "data:image/svg+xml;base64," + btoa(svgString);

  return dataURL;
}

// Login functions //

/**
 * Logins a User and Opens their database.
 */
async function login() {
  const username = document.querySelector(".username").value;
  const password = document.querySelector(".password").value;
  const usedName = await existsDB(username);

  if(username.length>0 && usedName) {
    const request = indexedDB.open(username, 1);

    request.onsuccess = function() {
      const db = request.result;
      const transaction = db.transaction("logins", "readonly");
      const logins = transaction.objectStore("logins");
      
      const login = logins.get(username);

      login.onsuccess = async function() {
        let creds = await login.result;
        const user = creds.user;
        const pass = creds.pass;
        const salt = creds.salt;
        const hash = await hashPassword(password, salt);

      if(hash === pass) {
        loginHeader(username);
        notesContainer();
      } else {
        alert(`Entered credentials seem to be wrong!\nTry again.`);
      }
      };
      
      transaction.oncomplete = function () {
        db.close();
      };
    };
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
 */
async function validateUsername() {
  const minLength = 4;
  const username = document.querySelector(".username").value;
  const userLabel = document.querySelector("#username-label");

  if (username.trim() === "") {
    userLabel.innerHTML = 'New Username';
    return;
  }
  const usedName = await existsDB(username);

  if (!usedName && username.length >= minLength) {
    userLabel.innerHTML = 'New Username' + '✔️';
  } else {
    userLabel.innerHTML = 'New Username' + '❌';
  }

  isValidUsername = !usedName && username.length >= minLength;
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

  request.onupgradeneeded = function() {
    const db = request.result;
    if (!db.objectStoreNames.contains('logins')) {
      db.createObjectStore("logins", {keyPath: 'user'});
      db.createObjectStore("notes", {keyPath: 'title'});
    }
  };
  
  request.onsuccess = function() {
    const db = request.result;
    const transaction = db.transaction("logins", "readwrite");
    const logins = transaction.objectStore("logins");
    
    const login = {user: username, pass: passHash, salt: saltHash};
    logins.add(login);
    
    transaction.oncomplete = function () {
      alert(`User \"${username}\" successfully created.\n
      Please be sure to remember your password.\n
      There's no way to retrieve it for now!`);
      db.close();
      loginContainer();
      loginFooter();
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