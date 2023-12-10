$(document).ready(function () {
    var originalNumbers = [...Array(25).keys()].map(x => x + 1);
    var currentNumbers = [...originalNumbers];
    var newNumbers = [...Array(25).keys()].map(x => x + 26);
    var level = 1;
    var isPhaseOne = true;
    var resultTime;
    var timerInterval;
    var usedNumbers = [];

    function updateTimer() {
        var currentTime = +new Date;
        var elapsedTime = (currentTime - startTime) / 1000;
        $("#timer").text(elapsedTime.toFixed(3));
    }
    $("#theme-selector input").change(function () {
        var selectedTheme = $("input[name='theme']:checked").val();
        $("#grid").removeClass().addClass(selectedTheme);
    });

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function resetGame() {
        level = isPhaseOne ? 1 : 26;
        currentNumbers = isPhaseOne ? shuffle([...originalNumbers]) : shuffle([...newNumbers]);

        clearInterval(timerInterval);

        renderNumbers();
        startTime = +new Date;
        timerInterval = setInterval(updateTimer, 50);
    }

    function renderNumbers() {
        $("#grid").empty();
        var numbersToDisplay = isPhaseOne ? currentNumbers : shuffle([...newNumbers]);

        numbersToDisplay.forEach(function (number, index) {
            var div = $('<div>').text(number).addClass('number').attr('data-index', index);
            $('#grid').append(div);
        });

        if (!isPhaseOne) {
            // En la segunda etapa, cambiar el fondo a blanco solo para los números de 26 a 50
            $('#grid .number').each(function () {
                var div = $(this);
                var number = parseInt(div.text());
                div.css('background-color', number >= 26 && number <= 50 ? 'white' : 'red');
            });
        }
    }

    function startTimer() {
        var startTime = +new Date;

        timerInterval = setInterval(function () {
            var currentTime = +new Date;
            resultTime = (currentTime - startTime) / 1000;
            $("#time").text(resultTime.toFixed(3));
        }, 50);
    }

    function handleTap(element) {
        var tappedNumber = parseInt(element.text());
        var tappedIndex = parseInt(element.attr('data-index'));
    
        if (tappedNumber === level) {
            animateNumber(element, tappedIndex);
            level++;
    
            if (level <= 50) {
                if (isPhaseOne) {
                    startTimer();
                } else {
                    if (level === 26) {
                        isPhaseOne = false;
                        resetGame();
                    }
                    startTimer();
                }
            }
    
            if (level === 51) {
                endGame();
            }
        }
    }
    
    
    function animateNumber(element, index) {
        element.animate({
            opacity: 0
        }, 100, function () {
            var newNumber = isPhaseOne ? getRandomUnusedNumber() : '';
            element.stop().addClass("second").animate({
                opacity: 1
            }, 100).text(newNumber);

            if (!isPhaseOne) {
                // En la segunda etapa, cambiar el fondo a blanco solo para los números de 26 a 50
                var parsedNewNumber = parseInt(newNumber);
                element.css('background-color', parsedNewNumber >= 26 && parsedNewNumber <= 50 ? 'white' : 'red');
            }

            if (level === 51) {
                // Si el usuario ha alcanzado el número 50, terminar el juego
                endGame();
            }
        });
    }

    function getRandomUnusedNumber() {
        var newNumber;
        do {
            newNumber = getRandomNumberFromRange(26, 50);
        } while (usedNumbers.includes(newNumber));

        usedNumbers.push(newNumber);

        return newNumber;
    }

    function getRandomNumberFromRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function endGame() {
        clearInterval(timerInterval);

        var redirectURL = getRedirectResultPageURL(resultTime);
        var resultLink = $("<a>").attr("href", redirectURL).attr("id", "resultLink");

        $("#grid").append(resultLink);

        setTimeout(function () {
            document.querySelector("#resultLink").click();
        }, 500);
    }

    $("#grid").on("click", ".number", function () {
        handleTap($(this));
    });

    // Inicialización del juego
    resetGame();
});
