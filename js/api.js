async function getUrl(url) {
    let lista;

    try {
        var response = await fetch(url);
        
        var results = await response.json();
        
        lista = results.meals;
    } catch (err) {
        console.error(err);
    }

    return lista;
}

async function getAllCategories() {
    let categories;

    try {
        var response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
        
        var results = await response.json();
        
        categories = results.categories;
    } catch (err) {
        console.error(err);
    }

    return categories;
}

async function getAllAreas() {
    let areas;

    try {
        var response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
        
        var results = await response.json();
        
        areas = results.meals;
    } catch (err) {
        console.error(err);
    }

    return areas;
}

// Restituisce n piatti randomici
async function getRandomMeal(n) {
    let meals = new Map();
    while (meals.size < n) {
        try {
            const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
            const meal = await response.json();
            meals.set(meal.meals[0].idMeal, meal.meals[0]);
        } catch (err) {
            console.error('Errore:', err);
        }
    }
    return meals.values();
}

// Ottiene un piatto in base all'id
async function getPlateById(id) {
    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);
        const results = await response.json();
        
        return results.meals?.length > 0 ? createPlateFullInfo(results.meals[0]) : null;        // Restituisce null se non ci sono piatti con quell'id
    } catch (err) {
        console.error(err);
        return null; // In caso di errore, restituisce null
    }
}

// Restituisce piatti in base alla categoria
async function searchByCategory(category) {
    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=" + category);
        const results = await response.json();
        return results.meals || []; // Restituisce un array vuoto se meals non esiste
    } catch (err) {
        console.error(err);
        return []; // In caso di errore, restituisce un array vuoto
    }
}

function createPlateFullInfo(plate) {     // Creazione piatto con tutti i dettagli sistemati bene
    let tags = [];
    let ingredients = [];
    let measures = [];
    
    if (plate.strTags) {                  // Controllo se strTags è definito e non nullo prima di fare split
        tags = plate.strTags.split(',');
    }
    
    // Ciclo per aggiungere ingredienti e misure
    for (let i = 1; i <= 20; i++) {
        let ingredient = plate[`strIngredient${i}`];
        let measure = plate[`strMeasure${i}`];

        // Controllo se l'ingrediente non è vuoto o composto da spazi vuoti
        if (ingredient && ingredient.trim() !== "") {
            ingredients.push(ingredient);
            measures.push(measure);
        } else {
            break;      // Esci dal ciclo se l'ingrediente è vuoto o composto da spazi vuoti
        }
    }
    
    return plateObj = {
        id: plate.idMeal,
        name: plate.strMeal,
        category: plate.strCategory,
        area: plate.strArea,
        instructions: plate.strInstructions,
        imageUrl: plate.strMealThumb,
        tags: tags,
        youtube: plate.strYoutube,
        ingredients: ingredients,
        measures: measures,
        source: plate.strSource,
        imageSource: plate.strImageSource
    }
}

