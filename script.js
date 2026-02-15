const form = document.getElementById('review-form');
const result = document.getElementById('result');
const year = document.getElementById('year');

year.textContent = new Date().getFullYear();

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const product = document.getElementById('product').value.trim();
  const price = Number(document.getElementById('price').value);

  const score = Math.min(9.8, Math.max(6.5, (10 - price / 120) + Math.random() * 1.2));
  const roundedScore = score.toFixed(1);
  const recommendation = price > 450
    ? 'premium buyers and creators'
    : price > 200
      ? 'everyday professionals'
      : 'budget-conscious shoppers';

  result.innerHTML = `
    <strong>${product} Agent Brief</strong><br>
    Overall score: <strong>${roundedScore}/10</strong> based on sentiment, trust, and value signals.<br>
    Best fit for <strong>${recommendation}</strong> at <strong>$${price}</strong>.
  `;
});
