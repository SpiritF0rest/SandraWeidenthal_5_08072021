/**
 * Définition de constantes
 */
const itemQuantity = document.getElementById("quantity");
const itemColors = document.getElementById("colors");

/**
 * récupération de l'id concerné pour l'appel API
 */
const params = (new URL(document.location)).searchParams;
const itemId = params.get('itemId');
const apiUrlForAnItem = "http://localhost:3000/api/products/" + itemId;

/**
 * Appel API 
 */
const getKanapDataItem = () => fetch(apiUrlForAnItem)
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .catch(function (err) {
        console.log("Une erreur est survenue lors de l'appel des données à l'API")
    });

/**
 * Ajout des données du produit 
 */
function itemInfo(item) {
    const pageTitle = document.querySelector("title");
    pageTitle.textContent = `${item.name}`;

    const itemImage = document.createElement("img");
    document.querySelector(".item__img").appendChild(itemImage);
    itemImage.setAttribute("src", `${item.imageUrl}`);
    itemImage.setAttribute("alt", `${item.altTxt}`);

    const itemName = document.getElementById("title");
    itemName.textContent = `${item.name}`;

    const itemPrice = document.getElementById("price");
    itemPrice.textContent = `${item.price}`;

    const itemDescription = document.getElementById("description");
    itemDescription.textContent = `${item.description}`;

    const itemColorsTable = `${item.colors}`;
    const itemColorsWords = itemColorsTable.split(',');
    for (let i = 0; i <= itemColorsWords.length - 1; i++) {
        const itemColor = document.createElement("option");
        itemColor.setAttribute("value", itemColorsWords[i]);
        itemColor.textContent = itemColorsWords[i];
        itemColors.appendChild(itemColor);
    };
    return;
}

/**
 * vérifie si l'article existe déjà 
 */
const addToCart = document.getElementById("addToCart");

function checkItemsDataStorage(array, itemId, itemColor, itemQuantity) {
    
    for (item of array) {
        if (item.itemDataId == itemId && item.itemDataColor == itemColor) {
            item.itemDataQuantity = parseInt(item.itemDataQuantity, 10) + parseInt(itemQuantity, 10);
            if (item.itemDataQuantity > 100) {
                item.itemDataQuantity = 100;
                alert("Attention, votre quantité pour cet article dépasse le maximum. Elle passe donc à 100 unités.")
            }
            return true;
        };
    };
};

/**
 * vérifie qu'une couleur est sélectionnée 
 */
function checkItemColor() {
    let itemColor = document.getElementById("colors").value;
    if (itemColor != "") {       
       return true;
   };
};

/**
 * vérifie qu'une quantité autorisée est demandée
 */
function checkItemQuantity() {
    let itemQuantity = document.getElementById("quantity").value;
    if (itemQuantity <= 100 && itemQuantity > 0) {
        return true;
    };
};


/**
 * ajout du produit au panier
 * @param {*} item 
 */
function addItemToCart(item) {
    let itemsDataForStorage = [];
    const itemDataObject = {
        itemDataId: itemId,
        itemDataQuantity: document.getElementById("quantity").value,
        itemDataColor: document.getElementById("colors").value,
        itemDataImage: item.imageUrl,
        itemDataImageAltTxt: item.altTxt,
        itemDataName: item.name,
        itemDataPrice: item.price
    };
    if (checkItemColor(itemColors) == true && checkItemQuantity(itemQuantity) == true){
        if (localStorage.getItem("cart")) {
            itemsDataForStorage = JSON.parse(localStorage.getItem("cart"));
            if (checkItemsDataStorage(itemsDataForStorage, itemDataObject.itemDataId, itemDataObject.itemDataColor, itemDataObject.itemDataQuantity)) {
                localStorage.setItem("cart", JSON.stringify(itemsDataForStorage));
            } else {
                itemsDataForStorage.push(itemDataObject);
                localStorage.setItem("cart", JSON.stringify(itemsDataForStorage));
            };
        } else {
            itemsDataForStorage.push(itemDataObject);
            localStorage.setItem("cart", JSON.stringify(itemsDataForStorage));
        };
    } else if(checkItemColor(itemColors) != true) {
        alert("Merci de préciser la couleur désirée.");
    } else if(checkItemQuantity(itemQuantity) != true) {
        alert("Merci de choisir une quantité entre 1 et 100.")
    };
};

/**
 * Fonction principale
 */
const main = async () => {
    const itemData = await getKanapDataItem();

    itemInfo(itemData);

    addToCart.addEventListener("click", function (e) {
        addItemToCart(itemData);  
    });
};

main();

