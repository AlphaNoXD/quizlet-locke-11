// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB2YAEosEBBrzb6BJr1JcyWLfwxZL58J_s",
    authDomain: "quizlet-daw.firebaseapp.com",
    projectId: "quizlet-daw",
    storageBucket: "quizlet-daw.firebasestorage.app",
    messagingSenderId: "992524312569",
    appId: "1:992524312569:web:52ade6a2aa0de5ad932728",
    measurementId: "G-GRLTXMMVR5"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// DOM Elements
const uploadButton = document.getElementById('uploadButton');
const formContainer = document.getElementById('formContainer');
const flashcardContainer = document.getElementById('flashcardContainer');
const submitButton = document.getElementById('submitButton');
const cancelButton = document.getElementById('cancelButton');
const questionInput = document.getElementById('question');
const answerInput = document.getElementById('answer');

// Show the form to create a flashcard
uploadButton.addEventListener('click', () => {
    formContainer.classList.toggle('hidden');
});

// Submit the flashcard
submitButton.addEventListener('click', () => {
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();

    if (question && answer) {
        createFlashcard(question, answer);
        questionInput.value = '';
        answerInput.value = '';
        formContainer.classList.add('hidden');
    } else {
        alert("Please fill in both fields.");
    }
});

// Cancel the form
cancelButton.addEventListener('click', () => {
    questionInput.value = '';
    answerInput.value = '';
    formContainer.classList.add('hidden');
});

// Function to create a flashcard
function createFlashcard(question, answer) {
    const flashcardRef = database.ref('flashcards').push();
    flashcardRef.set({
        question: question,
        answer: answer
    });
}

// Function to display flashcards
function displayFlashcards() {
    flashcardContainer.innerHTML = ''; // Clear existing flashcards
    const flashcardsRef = database.ref('flashcards');

    flashcardsRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            Object.keys(data).forEach(key => {
                const flashcard = data[key];
                const flashcardDiv = document.createElement('div');
                flashcardDiv.classList.add('flashcard');
                flashcardDiv.innerHTML = `
                    <strong>Question:</strong> ${flashcard.question}<br>
                    <strong>Answer:</strong> ${flashcard.answer}
                    <button class="deleteButton" data-id="${key}">Delete</button>
                `;
                flashcardContainer.appendChild(flashcardDiv);
            });
        }
    });
}

// Function to delete a flashcard
flashcardContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('deleteButton')) {
        const flashcardId = event.target.getAttribute('data-id');
        deleteFlashcard(flashcardId);
    }
});

// Function to delete a flashcard from the database
function deleteFlashcard(id) {
    const flashcardRef = database.ref('flashcards/' + id);
    flashcardRef.remove();
}

// Initial call to display flashcards
displayFlashcards();