let x = document.getElementById("test");
let i = 10

window.onbeforeunload = function(){
    if(i > 0){
        localStorage.time = i
    }
}
window.onload = function(){
    if (localStorage.time > 0){
        i = localStorage.time
        x.innerHTML = i
        localStorage.clear()
    }
}

let timer = setInterval(function() {
    x.innerHTML = i;
    i--;

    if (i < 0) {
        localStorage.clear()
        clearInterval(timer);
    }
}, 1000);