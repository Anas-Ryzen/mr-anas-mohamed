if(!localStorage.isLoggedIn){
    setTimeout(function(){
        location.href = 'login.html'
    },300)
}
if(!localStorage.token){
    setTimeout(function(){
        location.href = 'login.html'
    },300)
}
if(localStorage.boughtsuccesfully == 'yes'){
    setTimeout(function(){
        displaySuccessPopup('تم الإشتراك في الكورس')
        localStorage.removeItem('boughtsuccesfully')
    },200)
}
if(localStorage.joinagain == 'yes'){
    setTimeout(function(){
        displaySuccessPopup('قم بالدخول الي الكورس مجددا')
        localStorage.removeItem('joinagain')
    },200)
}
setInterval(function(){
    sessionStorage.clear()
},1000)

// استدعاء Google Apps Script لتعديل خلية معينة
function updateCell(row, column, newValue) {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbzNNavRmDNDdRUwCab4CvsMJHCCdDoIw17PsdesnUywS1UGgSpOo7qZsbFLtEo2K6Fr/exec'; 
    const params = new URLSearchParams({
        row: row,
        column: column,
        value: newValue
    });

    fetch(`${scriptUrl}?${params}`, { method: 'POST' })
        .then(response => response.text())
        .then(result => {})
        .catch(error => console.error('Error:', error));
}

function updateCell2(row, column, newValue) {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxK_Z0m66sgZZhYfGb2xNRFod9S0mBwWLwoPxLuxTqagm2a5ZGaOPu0kk_Fo2GG1jwgFw/exec'; 
    const params = new URLSearchParams({
        row: row,
        column: column,
        value: newValue
    });

    fetch(`${scriptUrl}?${params}`, { method: 'POST' })
        .then(response => response.text())
        .then(result => {})
        .catch(error => console.error('Error:', error));
}

function displaySuccessPopup(textinp) {
    const popup = document.getElementById("loginPopup");
    popup.style.display = "block";
    popup.innerHTML = textinp;

    setTimeout(function() {
        popup.style.display = "none";
    }, 3500);
}

const sheetId = '10lifxmFuDr_qmaYiWVpLxzgbknoiTqJ6pNkLEIb_Hfc'; // ID الخاص بشيت الحصص
const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

fetch(csvUrl)
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n'); // تقسيم البيانات إلى صفوف
        const courseData = rows.map(row => row.split(',')); // تقسيم الصفوف إلى خلايا
        displayCourses(courseData); // عرض الحصص
    })
    .catch(error => {
        console.error('Error fetching CSV:', error);
    });

function displayCourses(courseData) {
    const coursesContainer = document.getElementById('coursesContainer');
    courseData.forEach((course, index) => {
        const courseName = course[0]; // اسم الحصة
        const enrolledTokens = course[5]; // التوكنات المشتركه
        const coursePrice = course[2]; // سعر الحصة
        const courseGrade = course[3]; // الصف الدراسي
        const number = index; // استخدام رقم الصف الفعلي (ID) كمعرف فريد وآمن

        if(courseName == 'اسم الحصه'){
            // تجاهل صف العناوين
        }
        else if(coursePrice == 0 && courseGrade == localStorage.grade){
            const description = course[1];
            const courseGrade = course[3];
            const courseElement = document.createElement('div');
            courseElement.classList.add('course');

            // **التعديل الهام:** نمرر فقط الـ `number` (رقم الصف/المعرف) ولا نمرر أي بيانات حساسة أخرى في الزر
            courseElement.innerHTML = `
                <h3>${courseName}</h3>
                <h3>${description}</h3>
                <p>السعر: مجانا</p>
                <p>الصف الدراسي: ${courseGrade}</p>
                <button onclick="checkAndBuyCourse('${number}')">الدخول للكورس</button>
            `;
            coursesContainer.appendChild(courseElement);
        }
        else if(enrolledTokens && enrolledTokens.includes(localStorage.token) && courseGrade == localStorage.grade){
            const description = course[1];
            const coursePrice = course[2]; 
            const courseGrade = course[3]; 
            const courseElement = document.createElement('div');
            courseElement.classList.add('course');

            courseElement.innerHTML = `
                <h3>${courseName}</h3>
                <h3>${description}</h3>
                <p>السعر: ${coursePrice} جنيه</p>
                <p>الصف الدراسي: ${courseGrade}</p>
                <button onclick="checkAndBuyCourse('${number}')" id="bought">الدخول للكورس</button>
            `;
            coursesContainer.appendChild(courseElement);
        }
        else if(courseGrade == localStorage.grade){
            const description = course[1];
            const coursePrice = course[2]; 
            const courseGrade = course[3]; 
            const courseElement = document.createElement('div');
            courseElement.classList.add('course');

            courseElement.innerHTML = `
                <h3>${courseName}</h3>
                <h3>${description}</h3>
                <p>السعر: ${coursePrice} جنيه</p>
                <p>الصف الدراسي: ${courseGrade}</p>
                <button onclick="checkAndBuyCourse('${number}')">شراء الكورس</button>
            `;
            coursesContainer.appendChild(courseElement);
        }
        
        const loaderOverlay = document.getElementById('loader-overlay');
        loaderOverlay.style.display = 'none';
    });
}

// **الدالة الآمنة الجديدة:** تستقبل فقط الـ ID (رقم الصف) وتجلب البيانات الحقيقية من الشيت مباشرة
function checkAndBuyCourse(num){
    document.getElementById("overlay").style.display = 'block';
    const sheetId = '10lifxmFuDr_qmaYiWVpLxzgbknoiTqJ6pNkLEIb_Hfc'; 
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

    fetch(csvUrl)
        .then(response => response.text())
        .then(data => {
            let usermoney = '';
            const rows = data.split('\n');
            
            // استخراج بيانات الكورس المطلوبة مباشرة من الشيت الأساسي باستخدام الـ num بأمان تام
            const targetCourseRow = rows[num].split(',');
            const courseName = targetCourseRow[0];
            const description = targetCourseRow[1];
            const price = Number(targetCourseRow[2]);
            const link = targetCourseRow[4];
            const enrolledTokens = targetCourseRow[5];

            const walletSheetId = '1ou-3Gr1pOsRVlSoN4Ou0go51qS6OKxYL_RbfcBnPmwE'; 
            const walletCsvUrl = `https://docs.google.com/spreadsheets/d/${walletSheetId}/export?format=csv`;
            
            fetch(walletCsvUrl)
                .then(response => response.text())
                .then(walletData => {
                    let wallet = document.getElementById("wallet");
                    const rows2 = walletData.split('\n');
                    let userRowIndex = -1;

                    for(let i = 0; i < rows2.length; i++){
                        if(rows2[i].split(',')[8] == localStorage.token){
                            usermoney = Number(rows2[i].split(',')[9]);
                            userRowIndex = i;
                        }
                    }

                    // التحقق مما إذا كان الطالب مشتركاً مسبقاً أو الكورس مجاني
                    if((enrolledTokens && enrolledTokens.includes(localStorage.token)) || price === 0){
                        displaySuccessPopup('جاري فتح الكورس');
                        document.getElementById("overlay").style.display = 'none';
                        localStorage.name = courseName;
                        localStorage.description = description;
                        localStorage.link = link;
                        localStorage.number = num;
                        location.href = 'lesson.html';
                    }
                    // التحقق من رصيد محفظة المستخدم
                    else if(usermoney >= price){
                        displaySuccessPopup('جاري الإشتراك ، يرجي الإنتظار');
                        localStorage.boughtsuccesfully = 'yes';
                        
                        let newMoney = usermoney - price;
                        updateCell(userRowIndex + 1, 10, newMoney);
                        if(wallet) wallet.innerHTML = newMoney;

                        let newTokens = (enrolledTokens ? enrolledTokens : '') + localStorage.token;
                        updateCell2(Number(num) + 1, 6, newTokens);

                        setTimeout(function(){
                            location.reload();
                        }, 4500);
                    }
                    else if(usermoney < price){
                        displaySuccessPopup('لا يوجد المال الكافي للإشتراك');
                        document.getElementById("overlay").style.display = 'none';
                    }
                });
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("overlay").style.display = 'none';
        });
}
