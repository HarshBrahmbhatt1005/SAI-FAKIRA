// Form Open/Close Logic
const openFormBtn = document.getElementById("openForm");
const closeFormBtn = document.getElementById("closeForm");
const formOverlay = document.getElementById("formOverlay");

openFormBtn.addEventListener("click", () => {
  formOverlay.style.display = "flex";
});

closeFormBtn.addEventListener("click", () => {
  formOverlay.style.display = "none";
});

// Close on outside click
window.addEventListener("click", (e) => {
  if (e.target === formOverlay) {
    formOverlay.style.display = "none";
  }
});
setTimeout(() => {
  document.getElementById("myBox").classList.add("show");
}, 2000);


