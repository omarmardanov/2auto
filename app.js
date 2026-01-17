const input = document.querySelector('.input');
const button = document.querySelector('.search-button');
const results = document.querySelector('.results');
const car = document.querySelector('.car');

button.addEventListener('click', async () => {
  const query = input.value.trim();
  if (!query) return;

  // визуальное состояние
  car.classList.add('move-up');

  // запрос (пока заглушка)
  const data = await searchParts(query);

  // показать контейнер
  results.hidden = false;

  // временно просто проверить
  results.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
});
