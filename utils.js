import select from '@inquirer/select';

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function cards(array) {
  let temp = String;
  for (let i in array) {
    temp += `${array[i]} `;
  }

  return temp;
}

function calcCardsValue(array) {
  const points10regex = /10|J|Q|K/, points11regex = /A/;
  let val = 0;

  for (let i in array) {
    if (points10regex.test(array[i])) {
      val += 10;
    } else if (points11regex.test(array[i])) {
      val += 11;
    } else {
      val += Number(Array.from(array[i])[0]);
    }
  }

  return val;
}

// ===========================================================================

function generateDecks(decks = 1) {
  let deck = [];
  const nums = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const signs = ['♥', '♣', '♠', '♦'];
  for (let a = 0; a < decks; a++) {
    for (let i in nums) {
      for (let j in signs) {
        deck.push(`${nums[i]}${signs[j]}`);
      }
    }
  }

  return shuffle(deck);
}

function gameInit(players, deck) {
  players.player.push(nextCard(deck), nextCard(deck));
  players.dealer.push(nextCard(deck), nextCard(deck));
}

function nextCard(deck) {
  return deck.splice(deck.length - 1, 1)[0];
}

function displayHands(players) {
  players.playerScore = calcCardsValue(players.player);
  players.dealerScore = calcCardsValue(players.dealer);

  console.log(`Your hand: ${cards(players.player)} \n` +
    `Value: ${players.playerScore} \n\n` +
    `Dealers hand: ${cards(players.dealer)} \n` +
    `Value: ${players.dealerScore} \n`);
}

async function actionHandler(players, deck) {
  await select({
    message: 'Your action?',
    choices: [
      {
        name: 'hit',
        value: 'hit'
      },
      {
        name: 'stand',
        value: 'stand'
      }
    ]
  }).then(answer => {
    switch (answer) {
      case 'hit':
        players.player.push(nextCard(deck));
        displayHands(players);

        players.playerScore > 21 ? console.log(`You lost! Your score is over 21 (${players.playerScore})!`) :
          players.playerScore === 21 ? console.log(`You won! 21!`) :
            actionHandler(players, deck);

        break;
      case 'stand':
        if (players.dealerScore > players.playerScore) return console.log(`You lost! Dealer score is bigger than yours\n`);
        if (players.dealerScore === players.playerScore && players.dealerScore > 11) return console.log(`Push!\n`);

        do {
          players.dealer.push(nextCard(deck));
          players.dealerScore = calcCardsValue(players.dealer);
        } while (players.dealerScore < players.playerScore && players.dealerScore < 21);
        displayHands(players);

        if (players.dealerScore > 21) return console.log(`You won! Dealer's cards exceeded 21\n`);
        if (players.dealerScore === 21) return console.log(`You lost! Dealer has Blackjack!\n`);
        if (players.dealerScore > players.playerScore) return console.log(`You lost! Dealer's score is bigger than yours\n`);

        break;
    }
  });
}


export {
  generateDecks,
  gameInit,
  nextCard,
  displayHands,
  calcCardsValue,
  actionHandler
};