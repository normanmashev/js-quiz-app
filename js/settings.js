const saveBtn = document.getElementById("saveBtn");
const nameField = document.getElementById("name");
const playerName = localStorage.getItem("playername") || "";

window.onload = function () {
	nameField.value = playerName;
};

saveBtn.addEventListener("click", () => {
	let newName = nameField.value.trim();
	localStorage.setItem("playername", newName);
	showToast();
});
