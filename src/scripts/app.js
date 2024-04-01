'use strict';

import Score from "./Score.js";
import wordsList from "./wordlist.js";

const screen = document.querySelector('.screen');
const startButton = document.querySelector('#start');
const input = document.querySelector('.input-box');
const currentWord = document.querySelector('h2');
const timer = document.querySelector('h1');

let time = 99.0;
let hitsCount = 0;
let words = [...wordsList].sort(() => Math.random() - 0.5);
let index = words.length - 1;

function startTimer() {
  timer.innerText = time.toFixed(0);
  time -= 1; 
  if (time < 0) {
    /* reset here */
    return;
  }
  setTimeout(startTimer, 1000);
}

function playWords() {
  const word = words[index];
  currentWord.innerText = word;

  function checkInput() {
    if (input.value === word) {
      hitsCount += 1;
      index -= 1;
      input.value = '';
      /* some music here */
      input.removeEventListener('input', checkInput);
      playWords();
    }
  }

  input.addEventListener('input', checkInput);
}
function hideStartButton() {
  startButton.classList.add('hidden');
  playWords();
}

startButton.addEventListener('click', hideStartButton);
startButton.addEventListener('click', startTimer);