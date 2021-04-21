const toast = document.getElementById("toast");

toast.addEventListener("click", () => {
	closeToast();
});

function closeToast() {
	toast.classList.remove("show-toast");
	toast.classList.add("hide-toast");

	setTimeout(toast.classList.remove("hide-toast"), 1000);
}

function showToast() {
	toast.classList.add("show-toast");

	setTimeout(closeToast, 5000);
}
