// Serve per inserire i tag "preferiti" dentro al scroll
document.addEventListener('DOMContentLoaded', async function() {
    viewPasswordField();

    if (document.querySelector("#itemList")) {   // Se sono nella pagina signup.html eseguo questo codice
        let areas = [];
        let categories = [];

        let results = await getAllAreas();
        for (let area of results) {
            areas.push({
                name: area.strArea
            });
            addItem(area.strArea.toUpperCase());
        }

        results = await getAllCategories();
        for (let category of results) {
            categories.push({
                name: category.strCategory,
                description: category.strCategoryDescription
            });
            addItem(category.strCategory.toUpperCase());
        }
    } else {                                      // Se sono nella pagina login.html eseguo questo codice
        return;
    }
});

function viewPasswordField() {      // Permette di vedere la password
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');

    togglePassword.addEventListener('click', function() {
        if (passwordInput.type === 'password') {            // Controlla se il tipo dell'input è 'password' o 'text'
            passwordInput.type = 'text';
            togglePassword.textContent = 'visibility_off';
        } else {
            passwordInput.type = 'password';
            togglePassword.textContent = 'visibility';
        }
    });
}

// Per scrivere title case
function capitalizeFirstLetter(str) {
    return str
        .toLowerCase()  // Prima tutto minuscolo
        .split(' ')     // Dividi la stringa in parole
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Prima lettera maiuscola
        .join(' ');     // Unisci le parole con spazi
}

// Serve ad aggiungere i preferiti nello scroll
function addItem(text) {
    let itemList = document.querySelector("#itemList");
    if (itemList) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        const uniqueId = 'checkbox-' + text.replace(/\s+/g, '-').toLowerCase();
        checkbox.id = uniqueId;
        checkbox.value = text;

        const label = document.createElement('label');
        label.textContent = text;
        label.setAttribute('for', uniqueId);

        itemList.appendChild(checkbox);
        itemList.appendChild(label);
    }
}

// Ottiene le checkbox scelte
function getSelectedCheckBox() {
    let selectedItems = [];
    const checkboxes = document.querySelectorAll('#itemList input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedItems.push(capitalizeFirstLetter(checkbox.value));
        }
    });

    return selectedItems;
}

// Serve per validare il login
function loginValidation () {
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");
    const mex = document.querySelector("#mexFailed");

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const userMatch = users.find(user => user.email === emailInput.value && user.password === chiper_Password(passwordInput.value));

    // Se l'utente non è trovato
    let dummy = validateInput(emailInput, userMatch, mex);
    dummy = validateInput(passwordInput, userMatch, mex);
    
    if (dummy) {
        sessionStorage.setItem('logged', emailInput.value);
        transitionToPage('./home.html');
    }
}

// Serve a validare il signup
function registerValidation() {
    let usernameInput = document.querySelector("#username");
    let emailInput = document.querySelector("#email");
    let passwordInput = document.querySelector("#password");

    let passwordDiv = document.getElementById('passwordError');
    let usernameDiv = document.getElementById('usernameError');
    let emailDiv = document.getElementById('emailError');
    let emailTaken = document.querySelector("#emailTaken");
    let check = true;

    // Regex per validare la username e password
    const usernameRegex = /^.{4,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

    // Validazione dello username
    check &= validateInput(usernameInput, usernameRegex, usernameDiv);

    // Validazione dell'email
    check &= validateInput(emailInput, emailInput.checkValidity(), emailDiv);

    // Validazione della password
    check &= validateInput(passwordInput, passwordRegex, passwordDiv);

    if (!check) return;  // Se c'è qualche problema con l'input dell'utente non eseguo più nulla

    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Cerca se esiste già un utente con la stessa mail
    const userMatch = users.find(user => user.email === emailInput.value.toLowerCase());

    let dummy = validateInput(emailInput, !userMatch, emailTaken);

    if (!dummy) return;

    // Se tutto va a buon fine, scorri al prossimo item del carosello
    const carousel = new bootstrap.Carousel(document.querySelector('#carouselForm'));
    carousel.next();
}

// Registra un utente nuovo
function registerUser() {
    let username = document.querySelector("#username").value;
    let email = document.querySelector("#email").value.toLowerCase();
    let password = document.querySelector("#password").value;
    let formulario = [];
    let review = [];

    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Crea un oggetto utente
    const user = {
        username: username,
        email: email,
        password: chiper_Password(password),
        favoriteDishes: getSelectedCheckBox(),
        formulario: formulario,
        reviews: review
    };

    // Aggiungi il nuovo utente all'array
    users.push(user);

    // Salva l'array di utenti nel localStorage
    localStorage.setItem('users', JSON.stringify(users));

    sessionStorage.setItem('logged', email);

    transitionToPage('./home.html');    // Vai alla homepage
}