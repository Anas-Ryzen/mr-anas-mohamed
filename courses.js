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
if(localStorage.number){
    localStorage.removeItem('number')
}
localStorage.removeItem("name")
localStorage.removeItem("description")



const sheetId2 = '1ou-3Gr1pOsRVlSoN4Ou0go51qS6OKxYL_RbfcBnPmwE'; // استبدل بـ ID الخاص بجدول البيانات
const csvUrl2 = `https://docs.google.com/spreadsheets/d/${sheetId2}/export?format=csv`;
let studentgrade
fetch(csvUrl2)
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n'); // تقسيم البيانات إلى صفوف
        if (localStorage.token) {
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].split(',')[8] == localStorage.token){
                    studentgrade = rows[i].split(',')[6]
                    break; // توقف البحث بمجرد العثور على البيانات
                }
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
            
        }
    })
.catch(error => console.error("حدث خطأ أثناء جلب البيانات:", error));



// استدعاء Google Apps Script لتعديل خلية معينة
function updateCell(row, column, newValue) {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbzNNavRmDNDdRUwCab4CvsMJHCCdDoIw17PsdesnUywS1UGgSpOo7qZsbFLtEo2K6Fr/exec'; // ضع هنا رابط الـ Web App المنشور
    const params = new URLSearchParams({
        row: row,
        column: column,
        value: newValue
    });

    fetch(`${scriptUrl}?${params}`, { method: 'POST' })
        .then(response => response.text())
        .then(result => {
        })
        .catch(error => console.error('Error:', error));
}

function updateCell2(row, column, newValue) {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxK_Z0m66sgZZhYfGb2xNRFod9S0mBwWLwoPxLuxTqagm2a5ZGaOPu0kk_Fo2GG1jwgFw/exec'; // ضع هنا رابط الـ Web App المنشور
    const params = new URLSearchParams({
        row: row,
        column: column,
        value: newValue
    });

    fetch(`${scriptUrl}?${params}`, { method: 'POST' })
        .then(response => response.text())
        .then(result => {
        })
        .catch(error => console.error('Error:', error));
}

function displaySuccessPopup(textinp) {
    const popup = document.getElementById("loginPopup");
    popup.style.display = "block";
    popup.innerHTML = textinp

    setTimeout(function() {
        popup.style.display = "none";
    }, 3500);
}
let price


function displayCourses(courseData) {
    const coursesContainer = document.getElementById('coursesContainer');
    courseData.forEach(course => {
        const courseName = course[0]; // اسم الحصة
        const enrolledTokens = course[7]; // التوكنات المشتركه (قائمة مفصولة بفواصل)
        const coursePrice = course[2]; // سعر الحصة
        const courseGrade = course[3]; // الصف الدراسي
        if(courseName == 'اسم الحصه'){
            
        }
        else if(coursePrice == 0 && courseGrade == studentgrade){
            const description = course[1];
            const coursePrice = 'مجانا' // سعر الحصة
            const courseGrade = course[3]; // الصف الدراسي
            const number = course[8];
            const courseElement = document.createElement('div');
            courseElement.classList.add('course');

            courseElement.innerHTML = `
                <h3>${courseName}</h3>
                <h3>${description}</h3>
                <p>السعر: ${coursePrice}</p>
                <p>الصف الدراسي: ${courseGrade}</p>
                <button onclick="checkAndBuyCourse('${Number(number)}')">الدخول للكورس</button>
            `;
            coursesContainer.appendChild(courseElement);
        }
        else if(enrolledTokens.includes(localStorage.token) && courseGrade == studentgrade){
            const description = course[1];
            const coursePrice = course[2]; // سعر الحصة
            const courseGrade = course[3]; // الصف الدراسي
            const number = course[8];
            const courseElement = document.createElement('div');
            courseElement.classList.add('course');

            courseElement.innerHTML = `
                <h3>${courseName}</h3>
                <h3>${description}</h3>
                <p>السعر: ${coursePrice} جنيه</p>
                <p>الصف الدراسي: ${courseGrade}</p>
                <button onclick="checkAndBuyCourse('${Number(number)}')" id="bought">الدخول للكورس</button>
            `;
            coursesContainer.appendChild(courseElement);
        }
        else if(courseGrade == studentgrade){
            const description = course[1];
            const coursePrice = course[2]; // سعر الحصة
            const courseGrade = course[3]; // الصف الدراسي
            const number = course[8];
            const courseElement = document.createElement('div');
            courseElement.classList.add('course');

            courseElement.innerHTML = `
                <h3>${courseName}</h3>
                <h3>${description}</h3>
                <p>السعر: ${coursePrice} جنيه</p>
                <p>الصف الدراسي: ${courseGrade}</p>
                <button onclick="checkAndBuyCourse('${Number(number)}')">شراء الكورس</button>
            `;
            coursesContainer.appendChild(courseElement);
        }
        price = course[2]
        const loaderOverlay = document.getElementById('loader-overlay');
        loaderOverlay.style.display = 'none';
    });
}

function checkAndBuyCourse(num){
    document.getElementById("overlay").style.display = 'block'
    const sheetId = '10lifxmFuDr_qmaYiWVpLxzgbknoiTqJ6pNkLEIb_Hfc'; // استبدل بـ ID الخاص بجدول البيانات
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

    fetch(csvUrl)
        .then(response => response.text())
        .then(data => {
            let usermoney = ''
            const rows = data.split('\n'); // تقسيم البيانات إلى صفوف
            const sheetId = '1ou-3Gr1pOsRVlSoN4Ou0go51qS6OKxYL_RbfcBnPmwE'; // استبدل بـ ID الخاص بجدول البيانات
            const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
            fetch(csvUrl)
                .then(response => response.text())
                .then(data => {
                    const rows2 = data.split('\n'); // تقسيم البيانات إلى صفوف
                    for(let i = 0 ; i < rows2.length ; i++){
                        if(rows2[i].split(',')[8] == localStorage.token){
                            usermoney = rows2[i].split(',')[9]
                        }
                    }
                    if(rows[num].split(',')[7].includes(localStorage.token) || Number(rows[num].split(',')[2]) == 0){
                        displaySuccessPopup('جاري فتح الكورس')
                        document.getElementById("overlay").style.display = 'none'
                        localStorage.number = num
                        location.href = 'lesson.html'
                    }
                    else if(usermoney >= Number(rows[num].split(',')[2])){
                        displaySuccessPopup('جاري الإشتراك ، يرجي الإنتظار')
                        for(let i = 0 ; i < rows2.length ; i ++){
                            if(rows2[i].split(',')[8] == localStorage.token){
                                let newMoney = Number(rows2[i].split(',')[9]) - Number(price)
                                updateCell(i+1 , 10 , newMoney);
                                let newTokens = rows[num].split(',')[7] + localStorage.token
                                updateCell2(Number(num)+1 , 8 , newTokens)
                                localStorage.boughtsuccesfully = 'yes'

                                setTimeout(function(){
                                    location.reload()
                                },4500)
                            }
                        }
                    }
                    else if(usermoney < Number(rows[num].split(',')[2])){
                        displaySuccessPopup('لا يوجد المال الكافي للإشتراك')
                        document.getElementById("overlay").style.display = 'none'
                    }
                })
            
        })
}