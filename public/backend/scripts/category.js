var groupButton = document.getElementById('group');
var groupContent = document.getElementById("groupDropdown");

groupButton.onclick = () => {
    groupContent.classList.toggle("show");
    
    window.onclick = function (event) {
        if (!event.target.matches('.dropGroup')) {
            if (groupContent.classList.contains('show')) {
                groupContent.classList.remove('show');
            }
        }
    }
}	
