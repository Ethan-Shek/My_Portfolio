export function createRockBorders() {
  const pond = document.querySelector('.pond-container');
  const leftContainer = document.querySelector('.rocks.left');
  const rightContainer = document.querySelector('.rocks.right');

  if (!pond || !leftContainer || !rightContainer) return;

  leftContainer.innerHTML = '';
  rightContainer.innerHTML = '';

  const rockSrc = 'images/rocks2 ChatGPT.png';
  const rockWidth = 150; // width on screen
  const rockHeight = 100; // use this to calculate number of rocks
  const rockMargin = -30;

  const pondHeight = pond.scrollHeight;
  const numRocks = Math.ceil(pondHeight / (rockHeight + rockMargin));

  for (let i = 0; i < numRocks; i++) {
    const leftRock = document.createElement('img');
    leftRock.src = rockSrc;
    leftRock.className = 'rock';
    leftRock.style.width = rockWidth + 'px';
    leftRock.style.height = rockHeight + 'px';
    leftRock.style.transform = 'rotate(90deg)';
    leftRock.style.marginBottom = rockMargin + 'px';
    leftContainer.appendChild(leftRock);

    const rightRock = document.createElement('img');
    rightRock.src = rockSrc;
    rightRock.className = 'rock';
    rightRock.style.width = rockWidth + 'px';
    rightRock.style.height = rockHeight + 'px';
    rightRock.style.transform = 'rotate(-90deg)';
    rightRock.style.marginBottom = rockMargin + 'px';
    rightContainer.appendChild(rightRock);
  }
}
