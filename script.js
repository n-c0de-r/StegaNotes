if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker && navigator.serviceWorker.register("./sw.js");
  });
}

loginContainer();

function loginContainer() {
  let container = document.querySelector("#container");
  let loginFormHTML = `
      <form id="login-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" name="username" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required>
        </div>
        <div class="button-group">
          <button type="submit" id="login-button">Login</button>
          <button type="submit">Register</button>
        </div>
      </form>
    `;
  container.innerHTML = loginFormHTML;
}

async function login(username, password) {
  let objectStoreName = "credentials";
  let db = await openDatabase(username, password);
  let objectStore = db.transaction(objectStoreName, "readonly").objectStore(objectStoreName);
  let request = objectStore.get(username);

  return new Promise((resolve, reject) => {
    request.onsuccess = (event) => {
      let user = event.target.result;
      if (!user) {
        reject("User not found");
      } else {
        let { password: storedPassword, salt } = user;
        let hashedPassword = hashPassword(password, salt);
        if (hashedPassword !== storedPassword) {
          reject("Incorrect password");
        } else {
          resolve("Login successful");
        }
      }
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    let request = indexedDB.open("myDatabase", 1);
    request.onerror = (event) => {
      console.error("Database error:", event.target.errorCode);
      reject(event.target.errorCode);
    };
    request.onsuccess = (event) => {
      let db = event.target.result;
      console.log("Database opened successfully");
      resolve(db);
    };
    request.onupgradeneeded = (event) => {
      let db = event.target.result;
      let store = db.createObjectStore("users", {
        keyPath: "username",
      });
      store.createIndex("username", "username", { unique: true });
      console.log("Database upgraded successfully");
    };
  });
}

async function hashPassword(password, salt) {
  let encoder = new TextEncoder();
  let data = encoder.encode(password + salt);
  let hash = await crypto.subtle.digest("SHA-256", data);
  return hexString(hash);
}

function hexString(buffer) {
  let byteArray = new Uint8Array(buffer);
  let hexCodes = [...byteArray].map((value) => {
    let hexCode = value.toString(16);
    let paddedHexCode = hexCode.padStart(2, "0");
    return paddedHexCode;
  });
  return hexCodes.join("");
}

function generateSalt() {
  let buffer = new Uint8Array(16);
  crypto.getRandomValues(buffer);
  return hexString(buffer);
}

let loginButton = document.querySelector("#login-button");
loginButton.addEventListener("click", async () => {
  let username = document.querySelector("#username").value;
  let password = document.querySelector("#password").value;
  try {
    let result = await login(username, password);
    console.log(result);
  } catch (error) {
    console.error(error);
    let modal = error instanceof DOMException ? createModal(error.message, []) : error;
    modal.show();
  }
});