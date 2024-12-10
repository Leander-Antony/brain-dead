const board = document.getElementById('game-board');
const message = document.getElementById('message');
const movesDisplay = document.querySelector('.moves');
const timeDisplay = document.querySelector('.time');
const restartButton = document.querySelector('.restart');

let cards = [];
let flippedCards = [];
let matchedCards = 0;
let isGameOver = false;
let moves = 0; // Track number of moves
let time = 0; // Track time
let timerInterval;

// Function to start the game
const startGame = () => {
    generateCards();
    startTimer();
};

// Function to generate cards
const generateCards = () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8];
    const cardValues = [...values, ...values]; 
    cardValues.sort(() => Math.random() - 0.5); 

    // Create and append cards to the board
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
    timerInterval = setInterval(() => {
        time++;
        timeDisplay.textContent = `Time: ${time} sec`;
    }, 1000);
};

// Handle card click event
const handleCardClick = (event) => {
    if (isGameOver || flippedCards.length === 2 || event.target.classList.contains('flipped')) {
        return; 
    }

    const clickedCard = event.target;
    flippedCards.push(clickedCard);

    // Display the card's value when clicked
    clickedCard.textContent = clickedCard.dataset.value;
    clickedCard.classList.add('flipped'); 

    // Increment moves counter
    moves++;
    movesDisplay.textContent = `Moves: ${moves} moves`;

    // Check if two cards are flipped
    if (flippedCards.length === 2) {
        checkForMatch();
    }
};

// Check if the two flipped cards match
const checkForMatch = () => {
    const [card1, card2] = flippedCards;

    // If the cards match
    if (card1.dataset.value === card2.dataset.value) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCards += 2;
        flippedCards = [];

        // Check if all cards are matched
        if (matchedCards === cards.length) {
            clearInterval(timerInterval); 
            message.textContent = 'You win!';
            isGameOver = true;
        }
    } else {
        // If cards don't match, flip them back after 1 second
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '';  
            card2.textContent = '';
            flippedCards = []; 
        }, 1000);
    }
};

// Restart the game
const restartGame = () => {
    // Reset variables
    cards = [];
    flippedCards = [];
    matchedCards = 0;
    isGameOver = false;
    moves = 0;
    time = 0;
    clearInterval(timerInterval); 

    // Clear the game board
    board.innerHTML = '';

    // Reset UI display
    movesDisplay.textContent = `Moves: 0 moves`;
    timeDisplay.textContent = `Time: 0 sec`;
    message.textContent = ''; 

    // Start a new game
    startGame();
};

// Start the game 
startGame();

    
            
