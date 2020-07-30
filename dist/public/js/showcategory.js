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
                  '<div class="onboarding-content-bgimg11"' +
                  'categorySlug="' + slug + '"' +
                  'categoryId="' + id + '"' +
                  'style="background-image:linear-gradient(#0000003d, #00000040),url(' + "'" + image + "'" + ');">' +
                  '<div class="onboarding-content-text">' +
                  '<h4 style="color: #fff;">' + name + '</h4>' +
                  '<p style=" color: #fff;">' + description + '</p>' +
                  '</div>' +
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
         var url = $(this).attr('categorySlug');
         url = "/kategorie/" + url;
         window.open(url);
      })
   }
   $('#saveCategory').click(function () {
      $('#categoryList').val(selectCategory);
   })
});