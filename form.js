const form = document.getElementById('feedbackForm');
const rating = document.getElementById('rating');
const ratingValue = document.getElementById('ratingValue');
const backButton = document.getElementById('backButton');

// Track if slider has been interacted with
let ratingTouched = false;

// INITIALIZE SLIDER
ratingValue.textContent = rating.value;

// Detect user interaction
rating.addEventListener('input', () => {
  ratingValue.textContent = rating.value;
  ratingTouched = true; // mark slider as touched
});

// Also count clicks in case user clicks default value without dragging
rating.addEventListener('click', () => {
  ratingTouched = true;
});

// BACK TO QUIZZES BUTTON
backButton.addEventListener('click', () => {
  window.location.href = 'index.html';
});

// FORM SUBMISSION
form.addEventListener('submit', function(e) {
  let valid = true;
  const messages = [];

  // Age validation
  const age = document.getElementById('age');
  if (!age.value || age.value < 5 || age.value > 120) {
    valid = false;
    messages.push("Valid age (5-120) is required.");
  }

  // Gender validation
  const gender = document.getElementById('gender');
  if (!gender.value) {
    valid = false;
    messages.push("Please select your gender.");
  }

  // Rating validation
  if (!ratingTouched) {
    valid = false;
    messages.push("Please move or click the slider to rate the quiz.");
  }

  // If invalid, stop submission and show errors
  if (!valid) {
    e.preventDefault();
    alert(messages.join("\n"));
  }

});
