let isValidUsername, isValidPassword, isConfirmed, notesArray, wordList;
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
        <img src="" class="userTitle" alt=${name}'s Notes">
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
        <button class="loginButton">Login</button>
        <button class="registerButton">Register</button>
      </div>
    </div>
  `;

  const loginButton = document.querySelector(".loginButton");
  loginButton.addEventListener("click", function (event) {
    event.preventDefault();
    const username = document.querySelector(".username").value;
    const password = document.querySelector(".password").value;
    login(username, password);
  });

  const registerButton = document.querySelector(".registerButton");
  registerButton.addEventListener("click", registerContainer);
}

/**
 * Dynamically fill the content section with the register form.
 */
function registerContainer() {
  const footer = document.querySelector("footer");
  footer.innerHTML = "";

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
        <button class="registerButton">Register</button>
        <button class="cancelButton">Cancel</button>
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

  const registerButton = document.querySelector(".registerButton");
  registerButton.addEventListener("click", registerUser);

  const cancelButton = document.querySelector(".cancelButton");
  cancelButton.addEventListener("click", function() {
    loginContainer();
    fillFooter();
  });
}

/**
 * Dynamically fill the content section with notes.
 * @param {string} name The DB name to open
 */
function fillNotes(name) {
  getNotes(name);
  notesArray.forEach(note => {
    addNote(note);
  });
  const noteContainer = document.querySelector(".notes");
  noteContainer.style.display = 'block';
  closeNewModal();
}

/**
 * Fills in the header dynamically.
 * @param {string} name If this is set, make no footer
 */
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

/**
 * Creates a header PNG from the Username
 * @param {string} name Username
 */
function createPNG(name) {
  const svg = createSVG(name);
  const url = serializeSVG(svg);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();

  img.onload = function() {
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

function newModal() {
  const newContainer = document.querySelector('.page');
  newContainer.innerHTML=`
    <div class="modal animate">
      <button class="modalButton close" title="Close Modal">&times;</button>
      <label for="noteTitle">Note Title</label>
      <input type="text" class="title" name="noteTitle" placeholder="Enter Title">

      <label for="noteText">Note Text</label>
      <textarea class="text" name="noteText" placeholder="Enter original text" rows="5"></textarea>

      <div class="button-group">
        <button class="modalButton encryptButton">Encrypt</button>
        <button class="modalButton saveButton">Save</button>
      </div>
    </div>
  `;

  document.querySelector('.modal').style.display = 'block';

  const closeButton = document.querySelector(".close");
  closeButton.addEventListener("click", function(event) {
    event.preventDefault();
    closeNewModal();
  });

  const encryptButton = document.querySelector(".encryptButton");
  encryptButton.addEventListener("click", function (event) {
    event.preventDefault();
    const text = document.querySelector(".text").value;
    const key = prompt("Please enter your Keyword");
    text = encodeText(text, key);
  });

  const saveButton = document.querySelector(".saveButton");
  saveButton.addEventListener("click", function (event) {
    event.preventDefault();
    const title = document.querySelector(".title").value;
    const text = document.querySelector(".text").value;
    storeNote(title, text);
  });
}

function closeNewModal() {
  const newContainer = document.querySelector('.page');
  newContainer.innerHTML=`
  <div class="button-group">
    <button class="addButton">+</button>
  </div>`;

  const addButton = document.querySelector(".addButton");
  addButton.addEventListener("click", function(event) {
    event.preventDefault();
    newModal();
  });

  newContainer.style.display = 'block';
}

/**
 * Adds a note to the page.
 * @param {object} note The note object to display
 */
async function addNote(note) {
  let noteButton = document.createElement('button');
  noteButton.classList.add('note');
  noteButton.innerHTML = note.title;
  noteButton.dataset.title = note.title;
  noteButton.dataset.text = note.text;
  noteButton.dataset.date = note.date;
  noteButton.dataset.lang = "lang";

  
  const noteContainer = document.querySelector(".notes");
  noteContainer.appendChild(noteButton);
}

function showNote() {
  // TODO: show note
}

// Login functions //

/**
 * Logins a User and Opens their database.
 * @param {string} username The username to log in
 * @param {string} password The password to use to log in
 */
async function login(username, password) {
  const usedName = await existsDB(username);

  if (username.length > 0 && usedName) {
    const request = indexedDB.open(username, 1);

    request.onsuccess = function() {
      const db = request.result;
      const tsxLogin = db.transaction("logins", "readonly");
      const loginStore = tsxLogin.objectStore("logins");

      const login = loginStore.get(username);

      login.onsuccess = async function() {
        const creds = login.result;
        const pass = creds.pass;
        const salt = creds.salt;
        const hash = await hashPassword(password, salt);

        if (hash === pass) {
          fillHeader(username);
          fillFooter(username);
          fillNotes(username);
        } else {
          alert(`Entered credentials seem to be wrong!\nTry again.`);
        }
      };

      tsxLogin.oncomplete = function() {
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
    userLabel.innerHTML = 'New Username' + ' ✔️';
  } else {
    userLabel.innerHTML = 'New Username' + ' ❌';
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
    passLabel.innerHTML = 'New Password' + ' ✔️';
  } else {
    passLabel.innerHTML = 'New Password' + ' ❌';
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

  isConfirmed = password === confirm;

  if (isConfirmed) {
    confLabel.innerHTML = 'Confirm Password' + ' ✔️';
  } else {
    confLabel.innerHTML = 'Confirm Password' + ' ❌';
  }
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
      db.createObjectStore("logins", { keyPath: 'user' });
      db.createObjectStore("notes", { keyPath: 'title' });
      db.createObjectStore("languages", { keyPath: 'lang' });
    }
  };

  request.onsuccess = function() {
    const db = request.result;
    const tsxLogins = db.transaction("logins", "readwrite");
    const loginsStore = tsxLogins.objectStore("logins");

    const newLogin = { user: username, pass: passHash, salt: saltHash, lang: "eng" };
    loginsStore.add(newLogin);
    notesArray = [];

    tsxLogins.oncomplete = function() {
      alert(`User \"${username}\" successfully created.\n
      Please be sure to remember your password.\n
      There's no way to retrieve it for now!`);
      db.close();
      login(username, password);
    };
  };
}

/**
 * Get all notes from a store.
 * @param {*} name The User's store to access.
 */
function getNotes(name) {
  const request = indexedDB.open(name, 1);

  request.onsuccess = function() {
    const db = request.result;
    const tsxNotes = db.transaction("notes", "readonly");
    const noteStore = tsxNotes.objectStore("notes");
    const notesRequest = noteStore.getAll();

    notesRequest.onsuccess = async function() {
      notesArray = notesRequest.result;
    };

    notesRequest.oncomplete = function() {
      db.close();
    };
  }
}

/**
 * Stores a note in the Database.
 * @param {string} newTitle Title of the note
 * @param {string} newText Text of the note
 */
function storeNote(newTitle, newText) {
  let t = newTitle
  if(newText === undefined || newText.length === 0) return;
  if(newTitle === undefined || newTitle.length === 0) t = "New Note #" + (notesArray.length+1);

  const altText = document.querySelector(".userTitle").getAttribute('alt');
  const name = altText.substring(0, altText.indexOf("'"));
  const request = indexedDB.open(name, 1);

  request.onsuccess = async function() {
    const db = request.result;
    const tsxNotes = db.transaction("notes", "readwrite");
    const notesStore = tsxNotes.objectStore("notes");

    const note = { title: t, text: newText, createdAt: Date.now() };
    notesStore.add(note);
    notesArray.push(note);

    tsxNotes.oncomplete = function() {
      addNote(note);
      closeNewModal();
      db.close();
    };
  };
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

/**
 * Used to encode texts steganographically.
 * @param {*} text  Test to encode
 * @param {*} key Key to use for encoding
 * @returns Encoded text
 */
function encodeText(text, key) {
  if(text.trim().length === 0 || key.trim().length === 0) return;
  const keyLength = key.length;
  const end = text.length;
  const hiddenWords = new Array(end).fill('');

  for (let i = 0; i < end; i++) {
    const character = text.charAt(i);
      if (character === ' ') {
        continue;
      }

      const word = pickWord(character, key.codePointAt(i % keyLength));

      if(word === undefined || word === null) {
        hiddenWords[i] = character;
        continue;
      }
      hiddenWords[i] = word;
  }
  
  return hiddenWords.join(" ");
}

/**
 * Used to decode texts steganographically.
 * @param {string} text Test to decode
 * @param {string} key Key to use for decoding
 * @returns Decoded text
 */
function decodeText(text, key) {
  if(text.trim().length === 0 || key.trim().length === 0) return;
  const words = text.split(' ');
  const keyLength = key.length;
  const end = words.length;
  let result = '';
  let keyIndex = 0;

  for (let i = 0; i < end; i++) {
      let word = words[i];

      if(word === "") {
        result += " ";
        keyIndex++;
        continue;
      }

      const value = key.codePointAt(keyIndex % keyLength);
      result += word.charAt(value % word.length);
      keyIndex++;
  }
  
  return result;
}

/**
 * Picks a random word from a wordlist.
 * @param {char} char Character to look for
 * @param {number} value Key character value for calculations
 * @returns Word containing the letter at a specific position
 */
function pickWord(char, value) {
  const possibleWords = [...wordList]
    .filter(word => word.includes(char))
    .filter(word => word.charAt(value % word.length) === char);
      
  const randomIndex = getRandomInt(0, possibleWords.length);
  return candidateWord = possibleWords[randomIndex];
}

/**
 * Generate random numbers using the crypto API.
 * @param {int} min The lower bound
 * @param {int} max The upper bound
 * @returns The random integer
 */
function getRandomInt(min, max) {
  const range = max - min;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8);
  const randomBytes = new Uint8Array(bytesNeeded);
  let randomInt;

  do {
    window.crypto.getRandomValues(randomBytes);
    randomInt = 0;
    for (var i = 0; i < bytesNeeded; i++) {
      randomInt |= randomBytes[i] << (i * 8);
    }
    randomInt = randomInt % range;
  } while (randomInt >= range);
  
  return randomInt + min;
}
