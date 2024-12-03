let cards = [];

// GitHub Repository Info
const GITHUB_USERNAME = "AlphaNoXD";
const GITHUB_REPO = "quizlet-locke-11";
const FILE_PATH = "flashcards.json";
const TOKEN = "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"; // Replace with your personal access token.

// DOM Elements
const termInput = document.getElementById('term');
const definitionInput = document.getElementById('definition');
const addCardButton = document.getElementById('add-card');
const cardsContainer = document.getElementById('cards');

// Fetch flashcards from GitHub
const fetchFlashcards = async () => {
    const url = `https://api.github.com/repos/AlphaNoXD/quizlet-locke-11/contents/flashcards.json`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch flashcards.");

        const data = await response.json();
        const content = atob(data.content); // Decode Base64 content
        cards = JSON.parse(content);
        updateCardsUI();
    } catch (error) {
        console.error("Error fetching flashcards:", error);
        cards = [];
    }
};

// Save flashcards to GitHub
const saveFlashcards = async () => {
    const url = `https://api.github.com/repos/AlphaNoXD/quizlet-locke-11/contents/flashcards.json`;
    const content = btoa(JSON.stringify(cards)); // Encode content as Base64

    try {
        // Get current file's SHA (required for updating)
        const response = await fetch(url);
        const existingData = response.ok ? await response.json() : null;
        const sha = existingData ? existingData.sha : null;

        // Prepare payload
        const body = {
            message: "Update flashcards",
            content: content,
            sha: sha, // Include SHA if updating
        };

        const saveResponse = await fetch(url, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (saveResponse.ok) {
            alert("Flashcards saved successfully!");
        } else {
            throw new Error("Failed to save flashcards.");
        }
    } catch (error) {
        console.error("Error saving flashcards:", error);
    }
};

// Update the UI to display flashcards
const updateCardsUI = () => {
    cardsContainer.innerHTML = '';
    cards.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');

        // Card Inner
        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        // Front and Back
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.textContent = card.term;

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.textContent = card.definition;

        // Append Front and Back
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        cardDiv.appendChild(cardInner);

        // Add flip functionality
        cardDiv.addEventListener('click', () => {
            cardInner.classList.toggle('card-flipped');
        });

        cardsContainer.appendChild(cardDiv);
    });
};

// Add a new flashcard
addCardButton.addEventListener('click', () => {
    const term = termInput.value.trim();
    const definition = definitionInput.value.trim();

    if (term && definition) {
        cards.push({ term, definition });
        termInput.value = '';
        definitionInput.value = '';
        updateCardsUI();
        saveFlashcards(); // Save to GitHub after adding
    } else {
        alert('Please fill out both fields!');
    }
});

// Load flashcards on page load
document.addEventListener('DOMContentLoaded', fetchFlashcards);
