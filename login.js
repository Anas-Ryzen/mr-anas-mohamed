document.addEventListener('DOMContentLoaded', function() {
    // عند بدء تحميل الصفحة
    const loaderOverlay = document.getElementById('loader-overlay');
    
    // يتم إخفاء الـ overlay بعد 1.5 ثانية
    setTimeout(function() {
      loaderOverlay.style.display = 'none'; // إخفاء الـ overlay والدائرة
    }, 500);
}); 
let phonenum = document.getElementById("phonenum").value
let password = document.getElementById("password").value
let login = document.getElementById("login")
let prom = document.getElementById("prom")
login.disabled = true;
displaySuccessPopup('جاري تحميل البيانات')

const sheetId = '1ou-3Gr1pOsRVlSoN4Ou0go51qS6OKxYL_RbfcBnPmwE'; // استبدل بـ ID الخاص بجدول البيانات
const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
fetch(csvUrl)
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n'); // تقسيم البيانات إلى صفوف
        if(localStorage.studentPhone && localStorage.password && localStorage.token){
            for(let i = 0 ; i < rows.length ; i++){
                if(localStorage.token == rows[i].split(',')[8] && localStorage.studentPhone == rows[i].split(',')[3] && localStorage.password == rows[i].split(',')[5]){
                    document.getElementById("phonenum").value = rows[i].split(',')[3]
                    document.getElementById("password").value = rows[i].split(',')[5]
                    displaySuccessPopup('تم تحميل البيانات')
                    login.disabled = false;
                }
            }
        }
        login.onclick = function(){
            for(let i = 0 ; i < rows.length ; i ++){
                if(rows[i].split(',')[3] == document.getElementById("phonenum").value && rows[i].split(',')[5] == document.getElementById("password").value && rows[i].split(',')[7] == 'yes'){
                    localStorage.loggedinsuccesfully = 'yes'
                    localStorage.token = rows[i].split(',')[8]
                    localStorage.studentName = rows[i].split(',')[0]
                    localStorage.fatherName = rows[i].split(',')[1]
                    localStorage.grandFatherName = rows[i].split(',')[2]
                    localStorage.studentPhone = rows[i].split(',')[3]
                    localStorage.guardianPhone = rows[i].split(',')[4]
                    localStorage.password = rows[i].split(',')[5]
                    localStorage.grade = rows[i].split(',')[6]
                    localStorage.setItem('isLoggedIn', 'true');
                    location.href = 'index.html'
                    return ;
                }
            }
            for(let i = 0 ; i < rows.length ; i ++){
                if(rows[i].split(',')[3] == document.getElementById("phonenum").value && rows[i].split(',')[5] == document.getElementById("password").value && localStorage.token == rows[i].split(',')[8] && rows[i].split(',')[7] == 'no'){
                    displaySuccessPopup('يرجي الإنتظار حتي يتم تفعيل حسابك')
                    break;
                }
                if(rows[i].split(',')[3] == document.getElementById("phonenum").value && rows[i].split(',')[5] == document.getElementById("password").value && rows[i].split(',')[7] == 'no'){
                    displaySuccessPopup('يرجي الإنتظار حتي يتم تفعيل حسابك')
                    break;
                }
                else if(rows[i].split(',')[3] == document.getElementById("phonenum").value && rows[i].split(',')[5] == document.getElementById("password").value && localStorage.token == rows[i].split(',')[8] && rows[i].split(',')[7] == 'no'){
                    displaySuccessPopup('يرجي الإنتظار حتي يتم تفعيل حسابك')
                    break;
                }
                else if(rows[i].split(',')[3] != document.getElementById("phonenum").value){
                    displaySuccessPopup('لا يوجد حساب بهذا الرقم ، يرجي التوجه لإنشاء حساب')
                }
                else if(rows[i].split(',')[3] != document.getElementById("phonenum").value || rows[i].split(',')[5] != document.getElementById("password").value){
                    displaySuccessPopup('كلمه السر خاطئه')
                }

            }
        }
        login.disabled = false;
        
})
function displaySuccessPopup(textinp) {
    const popup = document.getElementById("loginPopup");
    popup.style.display = "block";
    popup.innerHTML = textinp

    setTimeout(function() {
        popup.style.display = "none";
    }, 3500);
}

if(localStorage.registeredsuccesfuly == 'yes'){
    setTimeout(function(){
        displaySuccessPopup('تم إنشاء الحساب بنجاح')
        localStorage.removeItem('registeredsuccesfuly')
    },300)
}

