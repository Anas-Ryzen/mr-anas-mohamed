document.addEventListener('DOMContentLoaded', function() {
    // عند بدء تحميل الصفحة
    const loaderOverlay = document.getElementById('loader-overlay');
    
    // يتم إخفاء الـ overlay بعد 1.5 ثانية
    setTimeout(function() {
      loaderOverlay.style.display = 'none'; // إخفاء الـ overlay والدائرة
    }, 1000);
}); 

function displaySuccessPopup(textinp) {
    const popup = document.getElementById("loginPopup");
    popup.style.display = "block";
    popup.innerHTML = textinp

    setTimeout(function() {
        popup.style.display = "none";
    }, 4000);
}

if(localStorage.loggedinsuccesfully == 'yes'){
    setTimeout(function(){
        displaySuccessPopup('تم تسجيل الدخول بنجاح')
        localStorage.removeItem('loggedinsuccesfully')
    },300)
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

if(localStorage.number){
    localStorage.removeItem('number')
}
localStorage.removeItem("name")
localStorage.removeItem("description")