function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,".");
    return parts.join(",");
}

function unformat(x) {
    return x.split('.').join('');
}

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
if(params.price_lte) document.getElementById("price_lte").value = numberWithCommas(params.price_lte)
if(params.price_gte) document.getElementById("price_gte").value = numberWithCommas(params.price_gte)


let max_price = document.getElementById("price_lte");
let min_price = document.getElementById("price_gte");

max_price.setAttribute("name", "");
max_price.addEventListener('change', function( ){
	if(!document.getElementById("price_lte").value){
		max_price.setAttribute("name", "");
	}else{
		max_price.setAttribute("name", "price_lte");
	}
})

min_price.setAttribute("name", "");
min_price.addEventListener('change', function( ){
	if(!document.getElementById("price_gte").value){
		min_price.setAttribute("name", "");
	}else{
		min_price.setAttribute("name", "price_gte");
	}
})


max_price.addEventListener('keyup', function( ){
	if(document.getElementById("price_lte").value){
		max_price.value = numberWithCommas(unformat(document.getElementById("price_lte").value))
	}
})

min_price.addEventListener('keyup', function( ){
	if(document.getElementById("price_gte").value){
		min_price.value = numberWithCommas(unformat(document.getElementById("price_gte").value))
	}
})


let FromPrice = document.getElementById('form-price');
let btnSubmitPrice = document.getElementById('submit-price');
btnSubmitPrice.onclick = function(){
	document.getElementById("price_lte").value = unformat(document.getElementById("price_lte").value);
	document.getElementById("price_gte").value = unformat(document.getElementById("price_gte").value);
	FromPrice.submit();
}