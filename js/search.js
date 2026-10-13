document.addEventListener("DOMContentLoaded", function () {
    checkLogged();

    // Funzione per ottenere il valore di un parametro nella query string
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const query = getQueryParam('query');
    if (query) {
        let searchBar = document.querySelector("#searchBar");
        searchBar.value = query.toString(); // Imposta il valore di query nella search bar

        searchRecipes(query);
    }
});

let ingredientRequestList = []; // Variabile globale per contenere gli ingredienti da utilizzare nella ricerca per ingrediente.

async function searchRecipes(query) {
    let contenitore = document.querySelector("#itemList");
    let mex = document.querySelector("#searchMex");
    let plateStorage = [];  // Array di piatti nuovo vuoto
    mex.innerHTML = 'Ricerca in corso...';
    contenitore.innerHTML = ""; // Svuota il contenitore

    try {
        let data = [];

        if (query.length == 1) {    // Ricerca per lettera iniziale
            data = await getUrl(`https://www.themealdb.com/api/json/v1/1/search.php?f=${query}`);
        } else if (await isIngredient(query)) {     // Ricerca per ingrediente (se query corrisponde a un ingrediente)
            // Controlla per ogni ingrediente nella lista
            for (let ingredient of ingredientRequestList) {
                let plates = await getUrl(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
                
                if (plates && plates.length > 0) {
                    plates.forEach(plate => {
                        // Verifica se il piatto non è già presente nella lista (univocità)
                        if (!data.some(existingPlate => existingPlate.idMeal === plate.idMeal)) {
                            data.push(plate);
                        }
                    });
                }
            }
        } else {    // Ricerca per nome del piatto
            data = await getUrl(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        }

        if(data && data.length > 0) {
            mex.innerHTML = 'Sono stati trovati&nbsp;<span style="color: #FFCC00;">' + data.length + '</span>&nbsp;piatti';

            data.forEach(plate => {     // Itera sui risultati e aggiungi i piatti al contenitore
                let gridItem = renderSearchPlateDiv(plate);
                contenitore.appendChild(gridItem);
                getReviewsStats(plate.idMeal, true);

                let plateObj = createPlateObject(plate);
                plateStorage.push(plateObj);
            });
        } else {
            mex.innerHTML = 'Nessun risultato trovato per&nbsp;<span style="color: #FFCC00;">' + query + '</span>.';
        }
    } catch (error) {
        console.error("Errore nella ricerca:", error);
        mex.innerHTML = 'Errore durante la ricerca. Riprova più tardi.';
    }

    localStorage.setItem('plates', JSON.stringify(plateStorage));
}

async function isIngredient(query) {
    try {
        const data = await getUrl("https://www.themealdb.com/api/json/v1/1/list.php?i=list");

        if (data) {
            // Dividi la query in parole separate
            const queryWords = query.toLowerCase().split(/\s+/);

            // Verifica se c'è una corrispondenza per ogni parola nella query
            data.forEach(ingredient => {
                const ingredientNameArray = ingredient.strIngredient.toLowerCase().split(" ");
                queryWords.forEach(word => {
                    if (ingredientNameArray.includes(word) && !ingredientRequestList.includes(ingredient.strIngredient.toLowerCase())) {
                        ingredientRequestList.push(ingredient.strIngredient.toLowerCase().replaceAll(" ", "_")); // Aggiungi l'ingrediente alla lista se corrisponde e non è già presente
                    }
                });
            });

            // Restituisce true se la lista ingredientRequestList non è vuota
            return ingredientRequestList.length > 0;
        }
    } catch (error) {
        console.error("Errore nel controllo degli ingredienti:", error);
    }
    return false;
}


function createPlateObject(plate) {     // Creazione dell'oggetto piatto da pushare per il localStorage
    return plateObj = {
        id: plate.idMeal,
        name: plate.strMeal,
        imageUrl: plate.strMealThumb
    }
}

function renderSearchPlateDiv(plate) {
    let plateSearchDiv = document.createElement('div');
    plateSearchDiv.classList.add('plateSearch');

    // Aggiungi l'evento onclick per la transizione alla pagina piatto.html
    let plateLink = "transitionToPage('plate.html?id=" + plate.idMeal + "')";
    plateSearchDiv.setAttribute('onclick', plateLink);

    // Crea la sezione di sinistra con l'immagine
    let plateLeft = document.createElement('div');
    plateLeft.classList.add('plateLeft');
    let img = document.createElement('img');
    img.classList.add('plateImg');
    img.src = plate.strMealThumb;
    img.alt = plate.strMeal;
    plateLeft.appendChild(img);
    plateSearchDiv.appendChild(plateLeft);

    // Crea la sezione di destra con il nome e altre informazioni
    let plateRight = document.createElement('span');
    plateRight.classList.add('plateRight');

    // Nome del piatto
    let plateName = document.createElement('span');
    plateName.classList.add('plateName');
    plateName.textContent = plate.strMeal;
    plateRight.appendChild(plateName);

    // Controlla se ci sono area e categoria, aggiungi l'elemento solo se presenti
    if (plate.strArea && plate.strCategory) {
        let areaAndCategory = document.createElement('div');
        areaAndCategory.classList.add('areaAndCategory');
        areaAndCategory.textContent = plate.strArea + ' - ' + plate.strCategory;
        plateRight.appendChild(areaAndCategory);
    }

    // Aggiungi le recensioni
    let plateReviews = document.createElement('span');
    plateReviews.classList.add('plateReviews');

    let starReview = document.createElement('span');
    starReview.classList.add('starReview');
    let kidStar = document.createElement('span');
    kidStar.classList.add('material-symbols-outlined', 'kidStar');
    kidStar.textContent = 'kid_star';
    let reviewVoteStar = document.createElement('span');
    reviewVoteStar.classList.add('reviewVote');
    reviewVoteStar.id = "starValue" + plate.idMeal;
    reviewVoteStar.textContent = '-';
    starReview.appendChild(kidStar);
    starReview.appendChild(reviewVoteStar);
    plateReviews.appendChild(starReview);

    // Altri elementi delle recensioni (difficoltà e numero recensioni)
    let difficultyReview = document.createElement('span');
    difficultyReview.classList.add('difficultyReview');
    let stockpot = document.createElement('span');
    stockpot.classList.add('material-symbols-outlined', 'stockpot');
    stockpot.textContent = 'stockpot';
    let reviewVoteDifficulty = document.createElement('span');
    reviewVoteDifficulty.classList.add('reviewVote');
    reviewVoteDifficulty.id = "difficultyValue" + plate.idMeal;
    reviewVoteDifficulty.textContent = '-';
    difficultyReview.appendChild(stockpot);
    difficultyReview.appendChild(reviewVoteDifficulty);
    plateReviews.appendChild(difficultyReview);

    let numberReview = document.createElement('span');
    numberReview.classList.add('numberReview');
    let reviewsIcon = document.createElement('span');
    reviewsIcon.classList.add('material-symbols-outlined', 'reviews');
    reviewsIcon.textContent = 'reviews';
    let reviewCount = document.createElement('span');
    reviewCount.classList.add('reviewVote');
    reviewCount.id = "commentNumber" + plate.idMeal;
    reviewCount.textContent = '-';
    numberReview.appendChild(reviewsIcon);
    numberReview.appendChild(reviewCount);
    plateReviews.appendChild(numberReview);

    plateRight.appendChild(plateReviews);
    plateSearchDiv.appendChild(plateRight);

    return plateSearchDiv;
}