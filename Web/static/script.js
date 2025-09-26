document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".carrossel .item");
  let currentIndex = 0;

  function showItem(index) {
    items.forEach((item, i) => {
      item.classList.remove("active");
      if (i === index) item.classList.add("active");
    });
  }

  function prevItem() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    showItem(currentIndex);
  }

  function nextItem() {
    currentIndex = (currentIndex + 1) % items.length;
    showItem(currentIndex);
  }

  // Inicializa
  showItem(currentIndex);

  // Expondo funções globais pros botões do HTML
  window.prevItem = prevItem;
  window.nextItem = nextItem;

  // Atualiza ano do rodapé
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});