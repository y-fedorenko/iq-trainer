'use strict';

const screen = document.querySelector('.screen');
const startButton = document.querySelector('#start');
const input = document.querySelector('.input-box');
const hitsCounter = document.querySelector('h2');
const timer = document.querySelector('h1');

let time = 99.0;

function startTimer() {
  timer.innerText = time.toFixed(1);
  time -= 0.1; 
  if (time < 0) return;
  setTimeout(startTimer, 100);
}


function hideStartButton() {
  startButton.classList.add('hidden');
}

startButton.addEventListener('click', hideStartButton);
startButton.addEventListener('click', startTimer);