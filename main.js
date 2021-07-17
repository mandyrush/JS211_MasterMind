'use strict';

const assert = require('assert');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let board = [];
let solution = '';
let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const printBoard = () =>  {
  for (let i = 0; i < board.length; i++) {
    console.log(board[i]);
  }
}

const generateSolution = () =>  {
  for (let i = 0; i < 4; i++) {
    const randomIndex = getRandomInt(0, letters.length);
    solution += letters[randomIndex];
  }
}

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

const generateHint = (guess) =>  {
  // your code here

  // Create an array from solution string and an array from the guess string
  let solutionArray = solution.split('');
  let guessArray = guess.split('');
  let correctLetterLocations = 0;
  let correctLetters = 0;

  // Look at each item in the solutions array and the guess array. 
  // If they match add 1 to the correctLetterLocations tally.
  // Set the item in the solution array to null so it can't be counted 
  // in the correct letter tally
  solutionArray.forEach((solution, index) => {
    if (solutionArray[index] === guessArray[index]) {
      correctLetterLocations += 1;
      solutionArray[index] = null;
    }
  })

  // Look at each item remaning in the solutions array. 
  // If the solution array contains a letter from the guess array
  // add 1 to the correctLetters tally and set that item in the solutions 
  // array to null so that on the next iteration of the loop if there is another
  // guess of the same letter it can find the next one.
  solutionArray.forEach((solution, index) => {
    let targetIndex = solutionArray.indexOf(guessArray[index]);

    if (targetIndex > -1) {
      correctLetters += 1;
      solutionArray[targetIndex] = null;
    }
  })

  return `${correctLetterLocations}-${correctLetters}`;
}

// Create an array from the guess string. Loop through the array
// and if the item exists in the letters array it is a valid guess.
// Otherwise it is not valid.
const validGuess = (guess) => {
  let guessArray = guess.split('');
  let valid = true;

  guessArray.forEach(guess => {
    if (letters.indexOf(guess) === -1) {
      valid = false;
    }
  })

  return valid;
}

const mastermind = (guess) => {
  //solution = 'abcd'; // Comment this out to generate a random solution
  // your code here

  // Account for uppercase guesses and whitespaces
  guess = guess.trim().toLowerCase();

  // Make sure the guess the user input is valid letters
  if (!validGuess(guess)) {
    console.log('That was not a valid guess. Please select letters between a & h.');
    return false;
  }

  if (guess === solution) {
    console.log('You guessed it!');
    return 'You guessed it!';
  } else {
    let hint = generateHint(guess);
    board.push(`${guess}-${hint}`);

    if (board.length < 10) {
      console.log('Guess again.')
      return 'Guess again.';
    } else {
      console.log(`You ran out of turns! The solution was ${solution}`);
      board = [];
      return `You ran out of turns! The solution was ${solution}`;
    }
  }
}


const getPrompt = () =>  {
  rl.question('guess: ', (guess) => {
    mastermind(guess);
    printBoard();
    getPrompt();
  });
}

// Tests

if (typeof describe === 'function') {
  solution = 'abcd';
  describe('#mastermind()', () => {
    it('should register a guess and generate hints', () => {
      mastermind('aabb');
      assert.equal(board.length, 1);
    });
    it('should be able to detect a win', () => {
      assert.equal(mastermind(solution), 'You guessed it!');
    });
  });

  describe('#generateHint()', () => {
    it('should generate hints', () => {
      assert.equal(generateHint('abdc'), '2-2');
    });
    it('should generate hints if solution has duplicates', () => {
      assert.equal(generateHint('aabb'), '1-1');
    });

  });

} else {

  generateSolution();
  getPrompt();
}