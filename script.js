import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://realtime-database-9c5c5-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize app
const app = initializeApp(appSettings);
// Intialize database
const database = getDatabase(app);
//  Create a reference in the database
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldElem = document.querySelector("#input-field");
const addBtnElem = document.querySelector("#add-btn");
const shoppingListElem = document.querySelector("#shopping-list");
const newItem = inputFieldElem.value;

const clearInputElem = () => {
  inputFieldElem.value = "";
};

const renderItemOnPage = (item) => {
  //   shoppingListElem.innerHTML += `<li>${itemValue}</li>`;
  let itemID = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("li");

  newEl.textContent = itemValue;

  //   Renove item from DB
  newEl.addEventListener("dblclick", () => {
    // Get exact location of an item in the database
    let exactItemLocation = ref(database, `shoppingList/${itemID}`);

    // Remove the item from DB
    remove(exactItemLocation);
  });

  shoppingListElem.appendChild(newEl);
};

const addToCart = () => {
  const newItem = inputFieldElem.value;
  if (newItem === "") return;
  // Push item to database
  push(shoppingListInDB, newItem);

  clearInputElem();
};

const clearShoppingListEl = () => {
  shoppingListElem.innerHTML = "";
};

// fetch items from firebase database
onValue(shoppingListInDB, (snapshot) => {
  // Fetch only when snapshot exists
  if (snapshot.exists()) {
    const shoppingItemsArray = Object.entries(snapshot.val());

    clearShoppingListEl();

    shoppingItemsArray.forEach((shoppingItem) => {
      let currentItemID = shoppingItem[0];
      let currentItemValue = shoppingItem[1];

      renderItemOnPage(shoppingItem);
    });
  } else {
    shoppingListElem.innerText = "No items here yet!";
  }
});

addBtnElem.addEventListener("click", addToCart);
