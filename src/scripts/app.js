'use strict';

import Score from "./Score.js";
import wordsList from "./wordlist.js";

const scoreScreen = document.querySelector('h4');
const startButton = document.querySelector('#start');
const input = document.querySelector('.input-box');
const currentWord = document.querySelector('h2');
const timer = document.querySelector('h1');
const initialScreen = document.querySelector('#initial-screen');
const finishScreen = document.querySelector('#finish-screen');


const backgroundSound = new Audio('./src/media/backgroundsound.mp3');
backgroundSound.type = 'audio/mpeg';
backgroundSound.loop = true;
backgroundSound.volume = 0.5;
const gameEndSound = new Audio('./src/media/gameendsound.mp3');
gameEndSound.type = 'audio/mpeg';
gameEndSound.volume = 1.0;
const correctSound = new Audio('./src/media/correctsound.mp3');
correctSound.type = 'audio/mpeg';
correctSound.loop = false;



let time;
let hitsCount;
let words;
let index;
const scoreList = [];

function resetGame(){
  time = 10;
  words = [...wordsList].sort(() => Math.random() - 0.5);
  hitsCount = 0;
  index = words.length - 1;
  input.value = '';
}

function startTimer() {
  timer.innerText = time.toFixed(0);
  time -= 1; 
  if (time < 0) {
    gameEnded();
    return;
  }
  setTimeout(startTimer, 1000);
}

//The sounds are in separate functions so they can be played from start each time
function playSoundCorrect() {
  correctSound.currentTime = 0;
  correctSound.play();
}

function playSoundBackground() {
  backgroundSound.currentTime = 0;
  backgroundSound.play();
}

function playWords() {
  const word = words[index];
  currentWord.innerText = word;
  scoreScreen.innerText = `Your score: ${hitsCount}`;
  function checkInput() {
    if (input.value.toLowerCase() === word) {
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
  initialScreen.classList.add('hidden');
  finishScreen.classList.add('hidden');
  resetGame();
  input.focus();  
  playWords();
  startTimer();
  playSoundBackground();
}

function gameEnded() {
  gameEndSound.play();
  backgroundSound.pause();
  finishScreen.classList.remove('hidden');
  startButton.value = 'Restart';
  startButton.classList.remove('hidden');
  recordScore();
}

startButton.addEventListener('click', StartButtonClicked);

window.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    StartButtonClicked();
  }
});

function recordScore() {
  const score = new Score();
  score.record(new Date(), hitsCount, (hitsCount / words.length).toFixed(2));
  scoreList.push(score);
}