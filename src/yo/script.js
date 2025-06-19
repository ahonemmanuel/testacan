// Carousel automatique + pagination
const slides = document.querySelectorAll(".slide");
const dotsEl = document.querySelector(".dots");

let idx = 0;
slides.forEach((_, i) => {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => goToSlide(i));
  dotsEl.append(dot);
});

function goToSlide(i) {
  idx = i;
  update();
}
function update() {
  document.querySelector(".slides").style.transform = `translateX(-${idx * 100}%)`;
  document.querySelectorAll(".dot").forEach((d,i)=>d.classList.toggle("active", i===idx));
}
setInterval(() => {
  idx = (idx + 1) % slides.length;
  update();
}, 5000);
