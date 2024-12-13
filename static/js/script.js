const board = document.getElementById('game-board');
const message = document.getElementById('message');
const movesDisplay = document.querySelector('.moves');
const timeDisplay = document.querySelector('.time');
const restartButton = document.querySelector('.restart');
const scoreDisplay = document.getElementById('score');
const leaderboardList = document.getElementById('leaderboard-list');
const nameModal = document.getElementById('nameModal');
const nameForm = document.getElementById('nameForm');
const playerNameInput = document.getElementById('playerName');

let cards = [];
let flippedCards = [];
let matchedCards = 0;
let isGameOver = false;
let moves = 0;
let time = 0;
let timerInterval;
let isTimerStarted = false;

// Function to start the game
const startGame = () => {
    generateCards();
};

// Function to generate cards
const generateCards = () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8];
    const cardValues = [...values, ...values];
    cardValues.sort(() => Math.random() - 0.5);

    cardValues.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;
        card.addEventListener('click', handleCardClick);
        cards.push(card);
        board.appendChild(card);
    });
};

// Function to start the timer
const startTimer = () => {
    if (!isTimerStarted) {
        isTimerStarted = true;
        timerInterval = setInterval(() => {
            time++;
            timeDisplay.textContent = `Time: ${time} sec`;
            updateScore();
        }, 1000);
    }
};

// Handle card click event
const handleCardClick = (event) => {
    if (isGameOver || flippedCards.length === 2 || event.target.classList.contains('flipped')) {
        return;
    }

    const clickedCard = event.target;
    flippedCards.push(clickedCard);

    clickedCard.textContent = clickedCard.dataset.value;
    clickedCard.classList.add('flipped');

    moves++;
    movesDisplay.textContent = `Moves: ${moves} moves`;

    updateScore();

    if (!isTimerStarted) {
        startTimer();
    }

    if (flippedCards.length === 2) {
        checkForMatch();
    }
};

// Check if the two flipped cards match
const checkForMatch = () => {
    const [card1, card2] = flippedCards;

    if (card1.dataset.value === card2.dataset.value) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCards += 2;
        flippedCards = [];

        if (matchedCards === cards.length) {
            gameOver();
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '';
            card2.textContent = '';
            flippedCards = [];
        }, 1000);
    }
};

// Function to update the score
const updateScore = () => {
    const score = Math.max(1000 - (moves * 10 + time), 0);
    scoreDisplay.textContent = `Score: ${score}`;
};


const restartGame = () => {
    location.reload(); // This reloads the page and resets everything
};


// When the game is over
const gameOver = () => {
    clearInterval(timerInterval);
    message.textContent = `You win! Final score: ${Math.max(1000 - (moves * 10 + time), 0)}`;
    isGameOver = true;

    // Open modal to enter name
    openModal();
};

// Open the modal
const openModal = () => {
    nameModal.style.display = 'block';
};

// Close the modal
const closeModal = () => {
    nameModal.style.display = 'none';
};

// Handle form submission for the name and score
nameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const playerName = playerNameInput.value.trim();
    const finalScore = Math.max(1000 - (moves * 10 + time), 0);
    
    if (playerName) {
        // Send name and score to the backend (Flask)
        fetch('/submit_score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ player_name: playerName, score: finalScore }),
        })
        .then(response => response.json())
        .then(data => {
            updateLeaderboard(data);
            closeModal();
        });
    }
});

// Fetch and update the leaderboard
const updateLeaderboard = (data) => {
    leaderboardList.innerHTML = '';
    data.leaderboard.forEach((entry) => {
        const li = document.createElement('li');
        li.textContent = `${entry.player_name}: ${entry.score}`;
        leaderboardList.appendChild(li);
    });
};

// Fetch leaderboard on page load
const fetchLeaderboard = () => {
    fetch('/get-leaderboard')
        .then(response => response.json())
        .then(data => {
            updateLeaderboard(data);
        });
};

// Initial leaderboard fetch
fetchLeaderboard();

// Start the game
startGame();

// Get modal elements
const leaderboardModal = document.getElementById('leaderboardModal');
const viewLeaderboardBtn = document.getElementById('viewLeaderboardBtn');
const closeLeaderboardModalBtn = document.getElementsByClassName('close-btn')[0];

// Show leaderboard modal
viewLeaderboardBtn.onclick = function() {
    leaderboardModal.style.display = 'block';
}

// Close leaderboard modal
closeLeaderboardModalBtn.onclick = function() {
    leaderboardModal.style.display = 'none';
}

// Close modal if clicked outside the content
window.onclick = function(event) {
    if (event.target === leaderboardModal) {
        leaderboardModal.style.display = 'none';
    }
}

// Function to dynamically populate the leaderboard data
function populateLeaderboard() {
    fetchLeaderboard(); // Re-fetch the leaderboard to ensure it is up-to-date.
}

// Call the populateLeaderboard function when the page loads or after a game is finished
populateLeaderboard();

document.addEventListener('contextmenu', function (e) {
    e.preventDefault();  // Disable right-click
});

document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();  // Disable copy keyboard shortcuts
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault(); // Disable F12 and Ctrl+Shift+I (DevTools)
    }
});

let isDevToolsOpen = false;

function detectDevTools() {
    const threshold = 160; // Adjust as needed to detect DevTools opening

    // Try to access a deep property to measure execution time
    const start = new Date().getTime();
    debugger; // Adding a breakpoint manually
    const end = new Date().getTime();

    if (end - start > threshold) {
        isDevToolsOpen = true;
    }

    if (isDevToolsOpen) {
        alert('Please close the developer tools!');
        window.location.reload(); // Reload the page to enforce closure
    }
}

// Check for DevTools every second
setInterval(detectDevTools, 3000);

