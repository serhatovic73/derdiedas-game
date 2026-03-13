// ===================
// SOUNDS
// ===================
const correctSound = new Audio("audio/correct.mp3");
const wrongSound = new Audio("audio/wrong.mp3");

correctSound.volume = 0.6;
wrongSound.volume = 0.6;

// ===================
// GAME STATE
// ===================
const state = {
  words: [],
  currentIndex: 0,
  correct: 0,
  wrong: 0,
  wrongWords: [],
  time: 0,
  timerInterval: null,
  combo: 0,
  score: 0,
};

// ===================
// DOM
// ===================
const dom = {
  card: document.getElementById("card"),
  word: document.getElementById("word"),
  correct: document.getElementById("correct"),
  wrong: document.getElementById("wrong"),
  result: document.getElementById("result"),
  score: document.getElementById("score"),
  wrongList: document.getElementById("left"),
  correctList: document.getElementById("right"),
  buttons: document.querySelectorAll("button[data-answer]"),
};

// ===================
// INIT
// ===================
document.addEventListener("DOMContentLoaded", init);

async function init() {
  dom.correctList.innerHTML = "";
  dom.wrongList.innerHTML = "";

  const params = new URLSearchParams(window.location.search);
  const topic = params.get("topic");

  if (!topic) return;

  // ⭐ MongoDB API
  const res = await fetch(
    `https://derdiedas-backend.onrender.com/topic?topic=${encodeURIComponent(topic)}`,
  );

  const data = await res.json();

  if (!data || !data.substopics) return;

  state.words = shuffle(data.substopics);

  bindEvents();
  renderWord();
  startTimer();
}

// ===================
// TIMER
// ===================
function startTimer() {
  state.timerInterval = setInterval(() => {
    state.time++;

    document.getElementById("timer").innerText = state.time;
  }, 1000);
}
// ===================
// EVENTS
// ===================
function bindEvents() {
  dom.buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      checkAnswer(e.target.dataset.answer);
    });
  });
}

// ===================
// GAME LOGIC
// ===================
function checkAnswer(answer) {
  const current = state.words[state.currentIndex];
  if (!current) return;

  if (isCorrectArticle(answer, current.article)) {
    handleCorrect(current);
  } else {
    handleWrong(current, answer);
  }
}

function handleCorrect(word) {
  correctSound.currentTime = 0;
  correctSound.play();

  state.correct++;
  state.combo++;

  let bonus = state.combo >= 3 ? 5 : 0;

  state.score += 10 + bonus;

  dom.correct.textContent = state.correct;

  const li = document.createElement("li");
  li.innerHTML = `${word.article} - ${word.word} (pl ${word.plural})`;
  dom.correctList.appendChild(li);

  dom.card.classList.add("correct");
  setTimeout(() => dom.card.classList.remove("correct"), 300);

  setTimeout(nextWord, 300);
}

function handleWrong(word, selected) {
  wrongSound.currentTime = 0;
  wrongSound.play();

  state.wrong++;
  state.combo = 0;

  dom.wrong.textContent = state.wrong;

  const li = document.createElement("li");
  li.innerHTML = `correct: ${word.article} - ${word.word} | your: ${selected}`;
  dom.wrongList.appendChild(li);

  dom.card.classList.add("wrong");
  setTimeout(() => dom.card.classList.remove("wrong"), 300);

  setTimeout(nextWord, 300);
}

function nextWord() {
  state.currentIndex++;

  // progress bar
  const percent = (state.currentIndex / state.words.length) * 100;

  document.getElementById("progressBar").style.width = percent + "%";

  if (state.currentIndex >= state.words.length) {
    endGame();
  } else {
    renderWord();
  }
}

function renderWord() {
  const current = state.words[state.currentIndex];
  if (!current) return;

  dom.word.innerHTML = `<div style="font-size:40px">${current.word}</div>
     <div style="color:gray">${current.en || ""}</div>`;
}

function endGame() {
  clearInterval(state.timerInterval);

  const card = document.getElementById("card");
  const result = document.getElementById("result");
  const scoreEl = document.getElementById("score");

  if (card) card.style.display = "none";
  if (result) result.style.display = "block";
  if (scoreEl) scoreEl.innerText = state.score;
}
// ===================
// HELPERS
// ===================
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function isCorrectArticle(answer, article) {
  if (article.includes("/")) {
    return article
      .split("/")
      .map((a) => a.trim())
      .includes(answer);
  }

  return answer === article;
}
