var usez = [
    {
        email: 'test@gmail.com',
        username: 'Test',
        password: 'Test',
        favoriteDishes: [
            'Filipino',
            'Indian',
            'Moroccan',
            'Portuguese',
            'Pork',
            'Vegan',
            'Vegetarian',
            'Goat',
        ],
        reviews: [],
        formulario: [
            {
                plateId: '53047',
                plateName: 'Moroccan Carrot Soup',
                plateArea: 'Moroccan',
                plateCategory: 'Vegetarian',
                plateImage:
                    'https://www.themealdb.com/images/media/meals/jcr46d1614763831.jpg',
                note: "L'ho trovato leggero e soddisfacente.",
            },
            {
                plateId: '53073',
                plateName: 'Eggplant Adobo',
                plateArea: 'Filipino',
                plateCategory: 'Vegetarian',
                plateImage:
                    'https://www.themealdb.com/images/media/meals/y7h0lq1683208991.jpg',
                note: 'Un piatto delicato e gustoso.',
            },
            {
                plateId: '53014',
                plateName: 'Pizza Express Margherita',
                plateArea: 'Italian',
                plateCategory: 'Miscellaneous',
                plateImage:
                    'https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg',
                note: 'Perfetto per chi ama i dolci, ma senza esagerare con la dolcezza.',
            },
            {
                plateId: '52770',
                plateName: 'Spaghetti Bolognese',
                plateArea: 'Italian',
                plateCategory: 'Beef',
                plateImage:
                    'https://www.themealdb.com/images/media/meals/sutysw1468247559.jpg',
                note: '',
            },
        ],
    },
    {
        email: 'giulia.savoia@example.com',
        username: 'GiuliaSavoia',
        password:
            '26dc6a32f389eb1478d81243f2d756bd9222788a3b92aa0eddafe756e4046792',
        favoriteDishes: ['Italian', 'Pasta', 'Seafood', 'Dessert', 'Vegan'],
        reviews: [],
        formulario: [],
    },
    {
        email: 'marco.bianchi@example.com',
        username: 'MarcoBianchi',
        password:
            '26dc6a32f389eb1478d81243f2d756bd9222788a3b92aa0eddafe756e4046792',
        favoriteDishes: ['French', 'Chicken', 'Starter', 'Lamb', 'Pasta'],
        reviews: [],
        formulario: [],
    },
    {
        email: 'luca.rossi@example.com',
        username: 'LucaRossi',
        password:
            '26dc6a32f389eb1478d81243f2d756bd9222788a3b92aa0eddafe756e4046792',
        favoriteDishes: ['Mexican', 'Pork', 'Side', 'Goat', 'Vegetarian'],
        reviews: [],
        formulario: [],
    },
    {
        email: 'anna.martini@example.com',
        username: 'AnnaMartini',
        password:
            '26dc6a32f389eb1478d81243f2d756bd9222788a3b92aa0eddafe756e4046792',
        favoriteDishes: ['Spanish', 'Dessert', 'Beef', 'Italian', 'Vegan'],
        reviews: [],
        formulario: [],
    },
    {
        email: 'francesco.lombardi@example.com',
        username: 'FrancescoLombardi',
        password:
            '26dc6a32f389eb1478d81243f2d756bd9222788a3b92aa0eddafe756e4046792',
        favoriteDishes: ['Greek', 'Starter', 'Chicken', 'Seafood', 'Pasta'],
        reviews: [],
        formulario: [],
    },
    {
        email: 'sara.russo@example.com',
        username: 'SaraRusso',
        password:
            '26dc6a32f389eb1478d81243f2d756bd9222788a3b92aa0eddafe756e4046792',
        favoriteDishes: ['Thai', 'Pasta', 'Lamb', 'Pork', 'Vegan'],
        reviews: [],
        formulario: [],
    },
    {
        email: 'elena.costa@example.com',
        username: 'ElenaCosta',
        password:
            '26dc6a32f389eb1478d81243f2d756bd9222788a3b92aa0eddafe756e4046792',
        favoriteDishes: [
            'Italian',
            'Seafood',
            'Vegetarian',
            'Dessert',
            'Chicken',
        ],
        reviews: [],
        formulario: [],
    },
    {
        email: 'paolo.neri@example.com',
        username: 'PaoloNeri',
        password:
            '26dc6a32f389eb1478d81243f2d756bd9222788a3b92aa0eddafe756e4046792',
        favoriteDishes: ['Moroccan', 'Beef', 'Starter', 'Lamb', 'Vegan'],
        reviews: [],
        formulario: [],
    },
    {
        email: 'chiara.bellucci@example.com',
        username: 'ChiaraBellucci',
        password:
            '26dc6a32f389eb1478d81243f2d756bd9222788a3b92aa0eddafe756e4046792',
        favoriteDishes: ['Turkish', 'Dessert', 'Vegan', 'Pasta', 'Seafood'],
        reviews: [],
        formulario: [],
    },
    {
        email: 'andrea.galli@example.com',
        username: 'AndreaGalli',
        password:
            '26dc6a32f389eb1478d81243f2d756bd9222788a3b92aa0eddafe756e4046792',
        favoriteDishes: ['Chinese', 'Chicken', 'Pasta', 'Vegetarian', 'Lamb'],
        reviews: [],
        formulario: [],
    },
];

var recensione = [
    'Questa ricetta è fantastica! Ho adorato ogni boccone.',
    'Semplice e delizioso. Lo rifarò sicuramente.',
    'Delizioso e facile da preparare. Un nuovo piatto preferito!',
    'Ottima ricetta, il sapore è perfetto e la preparazione è veloce.',
    'Una vera delizia! I miei amici hanno adorato questo piatto.',
    'Semplice da fare e il risultato è impeccabile.',
    'Gusto incredibile e ingredienti facili da reperire. Consigliatissimo!',
    'Un piatto che ha conquistato tutti a casa. Lo rifarò di sicuro!',
    'Molto gustoso e raffinato. Una ricetta perfetta per le occasioni speciali.',
    'Facile da fare, ma sembra un piatto da ristorante.',
    "Un'esplosione di sapori! Assolutamente da provare.",
    'Mi ha sorpreso quanto sia facile e buonissimo. Top!',
    'La preparazione è semplice e il risultato è eccellente.',
    'Ricetta perfetta per una cena in famiglia. Tutti hanno chiesto il bis!',
    'Un piatto semplice, ma con un sapore ricco e avvolgente.',
    'Ottimo piatto, davvero soddisfacente. È già nella mia lista di ricette preferite!',
    'Il mio nuovo piatto preferito! Una combinazione di sapori deliziosa.',
    'Sapore autentico e preparazione senza stress. Lo adoro.',
    'Questa ricetta è un must per chi ama la cucina casalinga.',
    'Semplice e gustosa. Ideale per ogni occasione.',
];

const plateIdMin = 52764;
const plateIdMax = 53083;
const recipeData = {};

async function fetchRecipes() {
    // Ottiene tutti gli id, nome, imageUrl dei piatti
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    for (let letter of alphabet) {
        try {
            const response = await fetch(
                `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`,
            );
            const data = await response.json();

            if (data.meals) {
                data.meals.forEach((meal) => {
                    recipeData[meal.idMeal] = {
                        name: meal.strMeal,
                        imageUrl: meal.strMealThumb,
                    };
                });
            }
        } catch (error) {
            console.error(`Error fetching data for letter ${letter}:`, error);
        }
    }
}

async function loadDemoData() {
    localStorage.clear();
    localStorage.setItem('users', JSON.stringify(usez));
    await fetchRecipes();

    let reviews = [];

    for (let plateID = plateIdMin; plateID <= plateIdMax; plateID++) {
        // Recupera i dati aggiornati di `users` da localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];

        let numReview = getRandomInt(7); // 0 to 6

        for (let i = 0; i < numReview; i++) {
            let userChosen = users[getRandomInt(users.length)];
            let alreadyReviewed = userChosen.reviews.find(
                (reviewPlateId) => reviewPlateId == plateID,
            );

            if (!alreadyReviewed) {
                if (recipeData[plateID]) {
                    const review = {
                        plateID: String(plateID),
                        email: userChosen.email,
                        username: userChosen.username,
                        tasteValue: String(getRandomInt(5) + 1),
                        difficultyValue: String(getRandomInt(5) + 1),
                        dateValue: getRandomDate().toISOString().split('T')[0],
                        name: recipeData[plateID].name,
                        imageUrl: recipeData[plateID].imageUrl,
                    };

                    // Aggiungi la recensione all'array delle recensioni
                    reviews.push(review);

                    // Aggiorna l'utente nella lista degli utenti
                    users = users.map((user) => {
                        if (user.email === userChosen.email) {
                            // Aggiungi l'ID del piatto all'array delle recensioni
                            if (!user.reviews.includes(String(plateID))) {
                                user.reviews.push(String(plateID));
                            }
                        }
                        return user;
                    });

                    // Salva `users` e `reviews` in localStorage ogni volta che una recensione è aggiunta
                    localStorage.setItem('users', JSON.stringify(users));
                    localStorage.setItem('reviews', JSON.stringify(reviews));
                } else {
                    break;
                }
            } else {
                i--;
            }
        }
    }

    location.reload();
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRandomDate() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 3);
    return new Date(getRandomInt(endDate - startDate) + startDate.getTime());
}

function deleteData() {
    localStorage.clear();
    sessionStorage.clear();

    location.reload();
}
