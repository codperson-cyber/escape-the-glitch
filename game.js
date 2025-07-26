const gameContainer = document.getElementById('game-container');

const levelMap = [
  ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
  ['#', '.', '.', '.', '.', '.', '.', '.', '*', '#'],
  ['#', '.', '#', '#', '#', '.', '#', 'G', '.', '#'],
  ['#', '.', '.', 'P', '.', '.', '#', '.', '.', '#'],
  ['#', '#', '.', '#', '#', '.', '#', '.', '#', '#'],
  ['#', '.', '.', '.', '.', '.', 'G', '.', '.', '#'],
  ['#', '.', '#', '#', '#', '#', '#', '#', '.', '#'],
  ['#', '.', '.', '.', '.', '.', '.', '#', '.', '#'],
  ['#', '*', '#', '#', '#', '#', '.', '#', 'E', '#'],
  ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#']
];

const TILE_TYPES = {
  '#': 'wall',
  '.': 'floor',
  'P': 'player',
  '*': 'data',
  'E': 'exit',
  'G': 'glitch'
};

let playerPos = { x: 3, y: 3 };
let collectedData = 0;
const totalData = levelMap.flat().filter(t => t === '*').length;

function drawLevel() {
  gameContainer.innerHTML = '';
  for (let y = 0; y < levelMap.length; y++) {
    for (let x = 0; x < levelMap[y].length; x++) {
      const tileChar = levelMap[y][x];
      const tileDiv = document.createElement('div');
      tileDiv.classList.add('tile');

      // Apply tile type class
      if (TILE_TYPES[tileChar]) {
        tileDiv.classList.add(TILE_TYPES[tileChar]);
      } else {
        tileDiv.classList.add('floor');
      }

      // If player position, override class to player
      if (playerPos.x === x && playerPos.y === y) {
        tileDiv.classList.remove('player', 'data'); // Remove old classes if any
        tileDiv.classList.add('player');
      }

      gameContainer.appendChild(tileDiv);
    }
  }
}

function canMoveTo(x, y) {
  if (y < 0 || y >= levelMap.length || x < 0 || x >= levelMap[0].length) return false;
  if (levelMap[y][x] === '#') return false;
  return true;
}

function movePlayer(dx, dy) {
  const newX = playerPos.x + dx;
  const newY = playerPos.y + dy;

  if (!canMoveTo(newX, newY)) return;

  playerPos.x = newX;
  playerPos.y = newY;

  // Check tile player moved onto
  const tileChar = levelMap[newY][newX];

if (tileChar === '*') {
  collectedData++;
  levelMap[newY][newX] = '.'; // Remove the data piece
  alert(`Data fragment collected! (${collectedData} / ${totalData})`);
}

if (tileChar === 'E') {
  if (collectedData === totalData) {
    alert('Congratulations! You escaped the glitch!');
  } else {
    alert('You need to collect all data fragments first!');
  }
}

if (tileChar === 'G') {
  alert('You stepped into a glitch! Returning to start...');
  playerPos = { x: 3, y: 3 }; // Reset to original position
}
  drawLevel();
}

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      movePlayer(0, -1);
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      movePlayer(0, 1);
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      movePlayer(-1, 0);
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      movePlayer(1, 0);
      break;
  }
});

drawLevel();
