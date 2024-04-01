'use strict';

import Score from "./Score.js";
import wordsList from "./wordlist.js";

const screen = document.querySelector('.screen');
const startButton = document.querySelector('#start');
const input = document.querySelector('.input-box');
const currentWord = document.querySelector('h2');
const timer = document.querySelector('h1');

const backgroundSound = new Audio('./src/media/backgroundsound.mp3');
backgroundSound.type = 'audio/mpeg';
backgroundSound.loop = true;
backgroundSound.volume = 0.5;
const gameEndSound = new Audio('./src/media/gameendsound.mp3');
gameEndSound.type = 'audio/mpeg';
gameEndSound.volume = 1.0;


let time = 15.0;
let hitsCount = 0;
let words = [...wordsList].sort(() => Math.random() - 0.5);
let index = words.length - 1;

function startTimer() {
  timer.innerText = time.toFixed(0);
  time -= 1; 
  if (time < 0) {
    gameEndSound.play();
    backgroundSound.pause();
    return;
  }
  setTimeout(startTimer, 1000);
}

//The sounds are in separate functions so they can be played from start each time
function playSoundCorrect() {
  const correctSound = new Audio('./src/media/correctsound.mp3');
  correctSound.type = 'audio/mpeg';
  correctSound.loop = false;
  correctSound.play();
}

function playSoundBackground() {
  backgroundSound.currentTime = 0;
  backgroundSound.play();
}

function playWords() {
  const word = words[index];
  currentWord.innerText = word;

  function checkInput() {
    if (input.value === word) {
      hitsCount += 1;
      index -= 1;
      input.value = '';
      playSoundCorrect();
      input.removeEventListener('input', checkInput);
      playWords();
    }
  }

  input.addEventListener('input', checkInput);
}
function StartButtonClicked() {
  startButton.classList.add('hidden');
  playWords();
  playSoundBackground();
}

startButton.addEventListener('click', StartButtonClicked);
startButton.addEventListener('click', startTimer);