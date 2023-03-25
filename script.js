let isValidUsername, isValidPassword, isConfirmed, wordList;
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/StegaNotes/sw.js");
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
      <img src="/StegaNotes/icons/favicon.png" class="icon" alt="StegaNotes Icon">
      <img src="/StegaNotes/icons/name.png" class="name" alt="StegaNotes Name">
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
  loginButton.addEventListener("click", function(event) {
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
        <input type="file" accept="application/json" class="fileInput">
         <button class="pickButton" style="margin-top: 3vh;">Pick a Dictionary</button>
        </input>
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

  const fileInput = document.querySelector(".fileInput");
  fileInput.addEventListener("change", readDictionary);
  
  const pickButton = document.querySelector(".pickButton");
  pickButton.addEventListener("click", function(event) {
    event.preventDefault();
    fileInput.click();
  });
}

/**
 * Dynamically fill the content section with notes.
 * @param {string} array The array to read
 */
function fillNotes(array) {
  array.forEach(note => {
    addNote(note.title, note.text, note.date);
  });
  const noteContainer = document.querySelector(".notes");
  noteContainer.style.display = 'block';
  closeModal();
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
    <a href="https://github.com/n-c0de-r/StegaNotes" style="text-shadow: 2px 2px 3px black">
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

/***Note functions***/

/**
 * Adds a note to the page.
 * @param {string} inputTitle Title of the note
 * @param {string} inputText Text of the note
 */
async function addNote(inputTitle, inputText, inputDate) {
  const noteContainer = document.querySelector(".notes");
  let newTitle = inputTitle
  const notesNr = noteContainer.childElementCount;
  if(inputTitle === undefined || inputTitle.length === 0) newTitle = "New Note #" + (notesNr+1);

  let date = inputDate;
  if(inputDate === undefined) {
    const d = new Date();
    date = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}, ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
  }
  

  let noteButton = document.createElement('button');
  noteButton.classList.add('note');
  noteButton.id = newTitle;
  noteButton.innerHTML = `${newTitle}`;
  noteButton.dataset.title = newTitle;
  noteButton.dataset.text = inputText;
  noteButton.dataset.date = date;

  storeNote({title: newTitle, text: inputText, createdAt: date});
  
  noteButton.addEventListener("click", function(event) {
    showNote(event.target.dataset);
  });

  noteContainer.appendChild(noteButton);
}

/**
 * Closes the note modal and displays the button.
 */
function closeModal() {
  document.querySelector(".notes").style.display = "block";
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
 * Displays the new note modal.
 */
function newModal() {
  document.querySelector(".notes").style.display = "none";
  const newContainer = document.querySelector('.page');
  newContainer.innerHTML=`
    <div class="modal zoomIn">
      <button class="modalButton close" title="Close Modal">&times;</button>
      <label for="noteTitle">Note Title</label>
      <input type="text" class="title" name="noteTitle" placeholder="Enter Title">

      <label for="noteText">Note Text (max. 200 chars)</label>
      <textarea class="text" name="noteText" placeholder="Enter original text" rows="4"></textarea>

      <div class="button-group">
        <button class="modalButton encodeButton">Encrypt</button>
        <button class="modalButton decodeButton" style="display: none;">Decrypt</button>
        <button class="modalButton saveButton">Save</button>
      </div>
    </div>
  `;

  document.querySelector('.modal').style.display = 'block';

  const closeButton = document.querySelector(".close");
  closeButton.addEventListener("click", function(event) {
    event.preventDefault();
    closeModal();
  });

  const encodeButton = document.querySelector(".encodeButton");
  encodeButton.disabled = true;
  encodeButton.addEventListener("click", function(event) {
    event.preventDefault();
    const key = prompt("Please enter your Keyword");
    if(key.trim().length === 0) return;
    const text = document.querySelector(".text");
    text.value = encodeText(text.value, key);
  });

  const saveButton = document.querySelector(".saveButton");
  saveButton.disabled = true;
  saveButton.addEventListener("click", function(event) {
    event.preventDefault();
    const text = document.querySelector(".text").value;
    if(text.length === 0) return;
    const title = document.querySelector(".title").value;
    addNote(title, text);
    closeModal();
  });

  const inputText = document.querySelector(".text");
  inputText.addEventListener("keyup", function(event) {
    if(inputText.value.trim().length === 0 || inputText.value.trim().length > 200) {
      encodeButton.disabled = true;
      saveButton.disabled = true;
    } else {
      encodeButton.disabled = false;
      saveButton.disabled = false;
    }
  });
}

/**
 * Displays the note modal
 * @param {object} note The note to display.
 */
function showNote(note) {
  document.querySelector(".notes").style.display = "none";
  const newContainer = document.querySelector('.page');
  newContainer.innerHTML=`
    <div class="modal zoomIn">
      <button class="modalButton close" title="Close Modal">&times;</button>
      <label for="noteTitle">${note.title}</label>
      <textarea class="text" name="noteText" rows="6" readonly>${note.text}</textarea>
      
      <label for="noteTime">Added at ${note.date}</label>

      <div class="button-group">
        <button class="modalButton decodeButton">Decrypt</button>
        <button class="modalButton deleteButton">Delete</button>
      </div>
    </div>
  `;

  document.querySelector('.modal').style.display = 'block';

  const closeButton = document.querySelector(".close");
  closeButton.addEventListener("click", function(event) {
    event.preventDefault();
    closeModal();
  });

  const decodeButton = document.querySelector(".decodeButton");
  decodeButton.addEventListener("click", function(event) {
    event.preventDefault();
    const key = prompt("Please enter your Keyword");
    if (key.trim().length === 0) {
      decodeButton.disabled = true;
      return;
    }
    const text = document.querySelector(".text");
    text.value = decodeText(text.value, key);
  });

  const deleteButton = document.querySelector(".deleteButton");
  deleteButton.addEventListener("click", function(event) {
    event.preventDefault();
    if(confirm("Do you really want to remove this note?"))
      removeNote(note.title);
  });
}

/**
 * Removes a note from the page.
 * @param {string} title The note name to delete
 */
function removeNote(title) {
  const noteContainer = document.querySelector(".notes");
  noteContainer.removeChild(document.getElementById(title));
  closeModal();
  deleteNote(title);
}

/***Login functions***/

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
      const tsxLangs = db.transaction("languages", "readonly");
      const loginStore = tsxLogin.objectStore("logins");
      const langsStore = tsxLangs.objectStore("languages");
      const loginRequest = loginStore.get(username);
      const langRequest = langsStore.get("eng");

      loginRequest.onsuccess = async function() {
        const creds = loginRequest.result;
        const pass = creds.pass;
        const salt = creds.salt;
        const hash = await hashPassword(password, salt);

        if (hash === pass) {
          fillHeader(username);
          fillFooter(username);
          getNotes(db);
        } else {
          alert(`Entered credentials seem to be wrong!\nTry again.`);
        }
      };

      langRequest.onsuccess = function() {
        wordList = langRequest.result.words;
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

/***Database functions***/

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

    const newLogin = { user: username, pass: passHash, salt: saltHash };
    loginsStore.add(newLogin);

    tsxLogins.oncomplete = function() {
      alert(`User \"${username}\" successfully created.\n
      Please be sure to remember your password.\n
      There's no way to retrieve it for now!`);
      login(username, password);
    };
  };
}

/**
 * Get all notes from a store.
 * @param {string} db The DB to read the store from
 */
function getNotes(db) {
  const tsxNotes = db.transaction("notes", "readonly");
  const noteStore = tsxNotes.objectStore("notes");
  const notesRequest = noteStore.getAll();

  notesRequest.onsuccess = function() {
    fillNotes(notesRequest.result);
  };
}

/**
 * Stores a note in the Database.
 * @param {object} note The note object to display
 */
function storeNote(note) {
  const altText = document.querySelector(".userTitle").getAttribute('alt');
  const name = altText.substring(0, altText.indexOf("'"));
  const request = indexedDB.open(name, 1);

  request.onsuccess = async function() {
    const db = request.result;
    const tsxNotes = db.transaction("notes", "readwrite");
    const notesStore = tsxNotes.objectStore("notes");
    notesStore.add(note);
  };
}

/**
 * Deletes a note from the database.
 * @param {string} title Key of note to delete
 */
function deleteNote(title) {
  const altText = document.querySelector(".userTitle").getAttribute('alt');
  const name = altText.substring(0, altText.indexOf("'"));
  const request = indexedDB.open(name, 1);

  request.onsuccess = async function() {
    const db = request.result;
    const tsxNotes = db.transaction("notes", "readwrite");
    const notesStore = tsxNotes.objectStore("notes");
    notesStore.delete(title);
  };
}

/**
 * Reads in a JSON file and stores it in the database.
 * @param {file} event The File event
 */
function readDictionary(event) {
  const name = document.querySelector(".username").value;
  const file = event.target.files[0];
  const lang = file.name.substring(0, file.name.lastIndexOf('.'));

  const reader = new FileReader();
  reader.readAsText(file);

  reader.onload = () => {
      const readFile = reader.result;
      const obj = JSON.parse(readFile);
      wordList = Object.values(obj)[0];
      storeDictionary(name, lang, words);
  };
}

/**
 * Stores the dictionary in the database.
 * @param {string} name Name of the database.
 * @param {string} lang Language code
 * @param {array} words Array of words.
 */
function storeDictionary(name, lang, words) {
  const request = indexedDB.open(name, 1);

  request.onsuccess = async function() {
    const db = request.result;
    const tsxLangs = db.transaction("languages", "readwrite");
    const langsStore = tsxLangs.objectStore("languages");

    const language = { lang: lang, words: words };
    langsStore.add(language);
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
 * @param {string} text  Test to encode
 * @param {string} key Key to use for encoding
 * @returns Encoded text
 */
function encodeText(text, key) {
  const end = text.length;
  const hiddenWords = [];

  for (let i = 0; i < end; i++) {
    const character = text.charAt(i);
    if (character === ' ') {
      continue;
    }

    const word = pickWord(character, key.codePointAt(i % key.length));

    if(word === undefined || word === null) {
      hiddenWords[i] = character;
      continue;
    }
    hiddenWords[i] = word;
  }
  
  const encodeButton = document.querySelector(".encodeButton").disabled = true;
  return hiddenWords.join(" ");
}

/**
 * Used to decode texts steganographically.
 * @param {string} text Test to decode
 * @param {string} key Key to use for decoding
 * @returns Decoded text
 */
function decodeText(text, key) {
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
