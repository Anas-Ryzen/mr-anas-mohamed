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
let attachment = document.getElementById('open-attachment')
let attachment_container = document.getElementById('attachment-section')
let classwork = document.getElementById('classwork')
const loaderOverlay = document.getElementById('loader-overlay');

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
let videoUrl2
let videoUrl3
if(localStorage.nohwyet == 'yes'){
    setTimeout(function(){
        displaySuccessPopup('لا يوجد واجب متوفر حاليا')
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
            // const rows2 = data.split('\n'); // تقسيم البيانات إلى صفوف
            if(rows[num].split(',')[7].includes(localStorage.token) || Number(rows[num].split(',')[2]) == 0){
                title.innerHTML = rows[num].split(',')[0]
                des.innerHTML = rows[num].split(',')[1]
                videoUrl = rows[num].split(',')[4]
                videoUrl2 = rows[num].split(',')[5]
                videoUrl3 = rows[num].split(',')[6]
                let file = rows[num].split(',')[9]
                let embedUrl = getEmbedUrl(videoUrl);
                let embedUrl2 = getEmbedUrl(videoUrl2);
                let embedUrl3 = getEmbedUrl(videoUrl3);
                if (embedUrl) {
                    document.getElementById("course-video").src = embedUrl;
                    document.getElementById("classwork-video").src = embedUrl2
                    if(document.getElementById('hw-video-section') && videoUrl3 !== ''){
                        document.getElementById("hw-video").src = embedUrl3
                    }
                    else if(videoUrl3 == '' && document.getElementById('hw-video-section')){
                        document.getElementById('hw-video-section').remove()
                    }
                } else {
                    alert("رابط الفيديو غير مدعوم!");
                }
                if(videoUrl2 == ''){
                    classwork.classList.add('hidden')
                }
                if(file == ''){
                    attachment_container.classList.add('hidden')
                }
                else if(file !== ''){
                    attachment.onclick = function(){
                        window.open(`https://cdn.jsdelivr.net/gh/Anas-Ryzen/${file}@main/${file}.pdf` , '_blank')
                    }
                }
                loaderOverlay.style.display = 'none';

            }
            else{
                location.href = 'courses.html'
            }
        })
    
})

window.onbeforeunload = function() {    
    localStorage.number = num
};

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

let hwbtn = document.getElementById("open-assignment")

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
                        hwbtn.style.cursor = "not-allowed";
                    }
                }
            }
        }

        if (pastresults.innerHTML === "") {
            document.getElementById('hw-video-section').remove()
            pastresults.innerHTML = "<div>لا توجد نتائج سابقة لهذا الاختبار</div>";
            hwbtn.onclick = function(){
                localStorage.number = num
                localStorage.name = title.innerHTML
                localStorage.description = des.innerHTML
                location.href = "hw.html"
            }
        }
    });

