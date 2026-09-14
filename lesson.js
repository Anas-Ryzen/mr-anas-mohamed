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

if(localStorage.nohwyet == 'yes'){
    setTimeout(function(){
        displaySuccessPopup('لم يتم نزول الواجب حتي الان')
        localStorage.removeItem('nohwyet')
    },300)
}
if(sessionStorage.name && sessionStorage.description && sessionStorage.link && sessionStorage.number){
    localStorage.name = sessionStorage.name
    localStorage.description = sessionStorage.description
    localStorage.link = sessionStorage.link
    localStorage.number = sessionStorage.number
    sessionStorage.removeItem("name")
    sessionStorage.removeItem("description")
    sessionStorage.removeItem("link")
    sessionStorage.removeItem("number")
}
if(!localStorage.name || !localStorage.description || !localStorage.link || !localStorage.number){
    localStorage.joinagain = 'yes'
    location.href = "courses.html"
}

let title = document.getElementById("course-title")
let des = document.getElementById("course-description")

title.innerHTML = localStorage.name
let namee = localStorage.name
des.innerHTML = localStorage.description
let desc = localStorage.description
let videoUrl = localStorage.link
let num = localStorage.number

localStorage.removeItem("name")
localStorage.removeItem("description")
localStorage.removeItem("link")
localStorage.removeItem("number")

window.onbeforeunload = function() {
    sessionStorage.name = namee
    sessionStorage.description = desc
    sessionStorage.link = videoUrl
    sessionStorage.number = num
};

let hwbtn = document.getElementById("open-assignment")

hwbtn.onclick = function(){
    localStorage.number = num
    location.href = "hw.html"
    localStorage.name = title.innerHTML
    localStorage.description = des.innerHTML
    localStorage.link = videoUrl
}


function getEmbedUrl(url) {
    let videoId;

    if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${videoId}`;
    }

    if (url.includes("youtube.com/watch")) {
        videoId = new URL(url).searchParams.get("v");
        return `https://www.youtube.com/embed/${videoId}`;
    }

    if (url.includes("vimeo.com/")) {
        videoId = url.split("vimeo.com/")[1].split("?")[0];
        return `https://player.vimeo.com/video/${videoId}`;
    }

    if (url.includes("dailymotion.com/video/")) {
        videoId = url.split("dailymotion.com/video/")[1].split("?")[0];
        return `https://www.dailymotion.com/embed/video/${videoId}`;
    }

    return "";
}

let embedUrl = getEmbedUrl(videoUrl);
if (embedUrl) {
    document.getElementById("course-video").src = embedUrl;
} else {
    alert("رابط الفيديو غير مدعوم!");
}

let pastresults = document.getElementById("pastresults");

const sheetId = '1ou-3Gr1pOsRVlSoN4Ou0go51qS6OKxYL_RbfcBnPmwE'; // استبدل بـ ID الخاص بجدول البيانات
const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

fetch(csvUrl)
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n'); // تقسيم البيانات إلى صفوف
        pastresults.innerHTML = ""; // تفريغ المحتوى القديم

        for (let i = 0; i < rows.length; i++) {
            if (localStorage.token == rows[i].split(',')[8]) {
                for (let k = 9; k < rows[i].split(',').length; k++) {
                    if (num == rows[i].split(',')[k]) {
                        let resultItem = document.createElement("div");
                        resultItem.textContent = rows[i].split(',')[k+1]+'%';
                        pastresults.appendChild(resultItem);
                        const loaderOverlay = document.getElementById('loader-overlay');
                        loaderOverlay.style.display = 'none';
                    }
                }
            }
        }

        if (pastresults.innerHTML === "") {
            pastresults.innerHTML = "<div>لا توجد نتائج سابقة لهذا الاختبار</div>";
        }
    });

