// Miscellaneous

// Transizione animata alla pagina url
window.transitionToPage = function(url) {
    document.querySelector('body').style.opacity = 0
    setTimeout(function() { 
        window.location.href = url
    }, 600)
}

document.addEventListener('DOMContentLoaded', function(event) {
    document.querySelector('body').style.opacity = 1;

    // Event listener per la barra di ricerca
    const searchBar = document.getElementById("searchBar");

    if(searchBar) {
        searchBar.addEventListener("keydown", async function (event) {
            if (event.key === "Enter") { // Controlla se il tasto premuto è "Enter"
                const query = searchBar.value.trim();
                if (query.length > 0) {
                    // Reindirizza a search.html con la query come parametro
                    window.location.href = `search.html?query=${encodeURIComponent(query)}`;
                }
            }
        });
    }
})

function checkLogged() {
    // Controlla se 'logged' è presente nel sessionStorage e se ha un valore non nullo
    const isLoggedIn = sessionStorage.getItem('logged');

    const ricettarioLink = document.getElementById('ricettario');
    const accountLink = document.getElementById('account');
    const loginLink = document.getElementById('login');

    // Link per il burger menu (dropdown)
    const loggedItems = document.querySelectorAll('.logged');
    const unloggedItem = document.querySelector('.unlogged');

    if (isLoggedIn) {
        // Se l'utente è loggato, mostra "Ricettario" e "Account", nascondi "Login"
        ricettarioLink.style.display = 'block';
        accountLink.style.display = 'block';
        loginLink.style.display = 'none';

        // Mostra gli elementi del burger menu per l'utente loggato
        loggedItems.forEach(item => {
            item.style.display = 'block';
        });
        unloggedItem.style.display = 'none';

    } else {
        // Se l'utente NON è loggato, mostra solo il pulsante "Login"
        ricettarioLink.style.display = 'none';
        accountLink.style.display = 'none';
        loginLink.style.display = 'block';

        // Mostra l'elemento "Login" nel burger menu e nasconde gli altri
        loggedItems.forEach(item => {
            item.style.display = 'none';
        });
        unloggedItem.style.display = 'block';
    }
}

function getReviewsStats(plateID, multiple) {
    let starValueInput;
    let difficultyValueInput;
    let commentNumberInput;
    
    if (multiple) {
        starValueInput = document.querySelector("#starValue" + plateID);
        difficultyValueInput = document.querySelector("#difficultyValue" + plateID);
        commentNumberInput = document.querySelector("#commentNumber" + plateID);
    } else {
        starValueInput = document.querySelector("#starValue");
        difficultyValueInput = document.querySelector("#difficultyValue");
        commentNumberInput = document.querySelector("#commentNumber");
    }

    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    let starValue = 0;
    let difficultyValue = 0;

    let matchReviews = reviews.filter(review => review.plateID === plateID);
    let commentNumber = matchReviews.length;

    if (commentNumber != 0) {
        matchReviews.forEach(comment => {
            starValue += parseFloat(comment.tasteValue);
            difficultyValue += parseFloat(comment.difficultyValue);
        });

        starValueInput.innerHTML = (starValue / commentNumber).toFixed(1);
        difficultyValueInput.innerHTML = (difficultyValue / commentNumber).toFixed(1);
        commentNumberInput.innerHTML = commentNumber;
    }
}

// Funzione di validazione
function validateInput(input, regex, errorDiv) {
    let isValid;

    // Verifica se "regex" è una RegExp
    if (regex instanceof RegExp) {
        isValid = regex.test(input.value);  // Usa regex.test() solo se è una RegExp (per l'email quindi)
    } else {
        isValid = regex;  // Se non è una RegExp, usa il valore booleano
    }

    if (isValid) {
        input.classList.remove("input-error");
        input.classList.add("input-correct");
        errorDiv.classList.remove("text-error");
        errorDiv.classList.add("text-correct");
        return true;
    } else {
        input.classList.add("input-error");
        input.classList.remove("input-correct");
        errorDiv.classList.add("text-error");
        errorDiv.classList.remove("text-correct");
        return false;
    }
}

// Cifra la password con SHA-256 e converte in esadecimale
function chiper_Password(pwd) {
    return CryptoJS.SHA256(pwd).toString(CryptoJS.enc.Hex); 
}