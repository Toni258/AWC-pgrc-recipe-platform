document.addEventListener("DOMContentLoaded", function() {
    checkLogged();

    loadPlateLogged();
});

async function loadPlateLogged() {
    let loggedEmail = sessionStorage.getItem('logged');
    let contenitore = document.querySelector("#itemList");
    let plateStorage = [];

    const email = loggedEmail ? loggedEmail : null;

    if (loggedEmail) {
        const users = JSON.parse(localStorage.getItem('users')) || [];

        const user = users.find(user => user.email === email);  // Trova l'utente corrispondente all'email

        const favoriteDishes = user.favoriteDishes;

        for (let item of favoriteDishes) {
            let [plate, type] = await getRandom(item);
            if(plate) {
                let gridItem = renderPlateDiv(plate, type);
                contenitore.appendChild(gridItem);
            
                let plateObj = createPlateObject(plate);
                plateStorage.push(plateObj);
            }
        }

        localStorage.setItem('plates', JSON.stringify(plateStorage));

        if (favoriteDishes.length <= 10) {     // Aggiungo dei piatti randomici oltre a quelli consigliati in base ai preferiti
            createAndRenderRandomPlate(10, contenitore, plateStorage);
        } else {
            createAndRenderRandomPlate(5, contenitore, plateStorage);
        }

    } else {
        console.log("Not logged in");

        createAndRenderRandomPlate(18, contenitore, plateStorage);
    }
}

async function createAndRenderRandomPlate(quantity, contenitore, plateStorage) {
    let dishes = [...await getRandomMeal(quantity)];

    for (let plate of dishes) {
        let gridItem = renderPlateDiv(plate, "not-logged");

        contenitore.appendChild(gridItem);

        let plateObj = createPlateObject(plate);

        plateStorage.push(plateObj);
    }

    localStorage.setItem('plates', JSON.stringify(plateStorage));
}

function renderPlateDiv(plate, type) {     // Creazione del div piatto in homepage
    let gridItem = document.createElement('div');
    gridItem.classList.add('grid-item');
    gridItem.id = plate.idMeal;

    if (type == "area") {
        gridItem.classList.add('area');
    } else if (type == "categoria") {
        gridItem.classList.add('categoria');
    } else {
        gridItem.classList.add('not-logged');
    }

    // Aggiungi l'evento onclick per la transizione alla pagina piatto.html
    let plateLink = "transitionToPage('plate.html?id=" + plate.idMeal + "')";
    gridItem.setAttribute('onclick', plateLink);

    let img = document.createElement('img');
    img.classList.add("plateImg");
    img.src = plate.strMealThumb;
    img.alt = plate.strMeal;
    gridItem.appendChild(img);

    let text = document.createElement('text');
    text.textContent = plate.strMeal;
    text.classList.add("plateName");
    gridItem.appendChild(text);

    return gridItem;
}

function createPlateObject(plate) {     // Creazione dell'oggetto piatto da pushare per il localStorage
    return plateObj = {
        id: plate.idMeal,
        name: plate.strMeal,
        imageUrl: plate.strMealThumb
    }
}

async function getRandom(favorite) {
    var areas = await getAllAreas();

    const areaMatch = areas.find(area => area.strArea === favorite);

    if (areaMatch) {
        var data = await getUrl("https://www.themealdb.com/api/json/v1/1/filter.php?a=" + favorite);

        if (!data) {
            console.error(`Nessun piatto trovato per l'area: ${favorite}`);
            return [null, "area"];
        }

        let plate = data[Math.floor(Math.random() * data.length)];

        return [plate, "area"];
    } else {
        var data = await getUrl("https://www.themealdb.com/api/json/v1/1/filter.php?c=" + favorite);

        if (!data) {
            console.error(`Nessun piatto trovato per la categoria: ${favorite}`);
            return [null, "categoria"];
        }

        let plate = data[Math.floor(Math.random() * data.length)];

        return [plate, "categoria"];
    }
}