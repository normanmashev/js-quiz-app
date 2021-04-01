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

const rand = () => {
	let min = 0,
		max = 3;
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getTextContent = e => {
	return e.textContent.substring(1, e.textContent.length);
};

const applyFifty = () => {
	const options = Array.from(document.querySelectorAll(".card__answer"));
	let randIdx = rand();

	while (getTextContent(options[randIdx]) === curQuest.correct_answer) {
		randIdx = rand();
	}

	options.forEach((e, i) => {
		if (getTextContent(e) === curQuest.correct_answer || i === randIdx) {
		} else {
			e.classList.add("invisible");
		}
	});

	const btn = document.querySelector("#fiftyBtn");
	btn.classList.remove("available");
	btn.classList.add("not-available");

	fiftyOption = false;
};

const applySkip = () => {
	const options = Array.from(document.querySelectorAll(".card__answer"));

	const correct = options.find(
		e => getTextContent(e) === curQuest.correct_answer
	);
	correct.classList.add("active");

	showAnswer();

	const btn = document.querySelector("#skipBtn");
	btn.classList.remove("available");
	btn.classList.add("not-available");

	skipOption = false;
};

const finishGame = () => {};

function showAnswer() {
	const options = Array.from(document.getElementsByClassName("card__answer"));

	options.forEach(e => {
		const text = getTextContent(e);

		if (text === curQuest.correct_answer) {
			e.classList.add("correct");
		} else {
			e.classList.add("wrong");
		}

		if (e.classList.contains("active") && e.classList.contains("correct")) {
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

function answerBtnListener() {
	const options = Array.from(document.getElementsByClassName("card__answer"));

	options.forEach(e => {
		if (e.classList.contains("active")) {
			const text = getTextContent(e);

			if (text === curQuest.correct_answer) {
				curScore += 10;
			}

			showAnswer();
		}
	});
}

function setScore() {
	const scoreline = document.getElementById("scoreline");
	curWidth = Math.round((curIndex * 100) / questions.length);

	scoreline.innerHTML = "";
	scoreline.innerHTML = `<div class="progress flex flex-center flex-column">
  <h5>${curIndex}/${questions.length}</h5>
  <div class="progress__border">
    <div
      class="progress__border-color"
      style="height: 24px; width: ${curWidth}%"
    ></div>
  </div>
</div>
<div class="score flex flex-center flex-column">
  <h5>Score</h5>
  <h3>${curScore}</h3>
</div>`;
}

function setButtons() {
	card.innerHTML += `<div class="options">
  <span id="fiftyBtn" class="btn-option ${
		fiftyOption ? "available" : "not-available"
	}"
  onclick="applyFifty()"
  >50/50</span>
  <div class="btn-grad" onclick="answerBtnListener()">${
		curIndex === questions.length - 1 ? "Finish" : "Answer"
	}</div>
  <span id="skipBtn" class="btn-option ${
		skipOption ? "available" : "not-available"
	}"
  onclick="applySkip()"
  >Skip</span>
</div>`;
}

function setNextQuestion() {
	curQuest = questions[curIndex];

	const randIdx = rand();
	let options = [...curQuest.incorrect_answers];
	options.splice(randIdx, 0, curQuest.correct_answer);

	card.innerHTML = "";
	card.innerHTML += `<h4 id="card-question" class="card__question">${curQuest.question}</h4>`;
	options.forEach((e, i) => {
		card.innerHTML += `<p class="card__answer"><span>${String.fromCharCode(
			65 + i
		)}</span>${e}</p>`;
	});

	setButtons();
	curIndex++;
	addListeners();
}

function addListeners() {
	const options = Array.from(document.getElementsByClassName("card__answer"));

	options.forEach(e =>
		e.addEventListener("click", () => {
			Array.from(options).forEach(c => {
				c.classList.remove("active");
			});
			e.classList.add("active");
		})
	);
}
