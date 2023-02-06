

// slug
function ChangeToSlug(){
    var title, slug;
 
    //Lấy text từ thẻ input title 
    title = document.getElementsByClassName("form-group")[0].getElementsByTagName("input")[0].value;

    //Đổi chữ hoa thành chữ thường
    slug = title.toLowerCase();

    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');
    //Xóa các ký tự đặt biệt
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
    //Đổi khoảng trắng thành ký tự gạch ngang
    slug = slug.replace(/ /gi, "-");
    //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
    //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');
    //Xóa các ký tự gạch ngang ở đầu và cuối
    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');
    //In slug ra textbox có id “slug”
    document.getElementsByClassName("form-group")[1].getElementsByTagName("input")[0].value = slug;
}



var sidebar = document.getElementsByClassName("menu-bar-li");
for (var i = 0; i < sidebar.length; i++) {
    sidebar[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("menu-bar-li active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
    });
}



var pagination = document.getElementsByClassName("pagination-a");
for (var i = 0; i < pagination.length; i++) {
  pagination[i].addEventListener("click", function() {
  var current = document.getElementsByClassName("pagination-a active");
  current[0].className = current[0].className.replace(" active", "");
  this.className += " active";
  });
}



//check all
var checkall   = document.getElementsByClassName("checkall")[0];
var checkboxes = document.getElementsByClassName("check");
var ordering   = document.getElementsByClassName("ordering");

checkall.onclick = function () {
    if(checkall.checked == true){
        for(var i = 0 ;i < checkboxes.length; i++) {
            checkboxes[i].checked = true;
            ordering[i].setAttribute("name", "ordering");
        }
    }else{
        for(var i = 0 ;i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
            ordering[i].removeAttribute("name");
        }
    }  
}  


// add name ordering
function Ordering () {
    for(var i = 0 ;i < checkboxes.length; i++) {
        if(checkboxes[i].checked == true){
            ordering[i].setAttribute("name", "ordering");
        }else {
            ordering[i].removeAttribute("name");
        }
    }
}


//change action

const button = document.getElementById('apply');
var action = document.getElementById("action-select");

function change_action () {
    button.disabled = false;
    var action = document.getElementById("action-select").value;
    formit.action = action;
    if (action == document.getElementById("action-select")[0].value) button.disabled = true;    
}

button.onclick = () => {
    if (action.value == document.getElementById("action-select")[4].value){
        if(!confirm("Bạn có muốn xóa")) return false;
    }  
}





let delOne =  document.getElementsByClassName('delete');

for(let i = 0; i < delOne.length; i++){
    delOne[i].onclick = function (){
        if(!confirm("Bạn có muốn xóa")) return false;
    }
}



const sortButton = document.getElementById('sort');
var sortContent = document.getElementById("sortDropdown");

sortButton.onclick = () => {
    sortContent.classList.toggle('show');   
    window.onclick = function (event) {
        if (!event.target.matches('.dropSort')) {
            if (sortContent.classList.contains('show')) {
                sortContent.classList.remove('show');
            }
        }
    }
}

