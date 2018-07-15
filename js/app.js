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
  init() {
    this.cloneCards();
    this.listenForClicks();
    this.listenToReset();
    this.listenToModalReset();
  }
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
    this.movesCounter.innerHTML = this.moves;
    this.stars = 3;
    this.listenForClicks();
  }
  listenToReset() {
    this.resetButton.addEventListener("click", e => {
      e.preventDefault();
      this.reset();
    });
  }
  listenToModalReset() {
    this.modalResetButton.addEventListener("click", e => {
      e.preventDefault();
      $("#winner").fadeOut("fast");
      $(".deck").show("fast");
      $(".score-panel").show("fast");
      this.reset();
    });
  }
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

  cloneCards() {
    let duplicatedSymbols = this.symbols.concat(this.symbols);
    let shuffledCards = this.shuffle(duplicatedSymbols);
    shuffledCards.forEach(
      symbol =>
        (this.deck.innerHTML += `<li class="card"><i class="fa fa-${symbol}"></i></li>`)
    );
  }
  flipMe(card) {
    card.classList.add("open", "show", "flipInY", "disabled");
  }
  listenForClicks() {
    let allCards = document.querySelectorAll(".card");
    return [...allCards].map(card => {
      card.addEventListener("click", () => {
        if (!this.hasStarted) {
          this.hasStarted = true;
          this.listenToTimer();
        }

        this.flipMe(card);
        this.opened.push(card);
        if (this.opened.length === 2) {
          card.classList.add("disabled");
          this.compareCards();
        }
      });
    });
  }
  compareCards() {
    if (this.opened[0].innerHTML === this.opened[1].innerHTML) {
      this.matchFound();
    } else {
      this.matchNotFound();
    }
  }
  updateState() {
    this.moves++;
    this.movesCounter.innerHTML = this.moves;
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
    this.opened = [];
  }
  matchFound() {
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
  matchNotFound() {
    let that = this;
    setTimeout(function() {
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
    }, 500);
  }
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

const mainTimer = new Timer();
const game = new Game(mainTimer);
game.init();
