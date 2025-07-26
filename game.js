const gameContainer = document.getElementById('game-container');
const startButton = document.getElementById('start-button');
const menuScreen = document.getElementById('menu-screen');
const instructions = document.getElementById('game-instructions');

const messageBox = document.getElementById('message-box');
const messageText = document.getElementById('message-text');
const messageClose = document.getElementById('message-close');

let inputEnabled = true;

function showMessage(text) {
  messageText.textContent = text;
  messageBox.classList.remove('hidden');
  inputEnabled = false;
}

messageClose.addEventListener('click', () => {
  messageBox.classList.add('hidden');
  inputEnabled = true;
});

const TILE_TYPES = {
  '#': 'wall',
  '.': 'floor',
  'P': 'player',
  '*': 'data',
  'E': 'exit',
  'G': 'glitch'
};

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

let playerPos = { x: 3, y: 3 };
let collectedData = 0;
const totalData = levelMap.flat().filter(tile => tile === '*').length;

function drawLevel() {
  gameContainer.innerHTML = '';
  for (let y = 0; y < levelMap.length; y++) {
    for (let x = 0; x < levelMap[y].length; x++) {
      const tileChar = levelMap[y][x];
      const tileDiv = document.createElement('div');
      tileDiv.classList.add('tile');
      tileDiv.classList.add(TILE_TYPES[tileChar]);
      tileDiv.textContent = tileChar === 'P' ? '🧑' :
                            tileChar === '*' ? '📀' :
                            tileChar === 'E' ? '🚪' :
                            tileChar === 'G' ? '⚠️' : '';
      gameContainer.appendChild(tileDiv);
    }
  }
}

function movePlayer(dx, dy) {
  if (!inputEnabled) return;

  const newX = playerPos.x + dx;
  const newY = playerPos.y + dy;

  if (newY < 0 || newY >= levelMap.length || newX < 0 || newX >= levelMap[0].length) {
    return;
  }

  const tileChar = levelMap[newY][newX];
  if (tileChar === '#') return;

  if (tileChar === 'G') {
    showMessage('You stepped into a glitch! Returning to start...');
    resetPlayer();
    return;
  }

  if (tileChar === '*') {
    collectedData++;
    levelMap[newY][newX] = '.';
    showMessage(`Data fragment collected! (${collectedData} / ${totalData})`);
  }

  if (tileChar === 'E') {
    if (collectedData === totalData) {
      showMessage('Congratulations! You escaped the glitch!');
      resetGame();
    } else {
      showMessage('You need to collect all data fragments first!');
      return;
    }
  }

  levelMap[playerPos.y][playerPos.x] = '.';
  levelMap[newY][newX] = 'P';
  playerPos = { x: newX, y: newY };
  drawLevel();
}

function resetPlayer() {
  levelMap[playerPos.y][playerPos.x] = '.';
  playerPos = { x: 3, y: 3 };
  levelMap[playerPos.y][playerPos.x] = 'P';
  collectedData = 0;
  resetDataFragments();
  drawLevel();
}

function resetDataFragments() {
  const originalDataPositions = [
    { x: 8, y: 1 },
    { x: 1, y: 8 }
  ];
  for (const pos of originalDataPositions) {
    if (levelMap[pos.y][pos.x] !== 'P') {
      levelMap[pos.y][pos.x] = '*';
    }
  }
}

function resetGame() {
  for (let y = 0; y < levelMap.length; y++) {
    for (let x = 0; x < levelMap[y].length; x++) {
      if (levelMap[y][x] !== '#' && levelMap[y][x] !== 'G') {
        levelMap[y][x] = '.';
      }
    }
  }
  levelMap[1][8] = '*';
  levelMap[8][1] = '*';
  playerPos = { x: 3, y: 3 };
  levelMap[playerPos.y][playerPos.x] = 'P';
  collectedData = 0;
  drawLevel();
}

document.addEventListener('keydown', (e) => {
  if (menuScreen.style.display !== 'none' || !inputEnabled) return;

  switch(e.key) {
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

startButton.addEventListener('click', () => {
  menuScreen.style.display = 'none';
  gameContainer.style.display = 'grid';
  instructions.style.display = 'block';
  drawLevel();
});
