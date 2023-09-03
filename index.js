import { generateDecks, gameInit, displayHands, actionHandler } from './utils.js';

let players = { player: [], playerScore: 0, dealer: [], dealerScore: 0 };
let playingDeck = generateDecks();

gameInit(players, playingDeck);

function game() {
  console.log(`== Game started == \n`);
  displayHands(players);
  players.dealerScore === 21 ? console.log(`You lost! Dealer has Blackjack!\n`) :
    players.playerScore === 21 ? console.log(`You won! Blackjack\n`) :
      actionHandler(players, playingDeck);
}

game();