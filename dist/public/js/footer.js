AOS.init();
$(function () {
   $('.cancelNav').click(function () {
      $('.sidenav').css('display', 'none');
   });
});
function openNav() {
   document.getElementById("myTopnav").style.height = "220px";

}
function closeNav() {
   document.getElementById("myTopnav").style.height = "0";
   document.getElementById('closebtn').style.visibility = "hidden";
}
function searchForm() {
   document.getElementById("searchForm").submit();
}
document.getElementById('closebtn').style.visibility = "hidden";

function displaySearchbtn() {
   document.getElementById('closebtn').style.visibility = "visible";
}
function openSidebar() {
   document.getElementById("sidenav").style.display = "block";
}