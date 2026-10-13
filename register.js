document.addEventListener('DOMContentLoaded', function() {
    // عند بدء تحميل الصفحة
    const loaderOverlay = document.getElementById('loader-overlay');
    
    // يتم إخفاء الـ overlay بعد 1.5 ثانية
    setTimeout(function() {
      loaderOverlay.style.display = 'none'; // إخفاء الـ overlay والدائرة
    }, 500);
});


if (localStorage.token){
    localStorage.youhaveaccount = 'yes'
    location.href = 'login.html'
}

if(localStorage.number){
    localStorage.removeItem('number')
}
const sheetId = '1ou-3Gr1pOsRVlSoN4Ou0go51qS6OKxYL_RbfcBnPmwE'; // استبدل بـ ID الخاص بجدول البيانات
const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
let register = document.getElementById("register")
fetch(csvUrl)
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n'); // تقسيم البيانات إلى صفوف

        const scriptUrl = 'https://script.google.com/macros/s/AKfycbyHfl7Xz-VcsGZy4cRERRJkPG3-OL2SBISdUjFANTBb2fjxXe-n2439jCvFmDKSHqJA/exec'; // ضع هنا رابط Google Apps Script الخاص بك

        register.onclick = function(){
            register.disabled = true
            let studentName = document.getElementById("student-name").value.trim();
            let fatherName = document.getElementById("father-name").value.trim();
            let grandFatherName = document.getElementById("grand-father-name").value.trim();
            let studentPhone = document.getElementById("student-phone").value.trim();
            let guardianPhone = document.getElementById("guardian-phone").value.trim();
            let password = document.getElementById("password").value.trim();
            let grade = document.getElementById("grade").value.trim();
            let state = 'no';
            let wallet = 0
            const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"; // الحروف الصغيرة والكبيرة
            let token = "";

            for (let i = 0; i < 10; i++) {
                const randomIndex = Math.floor(Math.random() * chars.length); // اختيار حرف عشوائي
                token += chars[randomIndex];
            }

            // التأكد من أن الرقم يبدأ بصفر
            if (studentPhone[0] !== '0') {
                studentPhone = '0' + studentPhone;
            }
            if (guardianPhone[0] !== '0') {
                guardianPhone = '0' + guardianPhone;
            }

            // إجبار Google Sheets على معاملة الرقم كنص
            studentPhone = "'" + studentPhone;
            guardianPhone = "'" + guardianPhone;
            if(localStorage.token){
                displaySuccessPopup('لديك حساب بالفعل')
                register.disabled = false
                return ;
            }
            else if(!studentName || !fatherName || !studentPhone || !guardianPhone || !password || !grade) {
                displaySuccessPopup('يرجي إدخال البيانات كامله وبشكل صحيح')
                register.disabled = false
                return ;
            }

            // التحقق إذا كان الرقم موجودًا في Google Sheets
            let isPhoneTaken = false;
            for(let i = 0; i < rows.length; i++) {
                if (rows[i].split(',')[3] === document.getElementById("student-phone").value) {
                    isPhoneTaken = true;
                    break;
                }
            }

            if (isPhoneTaken) {
                displaySuccessPopup('هذا الرقم مستخدم بالفعل')
                register.disabled = false
                return;
            }

            displaySuccessPopup('جاري إنشاء الحساب ، يرجى الإنتظار')

            fetch(scriptUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `studentName=${encodeURIComponent(studentName)}&fatherName=${encodeURIComponent(fatherName)}&studentPhone=${encodeURIComponent(studentPhone)}&guardianPhone=${encodeURIComponent(guardianPhone)}&password=${encodeURIComponent(password)}&grade=${encodeURIComponent(grade)}&state=${encodeURIComponent(state)}&token=${encodeURIComponent(token)}&grandFatherName=${encodeURIComponent(grandFatherName)}&wallet=${encodeURIComponent(wallet)}`
            })
            .then(response => response.text())
            .then(data => {
                document.getElementById("student-name").value = '';
                document.getElementById("father-name").value = '';
                document.getElementById("grand-father-name").value = '';
                document.getElementById("student-phone").value = '';
                document.getElementById("guardian-phone").value = '';
                document.getElementById("password").value = '';
                document.getElementById("grade").value = '';

                studentPhone = studentPhone.startsWith("'") ? studentPhone.slice(1) : studentPhone;
                guardianPhone = guardianPhone.startsWith("'") ? guardianPhone.slice(1) : guardianPhone;

                // localStorage.setItem('studentName', studentName);
                // localStorage.setItem('fatherName', fatherName);
                // localStorage.setItem('grandFatherName', grandFatherName);
                // localStorage.setItem('studentPhone', studentPhone);
                // localStorage.setItem('guardianPhone', guardianPhone);
                // localStorage.setItem('password', password);
                // localStorage.setItem('grade', grade);

                localStorage.setItem('token', token);
                localStorage.registeredsuccesfuly = 'yes';
                location.href = 'login.html';
            })
            .catch(error => {
                displaySuccessPopup('حدث خطأ أثناء إنشاء الحساب.')
            });
        }
    })
    .catch(error => {
        console.error('Error fetching CSV:', error);
});

function displaySuccessPopup(textinp) {
    const popup = document.getElementById("loginPopup");
    popup.style.display = "block";
    popup.innerHTML = textinp

    setTimeout(function() {
        popup.style.display = "none";
    }, 4000);
}