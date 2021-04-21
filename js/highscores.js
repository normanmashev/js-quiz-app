function getScores() {
	return JSON.parse(localStorage.getItem("highscores")) || [];
}

function insertScores(table, scores) {
	const caption = `
  <caption><h1>Highscores</h1></caption>
    <tr>
      <th>#</th>
      <th>Name</th>
      <th>Score</th>
    </tr>`;

	table.innerHTML = caption;

	scores.forEach((e, i) => {
		const tr = `<tr>
                  <td>${i + 1}</td>
                  <td>${e.name}</td>
                  <td>${e.score}</td>
                </tr>`;
		table.innerHTML += tr;
	});
}

document.addEventListener("DOMContentLoaded", () => {
	const scores = getScores();
	const table = document.getElementsByTagName("table")[0];

	if (!scores.length) {
		table.innerHTML = "<caption><h1>No games played</h1></caption>";
		return;
	}

	insertScores(table, scores);
});
