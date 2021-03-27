let curQuest;
let curWidth = 0;
let curScore = 0;
let curIndex = 0;
const questions = JSON.parse(localStorage.getItem("questions"));

document.addEventListener("DOMContentLoaded", () => {
	setNextQuestion();
});

const rand = () => {
	let min = 0,
		max = 3;
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

function showAnswer() {
	const options = document.getElementsByClassName("card__answer");
	curWidth = Math.round((curIndex * 100) / questions.length);
	Array.from(options).forEach(e => {
		e.classList.remove("active");
		const text = e.textContent.substring(1, e.textContent.length);
		if (text === curQuest.correct_answer) {
			e.classList.add("correct");
		} else {
			e.classList.add("wrong");
		}
	});
	setScore();
	setTimeout(() => {
		setNextQuestion();
	}, 2000);
}

function answerBtnListener() {
	const options = document.getElementsByClassName("card__answer");
	Array.from(options).forEach(e => {
		if (e.classList.contains("active")) {
			const text = e.textContent.substring(1, e.textContent.length);
			if (text === curQuest.correct_answer) {
				curScore += 10;
			}
			showAnswer();
		}
	});
}

function setScore() {
	const scoreline = document.getElementById("scoreline");
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
	card.innerHTML +=
		'<div class="btn-grad" onclick="answerBtnListener()">Answer</div>';

	curIndex++;
	addListeners();
}

function addListeners() {
	const options = document.getElementsByClassName("card__answer");
	Array.from(options).forEach(e =>
		e.addEventListener("click", () => {
			Array.from(options).forEach(c => {
				c.classList.remove("active");
			});
			e.classList.add("active");
		})
	);
}
