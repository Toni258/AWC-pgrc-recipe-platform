document.addEventListener("DOMContentLoaded", async function() {
    const isLoggedIn = sessionStorage.getItem('logged');    
    if(!isLoggedIn) {                   // Controlla se l'utente è loggato e se ha un valore non nullo, quindi reindirizzo alla login page
        transitionToPage("login.html");
    }
    
    deleteArrow(getTab());
    viewPasswordField();
    updateInformationFields();
    inputEventListeners();
    toggleButtonState();

    const video = document.getElementById('successVideo');
    video.onended = function() {                // Serve a chiudere il popup dopo 500ms
        setTimeout(() => {
            closePopup("popupSuccessModify");
        }, 500);
    };

    document.querySelectorAll('.conteinerArrow').forEach(element => {   // Serve per non permettere all'utente di premere continuamente le frecciette e mandare in tilt il carosello
        element.addEventListener('click', function (e) {
            // Disabilita il clic
            element.style.pointerEvents = 'none';
            
            // Riabilita dopo 300ms
            setTimeout(() => {
                element.style.pointerEvents = 'auto';
            }, 600);
        });
    });

    loadFormulario();
    loadReviews();
});


// ---------------------   Region Functioning   ---------------------

var currentTab = 1;

function getTab() {
    const urlParams = new URLSearchParams(window.location.search);      // Ottengo l'URL corrente
    const tab = urlParams.get('tab');                                   // Ottengo piatto con id passato da url

    if(tab) {
        const carouselItems = document.querySelectorAll('.carousel-item');      // Imposta la classe "active" sugli elementi del carosello
        carouselItems.forEach(item => {         // Rimuove la classe "active" da tutti gli item del carosello
            item.classList.remove('active');
        });

        if(tab == "account") {
            currentTab = 1;
            document.querySelectorAll('.carousel-item')[0].classList.add('active');
        } else if (tab == "ricettario") {
            currentTab = 2;
            document.querySelectorAll('.carousel-item')[1].classList.add('active');
        } else if (tab == "reviews") {
            currentTab = 3;
            document.querySelectorAll('.carousel-item')[2].classList.add('active');
        }
    } else {    // Caso in cui non ci sono parametri
        currentTab = 1;
        document.querySelectorAll('.carousel-item')[0].classList.add('active');
    }

    return currentTab;
}

function deleteArrow(destinationTab) {
    let leftArrow = document.querySelector(".arrowBack");
    let rightArrow = document.querySelector(".arrowForward");
    let title = document.querySelector("#title");
    const currentUrl = new URL(window.location.href);           // Serve per aggiornare l'URL

    if (destinationTab == 1) {
        leftArrow.style.display = "none";
        rightArrow.style.display = "inline-block";
        title.innerHTML = "Your Profile";
        currentUrl.searchParams.set('tab', 'account');
        window.history.pushState({}, '', currentUrl);
    } else if (destinationTab == 2) {
        leftArrow.style.display = "inline-block";
        rightArrow.style.display = "inline-block";
        title.innerHTML = "Ricettario";
        currentUrl.searchParams.set('tab', 'ricettario');
        window.history.pushState({}, '', currentUrl);
    } else if (destinationTab == 3) {
        leftArrow.style.display = "inline-block";
        rightArrow.style.display = "none";
        title.innerHTML = "Reviews";
        currentUrl.searchParams.set('tab', 'reviews');
        window.history.pushState({}, '', currentUrl);
    }
}

function slide(direction) {
    const carousel = new bootstrap.Carousel(document.querySelector('#carouselForm'));
    
    if(direction == "right") {
        carousel.next();
        deleteArrow(++currentTab);
    } else if(direction == "left") {
        carousel.prev();
        deleteArrow(--currentTab);
    }
}





// ---------------------   Region Account   ---------------------

let user;

function viewPasswordField() {      // Permette di vedere la password
    const oldPasswordInput = document.getElementById('oldPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const toggleOldPassword = document.getElementById('toggleOldPassword');
    const toggleNewPassword = document.getElementById('toggleNewPassword');

    toggleOldPassword.addEventListener('click', function() {
        // Controlla se il tipo dell'input è 'password' o 'text'
        if (oldPasswordInput.type === 'password') {
            oldPasswordInput.type = 'text';
            toggleOldPassword.textContent = 'visibility_off'; // Cambia l'icona per 'off'
        } else {
            oldPasswordInput.type = 'password';
            toggleOldPassword.textContent = 'visibility'; // Cambia l'icona per 'on'
        }
    });

    toggleNewPassword.addEventListener('click', function() {
        if (newPasswordInput.type === 'password') {
            newPasswordInput.type = 'text';
            toggleNewPassword.textContent = 'visibility_off';
        } else {
            newPasswordInput.type = 'password';
            toggleNewPassword.textContent = 'visibility';
        }
    });
}

function updateInformationFields() {
    let email = sessionStorage.getItem("logged");
    let users = JSON.parse(localStorage.getItem("users")) || [];
    user = users.find(usez => usez.email == email);

    document.getElementById('username').value = user.username;
    document.getElementById('email').value = user.email;
}

function inputEventListeners() {
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const oldPasswordInput = document.getElementById('oldPassword');
    const newPasswordInput = document.getElementById('newPassword');

    usernameInput.addEventListener('input', toggleButtonState);
    emailInput.addEventListener('input', toggleButtonState);
    oldPasswordInput.addEventListener('input', toggleButtonState);
    newPasswordInput.addEventListener('input', toggleButtonState);
}

function toggleButtonState() {      // Funzione per abilitare/disabilitare il pulsante
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const oldPasswordInput = document.getElementById('oldPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const saveButton = document.querySelector('.bottone-primario');

    const usernameFilled = usernameInput.value.trim() !== '';
    const emailFilled = emailInput.value.trim() !== '';
    const oldPasswordFilled = oldPasswordInput.value.trim() !== '';
    const newPasswordFilled = newPasswordInput.value.trim() !== '';
    
    // Controlla se almeno uno dei campi di input è compilato per username o email
    // oppure se entrambe le password contengono almeno 1 carattere
    if (((usernameFilled && usernameInput.value != user.username) || (emailFilled && emailInput.value != user.email)) || (oldPasswordFilled && newPasswordFilled)) {
        saveButton.classList.remove('disabled');
        saveButton.classList.add('active');
        saveButton.disabled = false; // Abilita il pulsante
    } else {
        saveButton.classList.add('disabled');
        saveButton.classList.remove('active');
        saveButton.disabled = true; // Disabilita il pulsante
    }
}

function inputValidation() {
    let usernameInput = document.querySelector("#username");
    let emailInput = document.querySelector("#email");
    let passwordOldInput = document.querySelector("#oldPassword");
    let passwordNewInput = document.querySelector("#newPassword");
    let checkUsername = true;
    let checkEmail = true;
    let checkPassword = true;

    let newPassword = "";

    if(usernameInput.value != user.username) {                  // Se è richiesto di modificare il campo username
        console.log("Entrato 3");
        // Variabili di errori
        let usernameDiv = document.getElementById('usernameError');

        // Regex per validare la password
        const usernameRegex = /^.{4,}$/;

        // Validazione dello username
        checkUsername &= validateInput(usernameInput, usernameRegex, usernameDiv);
    } /* else {
        checkUsername &= validateInput(usernameInput, /^.{4,}$/, document.getElementById('usernameError'));   // Serve a resettare l'estetica di errore se si rimette le vecchie credenziali
    } */

    if(emailInput.value.toLowerCase() != user.email) {                        // Se è richiesto di modificare il campo email
        // Variabili di errori
        let emailDiv = document.getElementById('emailError');
        let emailTaken = document.querySelector("#emailTaken");

        // Validazione dell'email
        checkEmail &= validateInput(emailInput, emailInput.checkValidity(), emailDiv);

        if(checkEmail) {
            // Recupera l'array di utenti esistente dal localStorage
            let users = JSON.parse(localStorage.getItem('users')) || [];
        
            // Cerca se esiste già un utente con la stessa mail
            const userMatch = users.find(usez => usez.email === emailInput.value.toLowerCase());              // Se trova un utente corrispondente, restituisce quell'oggetto utente. Se non trova nulla, restituisce undefined.
        
            checkEmail &= validateInput(emailInput, !userMatch, emailTaken);                      // Se userMatch è undefined, significa che non c'è un utente con la stessa email (il che va bene, quindi !userMatch è true).
        }
    } /* else {
        checkEmail &= validateInput(emailInput, emailInput.checkValidity(), document.getElementById('emailError'));  // Serve a resettare l'estetica di errore se si rimette le vecchie credenziali
    } */

    if(passwordOldInput.value.length > 0 && passwordNewInput.value.length > 0) {           // Se è richiesto di modificare il campo email
        // Variabili di errori
        let passwordOldDiv = document.getElementById('passwordOldError');
        let passwordNewDiv = document.getElementById('passwordNewError');

        // Regex per validare la password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

        // Validazione della password
        if (user.password == chiper_Password(passwordOldInput.value)) {
            passwordOldInput.classList.remove("input-error");
            passwordOldInput.classList.add("input-correct");
            passwordOldDiv.classList.remove("text-error");
            passwordOldDiv.classList.add("text-correct");
        } else {
            passwordOldInput.classList.add("input-error");
            passwordOldInput.classList.remove("input-correct");
            passwordOldDiv.classList.add("text-error");
            passwordOldDiv.classList.remove("text-correct");
            checkPassword = false;
        }

        checkPassword &= validateInput(passwordNewInput, passwordRegex, passwordNewDiv);

        if(checkPassword) {
            newPassword = passwordNewInput.value;
        }
    }

    if(!checkUsername || !checkEmail || !checkPassword) return;      // Se c'è qualche problema con l'input dell'utente non eseguo più nulla, lo metto qui perchè almeno mi mostra tutti i problemi in un solo colpo
    
    if(checkUsername) {
        let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
        reviews.forEach(review => {
            if (review.email === user.email) {
                review.username = usernameInput.value;
            }
        });
        localStorage.setItem('reviews', JSON.stringify(reviews));

        user.username = usernameInput.value;
    }
    if(checkEmail) {
        let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
        reviews.forEach(review => {
            if (review.email === user.email) {
                review.email = emailInput.value.toLowerCase();
            }
        });
        localStorage.setItem('reviews', JSON.stringify(reviews));

        user.email = emailInput.value.toLowerCase();
    }
    if(checkPassword) {
        user.password = chiper_Password(newPassword);
    }

    return true;
}

function saveCredentials() {
    if(inputValidation()) {
        // Recupera l'array di utenti dal localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let emailBeforePossibleChanges = sessionStorage.getItem('logged') || [];

        // Trova l'indice dell'utente attualmente loggato
        const userIndex = users.findIndex(usez => usez.email === emailBeforePossibleChanges);

        if (userIndex !== -1) {
            // Aggiorna l'utente all'indice trovato
            users[userIndex] = user;

            // Salva nuovamente l'array aggiornato in localStorage
            localStorage.setItem('users', JSON.stringify(users));

            if (user.email != emailBeforePossibleChanges) {
                sessionStorage.setItem('logged', user.email);
            }

            // Feedback per l'utente
            showPopup("popupSuccessModify");
        } else {
            alert('Errore: Utente non trovato.');           // Questo errore avviene solo se cerco di modificare le informazioni di un utente che non corrisponde!
        }
    }
}

function showPopup(id) {            // Funzione per mostrare il popup
    document.getElementById(id).classList.remove('hidden');
}

function closePopup(id) {           // Funzione per chiudere il popup
    document.getElementById(id).classList.add('hidden');

    if (id == "popupSuccessModify") {
        location.reload(); // Ricarica la pagina
    }
}

function logout() {
    sessionStorage.removeItem("logged");

    transitionToPage("home.html");
}

function deleteAccount() {
    // CODICE PER CAMBIARE L'EMAIL DI TUTTE LE RECENSIONI FATTE DA QUESTO UTENTE COSI DA POTER RIUTILIZZARE UN ACCOUNT CON LA STESSA EMAIL, MANTENERE LE RECENSIONI, MA NON ASSEGNARLE AL NUOVO ACC
    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews.forEach(review => {
        if (review.email === user.email) {
            review.email = "deletedAccount";  // Imposto la email della recensione ad una email che so non esisterà mai (quindi non una email)
        }
    });
    localStorage.setItem('reviews', JSON.stringify(reviews));

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = users.filter(usez => usez.email !== user.email);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    logout();
}



// ---------------------   Region Formulario   ---------------------

function deleteFromFormulario(plateId) {
    let users = JSON.parse(localStorage.getItem("users"));
    if (!users) {
        console.error("Nessun utente trovato nel localStorage.");
        return;
    }

    // Filtra il formulario dell'utente per rimuovere il piatto con l'ID fornito
    user.formulario = user.formulario.filter(plate => plate.plateId !== plateId);

    // Aggiorna l'array degli utenti con l'utente modificato
    users = users.map(u => (u.email === user.email ? user : u));

    // Salva i dati aggiornati nel localStorage
    localStorage.setItem("users", JSON.stringify(users));
    
    // Chiudi il popup
    closePopupFormulario("popupRemoveBookmark");

    // Aggiorna l'interfaccia utente
    loadFormulario();
}

function loadFormulario() {
    if (!user || !user.formulario || !Array.isArray(user.formulario)) {
        console.error("L'utente o il Ricettario non sono validi.");
        return;
    }

    let formularioContainer = document.getElementById('contentFormulario');

    formularioContainer.innerHTML = '';     // Svuota il contenitore per evitare duplicati

    if(user.formulario.length > 0) {
        document.getElementById("errorTextFormulario").style.display = "none";
        user.formulario.forEach(plateFormulario => {
            let recipeSavedElement = renderFormulario(plateFormulario);
    
            formularioContainer.appendChild(recipeSavedElement);
        });
    } else {
        document.getElementById("errorTextFormulario").style.display = "block";
    }
}

function renderFormulario(plateFormulario) {
    // Contenitore principale
    let recipeSavedContainer = document.createElement('div');
    recipeSavedContainer.classList.add('recipeSavedContainer');

    // Sezione sinistra con immagine
    let plateLeft = document.createElement('div');
    plateLeft.classList.add('plateLeft');
    let img = document.createElement('img');
    img.classList.add('plateImg');
    img.src = plateFormulario.plateImage;
    plateLeft.appendChild(img);
    recipeSavedContainer.appendChild(plateLeft);

    // Sezione destra
    let plateRight = document.createElement('div');
    plateRight.classList.add('plateRight');

    // Parte superiore destra con nome e bookmark
    let upperRightSection = document.createElement('div');
    upperRightSection.classList.add('upperRightSection');
    let plateName = document.createElement('text');
    plateName.classList.add('plateName');
    plateName.textContent = plateFormulario.plateName;
    upperRightSection.appendChild(plateName);

    let bookmarkButton = document.createElement('span');
    bookmarkButton.classList.add('bookmarkButton', 'material-symbols-outlined');
    bookmarkButton.textContent = 'bookmark';
    bookmarkButton.setAttribute('onclick', `showPopupWithId('popupRemoveBookmark', '${plateFormulario.plateId}')`);

    upperRightSection.appendChild(bookmarkButton);
    plateRight.appendChild(upperRightSection);

    // Area e categoria
    let areaAndCategory = document.createElement('text');
    areaAndCategory.classList.add('areaAndCategory');
    areaAndCategory.textContent = plateFormulario.plateArea + ' - ' + plateFormulario.plateCategory;
    plateRight.appendChild(areaAndCategory);

    // Nota dell'utente
    let yourNote = document.createElement('text');
    yourNote.classList.add('yourNote');
    yourNote.textContent = "Your Note";
    plateRight.appendChild(yourNote);

    // Contenitore della nota
    let plateNote = document.createElement('div');
    plateNote.classList.add('plateNote');
    let textarea = document.createElement('textarea');
    textarea.value = plateFormulario.note || '';
    plateNote.appendChild(textarea);
    plateRight.appendChild(plateNote);

    // Aggiungi l'evento per rilevare le modifiche
    textarea.addEventListener('input', () => {
        if (textarea.value !== plateFormulario.note) {
            const plateIndex = user.formulario.findIndex(plate => plate.plateId === plateFormulario.plateId);
            if (plateIndex !== -1) {
                user.formulario[plateIndex].note = textarea.value;
            }

            let users = JSON.parse(localStorage.getItem("users"));              // Aggiorna i dati nel localStorage
            if (users) {
                users = users.map(u => (u.email === user.email ? user : u));
                localStorage.setItem("users", JSON.stringify(users));
            }
        }
    });

    recipeSavedContainer.appendChild(plateRight);

    return recipeSavedContainer;
}

function showPopupWithId(popupId, plateId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.dataset.plateId = plateId; // Imposta correttamente l'ID della recensione
        popup.classList.remove('hidden'); // Mostra il popup
    } else {
        alert("Errore di show popup con id");
    }
}

function closePopupFormulario(popupId) {
    const popup = document.getElementById(popupId);
    popup.classList.add('hidden'); // Nascondi il popup
    delete popup.dataset.plateId; // Rimuovi l'ID dal dataset
}

function deleteFromFormularioInPopup() {
    const popup = document.getElementById('popupRemoveBookmark');
    const plateId = popup.dataset.plateId;
    deleteFromFormulario(plateId); // Chiama la funzione con l'ID
}




// ---------------------   Region Reviews   ---------------------

function loadReviews() {
    if (!user || !user.reviews || !Array.isArray(user.reviews)) {
        console.error("L'utente o il ricettario non sono validi.");
        return;
    }

    const reviewsContainer = document.getElementById('contentReviews');
    
    reviewsContainer.innerHTML = '';     // Svuota il contenitore per evitare duplicati

    if(user.reviews.length > 0) {
        let allReviews = JSON.parse(localStorage.getItem("reviews"));

        // Filtra solo le recensioni appartenenti all'utente corrente (email corrispondente)
        const userReviews = allReviews.filter(
            review => review.email === user.email && user.reviews.includes(review.plateID)
        );

        document.getElementById("errorTextReviews").style.display = "none";

        userReviews.forEach(review => {
            let reviewElement = renderReviewContainer(review);
    
            reviewsContainer.appendChild(reviewElement);
        });
    } else {
        document.getElementById("errorTextReviews").style.display = "block";
    }
}

function renderReviewContainer(reviewData) {
    // Contenitore principale
    const reviewSavedContainer = document.createElement('div');
    reviewSavedContainer.classList.add('reviewSavedContainer');

    // Sezione sinistra con immagine
    const plateLeft = document.createElement('div');
    plateLeft.classList.add('plateLeft');
    const img = document.createElement('img');
    img.classList.add('plateImgReviews');
    img.src = reviewData.imageUrl;
    plateLeft.appendChild(img);
    reviewSavedContainer.appendChild(plateLeft);

    // Sezione destra
    const plateRight = document.createElement('div');
    plateRight.classList.add('plateRight');

    // Parte superiore destra con nome e icona delete
    const upperRightSectionReviews = document.createElement('div');
    upperRightSectionReviews.classList.add('upperRightSectionReviews');
    const plateNameReviews = document.createElement('text');
    plateNameReviews.classList.add('plateNameReviews');
    plateNameReviews.textContent = reviewData.name;

    if(reviewData.name.length > 35) {
        plateNameReviews.style.fontSize = "20px";
    }

    const deleteIcon = document.createElement('span');
    deleteIcon.classList.add('deleteIcon', 'material-symbols-outlined');
    deleteIcon.textContent = 'delete';
    deleteIcon.setAttribute('onclick', `showPopupWithId('popupRemoveReview', '${reviewData.plateID}')`);
    upperRightSectionReviews.appendChild(plateNameReviews);
    upperRightSectionReviews.appendChild(deleteIcon);
    plateRight.appendChild(upperRightSectionReviews);

    // Sezione Taste
    const tasteContainer = document.createElement('div');
    tasteContainer.classList.add('tasteContainer');
    const tasteText = document.createElement('text');
    tasteText.classList.add('tasteText');
    tasteText.textContent = 'Taste';
    const tasteRating = document.createElement('div');
    tasteRating.classList.add('tasteRating');

    for (let i = 0; i < 5; i++) {
        const star = document.createElement('text');
        star.classList.add('material-symbols-outlined', 'star');
        if (i < reviewData.tasteValue) {
            star.classList.add('fullStar')
        }
        star.textContent = 'star';
        tasteRating.appendChild(star);
    }
    tasteContainer.appendChild(tasteText);
    tasteContainer.appendChild(tasteRating);
    plateRight.appendChild(tasteContainer);

    // Parte inferiore con difficoltà e data
    const bottomSection = document.createElement('div');
    bottomSection.classList.add('bottomSection');

    // Difficoltà
    const difficultyContainer = document.createElement('div');
    difficultyContainer.classList.add('difficultyContainer');
    const difficultyText = document.createElement('text');
    difficultyText.classList.add('difficultyText');
    difficultyText.textContent = 'Difficulty';
    const difficultyRating = document.createElement('div');
    difficultyRating.classList.add('difficultyRating');
    for (let i = 0; i < 5; i++) {
        const pot = document.createElement('text');
        pot.classList.add('material-symbols-outlined', 'difficulty');
        if(i < reviewData.difficultyValue) {
            pot.classList.add('fullDifficulty');
        }
        pot.textContent = 'stockpot';
        difficultyRating.appendChild(pot);
    }
    difficultyContainer.appendChild(difficultyText);
    difficultyContainer.appendChild(difficultyRating);
    bottomSection.appendChild(difficultyContainer);

    // Data
    const dateContainer = document.createElement('div');
    dateContainer.classList.add('dateContainer');
    const dateText = document.createElement('text');
    dateText.classList.add('dateText');
    dateText.textContent = 'Date';
    const dateValue = document.createElement('text');
    dateValue.classList.add('dateValue');
    dateValue.textContent = reviewData.dateValue;
    dateContainer.appendChild(dateText);
    dateContainer.appendChild(dateValue);
    bottomSection.appendChild(dateContainer);

    plateRight.appendChild(bottomSection);
    reviewSavedContainer.appendChild(plateRight);

    return reviewSavedContainer;
}

function closePopupReviews(popupId) {
    const popup = document.getElementById(popupId);
    popup.classList.add('hidden'); // Nascondi il popup
    delete popup.dataset.plateId; // Rimuovi l'ID dal dataset
}

function deleteReviewInPopup() {
    const popup = document.getElementById('popupRemoveReview');
    const plateId = popup.dataset.plateId; // Recupera l'ID della recensione

    if (plateId) {
        // Elimina la recensione dall'array di recensioni dell'utente
        user.reviews = user.reviews.filter(id => id !== plateId);

        // Aggiorna i dati nel localStorage
        let users = JSON.parse(localStorage.getItem("users"));
        if (users) {
            users = users.map(u => (u.email === user.email ? user : u));
            localStorage.setItem("users", JSON.stringify(users));
        }

        // Elimina la recensione anche da localStorage reviews
        let reviews = JSON.parse(localStorage.getItem("reviews"));
        if (reviews) {
            reviews = reviews.filter(review => review.plateID !== plateId);
            localStorage.setItem("reviews", JSON.stringify(reviews));
        }

        // Ricarica le recensioni aggiornate nell'interfaccia
        loadReviews();
    }

    closePopupReviews('popupRemoveReview'); // Chiudi il popup
}
