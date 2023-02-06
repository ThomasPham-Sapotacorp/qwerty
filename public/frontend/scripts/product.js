
function openTabProduct(a, tabID) {
    if (tabID ==  'info') {
        tabID_2 = 'content'; 
        title =  a.nextElementSibling;
    }else {
        tabID_2 = 'info'; 
        title =  a.previousElementSibling;
    }

    a.className = 'active'
    title.classList.remove("active");
    
    div_1 = document.getElementById(tabID);
    div_2 = document.getElementById(tabID_2);

    div_1.style.display = 'block'
    div_2.style.display = 'none'
}

function amount_change(num) {
    document.getElementById("myAmount").stepUp(num);
}

var close = document.getElementsByClassName("closebtn");
var i;

// Loop through all close buttons
for (i = 0; i < close.length; i++) {
  // When someone clicks on a close button
  close[i].onclick = function(){

    // Get the parent of <span class="closebtn"> (<div class="alert">)
    var div = this.parentElement;

    // Set the opacity of div to 0 (transparent)
    div.style.opacity = "0";

    // Hide the div after 600ms (the same amount of milliseconds it takes to fade out)
    setTimeout(function(){ div.style.display = "none"; }, 600);
  }
}


let cart_B      = document.getElementById('add-to-cart');
let buy_B       = document.getElementById('buy-now');
let form_cart   = document.getElementById('cart');

cart_B.addEventListener("click", function () {
    form_cart.action = "/cart/add-to-cart/";
    form_cart.submit();
});

buy_B.addEventListener("click", function () {
    form_cart.action = "/cart/buy-now/";
    form_cart.submit();
});

lightGallery(document.getElementById('lightgallery')); 

$(".owl_category").owlCarousel({
    items: 5,
    loop: true,
    nav: true,
    dots: false,
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
