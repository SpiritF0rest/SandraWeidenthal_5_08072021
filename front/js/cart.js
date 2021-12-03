/**
 * Constants definition
 */
const itemsDataCart = JSON.parse(localStorage.getItem("cart"));
const firstName     = document.getElementById("firstName");
const lastName      = document.getElementById("lastName");
const address       = document.getElementById("address"); 
const city          = document.getElementById("city");
const email         = document.getElementById("email");

/**
 * Variable definition
 */
let allQuantityInput    = document.getElementsByClassName("itemQuantity");
let allDeleteButton     = document.getElementsByClassName("deleteItem");
let alphaRegex          = /^[a-zA-Zçñàéèêëïîôüù '-\.]+$/;
let alphaNumberRegex    = /^[0-9a-zA-Zçñàéèêëïîôüù '-\.]+$/;
let emailRegex          = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let contact             = {};
let productsArray       = [];
let dataToSend          = {};

/**
 * Creation of an item for the cart.
 * @param {*} item 
 * @returns { HTMLElement }
 */
function itemCartInfo(item) {

    // Article containing the data of the ordered product
    const itemArticle = document.createElement("article");
    itemArticle.classList.add("cart__item");
    itemArticle.setAttribute("data-id", item.itemDataId);
    itemArticle.setAttribute("data-color", item.itemDataColor);

    // Block displaying the product image
    const itemImageDiv = document.createElement("div");
    itemImageDiv.classList.add("cart__item__img");
    const itemImage = document.createElement("img");
    itemImage.setAttribute("src", item.itemDataImage);
    itemImage.setAttribute("alt", item.itemDataImageAltTxt);
    itemImageDiv.appendChild(itemImage);

    // Div grouping product information
    const itemInfoDiv = document.createElement("div");
    itemInfoDiv.classList.add("cart__item__content");

    // Div containing the name, color and price of the product
    const itemDescriptionDiv = document.createElement("div");
    itemDescriptionDiv.classList.add("cart__item__content__description");
    const itemH2 = document.createElement("h2");
    itemH2.textContent = item.itemDataName;
    const itemColorParagraph = document.createElement("p");
    itemColorParagraph.textContent = item.itemDataColor;
    const itemPriceParagraph = document.createElement("p");
    itemPriceParagraph.textContent = item.itemDataPrice + " €";
    itemDescriptionDiv.appendChild(itemH2);
    itemDescriptionDiv.appendChild(itemColorParagraph);
    itemDescriptionDiv.appendChild(itemPriceParagraph);

    // Div regrouping the quantity and the deletion of a product
    const itemSettingsDiv = document.createElement("div");
    itemSettingsDiv.classList.add("cart__item__content__settings");

    // Div containing the modifiable quantity of the product
    const itemQuantitySettingsDiv = document.createElement("div");
    itemQuantitySettingsDiv.classList.add("cart__item__content__settings__quantity");
    const itemQuantityParagraph = document.createElement("p");
    itemQuantityParagraph.textContent = "Qté : ";
    const itemQuantityInput = document.createElement("input");
    itemQuantityInput.setAttribute("type", "number");
    itemQuantityInput.classList.add("itemQuantity");
    itemQuantityInput.setAttribute("name", "itemQuantity");
    itemQuantityInput.setAttribute("min", "1");
    itemQuantityInput.setAttribute("max", "100");
    itemQuantityInput.setAttribute("value", item.itemDataQuantity);
    itemQuantitySettingsDiv.appendChild(itemQuantityParagraph);
    itemQuantitySettingsDiv.appendChild(itemQuantityInput);

    // Div containing the product delete button
    const itemDeleteSettingsDiv = document.createElement("div");
    itemDeleteSettingsDiv.classList.add("cart__item__content__settings__delete");
    const itemDeleteButton = document.createElement("p");
    itemDeleteButton.classList.add("deleteItem");
    itemDeleteButton.textContent = "Supprimer";
    itemDeleteSettingsDiv.appendChild(itemDeleteButton);

    // Parent / child connection of the main blocks
    itemSettingsDiv.appendChild(itemQuantitySettingsDiv);
    itemSettingsDiv.appendChild(itemDeleteSettingsDiv);

    itemInfoDiv.appendChild(itemDescriptionDiv);
    itemInfoDiv.appendChild(itemSettingsDiv);

    itemArticle.appendChild(itemImageDiv);
    itemArticle.appendChild(itemInfoDiv);

    return itemArticle;
};
 
/**
 * Insertion of articles in the cart
 * @param {*} product 
 */
function cartPagination(product) {
    const cartList = document.getElementById("cart__items");
    for (let i = 0; i <= product.length - 1; i++) {
        cartList.appendChild(itemCartInfo(product[i]));
    };
};

/**
 * To change the quantity of an item
 */
function changeQuantity() {
    for (let input of allQuantityInput) {
        let itemToModify = input.closest("article");
        input.addEventListener("change", function (e) {
            let itemTargetId = itemToModify.getAttribute("data-id");
            let itemTargetColor = itemToModify.getAttribute("data-color");
            let searchItem = itemsDataCart.find(array => array.itemDataId == itemTargetId && array.itemDataColor == itemTargetColor);
            // Change quantity to 100 if the user enters a value > 100 (possible with the keyboard)
            if (input.value > 100) {
                alert("La quantité ne peut dépasser 100 unités pour un même article.");
                input.value = 100;
                Object.defineProperty(searchItem, "itemDataQuantity", { value: input.value });
                localStorage.setItem("cart", JSON.stringify(itemsDataCart));
                input.textContent = "100";
            } else if (input.value > 0 && input.value <= 100) {
                Object.defineProperty(searchItem, "itemDataQuantity", { value: input.value });
                localStorage.setItem("cart", JSON.stringify(itemsDataCart));
            }
            // Delete if quantity is changed to 0 (possible with the keyboard)
            else if (input.value == 0) {
                itemToModify.remove();
                deleteItemInLocalStorage(itemToModify);
            }
            totalQuantity();
            calculTotalPrice(itemsDataCart);
        });
    };
};

/**
 * Delete an item
 */
function deleteItem() {
    for (let button of allDeleteButton) {
        let itemToDelete = button.closest("article");
        button.addEventListener("click", function (e) {
            deleteItemInLocalStorage(itemToDelete);
            itemToDelete.remove();
            totalQuantity();
            calculTotalPrice(itemsDataCart);
        });
    };
};

/**
 * Delete an item in local storage
 * @param {*} targetItem 
 */
function deleteItemInLocalStorage(targetItem) {
    let itemToDeleteId = targetItem.getAttribute("data-id");
    let itemToDeleteColor = targetItem.getAttribute("data-color");
    let searchItem = itemsDataCart.find(array => array.itemDataId == itemToDeleteId && array.itemDataColor == itemToDeleteColor);
    let targetItemIndex = itemsDataCart.indexOf(searchItem);
    let removedItem = itemsDataCart.splice(targetItemIndex, 1);
    localStorage.setItem("cart", JSON.stringify(itemsDataCart));
};

/**
 * Total quantity
 */
function totalQuantity() {
    const itemsTotalQuantity = document.querySelectorAll(".itemQuantity");
    let itemsSum = 0;
    for (let quantity of itemsTotalQuantity) {
        itemsSum = itemsSum + parseInt(quantity.value, 10);
    };
    const totalQuantity = document.getElementById("totalQuantity");
    totalQuantity.textContent = itemsSum;
};

/**
 * Total price 
 * @param {*} items 
 */
function calculTotalPrice(items) {
    let itemsTotalPrice = 0;
    for (let item of items) {
        itemsTotalPrice = itemsTotalPrice + (parseInt(item.itemDataQuantity, 10) * item.itemDataPrice);
    };
    const calculTotalPrice = document.getElementById("totalPrice");
    calculTotalPrice.textContent = itemsTotalPrice;
};

/**
 * Input verification
 */
function checkInput() {
    firstName.addEventListener("input", function (e) {
        if (alphaRegex.test(e.target.value) == false) {
            document.getElementById("firstNameErrorMsg").innerText = "Merci d'entrer un prénom valide, ex: James (lettres et - uniquement).";
            return false;
        } else {
            document.getElementById("firstNameErrorMsg").innerText = "";
            return true;
        };
    });
    lastName.addEventListener("input", function (e) {
        if (alphaRegex.test(e.target.value) == false) {
            document.getElementById("lastNameErrorMsg").innerText = "Merci d'entrer un nom valide, ex: Halliday (lettres et - uniquement).";
            return false;
        } else {
            document.getElementById("lastNameErrorMsg").innerText = "";
            return true;
        };
    });
    address.addEventListener("input", function (e) {
        if (alphaNumberRegex.test(e.target.value) == false) {
            document.getElementById("addressErrorMsg").innerText = "Merci d'entrer une adresse valide, ex: 4 Privet Drive (lettres, chiffres et - uniquement).";
            return false;
        } else {
            document.getElementById("addressErrorMsg").innerText = "";
            return true;
        };
    });
    city.addEventListener("input", function (e) {
        if (alphaRegex.test(e.target.value) == false) {
            document.getElementById("cityErrorMsg").innerText = "Merci d'entrer une ville valide, ex: Paimpont (lettres et - uniquement).";
            return false;
        } else {
            document.getElementById("cityErrorMsg").innerText = "";
            return true;
        };
    });
    email.addEventListener("input", function (e) {
        if (emailRegex.test(e.target.value) == false) {
            document.getElementById("emailErrorMsg").innerText = "Merci d'entrer un e-mail valide, ex: email@valide.com.";
            return false;
        } else {
            document.getElementById("emailErrorMsg").innerText = "";
            return true;
        };
    });
};

/**
 * Contact object creation
 * @returns { Object }
 */
function createContact() {
    contact = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value
    };
    return contact;
};

/**
 * Get products of the order
 */
function getCartProductsId() {
    for (let item of itemsDataCart) {
        productsArray.push(item.itemDataId);
    };
};

/**
 * Form validation
 */
function formValidation() {
    if (alphaRegex.test(firstName.value) == true && alphaRegex.test(lastName.value) == true && alphaRegex.test(city.value) == true && alphaNumberRegex.test(address.value) == true && emailRegex.test(email.value) == true) {
        return true;
    } else {
        return false;
    };
};

/**
 * Control before validation
 */
function validationForOrder() {
    let order = document.getElementById("order");
    order.addEventListener("click", function (e) {
        e.preventDefault();
        let contact = createContact();
        let data = createDataToSend(contact);
        if (formValidation() == true) {
            sendOrder(data);
        } else {
            alert("Merci de remplir correctement le formulaire de contact.");
        };
    });
};

/**
 * Creation of the object containing the data to send
 * @param { Object } contact 
 * @returns { Object }
 */
function createDataToSend(contact) {
    dataToSend = {
        contact: contact,
        products: productsArray
    };
    return dataToSend;
};

/**
 * Sending the POST request
 * @param { Object } data 
 */
function sendOrder(data) {
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function (responseData) {
            // Adding order Id to the URL
            window.location.href = "../html/confirmation.html?orderId=" + responseData.orderId;
            localStorage.clear();
        })
        .catch(function (err) {
            console.log("une erreur est survenu lors de l'envoi des données à l'API");
        });
};

/**
 * Main function
 */
 const main = async () => {
    cartPagination(itemsDataCart);
    totalQuantity();
    calculTotalPrice(itemsDataCart);
    changeQuantity();
    deleteItem();
    checkInput();
    getCartProductsId();
    validationForOrder();
};

main();