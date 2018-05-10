$(function() { //On Ready jQuery function.

    const cardList = [

        'diamond', 'paper-plane', 'anchor', 'bolt',
        'cube', 'anchor', 'leaf', 'bicycle',
        'diamond', 'bomb', 'leaf', 'bomb',
        'bolt', 'bicycle',
        'paper-plane', 'cube'
    ];

    let opened = []; //push open cards in this array.
    let matches = 0; //the initial number of matched cards.
    let hasGameStarted = false; //game state at beginning.
    let movesCounter = 0; //count the moves
    let starsCounter = 3; //count the stars
    let $movesElement = $("#moves"); //Grab the moves element.
    let $starsElement = $(".stars"); //Grab the stars element.


    //Fisher Yates Algorithm to shuffle arrays.
    function shuffle(array) {
        let currentIndex = array.length,
            temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
    //Dynamically add card elements to the deck container.
    function putCardsOnDeck() {
        shuffle(cardList);
        for (let i = 0; i < cardList.length; i++) {
            let theDeck = document.querySelector('.deck');
            let cardHTML = `<li class="card" id="card_${i+1}"><i class="fa fa-${cardList[i]}"></li>`;
            theDeck.innerHTML += (cardHTML);
        }
    }
    //Toggling the card
    //flipInY, bounceIn and tada classes that are passed as args are adopted from the animate.css file written by
    //Daniel Eden https://daneden.github.io/animate.css/
    function cardToggle() {
        if (hasGameStarted === false) {
            hasGameStarted = true;
            countUpTimer.start();
        }
        if (opened.length === 0) {
            if ($(this).hasClass('flipInY')) {
                $(this).removeClass('flipInY');
                $(this).addClass('animated').toggleClass('show open bounceIn');
            } else {
                $(this).addClass('animated').toggleClass('show open bounceIn');
            }
            opened.push($(this));
            removeClickEvent();
        } else if (opened.length === 1) {
            updateMoveCounter();
            if ($(this).hasClass('flipInY')) {
                $(this).removeClass('flipInY');
                $(this).addClass('animated').toggleClass('show open bounceIn');
            } else {
                $(this).addClass('animated').toggleClass('show open bounceIn');
            }
            opened.push($(this));
            setTimeout(compareOpenCards, 700);
        }
    }
    //Comparing the open cards to check for a match
    function compareOpenCards() {
        //If a match is found, keep them opened.
        if (opened[0][0].firstChild.className == opened[1][0].firstChild.className) {
            opened[0].toggleClass('match bounceIn tada');
            opened[1].toggleClass('match bounceIn tada');
            matches++;
            removeClickEvent();
            opened = [];
            setTimeout(isWon, 1000)
        } else { //If a match is not found, flip them back.
            opened[0].toggleClass("show open bounceIn flipInY");
            opened[1].toggleClass("show open bounceIn flipInY");
            addClickEvent();
            opened = [];
        }
    }
    //Increase the counts and remove a star if a specific number of moves is passed.
    function updateMoveCounter() {
        movesCounter++;
        $movesElement.html(`Moves: ${movesCounter}`);
        if (movesCounter == 20) {
            removeStar();
            starsCounter--;
        } else if (movesCounter == 35) {
            removeStar();
            starsCounter--;
        }
    }
    //Activate click event on flipped cards.
    function addClickEvent() {
        opened[0].on("click", cardToggle)
    }
    //remove click events from each opened card.
    function removeClickEvent() {
        opened.forEach(function(openedCard) {
            openedCard.off('click')
        });
    }
    //remove star.
    function removeStar() {
        $starsElement.children()[0].remove();
        $starsElement.append('<li><i class="fa fa-star-o"></i></li>');
    }
    //add star.
    function addStar() {
        for (let i = 0; i < $starsElement.children().length; i++) {
            let elem = $starsElement.children()[i];
            elem.innerHTML = '<li><i class="fa fa-star"></i></li>'
        }
    }
    //Timer object is created by the awesome Albert Gonzalez 
    //https://albert-gonzalez.github.io/easytimer.js/
    let countUpTimer = new Timer();
    countUpTimer.addEventListener('secondsUpdated', function(e) {
        $('#count-up-timer').html(countUpTimer.getTimeValues().toString());
    });
    //Checking win state.
    function isWon() {
        if (matches >= 8) {
            countUpTimer.stop(); //Timer stops.
            $('.deck').fadeOut('fast'); //Hiding the deck element.
            $('.score-panel').fadeOut('fast'); //Hiding the score panel element.
            let $winnerModal, $movesCountByEnd, $starsCountByEnd, $timeByEnd, timer;
            $winnerModal = $("#winner");
            $movesCountByEnd = $("#movescount");
            $starsCountByEnd = $("#starscount");
            $timeByEnd = $("#timecount");
            timer = document.getElementById('count-up-timer');
            $winnerModal.removeClass('winnerSectionHider').fadeIn('fast');
            $movesCountByEnd.html(`Moves: ${movesCounter}`); //Grab moves count and populate the movescount element.
            //Grab stars count and populate the starscount element.
            switch (starsCounter) {
                case 3:
                    $starsCountByEnd.html(`<ul class="stars"><li><i class="fa fa-star"></i></li>
                    <li><i class="fa fa-star"></i></li>
                    <li><i class="fa fa-star"></i></li>
                    </ul> `)
                    break;
                case 2:
                    $starsCountByEnd.html(`<ul class="stars"><li><i class="fa fa-star"></i></li>
                    <li><i class="fa fa-star"></i></li>
                    <li><i class="fa fa-star-o"></i></li>
                    </ul> `)
                    break;
                case 1:
                    $starsCountByEnd.html(`<ul class="stars"><li><i class="fa fa-star"></i></li>
                    <li><i class="fa fa-star-o"></i></li>
                    <li><i class="fa fa-star-o"></i></li>
                    </ul> `)
                    break;
            }
            $timeByEnd.html(`Time consumed: ${timer.innerHTML}`); //Grab time and populate the count-up-timer element.
            $("#count-up-timer").html("00:00:00"); //Reset timer to zero.
        }

    }
    //Initialize the game.
    function playGame() {
        putCardsOnDeck();
        $('.card').click(cardToggle);
        $movesElement.html(`Moves: 0`);

    }
    // Resetting the game to its initial state when clicked mid-game.
    function resetGame() {
        $('.deck').empty();
        countUpTimer.stop()
        $("#count-up-timer").html("00:00:00")
        addStar();

        //Reassinging the global variables to their initial states.
        opened = [];
        matches = 0;
        hasGameStarted = false;
        movesCounter = 0;
        starsCounter = 3;
        $movesElement.html('');

        //Relaunching the game
        playGame();
    }
    //Restarting the game after the game finishes.
    function restartGame() {
        $('#winner').fadeOut('fast');
        $('.deck').show('fast');
        $('.score-panel').show('fast');
        resetGame();

    }
    //Play the game!
    playGame();

    //Reset and restart when user clicks the repeat icon.
    $(".reset").click(resetGame);
    $(".restart").click(restartGame);

});