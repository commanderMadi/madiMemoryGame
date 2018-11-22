//Creating a class to enclose all the game properties
class Game {
  constructor(timer) {
    this.opened = [];
    this.matches = 0;
    this.hasStarted = false;
    this.moves = 0;
    this.movesCounter = document.querySelector("#moves");
    this.stars = 3;
    this.starsCounter = document.querySelector(".stars");
    this.timer = timer;
    this.timerCounter = document.querySelector("#count-up-timer");
    this.symbols = [
      "gem",
      "paper-plane",
      "anchor",
      "bolt",
      "cube",
      "sign",
      "leaf",
      "bicycle"
    ];
    this.deck = document.querySelector(".deck");
    this.resetButton = document.querySelector("#reset");
    this.modalResetButton = document.querySelector("#reset-modal");
  }
  //Initializing the game.
  init() {
    this.cloneCards();
    this.listenForClicks();
    this.listenToReset();
    this.listenToModalReset();
  }
  //Clearing all the properties and the elements
  reset() {
    this.deck.innerHTML = "";
    this.starsCounter.innerHTML = `
      <li><i class="fa fa-star"></i></li>
      <li><i class="fa fa-star"></i></li>
      <li><i class="fa fa-star"></i></li>`;
    this.cloneCards();
    this.opened = [];
    this.matches = 0;
    this.timer.stop();
    this.hasStarted = false;
    this.timerCounter.innerHTML = "00:00:00";
    this.moves = 0;
    this.movesCounter.innerHTML = `Moves: ${this.moves}`;
    this.stars = 3;
    this.listenForClicks();
  }
  //Listening to user click on the reset button.
  listenToReset() {
    this.resetButton.addEventListener("click", e => {
      e.preventDefault();
      this.reset();
    });
  }
  //Listening to user click on the reset button inside the modal
  listenToModalReset() {
    this.modalResetButton.addEventListener("click", e => {
      e.preventDefault();
      $("#winner").fadeOut("fast");
      $(".deck").show("fast");
      $(".score-panel").show("fast");
      this.reset();
    });
  }
  //Listen to the timer start.
  listenToTimer() {
    let timerInstance = this.timer;
    timerInstance.addEventListener("secondsUpdated", function(e) {
      document.querySelector(
        "#count-up-timer"
      ).innerHTML = timerInstance.getTimeValues().toString();
    });
    timerInstance.start();
    return timerInstance;
  }
  /*Fisher-Yates shuffle function from https://stackoverflow.com/questions/
  2450954/how-to-randomize-shuffle-a-javascript-array*/
  shuffle(array) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
  //Duplicating the cards on the deck.
  cloneCards() {
    let duplicatedSymbols = this.symbols.concat(this.symbols);
    let shuffledCards = this.shuffle(duplicatedSymbols);
    shuffledCards.forEach(
      symbol =>
        (this.deck.innerHTML += `<li class="card"><i class="fa fa-${symbol}"></i></li>`)
    );
  }
  //Adding the classes required to flip the card.
  flipMe(card) {
    card.classList.add("open", "show", "flipInY", "disabled");
    this.opened.push(card);
  }
  //Listening to user click on each card.
  listenForClicks() {
    let allCards = document.querySelectorAll(".card");
    [...allCards].map(card => {
      card.addEventListener("click", () => {
        if (!this.hasStarted) {
          this.hasStarted = true;
          this.listenToTimer();
        }
        this.flipMe(card);
        if (this.opened.length > 1) {
          this.compareCards();
        }
      });
    });
  }
  // To disable cards during comparison to prevent multiple card clicks.
  disableClick() {
    let allCards = document.querySelectorAll(".card");
    for (let i = 0; i < allCards.length; i++) {
      if (!allCards[i].classList.contains("match")) {
        allCards[i].classList.add("disabled");
      }
    }
  }
  
  // To enable cards after comparison
  enableClick() {
    let allCards = document.querySelectorAll(".card");
    for (let i = 0; i < allCards.length; i++) {
      if (!allCards[i].classList.contains("match")) {
        allCards[i].classList.remove("disabled");
      }
    }
  }
  //Comparison logic.
  compareCards() {
    this.disableClick();
    if (this.opened[0].innerHTML === this.opened[1].innerHTML) {
      this.matchFound();
    } else {
      this.matchNotFound();
    }
  }
  //Updating game state.
  updateState() {
    this.opened = [];
    this.moves++;
    this.movesCounter.innerHTML = `Moves: ${this.moves}`;
    switch (this.moves) {
      case 10:
        this.stars--;
        this.starsCounter.innerHTML = `<li><i class="fa fa-star"></i></li>
                                         <li><i class="fa fa-star"></i></li>`;
        break;
      case 20:
        this.stars--;
        this.starsCounter.innerHTML = `<li><i class="fa fa-star"></i></li>`;
        break;
    }
  }
  //Handling match cases.
  matchFound() {
    this.enableClick();
    this.opened[0].classList.remove("flipInY");
    this.opened[1].classList.remove("flipInY");
    this.opened[0].classList.add(
      "match",
      "animated",
      "bounceIn",
      "tada",
      "disabled"
    );
    this.opened[1].classList.add(
      "match",
      "animated",
      "bounceIn",
      "tada",
      "disabled"
    );
    this.matches++;
    this.updateState();
    this.isWon();
  }
  //Handling mismatch cases.
  matchNotFound() {
    let that = this;
    let allCards = document.querySelectorAll(".card");
    setTimeout(function() {
      that.enableClick();
      that.opened[0].classList.remove(
        "open",
        "animated",
        "show",
        "bounceIn",
        "flipInY",
        "disabled"
      );
      that.opened[1].classList.remove(
        "open",
        "animated",
        "show",
        "bounceIn",
        "flipInY",
        "disabled"
      );
      that.updateState();
    }, 750);
  }
  //Checking if the game is already won.
  isWon() {
    if (this.matches >= 8) {
      $(".deck").fadeOut("fast"); //Hiding the deck element.
      $(".score-panel").fadeOut("fast"); //Hiding the score panel element.
      let $winnerModal, $movesCountByEnd, $starsCountByEnd, $timeByEnd;
      $winnerModal = $("#winner");
      $movesCountByEnd = $("#movescount");
      $starsCountByEnd = $("#starscount");
      $timeByEnd = $("#timecount");

      $winnerModal.removeClass("winnerSectionHider").fadeIn("fast");
      $movesCountByEnd.html(`Moves: ${this.movesCounter.innerHTML}`); //Grab moves count and populate the movescount element.
      //Grab stars count and populate the starscount element.
      switch (this.stars) {
        case 3:
          $starsCountByEnd.html(`<ul class="stars"><li><i class="fa fa-star"></i></li>
                <li><i class="fa fa-star"></i></li>
                <li><i class="fa fa-star"></i></li>
                </ul> `);
          break;
        case 2:
          $starsCountByEnd.html(`<ul class="stars"><li><i class="fa fa-star"></i></li>
                <li><i class="fa fa-star"></i></li>
                <li><i class="fa fa-star-o"></i></li>
                </ul> `);
          break;
        case 1:
          $starsCountByEnd.html(`<ul class="stars"><li><i class="fa fa-star"></i></li>
                <li><i class="fa fa-star-o"></i></li>
                <li><i class="fa fa-star-o"></i></li>
                </ul> `);
          break;
      }
      $timeByEnd.html(`Time consumed: ${this.timerCounter.innerHTML}`); //Grab time and populate the count-up-timer element.
    }
  }
}
//Creating a new timer and game instance and running the game.
const mainTimer = new Timer();
const game = new Game(mainTimer);
game.init();
