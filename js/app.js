let playerHealth = 100;
let aiHealth = 100;

let playerScore = 0;
let aiScore = 0;

let difficulty = "easy";

let winStreak = 0;

const playerHistory = [];


/* SELECT ELEMENTS */

const buttons = document.querySelectorAll(".move-btn");

const battleText = document.querySelector(".battle-text");

const playerHealthBar = document.querySelector(".player-health");

const aiHealthBar = document.querySelector(".ai-health");

const playerScoreText = document.querySelector(".player-score");

const aiScoreText = document.querySelector(".ai-score");

const restartBtn = document.querySelector(".restart-btn");

const difficultyButtons = document.querySelectorAll(".difficulty-btn");

const historyList = document.querySelector(".history-list");

const streakText = document.querySelector(".streak-text");

const battleArea = document.querySelector(".battle-area");

const themeBtn = document.querySelector(".theme-btn");


/* SOUND EFFECTS */

const clickSound = document.querySelector("#clickSound");

const hitSound = document.querySelector("#hitSound");

const winSound = document.querySelector("#winSound");


/* SOUND VOLUME */

clickSound.volume = 0.3;

hitSound.volume = 0.4;

winSound.volume = 0.5;


/* LOADER */

window.addEventListener("load", () => {

  setTimeout(() => {

    document.querySelector(".loader")
    .style.display = "none";

  }, 2000);

});


/* THEME TOGGLE */

themeBtn.addEventListener("click", () => {

  document.body.classList.toggle("light-theme");

});


/* MOVE BUTTON EVENTS */

buttons.forEach(button => {

  button.addEventListener("click", () => {

    const playerMove = button.innerText;

    clickSound.currentTime = 0;

    clickSound.play();

    playGame(playerMove);

  });

});


/* DIFFICULTY BUTTON EVENTS */

difficultyButtons.forEach(button => {

  button.addEventListener("click", () => {

    difficulty = button.innerText.toLowerCase();

    battleText.innerText = `🤖 Difficulty: ${difficulty}`;

    difficultyButtons.forEach(btn => {

      btn.classList.remove("active-difficulty");

    });

    button.classList.add("active-difficulty");

  });

});


/* RESTART BUTTON */

restartBtn.addEventListener("click", restartGame);


/* MAIN GAME FUNCTION */

function playGame(playerMove){

  playerHistory.push(playerMove);

  battleText.innerText = "🤖 AI analyzing strategy...";

  setTimeout(() => {

    const aiMove = getAIChoice();

    determineWinner(playerMove, aiMove);

  }, 700);

}


/* AI SYSTEM */

function getAIChoice(){

  if(difficulty === "easy"){

    return randomChoice();

  }

  else if(difficulty === "medium"){

    return mediumAI();

  }

  else{

    return hardAI();

  }

}


/* RANDOM AI */

function randomChoice(){

  const choices = ["🪨 Rock", "📄 Paper", "✂️ Scissors"];

  const randomIndex = Math.floor(Math.random() * 3);

  return choices[randomIndex];

}


/* MEDIUM AI */

function mediumAI(){

  const randomChance = Math.random();

  if(randomChance < 0.5){

    return randomChoice();

  }

  return counterPlayerMove();

}


/* HARD AI */

function hardAI(){

  return counterPlayerMove();

}


/* SMART AI */

function counterPlayerMove(){

  let rockCount = 0;
  let paperCount = 0;
  let scissorsCount = 0;

  playerHistory.forEach(move => {

    if(move.includes("Rock")){

      rockCount++;

    }

    else if(move.includes("Paper")){

      paperCount++;

    }

    else{

      scissorsCount++;

    }

  });


  if(rockCount >= paperCount && rockCount >= scissorsCount){

    return "📄 Paper";

  }

  else if(paperCount >= rockCount && paperCount >= scissorsCount){

    return "✂️ Scissors";

  }

  else{

    return "🪨 Rock";

  }

}


/* WINNER LOGIC */

function determineWinner(playerMove, aiMove){

  hitSound.currentTime = 0;

  hitSound.play();

  battleArea.classList.add("attack");


  /* DRAW */

  if(playerMove === aiMove){

    battleText.innerText = "🤝 Draw Match";

    addHistory("🤝 Draw Match");

    playerHealth -= 5;

    aiHealth -= 5;

  }


  /* PLAYER WIN */

  else if(

    (playerMove.includes("Rock") && aiMove.includes("Scissors")) ||

    (playerMove.includes("Paper") && aiMove.includes("Rock")) ||

    (playerMove.includes("Scissors") && aiMove.includes("Paper"))

  ){

    battleText.innerText = `⚔️ ${playerMove} beats ${aiMove}`;

    addHistory(`✅ ${playerMove} beat ${aiMove}`);

    aiHealth -= 20;

    playerScore++;

    winStreak++;

    winSound.currentTime = 0;

    winSound.play();

  }


  /* AI WIN */

  else{

    battleText.innerText = `💀 ${aiMove} beats ${playerMove}`;

    addHistory(`❌ ${aiMove} beat ${playerMove}`);

    playerHealth -= 20;

    aiScore++;

    winStreak = 0;

  }


  updateUI();

  saveGameData();

  checkGameOver();


  setTimeout(() => {

    battleArea.classList.remove("attack");

  }, 500);

}


/* UPDATE UI */

function updateUI(){

  if(playerHealth < 0){

    playerHealth = 0;

  }

  if(aiHealth < 0){

    aiHealth = 0;

  }

  playerHealthBar.style.width = playerHealth + "%";

  aiHealthBar.style.width = aiHealth + "%";

  playerScoreText.innerText = `Score: ${playerScore}`;

  aiScoreText.innerText = `Score: ${aiScore}`;

  streakText.innerText = `🔥 Streak: ${winStreak}`;

}


/* GAME OVER */

function checkGameOver(){

  if(playerHealth === 0){

    battleText.innerText = "💀 AI Wins The Battle";

    disableButtons();

  }

  else if(aiHealth === 0){

    battleText.innerText = "🏆 You Win The Battle";

    disableButtons();

  }

}


/* DISABLE BUTTONS */

function disableButtons(){

  buttons.forEach(button => {

    button.disabled = true;

  });

}


/* RESTART */

function restartGame(){

  playerHealth = 100;

  aiHealth = 100;

  playerScore = 0;

  aiScore = 0;

  winStreak = 0;

  playerHistory.length = 0;

  historyList.innerHTML = "";

  updateUI();

  battleText.innerText = "Choose Your Move";

  buttons.forEach(button => {

    button.disabled = false;

  });

}


/* MATCH HISTORY */

function addHistory(message){

  const li = document.createElement("li");

  li.innerText = message;

  historyList.prepend(li);

}


/* SAVE GAME */

function saveGameData(){

  localStorage.setItem("playerScore", playerScore);

  localStorage.setItem("aiScore", aiScore);

  localStorage.setItem("winStreak", winStreak);

}


/* LOAD GAME */

function loadGameData(){

  const savedPlayerScore =
  localStorage.getItem("playerScore");

  const savedAiScore =
  localStorage.getItem("aiScore");

  const savedWinStreak =
  localStorage.getItem("winStreak");


  if(savedPlayerScore){

    playerScore = Number(savedPlayerScore);

  }

  if(savedAiScore){

    aiScore = Number(savedAiScore);

  }

  if(savedWinStreak){

    winStreak = Number(savedWinStreak);

  }

  updateUI();

}


/* LOAD SAVED DATA */

loadGameData();