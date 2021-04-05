let curQuest;
let curWidth = 0;
let curScore = 0;
let curIndex = 0;
let skipOption = true;
let fiftyOption = true;
const questions = JSON.parse(localStorage.getItem("questions"));
localStorage.removeItem("questions");

document.addEventListener("DOMContentLoaded", () => {
	setScore();
	setNextQuestion();
});

function getRand() {
	let min = 0,
		max = 3;
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getTextContent(e) {
	return e.getElementsByClassName("answer-text")[0].textContent;
}

function getWidth() {
	return Math.round((curIndex * 100) / questions.length);
}

function getCardAnswers() {
	return Array.from(document.getElementsByClassName("card__answer"));
}

function disableButton(id) {
	const btn = document.getElementById(id);
	btn.classList.remove("available");
	btn.classList.add("not-available");
}

function applyFifty() {
	const options = getCardAnswers();
	let randIdx = getRand();

	while (getTextContent(options[randIdx]) === curQuest.correct_answer) {
		randIdx = getRand();
	}

	options.forEach((e, i) => {
		if (getTextContent(e) === curQuest.correct_answer || i === randIdx) {
			return;
		}
		e.classList.add("invisible");
	});

	disableButton("fiftyBtn");
	fiftyOption = false;
}

function applySkip() {
	const options = getCardAnswers();

	const correct = options.find(
		e => getTextContent(e) === curQuest.correct_answer
	);

	correct.classList.add("active");

	disableButton("skipBtn");
	skipOption = false;

	showAnswer();
}

function showModal() {
	const modal = document.getElementById("modal");
	const score = document.getElementById("modal-score");
	const close = document.getElementById("modal-closebtn");
	const ANIMATION_SPEED = 400; // ms

	score.innerHTML = `${curScore}`;

	modal.classList.add("open");

	close.addEventListener("click", () => {
		modal.classList.remove("open");
		modal.classList.add("close");

		setTimeout(() => {
			modal.classList.remove("close");
		}, ANIMATION_SPEED);
	});
}

function finishGame() {
	showModal();
}

function showAnswer() {
	const options = getCardAnswers();

	options.forEach(e => {
		const text = getTextContent(e);

		if (text !== curQuest.correct_answer) {
			return e.classList.add("wrong");
		}

		e.classList.add("correct");

		if (e.classList.contains("active")) {
			e.classList.add("animate");
		}
	});

	setScore();

	if (curIndex === questions.length) {
		finishGame();
		return;
	}

	setTimeout(() => {
		setNextQuestion();
	}, 2000);
}

function promptToAnswer() {
	const options = getCardAnswers();

	const removePropmtClass = () => {
		options.forEach(e => e.classList.remove("prompt"));
	};

	options.forEach(e => e.classList.add("prompt"));

	setTimeout(removePropmtClass, 1000);
}

function onAnswer() {
	const options = getCardAnswers();

	const active = options.find(e => e.classList.contains("active"));

	if (!active) {
		return promptToAnswer();
	}

	const activeText = getTextContent(active);

	if (activeText === curQuest.correct_answer) {
		curScore += 10;
	}

	showAnswer();
}

function setScore() {
	const scoreline = document.getElementById("scoreline");
	const curWidth = getWidth();

	scoreline.innerHTML = "";
	scoreline.innerHTML = `
  <div class="progress flex flex-center flex-column">
    <h5>${curIndex}/${questions.length}</h5>
    <div class="progress__border">
      <div class="progress__border-color" style="height: 24px; width: ${curWidth}%"></div>
    </div>
  </div>
  <div class="score flex flex-center flex-column">
    <h5>Score</h5>
    <h3>${curScore}</h3>
  </div>`;
}

function setButtons() {
	const fifty = fiftyOption ? "available" : "not-available";
	const skip = skipOption ? "available" : "not-available";
	const main = curIndex === questions.length ? "Finish" : "Answer";

	card.innerHTML += `<div class="options">
    <span id="fiftyBtn" class="btn-option ${fifty}" onclick="applyFifty()">50/50</span>
    <div class="btn-grad" onclick="onAnswer()">${main}</div>
    <span id="skipBtn" class="btn-option ${skip}" onclick="applySkip()">Skip</span>
  </div>`;
}

function setListeners() {
	const options = getCardAnswers();

	options.forEach(e =>
		e.addEventListener("click", () => {
			const currentActive = options.find(c => c.classList.contains("active"));

			if (currentActive) {
				currentActive.classList.remove("active");
			}

			e.classList.add("active");
		})
	);
}

function setNextQuestion() {
	curQuest = questions[curIndex];
	curIndex++;

	const randIdx = getRand();
	let options = [...curQuest.incorrect_answers];

	options.splice(randIdx, 0, curQuest.correct_answer);

	card.innerHTML = "";
	card.innerHTML += `
    <h4 id="card-question" class="card__question">${curQuest.question}</h4>`;

	options.forEach((e, i) => {
		const letter = String.fromCharCode(65 + i);

		card.innerHTML += `
    <p class="card__answer">
      <span class="answer-letter">${letter}</span>
      <span class="answer-text">${e}</span>
    </p>`;
	});

	setButtons();
	setListeners();
}
