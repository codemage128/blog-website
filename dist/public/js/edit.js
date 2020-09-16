var article_content = JSON.parse($('#article_content').val());
var article_summary = $('#article_summary').val();
$('#article_content').hide();
$('#article_summary').hide();
$('#article_category_id').hide();

$('#summary_modal').val(article_summary);
$('#category').val($('#article_category_id').val());

var editor = new EditorJS({
   holder: 'editor',
   tools: {
      header: {
         class: Header,
         inlineToolbar: ['link'],
         config: {
            placeholder: 'Type the Article title',
            levels: [1, 2, 3],
            defaultLevel: 2
         },
         shortcut: 'CMD+SHIFT+H'
      },
      image: SimpleImage,
      embed: {
         class: Embed,
         inlineToolbar: true
      },
      list: {
         class: List,
         inlineToolbar: true,
         shortcut: 'CMD+SHIFT+L'
      },
      // checklist: {
      //    class: Checklist,
      //    inlineToolbar: true,
      // },

      // quote: {
      //    class: Quote,
      //    inlineToolbar: true,
      //    config: {
      //       quotePlaceholder: 'Enter a quote',
      //       captionPlaceholder: 'Quote\'s author',
      //    },
      //    shortcut: 'CMD+SHIFT+O'
      // },

      // warning: Warning,

      // marker: {
      //    class: Marker,
      //    shortcut: 'CMD+SHIFT+M'
      // },

      // code: {
      //    class: CodeTool,
      //    shortcut: 'CMD+SHIFT+C'
      // },

      delimiter: Delimiter,

      // inlineCode: {
      //    class: InlineCode,
      //    // shortcut: 'CMD+SHIFT+C'
      // },

      // linkTool: LinkTool,
      paragraph: {
         class: Paragraph,
         inlineToolbar: true,
      },
      // table: {
      //    class: Table,
      //    inlineToolbar: true,
      //    shortcut: 'CMD+ALT+T'
      // },
   },
   //data
   data: {
      blocks: article_content
   },
   onReady: function () {
   },
   onChange: function () {

   }
});

$('#publish').click(function () {
   editor.save().then((savedData) => {
      var data = JSON.stringify(savedData);
      console.log(savedData);
      // this is the sending data to the backend part.
      var category = $('#category').val();
      if (category == "none") {
         console.log(category);
         $('#post-err').modal({});
      } else {
         $('#data').val(data);
         $('#post-summary').modal({});
      }
   });
})
$('#publish-submit').click(function () {
   var words = $('#summary_modal').val().match(/\S+/g).length;
   // if (words < 30) {
   //    $('.summary-error').show();
   // } else {
   //    $('#summary').val($('#summary_modal').val());
   //    $('#article').submit();
   // }
   $('#summary').val($('#summary_modal').val());
   $('#article').submit();
})

$("#summary_modal").on('keyup', function () {
   $('.summary-error').hide();
   var words = this.value.match(/\S+/g).length;

   if (words > 30) {
      //   // Split the string on first 200 words and rejoin on spaces
      //   var trimmed = $(this).val().split(/\s+/, 200).join(" ");
      //   // Add a space at the end to make sure more typing creates new words
      //   $(this).val(trimmed + " ");
      $('#word_left').hide();
   }
   else {
      $('#word_left').show();
      $('#summary_modal').text(words);
      $('#word_left').text(30 - words);
   }
});

$('#image-section').scroll(function (event) {
   // console.log('this is the scroll section');
   // console.log(event.target.offsetHeight );
   var scrollTop = $('#image-section').scrollTop();
   var TotalHeight = $('#image-section').prop("scrollHeight");
   var scrollPercentage = ((scrollTop + $('#image-section').height()) / TotalHeight);

   if (scrollPercentage > 0.99) {
      // Load content
      var searchKey = $('#searchImageKey').val();
      var page = $('#page').val();
      $.ajax({
         url: "/unsplash-search",
         type: "POST",
         dataType: 'json',
         data: { searchKey: searchKey, page: page },
         success: function (data) {
            var template = '';
            $('#page').val(data.page);
            for (var i = 0; i < data.data.results.length; i++) {
               var src = data.data.results[i].urls.regular;
               var _template = '<div class="col-lg-12 p-1">' +
                  '<img src="' + src + '"' +
                  'alt="Card image cap" style="width: 100%">' +
                  '</div>';
               template += _template;
            }
            $('#image-section').append(template);

            var $grid = $('.grid').masonry({
               itemSelector: '.grid-item',
               percentPosition: true,
               columnWidth: '.grid-sizer'
            })
            // $grid.imagesLoaded().progress(function () {
            //    $grid.masonry();
            // });
            $grid.imagesLoaded(function () {
               $grid.masonry();
            })
         }
      });
   }
})

$('#searchImage').click(function () {
   var searchKey = $('#searchImageKey').val();
   $('#image-section').empty();
   var page = 0;
   $.ajax({
      url: "/unsplash-search",
      type: "POST",
      dataType: 'json',
      data: { searchKey: searchKey, page: page },
      success: function (data) {
         $('#page').val(data.page);
         // var template = '<div class="grid-sizer"></div>';
         var template = '';
         for (var i = 0; i < data.data.results.length; i++) {
            var src = data.data.results[i].urls.regular;
            var _template = '<div class="col-lg-12 p-1">' +
               '<img src="' + src + '"' +
               'alt="Card image cap" style="width: 100%;">' +
               '</div>';
            template += _template;
         }
         $('#image-section').append(template);

         var $grid = $('.grid').masonry({
            itemSelector: '.grid-item',
            percentPosition: true,
            columnWidth: '.grid-sizer'
         })
         // $grid.imagesLoaded().progress(function () {
         //    $grid.masonry();
         // });
         $grid.imagesLoaded(function () {
            $grid.masonry();
         })
      }
   })
});

// $('#emojionearea').emojioneArea({
//    pickerPosition: "bottom"
// });
// var postenable = "<%= user.postenable%>";
// if (!postenable) {
//    $('#post-enable').modal({ backdrop: 'static', keyboard: false });
// } else {
//    $('#post-policy').modal({});
// }
$('#darkmode').click(function () {
   if ($(this).prop('checked') == true) {
      //dark node
      $('#header-logo-image').attr('src', '/images/GOLDEN-PNG1.png');
      $('.custom-control-label').addClass('text-white');
      $('#publish').removeClass('btn-outline-dark').addClass('grey lighten-1');
      $('body').addClass('black-body');
   } else {
      //white mode
      $('#header-logo-image').attr('src', '/images/GOLDEN-PNG.png');
      $('.custom-control-label').removeClass('text-white');
      $('#publish').removeClass('grey lighten-1').addClass('btn-outline-dark');
      $('body').removeClass('black-body');
   }
});