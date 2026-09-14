document.addEventListener('DOMContentLoaded', function() {
    // عند بدء تحميل الصفحة
    const loaderOverlay = document.getElementById('loader-overlay');
    
    // يتم إخفاء الـ overlay بعد 1.5 ثانية
    setTimeout(function() {
      loaderOverlay.style.display = 'none'; // إخفاء الـ overlay والدائرة
    }, 500);
}); 
function displaySuccessPopup(textinp) {
    const popup = document.getElementById("loginPopup");
    popup.style.display = "block";
    popup.innerHTML = textinp

    setTimeout(function() {
        popup.style.display = "none";
    }, 3500);
}
if(!localStorage.studentName || !localStorage.fatherName || !localStorage.studentPhone || !localStorage.guardianPhone || !localStorage.password || !localStorage.grade){
    location.href = 'register.html'
}
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

let amount = document.getElementById("amount")
let rechargebtn = document.getElementById("recharge-btn")


const sheetId = '1ou-3Gr1pOsRVlSoN4Ou0go51qS6OKxYL_RbfcBnPmwE'; // استبدل بـ ID الخاص بجدول البيانات
const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

fetch(csvUrl)
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n'); // تقسيم البيانات إلى صفوف
        let wallet = document.getElementById("wallet");
        let found = false; // متغير للتحقق إذا تم العثور على البيانات
        rechargebtn.onclick = function(){
            if (localStorage.studentName && localStorage.fatherName && localStorage.grandFatherName && localStorage.studentPhone && localStorage.guardianPhone && localStorage.password && localStorage.grade) {
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].split(',')[3] == localStorage.studentPhone && rows[i].split(',')[8] == localStorage.token && rows[i].split(',')[0] == localStorage.studentName && rows[i].split(',')[1] == localStorage.fatherName && rows[i].split(',')[2] == localStorage.grandFatherName){
                        found = true;
                        if(amount.value.length != 0){
                            if(amount.value >= 20 && amount.value <= 500){
                                let phoneNumber = "201097799626"; // رقم الهاتف بدون "+"
                                let message = `اريد شحن المحفظه ، المبلغ ${amount.value} ، الاسم : ${localStorage.studentName} ${localStorage.fatherName} ${localStorage.grandFatherName} ، رقم الهاتف : ${localStorage.studentPhone}`;
                            
                                // تكوين رابط واتساب
                                let url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                            
                                // فتح الرابط في نافذة جديدة
                                window.open(url, "_blank");
                            }
                            else if(amount.value < 20){
                                displaySuccessPopup("اقل مبلغ 20 جنيه")
                            }
                            else if(amount.value > 500){
                                displaySuccessPopup("الحد الاقصي 500 جنيه")
                            }
                        }
                        else{
                            displaySuccessPopup("لا يمكن ترك المبلغ فارغ")
                        }
                        break;
                    }
                }

                // بعد انتهاء الحلقة، إذا لم يتم العثور على البيانات، قم بتوجيه المستخدم
                if (!found) {
                    localStorage.clear();
                    location.href = "login.html";
                }
            }
        }
    })
    .catch(error => console.error("حدث خطأ أثناء جلب البيانات:", error));