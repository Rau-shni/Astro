let currentLevel = 1;
const farmer = document.getElementById('farmer');
const nitrogen = document.getElementById('nitrogen');
const phosphorus = document.getElementById('phosphorus');
const potassium = document.getElementById('potassium');
let totalNutrients = { nitrogen: 0, phosphorus: 0, potassium: 0 };

let farmerPos = { top: 0, left: 0 };

// Level data with nutrients and obstacles for each level
const levels = {
    1: {
        nutrients: [
            { top: 100, left: 100 },
            { top: 200, left: 300 },
            { top: 400, left: 500 },
        ],
        obstacles: [
            { top: 300, left: 200 },
            { top: 450, left: 400 },
        ]
    },
    2: {
        nutrients: [
            { top: 50, left: 50 },
            { top: 150, left: 350 },
            { top: 350, left: 550 },
            { top: 250, left: 450 },
            { top: 450, left: 150 },
        ],
        obstacles: [
            { top: 100, left: 200 },
            { top: 300, left: 400 },
            { top: 500, left: 600 },
        ]
    },
    3: {
        nutrients: [
            { top: 50, left: 50 },
            { top: 150, left: 350 },
            { top: 350, left: 550 },
            { top: 250, left: 450 },
            { top: 450, left: 150 },
            { top: 550, left: 250 },
            { top: 100, left: 500 },
        ],
        obstacles: [
            { top: 100, left: 200 },
            { top: 200, left: 500 },
            { top: 300, left: 300 },
            { top: 500, left: 200 },
            { top: 400, left: 500 },
        ],
    }
};

// Function to start a level
function startLevel(level) {
    currentLevel = level;
    resetGameBoard();
    loadLevel(level);
}

// Function to reset game board
function resetGameBoard() {
    document.querySelectorAll('.nutrient').forEach(elem => elem.remove());
    document.querySelectorAll('.obstacle').forEach(elem => elem.remove());
    farmer.style.top = '0px';
    farmer.style.left = '0px';
    farmerPos = { top: 0, left: 0 };
}

// Function to load a level's nutrients and obstacles
function loadLevel(level) {
    const levelData = levels[level];

    // Load nutrients
    levelData.nutrients.forEach(nutrientPos => {
        const nutrient = document.createElement('div');
        const nutrientType = assignNutrientType();

        nutrient.classList.add('nutrient', nutrientType);
        nutrient.style.top = nutrientPos.top + 'px';
        nutrient.style.left = nutrientPos.left + 'px';
        document.getElementById('game-board').appendChild(nutrient);
    });

    // Load obstacles
    levelData.obstacles.forEach(obstaclePos => {
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.style.top = obstaclePos.top + 'px';
        obstacle.style.left = obstaclePos.left + 'px';
        document.getElementById('game-board').appendChild(obstacle);
    });
}

// Function to assign random nutrient type
function assignNutrientType() {
    const types = ['nitrogen', 'phosphorus', 'potassium'];
    return types[Math.floor(Math.random() * types.length)];
}

// Function to move the farmer based on arrow key presses
document.addEventListener('keydown', (event) => {
    const key = event.key;

    switch (key) {
        case 'ArrowUp':
            moveFarmer(0, -20);
            break;
        case 'ArrowDown':
            moveFarmer(0, 20);
            break;
        case 'ArrowLeft':
            moveFarmer(-20, 0);
            break;
        case 'ArrowRight':
            moveFarmer(20, 0);
            break;
    }

    checkCollisions();
});

// Move the farmer
function moveFarmer(dx, dy) {
    const newTop = farmerPos.top + dy;
    const newLeft = farmerPos.left + dx;

    if (newTop >= 0 && newTop <= 560 && newLeft >= 0 && newLeft <= 760) {
        farmerPos.top = newTop;
        farmerPos.left = newLeft;

        farmer.style.top = farmerPos.top + 'px';
        farmer.style.left = farmerPos.left + 'px';
    }
}

// Check for collisions with nutrients and obstacles
function checkCollisions() {
    const nutrients = document.querySelectorAll('.nutrient');
    const obstacles = document.querySelectorAll('.obstacle');

    nutrients.forEach((nutrient, index) => {
        if (isColliding(farmer, nutrient)) {
            collectNutrient(nutrient);
        }
    });

    obstacles.forEach((obstacle) => {
        if (isColliding(farmer, obstacle)) {
            resetFarmer();
        }
    });
}

// Check if two elements are colliding
function isColliding(elem1, elem2) {
    const rect1 = elem1.getBoundingClientRect();
    const rect2 = elem2.getBoundingClientRect();

    return !(
        rect1.top > rect2.bottom ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right ||
        rect1.right < rect2.left
    );
}

// Collect a nutrient and update the balance
function collectNutrient(nutrient) {
    const nutrientType = nutrient.classList.contains('nitrogen') ? 'nitrogen' :
                        nutrient.classList.contains('phosphorus') ? 'phosphorus' :
                        'potassium';

    totalNutrients[nutrientType]++;
    updateNutrientBalance();

    nutrient.remove(); // Remove collected nutrient
}

// Update the nutrient balance display
function updateNutrientBalance() {
    nitrogen.textContent = totalNutrients.nitrogen;
    phosphorus.textContent = totalNutrients.phosphorus;
    potassium.textContent = totalNutrients.potassium;
}

// Reset the farmer to the starting position if they hit an obstacle
function resetFarmer() {
    farmerPos = { top: 0, left: 0 };
    farmer.style.top = farmerPos.top + 'px';
    farmer.style.left = farmerPos.left + 'px';
}