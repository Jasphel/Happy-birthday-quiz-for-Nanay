// BDAY.js — cleaned & fixed version
// Quiz data
const quizData = [
    {
        question: "I prayed bitterly for a son and promised to dedicate him to the Lord’s service. God answered my prayer, and I became the mother of a great prophet.",
        options: ["Sarah", "Jochebed", "Hannah", "Hagar"],
        correct: 2
    },
    {
        question: "I was very old when I gave birth to my son, just as God had promised to my husband. My laughter turned into joy when he was born.",
        options: ["Sarah", "Jochebed", "Hannah", "Hagar"],
        correct: 0
    },
    {
        question: "I placed my baby in a basket and set him among the reeds by the river Nile to save him from death.",
        options: ["Sarah", "Jochebed", "Hannah", "Hagar"],
        correct: 1
    },
    {
        question: "I was the first woman and the first mother on earth. One of my sons killed the other.",
        options: ["Esther", "Ruth", "Rebekah", "Eve"],
        correct: 3
    },
    {
        question: "I was a queen who risked my life to save my people. Though not a mother in the traditional sense, I am honored as a “mother” to my nation.",
        options: ["Esther", "Ruth", "Rebekah", "Eve"],
        correct: 0
    },
    {
        question: "I helped my son Jacob deceive his father to get the blessing meant for his brother. Later, I sent Jacob away to protect him from Esau’s anger.",
        options: ["Esther", "Ruth", "Rebekah", "Eve"],
        correct: 2
    },
    {
        question: "I was a Moabite woman who left my homeland to stay with my mother-in-law, Naomi. I became the great-grandmother of King David.",
        options: ["Esther", "Ruth", "Rebekah", "Eve"],
        correct: 1
    },
    {
        question: "A person who you have raised since you were 33?",
        options: ["Abigail", "Xybel", "Britney", "Claire"],
        correct: 3
    },
    {
        question: "Do you know that I love you?",
        options: ["Yes", "No", "Maybe (absolutely not an option)"],
        correct: 0
    }
];

// BONUS question (separate - not part of main quiz)
const bonusQuestion = {
    question: "What do you want to hear?",
    options: ["Greetings", "A random christian song", "An old christian song", "Carry me home"]
};

// state
let currentQuestion = 0;
let score = 0;
const totalQuestions = quizData.length;
let selectedAnswer = -1;
let timerInterval = null;
let timeLeft = 30;
let highScore = parseInt(localStorage.getItem('jsQuizHighScore') || '0', 10);

// ---------- audio ----------
const correctans = new Audio('sound/fanaf_score.mp3');
const wrongans = new Audio('sound/fnanf_error.mp3');
// optional finish sounds - only use if files exist
let donequiz, donequiz2;
try { donequiz = new Audio('sound/fnaf_shiftcomplete.mp3'); donequiz2 = new Audio('sound/fnanf_yey.mp3'); } catch(e) {}
const hbd = new Audio('sound/happybday.aac');
const great = new Audio('sound/howgreatyouare.aac');
const vessel = new Audio('sound/vessel.aac');
const carry = new Audio('sound/carrymehome.aac');

correctans.volume = 0.2;
wrongans.volume = 0.9;
// ---------- end audio ----------

// Helpers
function $(id) { return document.getElementById(id); }

// Update progress bar
function updateProgress() {
    const progress = ((currentQuestion + 1) / totalQuestions) * 100;
    if ($('progress-fill')) $('progress-fill').style.width = progress + '%';
    if ($('current-q')) $('current-q').textContent = currentQuestion + 1;
    if ($('total-q')) $('total-q').textContent = totalQuestions;
}

// Timer
function startTimer() {
    timeLeft = 30;
    if ($('timer-container')) $('timer-container').style.display = 'block';
    if ($('timer-text')) $('timer-text').textContent = timeLeft;
    if ($('timer-fill')) $('timer-fill').style.width = '100%';

    clearTimer();
    timerInterval = setInterval(() => {
        timeLeft--;
        if ($('timer-text')) $('timer-text').textContent = timeLeft;
        if ($('timer-fill')) $('timer-fill').style.width = (timeLeft / 30 * 100) + '%';

        if (timeLeft <= 0) {
            clearTimer();
            nextQuestion();
        }
    }, 1000);
}

function clearTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    if ($('timer-container')) $('timer-container').style.display = 'none';
}

// Load current question
function loadQuestion() {
    const q = quizData[currentQuestion];
    if (!q) {
        // nothing to load
        console.warn('No question to load (index out of range).');
        return;
    }

    if ($('question')) $('question').textContent = q.question;
    const optionsDiv = $('options');
    if (!optionsDiv) return;

    optionsDiv.innerHTML = '';
    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.className = 'option';
        btn.onclick = () => selectOption(index);
        optionsDiv.appendChild(btn);
    });

    if ($('next-btn')) $('next-btn').style.display = 'none';
    updateProgress();
    startTimer();
}

// Handle selection
function selectOption(index) {
    if (selectedAnswer !== -1) return; // already chosen
    selectedAnswer = index;
    clearTimer();

    const options = document.querySelectorAll('#options .option');
    options.forEach((opt, i) => {
        opt.disabled = true;
        if (i === quizData[currentQuestion].correct) opt.classList.add('correct');
        else if (i === index) opt.classList.add('incorrect');
    });

    if (index === quizData[currentQuestion].correct) {
        try { correctans.currentTime = 0; correctans.play(); } catch (e) {}
    } else {
        try { wrongans.currentTime = 0; wrongans.play(); } catch (e) {}
    }

    if ($('next-btn')) $('next-btn').style.display = 'block';
}

// Move to next
function nextQuestion() {
    // score counting
    if (selectedAnswer === quizData[currentQuestion].correct) {
        score++;
    }

    currentQuestion++;
    selectedAnswer = -1;

    if (currentQuestion < totalQuestions) {
        loadQuestion();
    } else {
        showScore();
    }
}

// Show score
function showScore() {
    clearTimer();
    if ($('question-container')) $('question-container').style.display = 'none';
    if ($('score-container')) $('score-container').style.display = 'block';

    if ($('score-circle-text')) $('score-circle-text').textContent = score;
    if ($('total-score')) $('total-score').textContent = totalQuestions;

    const percentage = Math.round((score / totalQuestions) * 100);
    let feedback = '';
    if (percentage >= 80) feedback = "Outstanding! You're amazing! 🌟";
    else if (percentage >= 60) feedback = "Well done! More reading and devotions! 🙏";
    else if (percentage === 50) feedback = "Soooo close! But ALMOST is never enough. (ariana reference)";
    else if (percentage === 0) feedback = "It's fine to fail. Don't be like me, a failure. ☹";
    else feedback = "Read your bible and pray everyday. 📖";

    if ($('feedback')) $('feedback').textContent = feedback;

    // High score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('jsQuizHighScore', String(highScore));
    }
    if ($('high-score')) $('high-score').style.display = 'block';
    if ($('high-score-val')) $('high-score-val').textContent = highScore;

    // play finish sounds if available (guarded)
    try {
        if (typeof donequiz !== 'undefined') { donequiz.currentTime = 0; donequiz.play(); }
        if (typeof donequiz2 !== 'undefined') { donequiz2.currentTime = 0; donequiz2.play(); }
    } catch (e) {
        console.warn('Finish audio not available', e);
    }
    starConfetti();

    // create gift button under Play Again (only once)
    const existingGiftBtn = document.querySelector('.gift-btn');
    if (!existingGiftBtn) {
        const giftBtn = document.createElement('button');
        giftBtn.textContent = '🎁 Open Gift?';
        giftBtn.className = 'gift-btn';
        giftBtn.onclick = openBonusQuestion;

        const playAgainBtn = $('play-again-btn');
        if (playAgainBtn && playAgainBtn.parentNode) {
            playAgainBtn.insertAdjacentElement('afterend', giftBtn);
        } else {
            const scoreContainer = $('score-container');
            if (scoreContainer) scoreContainer.appendChild(giftBtn);
        }
    }
}

// Restart
function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedAnswer = -1;
    if ($('score-container')) $('score-container').style.display = 'none';
    if ($('bonus-container')) $('bonus-container').style.display = 'none';
    if ($('question-container')) $('question-container').style.display = 'block';
    loadQuestion();
}

// Bonus question flow
function openBonusQuestion() {
    // hide main screens
    if ($('score-container')) $('score-container').style.display = 'none';
    if ($('question-container')) $('question-container').style.display = 'none';

    const bonusContainer = $('bonus-container');
    if (!bonusContainer) {
        console.error('Missing #bonus-container in HTML');
        return;
    }
    bonusContainer.style.display = 'block';

    // set question & populate
    if ($('bonus-question')) $('bonus-question').textContent = bonusQuestion.question;
    const bonusOptions = $('bonus-options');
    if (!bonusOptions) return;
    bonusOptions.innerHTML = '';

    bonusQuestion.options.forEach((optText, idx) => {
        const btn = document.createElement('button');
        btn.textContent = optText;
        btn.className = 'option';
        btn.onclick = () => {
            // stop others
            try { hbd.pause(); hbd.currentTime = 0; } catch (e) {}
            try { great.pause(); great.currentTime = 0; } catch (e) {}
            try { vessel.pause(); vessel.currentTime = 0; } catch (e) {}
            try { carry.pause(); carry.currentTime = 0; } catch (e) {}

            // play selected
            try {
                if (idx === 0) hbd.play();
                else if (idx === 1) great.play();
                else if (idx === 2) vessel.play();
                else if (idx === 3) carry.play();
            } catch (e) { console.warn('Audio play failed', e); }

            // disable all bonus choices
            document.querySelectorAll('#bonus-options .option').forEach(o => o.disabled = true);
            btn.classList.add('correct');
        };
        bonusOptions.appendChild(btn);
    });

    // show or create back button
    const backBtn = $('back-btn');
    if (backBtn) {
        backBtn.style.display = 'inline-block';
        backBtn.onclick = () => {
            // stop audio
            try { hbd.pause(); hbd.currentTime = 0; } catch(e){}
            try { great.pause(); great.currentTime = 0; } catch(e){}
            try { vessel.pause(); vessel.currentTime = 0; } catch(e){}
            try { carry.pause(); carry.currentTime = 0; } catch(e){}

            bonusContainer.style.display = 'none';
            if ($('score-container')) $('score-container').style.display = 'block';
        };
    } else {
        const createdBack = document.createElement('button');
        createdBack.textContent = '⬅️ Go Back to Results';
        createdBack.className = 'back-btn';
        createdBack.onclick = () => {
            try { hbd.pause(); hbd.currentTime = 0; } catch(e){}
            try { great.pause(); great.currentTime = 0; } catch(e){}
            try { vessel.pause(); vessel.currentTime = 0; } catch(e){}
            try { carry.pause(); carry.currentTime = 0; } catch(e){}

            bonusContainer.style.display = 'none';
            if ($('score-container')) $('score-container').style.display = 'block';
        };
        bonusOptions.appendChild(createdBack);
    }

    // hide timer/next
    if ($('next-btn')) $('next-btn').style.display = 'none';
    clearTimer();
}

// confetti
function starConfetti() {
  for (let i = 0; i < 25; i++) {
    const star = document.createElement('div');
    star.textContent = '⭐';
    star.style.position = 'fixed';
    star.style.left = Math.random() * 100 + 'vw';
    star.style.top = '-10px';
    star.style.fontSize = 20 + Math.random() * 20 + 'px';
    star.style.opacity = 0.8;
    star.style.zIndex = 9999;
    star.style.userSelect = 'none';
    star.style.pointerEvents = 'none';
    star.style.animation = `starFall ${2 + Math.random() * 2}s linear`;
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 4000);
  }
}

// add starFall keyframes once
const style = document.createElement('style');
style.textContent = `
@keyframes starFall {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}`;
document.head.appendChild(style);

// initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        // set total-q in header if exists
        if ($('total-q')) $('total-q').textContent = totalQuestions;
        loadQuestion();
    } catch (e) {
        console.error('Initialization error:', e);
    }
});
