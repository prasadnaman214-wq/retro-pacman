const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('current-score');
const highScoreEl = document.getElementById('high-score');
const startBtn = document.getElementById('start-btn');
const difficultySelect = document.getElementById('difficulty-select');
const menu = document.getElementById('menu');

// Canvas scaling for responsiveness
canvas.width = Math.min(window.innerWidth * 0.9, 600);
canvas.height = canvas.width; 

let score = 0;
let highScore = localStorage.getItem('pacmanHighScore') || 0;
highScoreEl.innerText = highScore;

let gameLoop;
let isPlaying = false;

// Difficulty Configuration Matrix
const difficultySettings = {
    easy: { ghostSpeed: 1, playerSpeed: 2.5, scatterTime: 10000 },
    medium: { ghostSpeed: 1.5, playerSpeed: 2.5, scatterTime: 7000 },
    hard: { ghostSpeed: 2.2, playerSpeed: 2.5, scatterTime: 4000 },
    auto: { ghostSpeed: 1, playerSpeed: 2.5, scatterTime: 10000 } // Starts easy
};

let currentMode = 'medium';
let activeSettings = { ...difficultySettings.medium };

function updateHighScore(newScore) {
    if (newScore > highScore) {
        highScore = newScore;
        localStorage.setItem('pacmanHighScore', highScore);
        highScoreEl.innerText = highScore;
    }
}

function handleAutoDifficulty() {
    if (currentMode !== 'auto') return;
    
    // Push the player: Every 500 points, increase ghost speed and reduce safe zones
    let scalingFactor = Math.floor(score / 500);
    
    // Cap the maximum difficulty so it remains playable
    activeSettings.ghostSpeed = Math.min(1 + (scalingFactor * 0.2), 3.0);
    activeSettings.scatterTime = Math.max(10000 - (scalingFactor * 1000), 2000);
}

function update() {
    // Game logic goes here (movement, collision, eating pellets)
    
    // Example of score increasing to test auto mode
    // score += 1; 
    
    handleAutoDifficulty();
    scoreEl.innerText = score;
    updateHighScore(score);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Render grid, player, and ghosts here
}

function loop() {
    if (!isPlaying) return;
    update();
    draw();
    requestAnimationFrame(loop);
}

startBtn.addEventListener('click', () => {
    currentMode = difficultySelect.value;
    activeSettings = { ...difficultySettings[currentMode] };
    score = 0;
    isPlaying = true;
    menu.style.display = 'none';
    loop();
});
