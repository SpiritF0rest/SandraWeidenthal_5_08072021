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
  .then(function(res) {
      if (res.ok) {
          return res.json();
      }
  })
  .catch(function(err) {
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
 
     const itemName  = document.getElementById("title");
     itemName.textContent = `${item.name}`;
 
     const itemPrice = document.getElementById("price");
     itemPrice.textContent = `${item.price}`;
 
     const itemDescription = document.getElementById("description");
     itemDescription.textContent = `${item.description}`;
 
     const itemColors = document.getElementById("colors");
     const itemColorsTable = `${item.colors}`;
     const itemColorsWords = itemColorsTable.split(',');
     for (let i = 0; i <= itemColorsWords.length-1; i++) {
         const itemcolor = document.createElement("option");
         itemcolor.setAttribute("value", itemColorsWords[i]);
         itemcolor.textContent = itemColorsWords[i];
         itemColors.appendChild(itemcolor);
     };
     return;
 }
 
 /**
  * Fonction principale
  */
 const main = async () => {
     const itemData = await getKanapDataItem();
 
     itemInfo(itemData);
 
 }
 
 main();