$(function () {
   init();
   var showCnt = 0;
   $('.show-more-text').click(function () {
      $('.show-more').css('display', 'block');
      $('show-more-text').css('display', 'none');
      // $('next-btn').css('display', 'block');
      showCnt = showCnt + 20;
      $.ajax({
         url: '/category/show-more',
         type: 'post',
         data: { categoryCount: showCnt },
         dataType: 'json',
         success: function (data) {
            var length = data.length;
            for (var i = 0; i < length; i++) {
               var image = data[i].background;
               var name = data[i].name;
               var description = data[i].description;
               var slug = data[i].slug;
               var id = data[i]._id;
               var template = '<div class="col-md-3 col-lg-3 col-sm-3">' +
                  '<div class="over-hideen">' +
                  '<div class="onboarding-content-bgimg11" categorySelected="false"' +
                  'categorySlug="' + slug + '"' +
                  'categoryId="' + id + '"' +
                  'style="background-image:linear-gradient(#0000003d, #00000040),url(' +  "'" + image + "'" + ');">' +
                  '<div class="onboarding-content-text">' +
                  '<h4 style="color: #fff;">' + name + '</h4>' +
                  '<p style=" color: #fff;">' + description + '</p>' +
                  '</div>' +
                  '<i class="fa fa-check-circle category-check category-check' + id + '"></i>' +
                  '</div>' +
                  '</div>' +
                  '</div>';
               $('.category-content').append(template);
            }
            // $('.fa-check-circle').hide();
         }
      });
   });
   
   var categoryCountLimit = $('#categoryCount').val();
   var selectCount = 0;
   var selectCategory = [];
   // $('.fa-check-circle').hide();
   function init() {
      $(document).on('click', '.onboarding-content-bgimg11', function (event) {
         event.preventDefault();
         var categoryId = $(this).attr('categoryId');
         var categorySlug = $(this).attr('categorySlug');
         var selected = $(this).attr('categorySelected');
         var categoryck = ".category-check" + categoryId;
         if (selected == 'false') {
            if (selectCount < categoryCountLimit) {
               selectCount++;
               selectCategory.push(categorySlug);
               $(this).attr('categorySelected', 'true');
               $(this).css('box-shadow', 'inset 0 0 0 2000px #98E0F2b3');
            } else {
               $(this).css('box-shadow', '');
            }
         } else if (selected == 'true') {
            if (selectCount <= categoryCountLimit) {
               selectCount--;
               var result = selectCategory.filter(function (elem) {
                  return elem != categorySlug;
               });
               selectCategory = result;
               $(this).attr('categorySelected', 'false');
               $(this).css('box-shadow', '');
            } else {
               $(this).css('box-shadow', '');
            }
         }
      })
   }
   $('#saveCategory').click(function(){
      $('#categoryList').val(selectCategory);
   })

});