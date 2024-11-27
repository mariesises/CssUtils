const characters = [
    { name: "Personaje 1", img: "img/11.jpg", match: true, description: "Descripción del match." },
    { name: "Personaje 2", img: "img/12.jpg", match: false, description: "Descripción del no match." },
    { name: "Personaje 3", img: "img/13.jpg", match: true, description: "Descripción del match." },
    { name: "Personaje 4", img: "img/14.jpg", match: true, description: "Descripción del match." },
];

let currentRound = 0;
let score = 0;
const maxRounds = 3;

// Variable para controlar si la ronda está activa y bloquear el acceso a otra respuesta
let roundActive = true;

function loadRound() {
    if (currentRound >= maxRounds) {
        showResult();
        return;
    }
    $("#character1").css("background-image", `url(${characters[currentRound].img})`);
    $("#character2").css("background-image", `url(${characters[currentRound + 1].img})`);
    $("#feedback").text("");
    roundActive = true;
}

function checkMatch(isMatch) {
    if (!roundActive) return;
    const correctMatch = characters[currentRound].match;
    if (isMatch === correctMatch) {
        score++;
        $("#feedback").text("¡Correcto! " + characters[currentRound].description);
    } else {
        $("#feedback").text("Incorrecto. " + characters[currentRound].description);
    }
    console.log(`Round ${currentRound + 1}: ${isMatch ? 'Right Swipe' : 'Left Swipe'} - Correct Match: ${correctMatch}`);
    currentRound++;
    roundActive = false;
    $("#next-round").show();
}


//Funcion final para el resultado
function showResult() {
    $("#game-container").hide();
    $("#result-screen").show();
    let resultMessage = "";
    if (score === 3) {
        resultMessage = "¡Enhorabuena! eres el terror de los match. Dominas Pucela y su historia como nadie";
    } else if (score === 2) {
        resultMessage = "¡Genial! tienes ojo para los match. Vuelve a jugar cuando quieras y consigue el 3/3";
    } else if (score === 1) {
        resultMessage = "Bueeeeno, ¡por algo se empieza! Te invitamos a pasear por Valladolid para acabar de empaparte de nuestra historia";
    } else {
        resultMessage = "Ufff, 0/3, hacer match en Pucela no es fácil, pero creo que te has pasado... ¡juega de nuevo y aprende sobre nuestra historia!";
    }
    $("#result-message").text(resultMessage);
}

$(document).ready(function () {
    loadRound();

    $("#character1").swipe({
        swipeLeft: function () {
            if (roundActive) {
                animateSwipe($(this), 'left');
                checkMatch(false, true); // Pasar true para indicar que es el character1 (izquierda)
            }
        },
        threshold: 50
    });

    $("#character2").swipe({
        swipeRight: function () {
            if (roundActive) {
                animateSwipe($(this), 'right');
                checkMatch(true, false); // Pasar false para indicar que es el character2 (derecha)
            }
        },
        threshold: 50
    });

    function animateSwipe(element, direction) {
        const moveDistance = direction === 'left' ? '-150%' : '150%'; // Mover un 150% para que salga de la pantalla
        element.animate({ left: moveDistance }, 500, function () {
            element.css('left', '0'); // Restablecer la posición después de la animación
        });
    }

    $("#next-round").click(function () {
        $(this).hide();
        loadRound();
    });

    $("#play-again").click(function () {
        currentRound = 0;
        score = 0;
        $("#result-screen").hide();
        $("#game-container").show();
        loadRound();
    });
});
