const getQuestions = async url => {
	try {
		let response = await fetch(url);
		let questions = await response.json();
		return questions.results;
	} catch (error) {
		console.error(error);
	}
};

const createApiUrl = () => {
	const amount = document.getElementById("amount").value;
	const category = document.getElementById("category").value;
	const difficulty = document.getElementById("difficulty").value;
	const type = document.getElementById("type").value;

	let url = `https://opentdb.com/api.php?amount=${amount}`;

	if (category !== "any") {
		url += `&category=${category}`;
	}
	if (difficulty !== "any") {
		url += `&difficulty=${difficulty}`;
	}
	if (type !== "any") {
		url += `&type=${type}`;
	}

	return url;
};

const startGame = async () => {
	try {
		const url = createApiUrl();
		const questions = await getQuestions(url);

		if (!questions.length) {
			showToast();
			return;
		}

		localStorage.setItem("questions", JSON.stringify(questions));
		location.href = "game.html";
	} catch (error) {
		console.log(error);
	}
};

const startBtn = document.getElementById("startBtn");
startBtn.addEventListener("click", () => startGame());
