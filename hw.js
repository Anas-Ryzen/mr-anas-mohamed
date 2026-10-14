function displaySuccessPopup(textinp) {
    const popup = document.getElementById("loginPopup");
    popup.style.display = "block";
    popup.innerHTML = textinp;

    setTimeout(function () {
        popup.style.display = "none";
    }, 3500);
}

function loading(time){
    const loaderOverlay = document.getElementById('loader-overlay');
    loaderOverlay.style.display = 'flex'; // إخفاء الـ overlay والدائرة
    
    // يتم إخفاء الـ overlay بعد 1.5 ثانية
    setTimeout(function() {
      loaderOverlay.style.display = 'none'; // إخفاء الـ overlay والدائرة
    }, time);
}

let simpleModal = document.getElementById("simpleModal")
let message = document.getElementById("message")
let yesBtn = document.getElementById("yesBtn")
let noBtn = document.getElementById("noBtn")
yesBtn.onclick = function(){
    submitExam()
    loading(2000)
    currentQuestionIndex = 0
    loadQuestion();
    simpleModal.style.display = "none"
}
noBtn.onclick = function(){
    simpleModal.style.display = "none"
}
function openmodal(){
    simpleModal.style.display = "flex"
    message.innerHTML = "هل انت متاكد من تسليم الواجب ؟"
}
if(!localStorage.token){
    localStorage.joinagain = 'yes'
    location.href = "courses.html"
}
let progressDisplay = document.getElementById("questionProgress")
let currentQuestionIndex = 0;
let answers = 0;
let userAnswers = {}; 
let result = document.getElementById("result");
let title = document.getElementById("course-title");
let des = document.getElementById("course-description");

let namee = localStorage.name;
title.innerHTML = namee;
let description = localStorage.description;
des.innerHTML = description;
localStorage.removeItem("name");
localStorage.removeItem("description");
window.onbeforeunload = function() {
    localStorage.name = namee
    localStorage.description = description
    localStorage.number = selectedClassNumber
};



const sheetId = "10lifxmFuDr_qmaYiWVpLxzgbknoiTqJ6pNkLEIb_Hfc"; 
const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

let questions = [];
const selectedClassNumber = +localStorage.number;
localStorage.removeItem("number");

function loadQuestions() {
    fetch(csvUrl)
        .then((response) => response.text())
        .then((data) => {
            let rows = data.split("\n").map((row) => row.split(","));

            if (rows.length < selectedClassNumber + 1) {
                console.error("رقم الحصة غير موجود في الجدول.");
                return;
            }

            let classRow = rows[selectedClassNumber];
            questions = extractQuestions(classRow);

            if (questions.length === 0) {
                console.error("لا توجد أسئلة لهذه الحصة.");
                localStorage.nohwyet = "yes";
                localStorage.number = selectedClassNumber;
                location.href = "lesson.html";
                return;
            }

            loadQuestion();
            const loaderOverlay = document.getElementById('loader-overlay');
            loaderOverlay.style.display = 'none';
        })
        .catch((error) => {
            location.href = 'index.html';
            console.error("Error fetching questions:", error);
            
        });
}

function extractQuestions(row) {
    let extractedQuestions = [];
    for (let i = 8; i < row.length; i += 6) {
        if (!row[i] || row[i].trim() === "") break;

        extractedQuestions.push([
            row[i],    
            row[i + 1], 
            row[i + 2], 
            row[i + 3], 
            row[i + 4], 
            row[i + 5]  
        ]);
    }
    return extractedQuestions;
}

function loadQuestion() {
    if (currentQuestionIndex < 0) {
        currentQuestionIndex = 0;
    }

    if (currentQuestionIndex >= questions.length) {
        currentQuestionIndex = questions.length - 1;
        return;
    }

    let question = document.getElementById("question");
    const optionButtons = document.querySelectorAll(".option");

    question.innerHTML = questions[currentQuestionIndex][0];

    // تحديث التقدم
    progressDisplay.innerHTML = `${currentQuestionIndex + 1} / ${questions.length}`;

    for (let i = 0; i < optionButtons.length; i++) {
        if (questions[currentQuestionIndex][i + 2]) {
            optionButtons[i].textContent = questions[currentQuestionIndex][i + 2];
            optionButtons[i].style.display = "block";
            optionButtons[i].onclick = function () {
                selectAnswer(i + 2, optionButtons[i].textContent);
            };

            // إعادة تعيين الألوان والحدود إلى حالتها الأصلية
            optionButtons[i].classList.remove("selected");
            optionButtons[i].style.backgroundColor = '';  // إزالة التلوين
            optionButtons[i].style.color = '';  // إعادة اللون الأصلي
            optionButtons[i].style.border = '';  // إعادة لون الحدود الأصلي
        } else {
            optionButtons[i].style.display = "none";
        }
    }

    // تلوين الإجابات بعد التصحيح
    if (answerStatus[currentQuestionIndex]) {
        const correctAnswer = questions[currentQuestionIndex][1];
        const selectedAnswer = userAnswers[currentQuestionIndex];

        optionButtons.forEach((btn) => {
            if (btn.textContent === correctAnswer) {
                if (selectedAnswer === correctAnswer) {
                    btn.style.backgroundColor = 'green'; // الإجابة الصحيحة المختارة
                    btn.style.border = '2px solid green'; // تغيير لون الحدود إلى الأخضر
                } else if (!selectedAnswer) {
                    btn.style.backgroundColor = 'gray'; // الإجابة الصحيحة غير المختارة
                    btn.style.border = '2px solid gray'; // تغيير لون الحدود إلى الرمادي
                } else {
                    btn.style.backgroundColor = 'green'; // الإجابة الصحيحة (غير مختارة ولكن يجب إظهارها)
                    btn.style.border = '2px solid green'; // تغيير لون الحدود إلى الأخضر
                }
                btn.style.color = 'white';
            } else if (btn.textContent === selectedAnswer && selectedAnswer !== correctAnswer) {
                btn.style.backgroundColor = 'red'; // الإجابة الخاطئة المختارة
                btn.style.border = '2px solid red'; // تغيير لون الحدود إلى الأحمر
                btn.style.color = 'white';
            }
        });
    }
}

function selectAnswer(index, selectedText) {
    userAnswers[currentQuestionIndex] = selectedText;
    document.querySelectorAll(".option").forEach((btn) => btn.classList.remove("selected"));
    event.target.classList.add("selected");
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        displaySuccessPopup("لقد وصلت إلى نهاية الأسئلة");
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
}

let answerStatus = [];  // مصفوفة لحفظ حالة الإجابة لكل سؤال (صحيحة أم خاطئة)

function submitExam() {
    let back = document.getElementById("back");
    back.disabled = true;
    back.style.cursor = "not-allowed";
    document.querySelectorAll(".option").forEach(button => {
        button.disabled = true;
        button.style.cursor = "not-allowed";
    });

    let submitExam = document.getElementById("submitExam");
    submitExam.disabled = true;
    submitExam.style.opacity = "0.5";
    submitExam.style.cursor = "not-allowed";

    // تعطيل تأثير الـ hover
    submitExam.style.backgroundColor = "#d9534f";  // إزالة تأثير الخلفية
    submitExam.style.color = "white";  // إزالة تأثير اللون

    let correctAnswers = 0;
    questions.forEach((q, index) => {
        if (userAnswers[index] === q[1]) {
            correctAnswers++;
            answerStatus[index] = 'correct';  // الإجابة صحيحة
        } else {
            answerStatus[index] = 'incorrect';  // الإجابة خاطئة
        }
    });

    let percent = Math.ceil((correctAnswers / questions.length) * 100);
    result.style.display = "block";
    result.innerHTML = percent + '%';

    addStudentResult(localStorage.token, selectedClassNumber, percent);
    displaySuccessPopup("تم تسليم الواجب بنجاح");

    // تعديل تلوين الإجابات
    const optionButtons = document.querySelectorAll(".option");
    questions.forEach((q, index) => {
        const correctAnswer = q[1];
        const selectedAnswer = userAnswers[index];

        optionButtons.forEach((btn) => {
            if (btn.textContent === correctAnswer) {
                if (selectedAnswer === correctAnswer) {
                    btn.style.backgroundColor = 'green'; // الإجابة الصحيحة المختارة
                } else if (!selectedAnswer) {
                    btn.style.backgroundColor = 'gray'; // الإجابة الصحيحة غير المختارة
                } else {
                    btn.style.backgroundColor = 'green'; // الإجابة الصحيحة (غير مختارة ولكن يجب إظهارها)
                }
                btn.style.color = 'white';
            } else if (btn.textContent === selectedAnswer && selectedAnswer !== correctAnswer) {
                btn.style.backgroundColor = 'red'; // الإجابة الخاطئة المختارة
                btn.style.color = 'white';
            } else {
                btn.style.backgroundColor = ''; // إعادة اللون الأصلي
                btn.style.color = '';
            }
        });
    });

    setTimeout(function() {
        back.disabled = false;
        back.style.opacity = "1";
        back.style.cursor = "pointer";
    }, 2000);
}


window.onload = loadQuestions;

let back = document.getElementById("back");
back.onclick = function () {
    localStorage.number = selectedClassNumber;
    location.href = "lesson.html";
};

function addStudentResult(token, label1, result) {
    const scriptURL = `https://script.google.com/macros/s/AKfycbyu2FFOgEEVAOza6fbuqONVXQtJI_dz3-O5fPIv17OiYvGwIimAPMs_W7ukfW3sGKmL/exec`;

    fetch(`${scriptURL}?token=${encodeURIComponent(token)}&label1=${encodeURIComponent(label1)}&result=${encodeURIComponent(result)}`)
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));
}

document.getElementById("nextQuestion").addEventListener("click", nextQuestion);
document.getElementById("prevQuestion").addEventListener("click", prevQuestion);
document.getElementById("submitExam").addEventListener("click", openmodal);