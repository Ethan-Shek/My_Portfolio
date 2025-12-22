const blueTint = document.querySelector('.blue-tint');

// Generate random duration between 5 and 10 seconds
const randomDuration = (Math.random() * 1 + 3).toFixed(2) + 's';

blueTint.style.animationDuration = randomDuration;
