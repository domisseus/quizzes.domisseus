/* topic.js - Shared logic for all vocabulary pages */

// --- GLOBAL VARIABLES ---
let vocabList = [];
let currentWord = {};
let isFlipped = false;
let currentMode = 0; // 0: Flashcard, 1: Quiz
let isReverse = false; // False = Spa->Eng, True = Eng->Spa
let fullCount = 0;
let fontMode = 0; // 0: Std, 1: Cursive, 2: Readable

// --- INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    // 1. Build vocabulary list from DOM
    const tables = document.querySelectorAll('.vocab-table');
    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cols = row.querySelectorAll('td');
            if(cols.length === 2) {
                const spanTd = cols[0];
                const engTd = cols[1];

                const spanishText = spanTd.textContent.trim();
                const englishText = engTd.textContent.trim();

                // Add to Javascript Array (for Flashcards)
                // 1. Add to Javascript Array (so Flashcards/Quiz still work!)
                vocabList.push({
                    spanish: spanishText,
                    english: englishText
                });

                // 2. Update HTML to be a link ONLY if the table doesn't say "no-links"
                if (!table.classList.contains('no-links')) {
                    spanTd.innerHTML = `<a href="https://www.spanishdict.com/translate/${encodeURIComponent(spanishText)}" class="verb-link" target="_blank">${spanishText}</a>`;
                }
            }
        });
    });
    
    // 2. Update the total count display
    fullCount = vocabList.length;
    // Note: We look for 'wordCount' now, so it works for Verbs, Animals, etc.
    const countDisplay = document.getElementById('wordCount'); 
    if(countDisplay) countDisplay.textContent = fullCount;
    
    // 3. Load Settings
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    const savedFont = localStorage.getItem('fontMode') || 'std';
    const fontBtn = document.getElementById('fontToggle');
    
    if (savedFont === 'cursive') {
        fontMode = 1;
        document.body.classList.add('cursive-font');
        if(fontBtn) fontBtn.textContent = "Font: Curs";
    } else if (savedFont === 'readable') {
        fontMode = 2;
        document.body.classList.add('readable-font');
        if(fontBtn) fontBtn.textContent = "Font: Read";
    } else {
        fontMode = 0;
        if(fontBtn) fontBtn.textContent = "Font: Std";
    }

    document.addEventListener('keydown', handleKeys);
});

// --- FUNCTIONS ---

function setTheme(mode) {
    document.body.className = mode === 'dark' ? 'dark-mode' : '';
    const lightBtn = document.getElementById('lightBtn');
    const darkBtn = document.getElementById('darkBtn');
    
    if(lightBtn) lightBtn.classList.toggle('active', mode === 'light');
    if(darkBtn) darkBtn.classList.toggle('active', mode === 'dark');
    
    localStorage.setItem('theme', mode);
    
    // Ensure font classes persist
    if (fontMode === 1) document.body.classList.add('cursive-font');
    if (fontMode === 2) document.body.classList.add('readable-font');
}

function handleKeys(e) {
    const practiceArea = document.getElementById('practiceArea');
    if (!practiceArea || practiceArea.style.display === 'none') return;
    
    if (currentMode === 0) {
        if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
            e.preventDefault();
            flipCard();
        }
        if (e.code === 'ArrowRight') {
            nextCard();
        }
    }
}

function toggleFont() {
    fontMode = (fontMode + 1) % 3;
    const btn = document.getElementById('fontToggle');
    document.body.classList.remove('readable-font', 'cursive-font');

    if (fontMode === 0) {
        btn.textContent = "Font: Std";
        localStorage.setItem('fontMode', 'std');
    } else if (fontMode === 1) {
        document.body.classList.add('cursive-font');
        btn.textContent = "Font: Curs";
        localStorage.setItem('fontMode', 'cursive');
    } else {
        document.body.classList.add('readable-font');
        btn.textContent = "Font: Read";
        localStorage.setItem('fontMode', 'readable');
    }
}

function toggleReverse() {
    const toggle = document.getElementById('reverseToggle');
    if(toggle) isReverse = toggle.checked;
    
    const practiceArea = document.getElementById('practiceArea');
    if (practiceArea && practiceArea.style.display !== 'none') {
        if (currentMode === 0) {
            isFlipped = false;
            updateCardDisplay();
        } else {
            nextQuiz();
        }
    }
}

function togglePractice(mode) {
    const area = document.getElementById('practiceArea');
    const flashcard = document.getElementById('flashcardMode');
    const quiz = document.getElementById('quizMode');
    
    if (area.style.display === 'block' && currentMode === mode) {
        area.style.display = 'none';
    } else {
        area.style.display = 'block';
        currentMode = mode;
        
        if (mode === 0) {
            flashcard.style.display = 'block';
            quiz.style.display = 'none';
            nextCard();
        } else {
            flashcard.style.display = 'none';
            quiz.style.display = 'block';
            nextQuiz();
        }
    }
}

// --- FLASHCARD LOGIC ---
function nextCard() {
    if (vocabList.length === 0) return;
    const randomIndex = Math.floor(Math.random() * vocabList.length);
    currentWord = vocabList[randomIndex];
    isFlipped = false;
    updateCardDisplay();
}

function flipCard() {
    isFlipped = !isFlipped;
    updateCardDisplay();
}

function updateCardDisplay() {
    if(!currentWord.spanish) return;

    const content = document.getElementById('cardContent');
    const hint = document.querySelector('#flashcardMode .card-hint');
    
    const front = isReverse ? currentWord.english : currentWord.spanish;
    const back = isReverse ? currentWord.spanish : currentWord.english;

    if (!isFlipped) {
        content.textContent = front;
        content.style.color = ""; 
        hint.textContent = "(Click or Space to flip)";
    } else {
        content.textContent = back;
        content.style.color = "#1a73e8"; 
        hint.textContent = "(Click or Space to flip back)";
    }
}

// --- QUIZ LOGIC ---
function getWrongAnswers(correctAnswer, count) {
    const wrongAnswers = [];
    if (vocabList.length < 4) return ["X", "Y", "Z"]; 
    let attempts = 0;
    while (wrongAnswers.length < count && attempts < 100) {
        attempts++;
        const randomObj = vocabList[Math.floor(Math.random() * vocabList.length)];
        const randomVal = isReverse ? randomObj.spanish : randomObj.english;
        if (randomVal !== correctAnswer && !wrongAnswers.includes(randomVal)) {
            wrongAnswers.push(randomVal);
        }
    }
    return wrongAnswers;
}

function nextQuiz() {
    const feedback = document.getElementById('quizFeedback');
    if(feedback) feedback.textContent = '';
    
    const buttons = document.querySelectorAll('.quiz-options button');
    buttons.forEach(btn => { btn.className = ''; btn.disabled = false; });

    const randomIndex = Math.floor(Math.random() * vocabList.length);
    currentWord = vocabList[randomIndex];
    
    const question = isReverse ? currentWord.english : currentWord.spanish;
    const correct = isReverse ? currentWord.spanish : currentWord.english;

    const quizWord = document.getElementById('quizWord');
    if(quizWord) quizWord.textContent = question;
    
    const wrongs = getWrongAnswers(correct, 3);
    const options = [...wrongs, correct];
    options.sort(() => Math.random() - 0.5);

    buttons.forEach((btn, index) => {
        btn.textContent = options[index];
        btn.dataset.answer = options[index];
    });
}

function checkAnswer(selectedButton) {
    const selectedAnswer = selectedButton.dataset.answer;
    const correct = isReverse ? currentWord.spanish : currentWord.english;
    const feedback = document.getElementById('quizFeedback');
    const buttons = document.querySelectorAll('.quiz-options button');
    
    buttons.forEach(btn => { btn.disabled = true; });

    if (selectedAnswer === correct) {
        selectedButton.classList.add('correct');
        if(feedback) {
            feedback.textContent = "✅ Correct!";
            feedback.style.color = "green";
        }
        setTimeout(nextQuiz, 1000);
    } else {
        selectedButton.classList.add('incorrect');
        if(feedback) {
            feedback.textContent = `❌ Incorrect. It was "${correct}"`;
            feedback.style.color = "#d32f2f";
        }
        buttons.forEach(btn => {
            if (btn.dataset.answer === correct) {
                btn.classList.add('correct');
            }
        });
        setTimeout(nextQuiz, 3000);
    }
}

// --- SEARCH LOGIC ---
function filterTable() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toLowerCase();
    
    const tables = document.querySelectorAll('.vocab-table');
    let visibleCount = 0;

    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        let hasVisibleRows = false;
        
        rows.forEach(row => {
            const cols = row.querySelectorAll('td');
            if(cols.length === 2) {
                const spanTd = cols[0];
                const engTd = cols[1];
                
                const spanishText = spanTd.textContent.toLowerCase();
                const englishText = engTd.textContent.toLowerCase();
                
                if (spanishText.includes(filter) || englishText.includes(filter)) {
                    row.style.display = "";
                    hasVisibleRows = true;
                    visibleCount++;
                } else {
                    row.style.display = "none";
                }
            }
        });
        
        if (filter !== "" && !hasVisibleRows) {
            table.parentElement.style.display = "none";
        } else {
            table.parentElement.style.display = "";
        }
    });
    
    const countSpan = document.getElementById('wordCount');
    if(countSpan) {
        if (filter === "") {
            countSpan.textContent = fullCount;
        } else {
            countSpan.textContent = `${visibleCount} / ${fullCount}`;
        }
    }
}