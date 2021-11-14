/**
 *Appel API 
 */
const getKanapDataItems = () => fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .catch(function(err) {
        console.log("Une erreur est survenue lors de l'appel des données à l'API")
    });



/**
 * création d'une item card
 */
function itemsCardInfo(item) {

   const itemsAnchor = document.createElement("a");
   const itemsArticle = document.createElement("article");
    itemsAnchor.appendChild(itemsArticle);
   const itemsImage = document.createElement("img");
   const itemsH3 = document.createElement("h3");
   const itemsParagraph = document.createElement("p");
    itemsArticle.appendChild(itemsImage);
    itemsArticle.appendChild(itemsH3);
    itemsArticle.appendChild(itemsParagraph);

    itemsAnchor.setAttribute("href", `./product.html?itemId=${item._id}`);
    itemsImage.setAttribute("src", `${item.imageUrl}`);
    itemsImage.setAttribute("alt", `${item.altTxt}`);
    itemsH3.classList.add("productName");
    itemsH3.textContent = `${item.name}`;
    itemsParagraph.classList.add("productDescription");
    itemsParagraph.textContent = `${item.description}`;

    return itemsAnchor;
}

/**
 * Création pagination
 */
function pagination(products) {
    const itemsList = document.getElementById("items");

    for (let i = 0; i <= products.length-1; i++) {
        itemsList.appendChild(itemsCardInfo(products[i]));
    }
}

/**
 * Fonction principale
 */
const main = async () => {
    const itemsData = await getKanapDataItems();

    pagination(itemsData);

}

main();