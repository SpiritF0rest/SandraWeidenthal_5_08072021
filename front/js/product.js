/**
 * Constants definition
 */
const itemQuantity  = document.getElementById("quantity");
const itemColors    = document.getElementById("colors");
const addToCart     = document.getElementById("addToCart");

/**
 * Get ID concerned for API call
 */
const params            = (new URL(document.location)).searchParams;
const itemId            = params.get('itemId');
const apiUrlForAnItem   = "http://localhost:3000/api/products/" + itemId;

/**
 * API call for one product
 * @returns { Promise }
 */
const getKanapDataItem = () => fetch(apiUrlForAnItem)
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .catch(function (err) {
        console.log("Une erreur est survenue lors de l'appel des données à l'API");
    });

/**
 * Adding product data
 * @param {*} item 
 * @returns { HTMLElement }
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
    // add all colors in the options list
    for (let i = 0; i <= itemColorsWords.length - 1; i++) {
        const itemColor = document.createElement("option");
        itemColor.setAttribute("value", itemColorsWords[i]);
        itemColor.textContent = itemColorsWords[i];
        itemColors.appendChild(itemColor);
    };
    return;
};



/**
 * Check if the article already exists
 * @param { Object [] } array 
 * @param { String } itemId 
 * @param { String } itemColor 
 * @param { String } itemQuantity 
 * @returns { Boolean }
 */
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
 * Check that a color is selected
 * @returns { Boolean }
 */
function checkItemColor() {
    let itemColor = document.getElementById("colors").value;
    if (itemColor != "") {
        return true;
    };
};

/**
 * Check that an authorized quantity is requested
 * @returns { Boolean }
 */
function checkItemQuantity() {
    let itemQuantity = document.getElementById("quantity").value;
    if (itemQuantity <= 100 && itemQuantity > 0) {
        return true;
    };
};


/**
 * Add product to cart in local storage
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
    if (checkItemColor(itemColors) == true && checkItemQuantity(itemQuantity) == true) {
        // Check if the cart exists
        if (localStorage.getItem("cart")) {
            itemsDataForStorage = JSON.parse(localStorage.getItem("cart"));
            // Check if the product exists in the cart
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
    } else if (checkItemColor(itemColors) != true) {
        alert("Merci de préciser la couleur désirée.");
    } else if (checkItemQuantity(itemQuantity) != true) {
        alert("Merci de choisir une quantité entre 1 et 100.");
    };
};

/**
 *  Main function
 */
const main = async () => {
    const itemData = await getKanapDataItem();
    itemInfo(itemData);
    // add product on click
    addToCart.addEventListener("click", function (e) {
        addItemToCart(itemData);
        if (checkItemColor(itemColors) == true && checkItemQuantity(itemQuantity) == true) {
            alert("Le produit a été ajouté à votre panier");
        };
    });
};

main();

