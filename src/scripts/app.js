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
const scoreUlList = document.querySelector('ul');

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
let scoreList = [];

function resetGame(){
  isGameOn = true;
  time = 15;
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
  sortScores();
  saveScores();
  leaderboard.focus();
}

startButton.addEventListener('click', StartButtonClicked);
window.addEventListener('keydown', function(event) {
  if ((event.key === 'Enter') && (!isGameOn)) {
    StartButtonClicked();
  }
});

function recordScore() {
  const date = new Date();
  const getMonth = (date.getMonth() + 1).toString.length > 1 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
  const getDate = date.getDate().toString.length > 1 ? date.getDate() : '0' + date.getDate();
  const dateString = `${date.getFullYear()}-${getMonth}-${getDate}`;
  const score = new Score(dateString, hitsCount, (hitsCount / words.length).toFixed(2));
  scoreList.push(score);
}

// creating a set of up to 10 scores
function saveScores() {
  scoreList.forEach((item, index) => {
    localStorage.setItem(`Score${index}`, JSON.stringify(`${item.getDate()};${item.getHits()};${item.getPercentage()}`));
  })
}

//loading scores untill there are any scores
function loadScores() {
  if (localStorage.getItem('Score0')) {
    let i = 0;
    while (localStorage.getItem(`Score${i}`) !== null) {
      let restoredScore = JSON.parse(localStorage.getItem(`Score${i}`)).split(';');
      scoreList.push(new Score(restoredScore[0], restoredScore[1], restoredScore[2]));
      i++;
    }
    sortScores();
  }
}

//sorting scores by hits, if there are more than 10 scores, only keep the top 10
function sortScores() {
  scoreList.sort((a, b) => b.getHits() - a.getHits());
  if (scoreList.length > 9) {
    scoreList = scoreList.slice(0, 9);    
  }
}

leaderboard.addEventListener("click", () => {
  createLeaderBoard();
  dialog.showModal();
});

//closes by clicking ouside of the dialog box
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});

function createLeaderBoard() {
  let htmlListOfScores = '';
  scoreList.forEach( (score, index) => {
    htmlListOfScores += `<li>#${index + 1} | ${score.getDate()} | ${score.getHits() >9 ? score.getHits() : '0' + score.getHits()} hits </li>`;
  });
  scoreUlList.innerHTML = htmlListOfScores;
  if (scoreList.length === 0) {
    scoreUlList.innerHTML = '<li>No scores saved yet</li>';
  }
}


window.addEventListener('load', loadScores);


