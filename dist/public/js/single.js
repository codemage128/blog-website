
$(function () {
   setTimeout(function () {
      $('.loader').css('display', 'none');
      $('#loader').css('display', 'none');
   }, 1000);
   // $('.loader').css('display', 'none');
   // $('#loader').css('display', 'none');

   // var article_body = JSON.parse($('#article_body').val());
   // var idList = [];

   // var body_content_element = "";
   // article_body.forEach((element, index) => {
   //    var _template = "";
   //    switch (element.type) {
   //       case "header":
   //          if (element.data.level != 1) {
   //             idList.push(index);
   //             _template = '<h' + element.data.level + ' id="' + index + '">' + element.data.text + '</h' + element.data.level + '>';
   //          }
   //          break;
   //       case "paragraph":
   //          _template = '<p>' + element.data.text + '</p>';
   //          break;
   //       case "image":
   //          _template = '<img src=' + element.data.url + ' alt=' + element.data.caption + '/>';
   //          break;
   //       case "code":
   //          var code = element.data.code;
   //          code = code.replace(/</g, "&lt;");
   //          code = code.replace(/>/g, "&gt;");
   //          console.log(code)
   //          _template = '<pre>' + code + '</pre>';
   //          break;
   //       case "embed":
   //          _template = '<div class="text-center" style="margin-top:10px;"><iframe src="' + element.data.embed + '" width="' + element.data.width + '" height="' + element.data.height + '" frameborder="0" allowfullscreen></iframe></div>';
   //          break;
   //       case "table":
   //          var content = element.data.content;
   //          _template = '<table class="table table-bordered table-hover" style="width:85%;margin: auto;margin-bottom: 10px;">';
   //          content.forEach((element, index) => {
   //             var length = element.length;
   //             var tr_template = "<tr class='text-center'>";
   //             for (var i = 0; i < length; i++) {
   //                var td_template = '<td>';
   //                td_template = td_template + element[i] + '</td>';
   //                tr_template += td_template;
   //             }
   //             tr_template += '</tr>';
   //             _template += tr_template;
   //          });
   //          _template = _template + "</table>";
   //          break;
   //       case "quote":
   //          _template = '<blockquote><p class="quotation-mark">“' + element.data.text + '“</p><h3 class="text-right">--- ' + element.data.caption + ' ---</h3></blockquote>'
   //          break;
   //       case "list":
   //          var type = element.data.style.charAt(0);
   //          _template = '<div><' + type + 'l>';
   //          element.data.items.forEach(item => {
   //             _template += '<li>' + item + '</li>';
   //          })
   //          _template += '</' + type + 'l></div>';
   //          break;
   //    }
   //    body_content_element = body_content_element + _template;
   // });
   // $('#inner-dark-blog-content-one').append(body_content_element);

   // var table_content_element = '<ol class="table-content"><h2>Inhalt</h2>';
   // var table_element = [];
   // article_body.forEach(element => {
   //    if (element.type == "header") {
   //       if (element.data.level != 1) {
   //          table_element.push(element);
   //       }
   //    }
   // });
   
   // var _string = "";
   // table_element.forEach((item, index) => {
   //    var template = '<li><a href="#' + idList[index] + '">' + item.data.text + '</a></li>';
   //    _string = _string + template;
   // });
   // table_content_element = table_content_element + _string + '</ol>';
   // $('#inner-dark-blog-content-one').prepend(table_content_element);
   // $('.table-of-contents').append(table_content_element);
   // init();
})


// function init() {

var body = document.body;
var articleheight = $('#inner-dark-blog-content-one').height();
console.log(articleheight);
var percent = 0;
var totalheight = $('.dark-blog-banner').height() + articleheight;
window.addEventListener('scroll', function () {
   var y = window.scrollY;
   if (y < $('.dark-blog-banner').height()) {
      percent = 0;
   } else if (y > totalheight) {
      percent = 100;
   } else {
      percent = (y - $('.dark-blog-banner').height()) / (articleheight) * 100;
   }
   $('#processbar').css('width', Math.floor(percent) + "%");
});
$('#darkmode').removeAttr('checked');
$('#darkmode').click(function () {
   if (this.checked) {
      document.body.style.background = 'black';
      $('#header-logo-image').attr('src', '/images/GOLDEN-PNG1.png');
      $('.inner-dark-blog-content-one').css('color', 'white');
      $('.inner-dark-blog-makeby').css('color', 'white');
      $('.recommended-for-you').css('color', 'white');
      $('.recommended-for-you').css('background', 'black');
      $('.recommended-txt').css('color', 'white');
      $('#footer').css('background', '#0a0a0a');
      $('#header').css('background', 'black');
      $('#firstChar').css('color', 'white');
      $('.searchbar').css('color', 'white');
      $('.dropdown a').css('color', 'white');
      $('.dropdown a:focus, .dropdown a:hover').css('color', 'white');
      $('.username_span').css('color', 'white');
      $('.dropdown-menu').css('background', 'black');
      $('.sidenav').css('background-color', '#1d1d1b');
      $('#authorname').css("color", "white");
      $('.inner-dark-blog-content-one p a').attr("style", "color: white !important");
   } else {
      document.body.style.background = 'white';
      $('#header-logo-image').attr('src', '/images/GOLDEN-PNG.png');
      $('.inner-dark-blog-content-one').css('color', 'black');
      $('.inner-dark-blog-makeby').css('color', 'black');
      $('.recommended-for-you').css('color', 'black');
      $('.recommended-for-you').css('background', 'white');
      $('.recommended-txt').css('color', 'black');
      $('#footer').css('background', '#f4f4f4');
      $('#header').css('background', 'white');
      $('#firstChar').css('color', 'black');
      $('.searchbar').css('color', 'rgb(29, 29, 27)');
      $('.dropdown a').css('color', 'black');
      $('.dropdown a:focus, .dropdown a:hover').css('color', 'black');
      $('.username_span').css('color', 'black');
      $('.dropdown-menu').css('background', 'white');
      $('.sidenav').css('background-color', 'black');
      $('#authorname').css("color", "black");
   }
});
// }
// var firstchild = $('.inner-dark-blog-content-one').children(":first");
// var clildstring = firstchild[0].innerText;
// var firstlettercolor = $('#firstlettercolor').val();
// $("#processbar").css('background-color', firstlettercolor);
// var newstring = "<span id='firstChar' style='color:" + firstlettercolor + "; font-size:80px;'>" + clildstring.charAt(0) + "</span>" + clildstring.substr(1, clildstring.length);;
// firstchild[0].innerHTML = newstring;
function upvote() {
   var articleId = $('#articleId').val();
   var uId = $('#userId').val();
   $.ajax({
      url: "/article/upvote-ajax",
      type: 'post',
      dataType: 'json',
      data: { articleId: articleId, userId: uId },
      success: function (data) {
         $('#upvoteCount').text(data.upvotecount);
      }
   });
}

$(document).on('mousedown', '.mobile-upvote', function () {
   console.log("this is mobile click function!");
   upvote();
});

$(window).scroll(function () {
   if ($(this).scrollTop() >= 0) {        // If page is scrolled more than 50px
      $('#return-to-top').fadeIn(200);    // Fade in the arrow
   } else {
      $('#return-to-top').fadeOut(200);   // Else fade out the arrow
   }
});
$('.cancelNav').click(function () {
   $('.sidenav').css('display', 'none');
});
function getmonth(data) {
   switch (data) {
      case 0:
         return 'Jan';
         break;
      case 1:
         return 'Feb';
         break;
      case 2:
         return 'March';
         break;
      case 3:
         return 'Apr';
         break;
      case 4:
         return 'May';
         break;
      case 5:
         return 'Jun';
         break;
      case 6:
         return 'Jul';
         break;
      case 7:
         return 'Aug';
         break;
      case 8:
         return 'Sep';
         break;
      case 9:
         return 'Oct';
         break;
      case 10:
         return 'Nov';
         break;
      case 11:
         return 'Dec';
         break;
      default: break;
   }
};
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

var username = $('#username').val();
var useremail = $('#useremail').val();
var userpicture = $('#userpicture').val();
var articleID = $('#articleId').val();

$('.replyBtn').click(function () {
   var id = $(this).attr('data');
   var replyId = "#replyForm" + id;
   $(replyId).submit();
})

$('.reply').click(function () {
   var id = $(this).attr('data');
   var replyId = "#" + id;
   $(replyId).toggle();
})

$('.delete').click(function(){
   var id = $(this).attr('data');

   $.ajax({
      url: '/delete',
      type: 'post',
      data: {commentId: id},
      success: function(data){
         location.reload();
      }
   });
})

$('.upvoteBtn').click(function () {
   var id = $(this).attr('data');
   var countTxt = "#count" + id;
   $.ajax({
      url: "/comment/upvote",
      type: 'post',
      data: { commentId: id },
      success: function (data) {
         $(countTxt).text(data);
      }
   });
})