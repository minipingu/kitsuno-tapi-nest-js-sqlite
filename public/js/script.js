// Redirect li items to their respective anchor tag link
const navItems = document.querySelectorAll(".nav-links li");

navItems.forEach(item => {
    item.addEventListener("click", () => {
        const link = item.querySelector("a").getAttribute("href");
            window.location.href = link;
    });
});


// Adjust font size of the username displayed on the top navbar
function adjustFontSize() {
    const usernameDisplay = document.querySelector('.user-section h6');
    const fullText = usernameDisplay.textContent;
    const username = fullText.split(' ')[1];

    let fontSize = 24;

    if (username.length > 7 && username.length <= 10) {
        fontSize = 20;
    } else if (username.length > 10) {
        fontSize = 16;
    }

    usernameDisplay.style.fontSize = `${fontSize}px`;
}

window.addEventListener('DOMContentLoaded', adjustFontSize);


// Navbar user tab dropdown
document.addEventListener('DOMContentLoaded', function () {
    const userLink = document.querySelector('.user-link');
    const userDropdown = document.querySelector('.user-dropdown');

    userLink.addEventListener('click', function (event) {
        event.preventDefault();
        userLink.classList.toggle('toggle');
        userDropdown.style.display = userLink.classList.contains('toggle') ? 'block' : 'none';
    });

    // Close dropdown when clicking outside
    window.addEventListener('click', function(event) {
        if (!userLink.contains(event.target)) {
            userLink.classList.remove('toggle');
            userDropdown.style.display = 'none';
        }
    });
});


// Dynamically creates a modal window displaying detailed information about a kana character
let currentModal = null;

function showInfo(id) {
    if (!currentModal) {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal';

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);

        modalOverlay.style.display = 'flex';
        currentModal = modalOverlay;
    }

    const kanaData = getKanaDataById(id);

    const modalContent = currentModal.querySelector('.modal-content');
    modalContent.innerHTML = `
        <div class="modal-header">
            <button class="navigate-button" onclick="navigateKana(${id}, 'back')">←</button>
            <h2>${kanaData.character} (${kanaData.romaji})</h2>
            <button class="navigate-button" onclick="navigateKana(${id}, 'next')">→</button>
        </div>
        <button class="audio-button" data-audio="${kanaData.audio}" onclick="playAudio(this.dataset.audio)">🔊</button>
        <div class="flip-container">
            <div class="flipper">
                <div class="front">
                    <img src="${kanaData.mnemonic}" alt="Mnemonic for ${kanaData.character}">
                    <p class="mnemonic-text">${kanaData.story}</p>
                </div>
                <div class="back">
                    <img src="${kanaData.strokeOrder}" alt="Stroke Order for ${kanaData.character}">
                </div>
            </div>
        </div>


    `;

    requestAnimationFrame(() => {
        modalContent.style.transform = 'scale(1)';
    });

    currentModal.addEventListener('click', function (e) {
        if (e.target === currentModal) {
            modalContent.style.transform = 'scale(0)';
            setTimeout(() => {
                document.body.removeChild(currentModal);
                currentModal = null;
            }, 300);
        }
    });
}

function getKanaDataById(id) {
    return kanaList.find(kana => kana.id === id);
}

function navigateKana(currentId, direction) {
    const currentIndex = kanaList.findIndex(kana => kana.id === currentId);
    let newIndex = currentIndex;

    if (direction === 'next') {
        do {
            newIndex = (newIndex + 1) % kanaList.length;
        } while (kanaList[newIndex] === null || kanaList[newIndex].romaji === null);
    } else if (direction === 'back') {
        do {
            newIndex = (newIndex - 1 + kanaList.length) % kanaList.length;
        } while (kanaList[newIndex] === null || kanaList[newIndex].romaji === null);
    }

    showInfo(kanaList[newIndex].id);
}


// Play audio in kana pages
function playAudio(audioSource) {
    const audio = new Audio(audioSource);
    audio.play();
}


// Show/hide flashcard form
function showFlashcardForm() {
    document.getElementById("flashcard-form").classList.remove("hidden");
    document.querySelector(".flashcard-button-form").style.display = "none";
}

function hideFlashcardForm() {
    document.getElementById("flashcard-form").classList.add("hidden");
    document.querySelector(".flashcard-button-form").style.display = "block";
}

function flashcardError() {
    document.getElementById("flashcard-error").classList.remove("hidden");
}


// Convert romaji to hiragana while typing in vocabulary word inputs
document.addEventListener('DOMContentLoaded', function () {
    if (typeof wanakana === 'undefined') return;

    document.querySelectorAll('.hiragana-input').forEach(input => {
        wanakana.bind(input, { IMEMode: 'toHiragana' });
    });
});


// Highlights text in red when flashcard inputs character count exceeds the specified limit.
document.addEventListener("DOMContentLoaded", function () {
    const limitElements = document.querySelectorAll(".character-limit");

    limitElements.forEach(element => {
        const limit = parseInt(element.getAttribute("data-limit"));

        element.addEventListener("input", function () {
            if (element.value.length > limit) {
                element.style.color = "red";
            } else {
                element.style.color = "black";
            }
        });
    });
});


// Toggle down resources
function toggleDropdown(id) {
    const content = document.getElementById(id);
    const header = content.previousElementSibling;

    if (content.style.maxHeight) {
        content.style.maxHeight = null;
        header.classList.remove("active-rss");
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
        header.classList.add("active-rss");
    }
}

const dropdowns = document.querySelectorAll('.dropdown-content ul li a');
dropdowns.forEach(link => {
    link.addEventListener('click', (event) => {
        event.stopPropagation();
    });
});


// Go back to the last page
function goBack() {
    if (document.referrer && document.referrer.includes("/vocabulary")) {
        window.location.href = "/vocabulary";
    } else if (window.history.length > 1 && document.referrer !== window.location.href) {
        window.history.back();
    } else {
        window.location.href = "/vocabulary";
    }
}


// Disables export buttons and shows a message during flashcard export
document.querySelectorAll('.export-form').forEach(form => {
    form.addEventListener('submit', function(event) {
        const buttons = document.querySelectorAll('.export-button');
        const loadingMessage = document.getElementById('loadingMessage');

        loadingMessage.style.display = 'block';

        buttons.forEach(button => {
            button.disabled = true;
            button.classList.add('inactive');
        });

        setTimeout(() => {
            loadingMessage.style.display = 'none';

            buttons.forEach(button => {
                button.disabled = false;
                button.classList.remove('inactive');
            });
        }, 8000);
    });
});


// Flashcards Modal, Search Bar, Export Loading
document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.fc-card');
    const searchInput = document.getElementById('fcSearchInput');
    const modalOverlay = document.getElementById('fcSingleModal');

    if (cards.length > 0 && modalOverlay) {
        const modalKanji = document.getElementById('modalKanji');
        const modalMeaning = document.getElementById('modalMeaning');
        const modalGrade = document.getElementById('modalGrade');
        const modalKunyomi = document.getElementById('modalKunyomi');
        const modalOnyomi = document.getElementById('modalOnyomi');
        const modalVocabSection = document.getElementById('modalVocabSection');
        const modalVocabList = document.getElementById('modalVocabList');
        const modalNotesSection = document.getElementById('modalNotesSection');
        const modalNotes = document.getElementById('modalNotes');

        function openModal(card) {
            modalKanji.textContent = card.dataset.kanji || '';
            modalMeaning.textContent = card.dataset.meaning || '';
            modalGrade.textContent = 'Grade ' + (card.dataset.grade || '');
            modalKunyomi.textContent = card.dataset.kunyomi || '-';
            modalOnyomi.textContent = card.dataset.onyomi || '-';

            // Populate Vocabulary safely from dataset
            const rawVocab = card.dataset.vocab || '';
            modalVocabList.innerHTML = '';
            if (rawVocab.trim() !== '') {
                if (modalVocabSection) modalVocabSection.style.display = '';
                const vocabItems = rawVocab.split('|||');
                vocabItems.forEach(vocab => {
                    const split = vocab.indexOf(' ');
                    const jp = split > 0 ? vocab.substring(0, split) : vocab;
                    const en = split > 0 ? vocab.substring(split + 1) : '';

                    const li = document.createElement('li');
                    li.innerHTML = `<div class="fc-vocab-jp">${jp}</div>` + (en ? `<div class="fc-vocab-en">${en}</div>` : '');
                    modalVocabList.appendChild(li);
                });
            } else {
                if (modalVocabSection) modalVocabSection.style.display = 'none';
            }

            // Populate Notes
            const notes = card.dataset.notes || '';
            if (notes.trim() !== '' && notes !== 'null' && notes !== '-') {
                if (modalNotesSection) modalNotesSection.style.display = '';
                if (modalNotes) modalNotes.textContent = notes;
            } else {
                if (modalNotesSection) modalNotesSection.style.display = 'none';
            }

            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        cards.forEach(card => {
            card.addEventListener('click', e => {
                if (e.target.closest('.fc-actions')) return;
                openModal(card);
            });

            card.addEventListener('keydown', e => {
                if ((e.key === 'Enter' || e.key === ' ') && e.target === card) {
                    e.preventDefault();
                    openModal(card);
                }
            });
        });

        modalOverlay.addEventListener('click', e => {
            if (e.target === modalOverlay || e.target.closest('.fc-close')) closeModal();
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeModal();
        });
    }

    // Search Filter
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            const term = e.target.value.toLowerCase().trim();
            const gridCards = document.querySelectorAll('.fc-card');

            gridCards.forEach(card => {
                const kanji = (card.dataset.kanji || '').toLowerCase();
                const meaning = (card.dataset.meaning || '').toLowerCase();

                if (kanji.includes(term) || meaning.includes(term)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Export Loading
    const exportContainer = document.querySelector('.fc-top-exports');
    const exportForms = document.querySelectorAll('.fc-top-exports form');
    if (exportContainer && exportForms.length > 0) {
        exportForms.forEach(form => {
            form.addEventListener('submit', function () {
                const actionUrl = form.getAttribute('action') || '';
                const timeoutDuration = actionUrl.includes('anki') ? 6000 : 2000;

                exportContainer.classList.add('is-exporting');

                setTimeout(() => {
                    exportContainer.classList.remove('is-exporting');
                }, timeoutDuration);
            });
        });
    }
});


// Reveal Api Key
const apiKeyElement = document.getElementById('apiKey');
if (apiKeyElement) {
    apiKeyElement.addEventListener('click', function () {
        apiKeyElement.classList.toggle('revealed');
    });
}


// Kanji stroke order svg
function colorStrokes(box) {
    const paths = box.querySelectorAll('svg path');

    paths.forEach((p, i) => {
        const hue = (i * 137.5) % 360;
        p.style.stroke = `hsl(${hue}, 85%, 45%)`;
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const box = document.getElementById('stroke-order');
    if (!box || !box.dataset.src) return;

    fetch(box.dataset.src)
        .then(r => r.text())
        .then(text => {
            const start = text.indexOf('<svg');
            const end = text.lastIndexOf('</svg>') + '</svg>'.length;
            box.innerHTML = text.slice(start, end);
            colorStrokes(box);
        })
        .catch(err => console.error('Could not load stroke order SVG', err));

    box.addEventListener('click', () => {
        const paths = box.querySelectorAll('svg path');
        let delay = 0;

        paths.forEach(p => {
            const len = p.getTotalLength();

            p.style.transition = 'none';
            p.style.strokeDasharray = len;
            p.style.strokeDashoffset = len;
            p.getBoundingClientRect();

            const duration = Math.max(0.4, len / 150);
            p.style.transition = `stroke-dashoffset ${duration}s ease-in-out ${delay}s`;
            p.style.strokeDashoffset = 0;

            delay += duration + 0.1;
        });
    });
});
