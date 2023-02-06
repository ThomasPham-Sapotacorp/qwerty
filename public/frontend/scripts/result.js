function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,".");
    return parts.join(",");
}

function unformat(x) {
    return x.split('.').join('');
}

let urlSearchParams = new URLSearchParams(window.location.search);
let params = Object.fromEntries(urlSearchParams.entries());
if(params.price_lte) document.getElementById("price_lte").value = numberWithCommas(params.price_lte)
if(params.price_gte) document.getElementById("price_gte").value = numberWithCommas(params.price_gte)


let max_price = document.getElementById("price_lte");
let min_price = document.getElementById("price_gte");

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

let link='/result';
if(params.search) link += '?search=' + params.search; 

let btnSubmitPrice = document.getElementById('submit-price');

btnSubmitPrice.onclick = function(){
	let lte = unformat(document.getElementById("price_lte").value);
	let gte = unformat(document.getElementById("price_gte").value);
	if (lte) link += '&price_lte='+ lte;
	if (gte) link += '&price_gte='+ gte;
	document.getElementById('submit-price').href = link;
}