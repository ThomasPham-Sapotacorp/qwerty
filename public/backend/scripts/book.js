//modal
var modal = document.getElementsByClassName("detail-product");
var outside = document.getElementsByClassName("detail-overlay");
var btn = document.getElementsByClassName("xemthem");
var span = document.getElementsByClassName("close");

for(let i = 0; i < modal.length; i++){
    btn[i].onclick = function () {
        modal[i].style.display = "block";
    }
    span[i].onclick = function () {
        modal[i].style.display = "none";
    } 
    outside[i].onclick = function () {
        modal[i].style.display = "none";
    }        
}


const categoryButton = document.getElementById('category');
var categoryContent = document.getElementById("categoryDropdown");

categoryButton.onclick = () => {
    categoryContent.classList.toggle("show");
    window.onclick = function (event) {
        if (!event.target.matches('.dropCategory')) {
            if (categoryContent.classList.contains('show')) {
                categoryContent.classList.remove('show');
            }
        }
    }
}

