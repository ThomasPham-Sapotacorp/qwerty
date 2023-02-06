$(document).ready(function () {
    $(".owl_banner").owlCarousel({
        items: 1,
        loop: true,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 3000,
    });

    $(".owl_category").owlCarousel({
        items: 5,
        loop: true,
        nav: true,
        dots: false,
        autoplay: true,
        autoplayTimeout: 3000,
    });

    $(".owl_category_toy").owlCarousel({
        items: 5,
        loop: true,
        nav: true,
        dots: false,
        rows: true,
        autoplay: true,
        autoplayTimeout: 3000,
    });


});



function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,".");
    return parts.join(",");
}

let price = document.getElementsByClassName('price_js');
for(let i = 0; i < price.length; i++){
    document.getElementsByClassName('price_js')[i].innerHTML = numberWithCommas(price[i].innerHTML)
}



var modal = document.getElementById("modal");
var outside = document.getElementById("modal-overlay");
var btn = document.getElementById("login");

outside.onclick = function () {
    modal.style.display="none";
} 

btn.onclick = function () {
    modal.style.display="block";
}



function openTab(a, tabID) {
    let modal = document.getElementById('modal-body')
    if (tabID ==  'sign-in') {
        tabID_2 = 'sign-up'; 
        title =  a.nextElementSibling;
        modal.style.height = '210px'
    }else {
        tabID_2 = 'sign-in'; 
        title =  a.previousElementSibling;
        modal.style.height = '430px'
    }

    title.className = 'inactive'
    a.className = 'active'
    
    form_1 = document.getElementById(tabID);
    form_2 = document.getElementById(tabID_2);

    form_1.style.display = 'block'
    form_2.style.display = 'none'
}

let repeatPw = document.getElementById('password-repeat');
let spanRepeat = document.getElementById('span-rp-pw');
repeatPw.addEventListener('keyup', function(){
    let newPwText       = document.getElementsByName('password')[1].value;
    let repeatPwText    = document.getElementById('password-repeat').value;

    if(newPwText !== repeatPwText){
        spanRepeat.innerHTML = 'Vui lòng nhập lại'
    }else{
        spanRepeat.innerHTML = ''
    }
})


let _urlSearchParams = new URLSearchParams(window.location.search);
let _params = Object.fromEntries(urlSearchParams.entries());
if(_params.search) document.getElementById('search_Input').value = _params.search;


let errLogin = document.getElementById('login-err');