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
const dialog = document.querySelector("dialog");
const leaderboard = document.querySelector('.leaderboard');


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
let isGameOn = false;
const scoreList = [];

function resetGame(){
  isGameOn = true;
  time = 99;
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
  if (index < 0) gameEnded();

  const word = words[index];
  currentWord.innerText = shuffleLetters(word);
  scoreScreen.innerText = `Your score: ${hitsCount}`;
  function checkInput() {
    if ((input.value.toLowerCase() === word) && isGameOn) {
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

function shuffleLetters(word) {
  let temp = word.split('');
  temp.sort(() => Math.random() - 0.5);
  if (temp.join('') === word) {
    return shuffleLetters(word);
  }
  return temp.join('');
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
  isGameOn = false;
  gameEndSound.play();
  backgroundSound.pause();
  finishScreen.classList.remove('hidden');
  startButton.value = 'Restart';
  startButton.classList.remove('hidden');
  recordScore();
  leaderboard.focus();

}

startButton.addEventListener('click', StartButtonClicked);
window.addEventListener('keydown', function(event) {
  if ((event.key === 'Enter') && (!isGameOn)) {
    StartButtonClicked();
  }
});

function recordScore() {
  const score = new Score(new Date(), hitsCount, (hitsCount / words.length).toFixed(2));
  scoreList.push(score);
}

leaderboard.addEventListener("click", () => {
  dialog.showModal();
});

//closes by clicking ouside of the dialog box
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});