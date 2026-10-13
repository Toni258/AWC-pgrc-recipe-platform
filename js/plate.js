var setTaste = false;
var setDifficulty = false;

var tasteValue = 0;
var difficultyValue = 0;

document.addEventListener("DOMContentLoaded", async function() {
    checkLogged();

    await loadPlateInfo();

    loadReviews();

    loadRicettario();
});

async function loadPlateInfo() {
    const urlParams = new URLSearchParams(window.location.search);      // Ottengo l'URL corrente
    const plate = await getPlateById(urlParams.get('id'));              // Ottengo piatto con id passato da url

    localStorage.setItem('plate', JSON.stringify(plate));

    let plateImgInput = document.getElementById("plateImg");
    plateImgInput.src = plate.imageUrl;

    let plateTagInput = document.getElementById("plateTags");
    let plateTags = plate.tags;
    plateTags.push(plate.area);

    if (plateTags.length > 0) {       // Se il piatto ha dei tag 
        for (let [index, tag] of plateTags.entries()) {
            let tagItem = document.createElement('div');

            if (index != plateTags.length-1) {
                tagItem.classList.add('tagItem');
            } else {
                tagItem.classList.add('tagItemArea');
            }

            tagItem.textContent = tag;

            plateTagInput.appendChild(tagItem);
        }
    } else {
        plateTagInput.style.display = 'none';  // Nascondi l'elemento perchè non ci sono tag
    }

    let plateNameInput = document.getElementById("plateName");
    plateNameInput.textContent = plate.name;

    let plateIngredientsInput = document.getElementById("ingredients");      // Load Plate Ingredients
    for (let i = 0; i < plate.ingredients.length; i++) {
        let element = document.createElement('li');
        element.classList.add('row');

        let dot = document.createElement('text');
        dot.classList.add("ingredientElement");
        dot.classList.add("col-1");
        dot.textContent = "-";

        let ingredient = document.createElement('text');
        ingredient.classList.add("col-5");
        ingredient.classList.add("ingredientText");
        ingredient.textContent = plate.ingredients[i];

        let measure = document.createElement('text');
        measure.classList.add("col-4");
        measure.classList.add("ingredientElement");
        measure.textContent = plate.measures[i];

        let space = document.createElement('div');
        space.classList.add("col-2");

        element.appendChild(dot);
        element.appendChild(ingredient);
        element.appendChild(measure);
        element.appendChild(space);

        plateIngredientsInput.appendChild(element);
    }

    let instructionsItem = document.getElementById("instructionsList");
    let instructionsText = plate.instructions;

    // Dividi il testo usando un'espressione regolare per gestire i punti seguiti da spazi, \r o \n
    let instructionsArray = instructionsText.split(/\.\s|\.(?=\r?\n)/);

    instructionsItem.innerHTML = "";

    let count = 1;

    // Cicla ogni parte dell'array e crea un nuovo elemento div per ogni frase
    instructionsArray.forEach(instruction => {
        if (instruction.trim()) {  // Evita di aggiungere elementi vuoti
            let instructionDiv = document.createElement('div');
            instructionDiv.classList.add("instructionItem");
            instructionDiv.textContent = count + ") " + instruction.trim() + "."
            instructionsItem.appendChild(instructionDiv);
            count++;
        }
    });

}

function loadReviews() {
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    let plateId = JSON.parse(localStorage.getItem("plate")).id;
    let checkAlreadyReviewedPlate = false;
    let user;
    let email = sessionStorage.getItem("logged");                       // Serve per togliere la possibilità di fare la recensione nel caso sia già stata fatta

    if(email) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        
        user = users.find(usez => usez.email == email);
        if (!user) {
            alert("Utente non trovato!");
            return;
        }
    }

    if (email && user.reviews.find(review => review == plateId)) {      // Se l'utente ha già fatto una recensione per quel piatto
        checkAlreadyReviewedPlate = true;                               // Qui imposto a true cosi che so di non aggiungere la stessa recensione nell'insieme di recensioni

        let userReview = reviews.find(review => review.email === email && review.plateID === plateId);

        document.querySelector("#contentMakeReview").style.display = 'none';

        let boxReview = document.querySelector("#addReview");
        boxReview.style.marginRight = "0px";
        boxReview.appendChild(makeDiv(userReview));
    }

    let matchReviews = reviews.filter(review => review.plateID === plateId);
    
    let reviewSection = document.getElementById("existingReviews");

    reviewSection.innerHTML = '';               // Pulisco le recensioni esistenti prima di caricare nuove recensioni

    if(matchReviews.length == 0) {
        document.querySelector(".scroll-bg").style.display = 'none';
    } else {
        matchReviews.forEach(review => {
            if(checkAlreadyReviewedPlate) {
                if(!(review.email == email)) {
                    reviewSection.appendChild(makeDiv(review));
                }
            } else {
                reviewSection.appendChild(makeDiv(review));
            }
            
        });

        getReviewsStats(plateId, false);
    }
}

function makeDiv(review) {
    let userReview = document.createElement('div');
    userReview.classList.add("userReview");
    
    let profilePic = document.createElement('div');
    profilePic.classList.add("profilePic");
    
    let circle = document.createElement('div');
    circle.classList.add("material-symbols-outlined", "circle", "personLogo");
    circle.textContent = "person";
    
    let username = document.createElement('div');
    username.classList.add("profileName");
    username.textContent = review.username;
    if (review.username.length > 7) {
        username.style.fontSize = "22px";
    }
    
    profilePic.appendChild(circle);
    profilePic.appendChild(username);
    userReview.appendChild(profilePic);
    
    let content = document.createElement('div');
    content.classList.add("content");
    
    // Sezione per il punteggio di gusto
    let tasteSection = document.createElement('div');
    tasteSection.classList.add("section");
     
    let tasteLabel = document.createElement('div');
    tasteLabel.classList.add("label");
    tasteLabel.textContent = "Taste";
     
    let tasteRating = document.createElement('div');
    tasteRating.classList.add("rating");
    for (let i = 1; i <= 5; i++) {
        let star = document.createElement('div');
                
        if (i <= Number(review.tasteValue)) {
            star.classList.add("material-symbols-outlined", "grade");
        } else {
            star.classList.add("material-symbols-outlined", "grade", "deactive");
        }
                
        star.setAttribute("value", i);
        star.textContent = "grade";
        tasteRating.appendChild(star);
    }
    
    tasteSection.appendChild(tasteLabel);
    tasteSection.appendChild(tasteRating);
    content.appendChild(tasteSection);

    // Sezione per il punteggio di difficoltà
    let difficultySection = document.createElement('div');
    difficultySection.classList.add("section");
    
    let difficultyLabel = document.createElement('div');
    difficultyLabel.classList.add("label");
    difficultyLabel.textContent = "Difficulty";
    
    let difficultyRating = document.createElement('div');
    difficultyRating.classList.add("rating");
    
    for (let i = 1; i <= 5; i++) {
        let pot = document.createElement('div');
    
        if (i <= Number(review.difficultyValue)) {
            pot.classList.add("material-symbols-outlined", "difficulty");
        } else {
            pot.classList.add("material-symbols-outlined", "difficulty", "deactive");
        }
    
        pot.setAttribute("value", i);
        pot.textContent = "stockpot";
        difficultyRating.appendChild(pot);
    }
    
    difficultySection.appendChild(difficultyLabel);
    difficultySection.appendChild(difficultyRating);
    content.appendChild(difficultySection);
    
    // Sezione per la data della recensione
    let footer = document.createElement('div');
    footer.classList.add("footer");
    
    let dateLabel = document.createElement('div');
    dateLabel.classList.add("label");
    dateLabel.textContent = "Date";
    
    let dateValue = document.createElement('div');
    dateValue.classList.add("date");
    dateValue.textContent = review.dateValue;
    
    footer.appendChild(dateLabel);
    footer.appendChild(dateValue);
    content.appendChild(footer);
    
    userReview.appendChild(content);

    return userReview;
}


function loadRicettario() {
    let users = JSON.parse(localStorage.getItem("users"));
    let plateObject = JSON.parse(localStorage.getItem("plate"));
    const session = sessionStorage.getItem('logged');
    let activeUser = users.find(user => user.email === session);
    let textLeaveNote = document.getElementById("AddRecipeBoxText");
    let text = document.createElement("span");
    text.classList.add("plateName");
    text.textContent = plateObject.name;

    textLeaveNote.appendChild(text);

    if(activeUser) {
        let formularioPersonale = activeUser.formulario;
        let matchRicetta = formularioPersonale.find(plate => plate.plateId === plateObject.id);

        if (matchRicetta) {
            document.getElementById("bookmark").classList.add("saved");
            document.getElementById("saveRecipeText").innerText = "SAVED";
        }
    }
}

function appearAddFormulario() {    // Fa apparire il box di aggiunta al formulario
    let users = JSON.parse(localStorage.getItem("users"));
    const session = sessionStorage.getItem('logged');
    let plateObject = JSON.parse(localStorage.getItem("plate"));
    
    let activeUser = users.find(user => user.email === session);

    if(!activeUser) {
        transitionToPage("login.html");
    } else {
        let saveRecipeText = document.getElementById("saveRecipeText").innerText;

        if(saveRecipeText == "SAVE RECIPE") {                                      // Cambio scritta e icon
            let boxAggiunta = document.getElementById("addRecipe");
            boxAggiunta.style.display = "block";
        } else if(saveRecipeText == "SAVED") {                                      // Cambio scritta e icon
            // Rimuovi il piatto dal formulario dell'utente
            activeUser.formulario = activeUser.formulario.filter(
                plate => plate.plateId !== plateObject.id
            );

            localStorage.setItem("users", JSON.stringify(users));

            // Cambia stato grafico
            document.getElementById("bookmark").classList.remove("saved");
            document.getElementById("saveRecipeText").innerText = "SAVE RECIPE";
        }
    }
}

function toggleFormulario() {       // Cambia l'icona ed il testo del bottone save recipe
    let users = JSON.parse(localStorage.getItem("users"));
    const session = sessionStorage.getItem('logged');
    
    let activeUser = users.find(user => user.email === session);

    let formularioPersonale = activeUser.formulario;
    let plateObject = JSON.parse(localStorage.getItem("plate"));

    let matchRicetta = formularioPersonale.find(plate => plate.plateId === plateObject.id);

    if (matchRicetta) {
        alert("Hai già aggiunto questa ricetta nel formulario!");
    } else {
        let addRecipeButton = document.getElementById("bookmark");                  
        let saveRecipeText = document.getElementById("saveRecipeText").innerText;
        let noteContent = document.getElementById('inputNoteBox').value;

        if (saveRecipeText == "SAVE RECIPE") {                                      // Cambio scritta e icon
            addRecipeButton.classList.add("saved");
            document.getElementById("saveRecipeText").innerText = "SAVED";
        } else {
            addRecipeButton.classList.remove("saved");
            document.getElementById("saveRecipeText").innerText = "SAVE RECIPE";
        }                                                                           // Cambio scritta e icon

        let plateFormulario = {
            plateId: plateObject.id,
            plateName: plateObject.name,
            plateImage: plateObject.imageUrl,
            plateArea: plateObject.area,
            plateCategory: plateObject.category,
            note: noteContent
        }

        formularioPersonale.push(plateFormulario);

        localStorage.setItem('users', JSON.stringify(users));

        closeAddFormulario();
    }
}

function closeAddFormulario() {
    let boxAggiunta = document.getElementById("addRecipe");
    boxAggiunta.style.display = "none";
}

function changeRating(element, score, type) {
    if ((type == 'taste' && !setTaste) || (type == 'difficulty' && !setDifficulty) || (type == 'set')) {   // Se il set corrispondente al type è false, allora mostro l'animazione
        let ratingElements = element.querySelectorAll('.material-symbols-outlined');    // Ottengo gli elementi con la classe "material-symbols-outlined" dentro element

        ratingElements.forEach((div, index) => {
            if (index+1 > score) {
                div.classList.add('deactiveUser');  // Disattivo il rating
            } else {
                div.classList.remove('deactiveUser');  // Attivo il rating
            }
        });
    }
}

function setRating(element, score, type) {
    if (type == 'taste') {
        setTaste = true;
        tasteValue = score;
    } else {
        setDifficulty = true;
        difficultyValue = score;
    }

    changeRating(element, score, 'set');
}

function toggleReview() {
    let loggedEmail = sessionStorage.getItem('logged');

    if (loggedEmail) {
        let addReviewButton = document.getElementById('addReviewButton');
        let enabledReview = document.getElementById('enabledReview');

        addReviewButton.classList.add('disappear');
        enabledReview.classList.add('appear');

        let today = new Date();
        let formattedDate = today.toISOString().split('T')[0];    // Formatto per compatibilità con input[type="date"] e prendo solo data in formato yyyy-mm-dd
        let dateInput = document.getElementById('dateInput');
        dateInput.value = formattedDate;

        dateInput.max = formattedDate;
    } else {
        transitionToPage("login.html");
    }
}

function addReview() {
    let dateValue = document.getElementById("dateInput").value;
    let plateObject = JSON.parse(localStorage.getItem("plate"));

    let plate = {
        id: plateObject.id,
        name: plateObject.name,
        imageUrl: plateObject.imageUrl
    }

    if (tasteValue > 0 && difficultyValue > 0) {
        addReviewToStorage(plate, tasteValue, difficultyValue, dateValue);
    } else {
        alert("Compila tutti i campi correttamente prima di mandare la recensione!");
    }
}

function addReviewToStorage(plate, tasteValue, difficultyValue, dateValue) {
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let email = sessionStorage.getItem("logged");

    let user = users.find(user => user.email == email);
    if (!user) {
        alert("Utente non trovato!");
        return;
    }

    let username = user.username;
    let reviewsUser = user.reviews || [];

    let alreadyReviewed = reviews.find(review => review.email === email && review.plateID === plate.id);

    if (!alreadyReviewed) {
        let review = {
            plateID: plate.id,
            name: plate.name,
            imageUrl: plate.imageUrl,
            email: email,
            username: username,
            tasteValue: tasteValue,
            difficultyValue: difficultyValue,
            dateValue: dateValue
        };

        reviews.push(review);

        // Aggiorna le recensioni dell'utente
        reviewsUser.push(plate.id);
        user.reviews = reviewsUser;

        // Sovrascrivi l'utente nell'array users
        let updatedUsers = users.map(u => u.email === email ? user : u);

        // Salva i dati aggiornati
        localStorage.setItem("reviews", JSON.stringify(reviews));
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        location.reload(true);
    } else {
        alert("Hai già recensito questo piatto");
    }
}