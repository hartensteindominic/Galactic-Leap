const form = document.getElementById('review-form');
const result = document.getElementById('result');
const year = document.getElementById('year');

year.textContent = new Date().getFullYear();

const reviewSignals = {
  positive: ['love', 'great', 'amazing', 'excellent', 'perfect', 'fast', 'reliable'],
  concern: ['issue', 'problem', 'slow', 'hard', 'difficult', 'late', 'confusing', 'setup']
};

const hasSignal = (text, words) => words.some((word) => text.includes(word));

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const product = document.getElementById('product').value.trim();
  const customer = document.getElementById('customer').value.trim();
  const review = document.getElementById('review').value.trim();
  const lowerReview = review.toLowerCase();

  const positiveTone = hasSignal(lowerReview, reviewSignals.positive);
  const hasConcerns = hasSignal(lowerReview, reviewSignals.concern);

  const empathyMessage = hasConcerns
    ? `Thanks ${customer} — we appreciate your honest feedback on ${product}. Our team can guide you through setup and make this smooth right away.`
    : `Thanks ${customer}! We're thrilled ${product} is delivering a great experience for you.`;

  const trustMessage = hasConcerns
    ? `${product} is protected by our support commitment, so if anything feels off we respond quickly with replacement or troubleshooting help.`
    : `${product} is backed by verified quality checks and dependable support, so customers can buy with confidence.`;

  const valueMessage = positiveTone
    ? `Based on your review, ${product} is a strong value pick for customers who want dependable performance.`
    : `Even with your note, ${product} remains a high-confidence choice for buyers who want feature depth and long-term support.`;

  const salesSummary = hasConcerns
    ? 'AI reassurance mode: concern detected, response focused on service and trust recovery.'
    : 'AI reassurance mode: positive momentum detected, response focused on confidence and conversion.';

  result.innerHTML = `
    <strong>${product} • AI Response Suite</strong>
    <p><em>Customer review:</em> “${review}”</p>
    <ul class="response-list">
      <li><strong>Empathy Agent:</strong> ${empathyMessage}</li>
      <li><strong>Trust Agent:</strong> ${trustMessage}</li>
      <li><strong>Value Agent:</strong> ${valueMessage}</li>
    </ul>
    <p><strong>${salesSummary}</strong></p>
  `;
});
