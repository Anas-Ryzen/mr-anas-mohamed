// (function() {
//     let devToolsOpen = false;
  
//     const threshold = 160;
//     const checkDevTools = function() {
//       if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
//         devToolsOpen = true;
//       }
//     };
  
//     setInterval(function() {
//       checkDevTools();
//       if (devToolsOpen) {
//         window.location.href = 'about:blank';
//       }
//     }, 1000);
//   })();
  
//   document.addEventListener('copy', function(e) {
//     e.preventDefault();
//   });
  
//   document.addEventListener('keydown', function(e) {
//     // Check for F12 key (DevTools)
//     if (e.keyCode === 123) { 
//       e.preventDefault();
//     }
  
//     // Check for Ctrl + Shift + I (Inspect)
//     if (e.ctrlKey && e.shiftKey && e.code === 'KeyI') {
//       e.preventDefault();
//     }
  
//     // Check for Ctrl + Shift + J (Console)
//     if (e.ctrlKey && e.shiftKey && e.code === 'KeyJ') {
//       e.preventDefault();
//     }
  
//     // Check for Ctrl + U (View Source)
//     if (e.ctrlKey && e.code === 'KeyU') {
//       e.preventDefault();
//     }
//   });
  

document.getElementById("user-icon").addEventListener("click", function (event) {
    let infoBox = document.getElementById("user-info");
    infoBox.style.display = infoBox.style.display === "block" ? "none" : "block";
    event.stopPropagation();
});

// إغلاق المربع عند الضغط خارج الأيقونة
document.addEventListener("click", function (event) {
    let infoBox = document.getElementById("user-info");
    let toggleButton = document.getElementById("user-icon");

    if (!toggleButton.contains(event.target) && !infoBox.contains(event.target)) {
        infoBox.style.display = "none";
    }
});
let iconusernamejs = document.getElementById("icon-usernamejs")

function datacheck(){
    const sheetId = '1ou-3Gr1pOsRVlSoN4Ou0go51qS6OKxYL_RbfcBnPmwE'; // استبدل بـ ID الخاص بجدول البيانات
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

    fetch(csvUrl)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n'); // تقسيم البيانات إلى صفوف
            let wallet = document.getElementById("wallet");
            let found = false; // متغير للتحقق إذا تم العثور على البيانات

            if (localStorage.token) {
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].split(',')[8] == localStorage.token){
                        wallet.innerHTML = rows[i].split(',')[9]
                        found = true;
                        iconusernamejs.innerHTML = `اهلا ${rows[i].split(',')[0]} ${rows[i].split(',')[1]} ${rows[i].split(',')[2]}`
                        break; // توقف البحث بمجرد العثور على البيانات
                    }
                }

                // بعد انتهاء الحلقة، إذا لم يتم العثور على البيانات، قم بتوجيه المستخدم
                if (!found) {
                    localStorage.clear();
                    location.href = "login.html";
                }
            }
        })
        .catch(error => console.error("حدث خطأ أثناء جلب البيانات:", error));
}
datacheck()