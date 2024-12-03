let cards = [];

// Retrieve saved flashcards from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedCards = localStorage.getItem('flashcards');
    if (savedCards) {
        cards = JSON.parse(savedCards);
        updateCardsUI();
    }
});

const termInput = document.getElementById('term');
const definitionInput = document.getElementById('definition');
const addCardButton = document.getElementById('add-card');
const saveButton = document.getElementById('save-quizlet');
const loadButton = document.getElementById('load-quizlet');
const cardsContainer = document.getElementById('cards');

const updateCardsUI = () => {
    cardsContainer.innerHTML = '';
    cards.forEach((card) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.innerHTML = `
            <strong>Term:</strong> ${card.term} <br />
            <strong>Definition:</strong> ${card.definition}
        `;
        cardsContainer.appendChild(cardDiv);
    });
};

addCardButton.addEventListener('click', () => {
    const term = termInput.value.trim();
    const definition = definitionInput.value.trim();
    if (term && definition) {
        cards.push({ term, definition });
        termInput.value = '';
        definitionInput.value = '';
        updateCardsUI();
    }
});

saveButton.addEventListener('click', () => {
    localStorage.setItem('flashcards', JSON.stringify(cards));
    alert('Flashcards saved successfully!');
});

loadButton.addEventListener('click', () => {
    const savedCards = localStorage.getItem('flashcards');
    if (savedCards) {
        cards = JSON.parse(savedCards);
        updateCardsUI();
        alert('Flashcards loaded successfully!');
    } else {
        alert('No flashcards found!');
    }
});
