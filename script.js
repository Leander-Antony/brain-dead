const board = document.getElementById('game-board');
const message = document.getElementById('message');
let cards = [];
let flippedCards = [];
let matchedCards = 0;
let isGameOver = false;

// Generate pairs of numbers for the cards
const generateCards = () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8]; // You can add more pairs
    const cardValues = [...values, ...values];
    cardValues.sort(() => Math.random() - 0.5); // Shuffle cards

    cardValues.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;
        card.addEventListener('click', handleCardClick);
        cards.push(card);
        board.appendChild(card);
    });
};

// Handle card flip
const handleCardClick = (event) => {
    if (isGameOver || flippedCards.length === 2 || event.target.classList.contains('flipped')) {
        return;
    }

    const clickedCard = event.target;
    flippedCards.push(clickedCard);
    clickedCard.textContent = clickedCard.dataset.value;
    clickedCard.classList.add('flipped');

    // Check if two cards are flipped
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
        // Check if all cards are matched
        if (matchedCards === cards.length) {
            message.textContent = 'You win!';
            isGameOver = true;
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

// Start the game
generateCards();
