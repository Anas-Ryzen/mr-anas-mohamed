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
    }, 2500);
});  
function displaySuccessPopup(textinp) {
    const popup = document.getElementById("loginPopup");
    popup.style.display = "block";
    popup.innerHTML = textinp

    setTimeout(function() {
        popup.style.display = "none";
    }, 4000);
}
if(!localStorage.number){
    localStorage.joinagain = 'yes'
    location.href = "courses.html"
}
let num = localStorage.number
localStorage.removeItem("number")
localStorage.removeItem("name")
localStorage.removeItem("description")
let title = document.getElementById("course-title")
let des = document.getElementById("course-description")
let videoUrl
if(localStorage.nohwyet == 'yes'){
    setTimeout(function(){
        displaySuccessPopup('لم يتم نزول الواجب حتي الان')
        localStorage.removeItem('nohwyet')
    },300)
}











const sheetId2 = '10lifxmFuDr_qmaYiWVpLxzgbknoiTqJ6pNkLEIb_Hfc'; // ID الخاص بشيت الحصص
const csvUrl2 = `https://docs.google.com/spreadsheets/d/${sheetId2}/export?format=csv`;
fetch(csvUrl2)
.then(response => response.text())
.then(data => {
    const rows = data.split('\n'); // تقسيم البيانات إلى صفوف
    const sheetId2 = '1ou-3Gr1pOsRVlSoN4Ou0go51qS6OKxYL_RbfcBnPmwE'; // استبدل بـ ID الخاص بجدول البيانات
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId2}/export?format=csv`;
    fetch(csvUrl)
        .then(response => response.text())
        .then(data => {
            const rows2 = data.split('\n'); // تقسيم البيانات إلى صفوف
            if(rows[num].split(',')[5].includes(localStorage.token) || Number(rows[num].split(',')[2]) == 0){
                title.innerHTML = rows[num].split(',')[0]
                des.innerHTML = rows[num].split(',')[1]
                videoUrl = rows[num].split(',')[4]
                let embedUrl = getEmbedUrl(videoUrl);
                if (embedUrl) {
                    document.getElementById("course-video").src = embedUrl;
                } else {
                    alert("رابط الفيديو غير مدعوم!");
                }
            }
        })
    
})

window.onbeforeunload = function() {    
    localStorage.number = num
};

let hwbtn = document.getElementById("open-assignment")

hwbtn.onclick = function(){
    localStorage.number = num
    localStorage.name = title.innerHTML
    localStorage.description = des.innerHTML
    location.href = "hw.html"
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

