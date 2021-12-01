/*NB!!: Penser au moment de la finalisation de la commande (commande validée) à vider le local storage avec localStorage.clear();*/

/**
 * Définition constante
 */
 const itemsDataCart = JSON.parse(localStorage.getItem("cart"));


/**
 * création d'un item pour le cart.
 */
 function itemCartInfo(item) {

    // Article contenant les données du produit commandé
    const itemArticle = document.createElement("article");
    itemArticle.classList.add("cart__item");
    itemArticle.setAttribute("data-id", item.itemDataId);
    itemArticle.setAttribute("data-color", item.itemDataColor);

    // Bloc affichant l'image du produit
    const itemImageDiv = document.createElement("div");
    itemImageDiv.classList.add("cart__item__img");
    const itemImage = document.createElement("img");
    itemImage.setAttribute("src", item.itemDataImage);
    itemImage.setAttribute("alt", item.itemDataImageAltTxt);
    itemImageDiv.appendChild(itemImage);

    // Div regroupant les infos du produit
    const itemInfoDiv = document.createElement("div");
    itemInfoDiv.classList.add("cart__item__content");

    // Div contenant le nom, la couleur et le prix du produit
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

    // Div regroupant la quantité et la suppression d'un produit
    const itemSettingsDiv = document.createElement("div");
    itemSettingsDiv.classList.add("cart__item__content__settings");

    // Div contenant la quantité modifiable du produit
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

    // Div contenant le bouton de suppression du produit
    const itemDeleteSettingsDiv = document.createElement("div");
    itemDeleteSettingsDiv.classList.add("cart__item__content__settings__delete");
    const itemDeleteButton = document.createElement("p");
    itemDeleteButton.classList.add("deleteItem");
    itemDeleteButton.textContent = "Supprimer";
    itemDeleteSettingsDiv.appendChild(itemDeleteButton);

    // Connexion parents/enfants des blocs principaux 
    itemSettingsDiv.appendChild(itemQuantitySettingsDiv);
    itemSettingsDiv.appendChild(itemDeleteSettingsDiv);

    itemInfoDiv.appendChild(itemDescriptionDiv);
    itemInfoDiv.appendChild(itemSettingsDiv);

    itemArticle.appendChild(itemImageDiv);
    itemArticle.appendChild(itemInfoDiv);

    return itemArticle;
 };
 
/**
  * Insertion des articles dans le panier
  */
function cartPagination(product) {
    const cartList = document.getElementById("cart__items");
    for (let i = 0; i <= product.length-1; i++) {
        cartList.appendChild(itemCartInfo(product[i]));
    };
};

/**
 * Modification quantité article
 */
let allQuantityInput = document.getElementsByClassName("itemQuantity");

function changeQuantity() {

    for (let input of allQuantityInput) {

        let itemToModify = input.closest("article");

        input.addEventListener("change", function (e) {

            let itemTargetId = itemToModify.getAttribute("data-id");
            let itemTargetColor = itemToModify.getAttribute("data-color");
            let searchItem = itemsDataCart.find( array => array.itemDataId == itemTargetId && array.itemDataColor == itemTargetColor);
            Object.defineProperty(searchItem, "itemDataQuantity", { value : input.value });
            localStorage.setItem("cart", JSON.stringify(itemsDataCart));

            if (input.value == 0) {
                itemToModify.remove();
                deleteItemInLocalStorage(itemToModify);
            }

            totalQuantity();
            calculTotalPrice(itemsDataCart);

        });
    };
};

/**
 * Suppression d'un article
 */
let allDeleteButton = document.getElementsByClassName("deleteItem");

function deleteItem() {
    
    for (let button of allDeleteButton ) {

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
 * Suppression d'un article dans le local storage
 */
function deleteItemInLocalStorage(targetItem) {
    
    let itemToDeleteId = targetItem.getAttribute("data-id");
    let itemToDeleteColor = targetItem.getAttribute("data-color");

    let searchItem = itemsDataCart.find( array => array.itemDataId == itemToDeleteId && array.itemDataColor == itemToDeleteColor);

    let targetItemIndex = itemsDataCart.indexOf(searchItem);
    
    let removedItem = itemsDataCart.splice(targetItemIndex, 1);
    
    localStorage.setItem("cart", JSON.stringify(itemsDataCart));
    
};

/**
 * Total quantité 
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
 * Total prix 
 */
function calculTotalPrice(items) {
    let itemsTotalPrice = 0;

    for (let item of items) {
        itemsTotalPrice = itemsTotalPrice + (parseInt(item.itemDataQuantity, 10) * item.itemDataPrice);
    };
    const calculTotalPrice = document.getElementById("totalPrice");
    calculTotalPrice.textContent =  itemsTotalPrice;
};

/**
 * Vérification des input
 */

let alphaRegex = /^[a-zA-Zçñàéèêëïîôüù '-]+$/;
let alphaNumberRegex = /^[0-9a-zA-Zçñàéèêëïîôüù '-]+$/;
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const address = document.getElementById("address"); 
const city = document.getElementById("city");
const email = document.getElementById("email");

function checkInput() {
    firstName.addEventListener("input", function(e) { 
        if (alphaRegex.test(e.target.value) == false) {
            document.getElementById("firstNameErrorMsg").innerText = "Merci d'entrer un prénom valide, ex: James (lettres et - uniquement).";
            return false; 
        } else {
            document.getElementById("firstNameErrorMsg").innerText = "";
            return true;
        };
    });
    lastName.addEventListener("input", function(e) { 
        if (alphaRegex.test(e.target.value) == false) {
            document.getElementById("lastNameErrorMsg").innerText = "Merci d'entrer un nom valide, ex: Halliday (lettres et - uniquement).";
            return false; 
        } else {
            document.getElementById("lastNameErrorMsg").innerText = "";
            return true;
        }; 
    });
    address.addEventListener("input", function(e) {        
        if (alphaNumberRegex.test(e.target.value) == false) {
            document.getElementById("addressErrorMsg").innerText = "Merci d'entrer une adresse valide, ex: 4 Privet Drive (lettres, chiffres et - uniquement).";
            return false; 
        } else {
            document.getElementById("addressErrorMsg").innerText = "";
            return true;
        }; 
    }); 
    city.addEventListener("input", function(e) {       
        if (alphaRegex.test(e.target.value) == false) {
            document.getElementById("cityErrorMsg").innerText = "Merci d'entrer une ville valide, ex: Paimpont (lettres et - uniquement).";
            return false; 
        } else {
            document.getElementById("cityErrorMsg").innerText = "";
            return true;
        }; 
    });
     email.addEventListener("input", function(e) {       
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
 * Récupération des données du formulaire de contact et création d'un objet
 */
let contact = {};
function createContact (){
    contact = {
    firstName:  firstName.value,
    lastName: lastName.value, 
    address:  address.value, 
    city:  city.value,
    email:  email.value
};
return contact;
};


/**
 * Récupération des produits de la commande
 */
let productsArray = [];
function getCartProductsId (){
    for (let item of itemsDataCart) {
        productsArray.push(item.itemDataId);
    };
};

/**
 * Validation de formulaire 
 */
function formValidation() {
    
        if (alphaRegex.test(firstName.value) == true && alphaRegex.test(lastName.value) == true && alphaRegex.test(city.value) == true && alphaNumberRegex.test(address.value) == true && emailRegex.test(email.value) == true) {
            return true;
        } else {
            return false;
        };
    
};

/**
 * Contrôle avant validation
 */
function validationForOrder () {
    let order = document.getElementById("order");
    order.addEventListener("click", function (e) {
        if (formValidation == true) {
            sendOrder();
        } else {
            alert("Merci de remplir correctement le formulaire de contact.");
        };
    });
};

/**
 * Création de l'objet contenant les données à envoyer
 */
let dataToSend;
function createDataToSend() {
   dataToSend = {
    contact :  contact,
    products : productsArray
};
return dataToSend;
};

/**
 * Envoi de la requête POST
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
            let responseData = res.json();
            window.location.href = "../html/confirmation.html?orderId=" + responseData.orderId;
            //localStorage.clear();
        }
        console.log(res);
    })
    .catch(function (err) {
        console.log("une erreur est survenu lors de l'envoi des données à l'API");
    });
};

/**
 * Fonction principale
 */

 const main = async () => {
    
    cartPagination(itemsDataCart);

    totalQuantity();

    calculTotalPrice(itemsDataCart);

    changeQuantity();

    deleteItem();

    checkInput();

    createContact();
    getCartProductsId();
    createDataToSend();

    sendOrder(dataToSend);

};

main();