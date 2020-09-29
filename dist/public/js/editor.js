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
      },
      image: SimpleImage,
      embed: {
         class: Embed,
         inlineToolbar: true
      },
      list: {
         class: List,
         inlineToolbar: true,
      },
      // checklist: {
      //    class: Checklist,
      //    inlineToolbar: true,
      // },

      quote: {
         class: Quote,
         inlineToolbar: true,
         config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: 'Quote\'s author',
         },
      },

      // warning: Warning,

      marker: {
         class: Marker,
      },

      code: {
         class: CodeTool,
      },

      delimiter: Delimiter,

      inlineCode: {
         class: InlineCode,
      },
      // linkTool: LinkTool,
      paragraph: {
         class: Paragraph,
         inlineToolbar: true,
      },
      table: {
         class: Table,
         inlineToolbar: true,
      },
   },
   i18n: {
      /**
       * @type {I18nDictionary}
       */
      messages: {
         /**
          * Other below: translation of different UI components of the editor.js core
          */
         ui: {
            "blockTunes": {
               "toggler": {
                  "Click to tune": "Bearbeiten",
                  "or drag to move": "Drag to Move"
               },
            },
            "inlineToolbar": {
               "converter": {
                  "Convert to": "Umwandeln"
               }
            },
            "toolbar": {
               "toolbox": {
                  "Add": "Hinzufügen"
               }
            }
         },
         /**
          * Section for translation Tool Names: both block and inline tools
          */
         toolNames: {
            "Text": "Text",
            "Heading": "Titel",
            "List": "Liste",
            "Warning": "Warnung",
            "Checklist": "Checkliste",
            "Quote": "Zitat",
            "Code": "Code",
            "Delimiter": "Abstand",
            "Raw HTML": "HTML Code",
            "Table": "Tabelle",
            "Link": "Link",
            "Marker": "Marker",
            "Bold": "Fett",
            "Italic": "Kursive",
            "InlineCode": "Code einbetten",
         },
         /**
          * Section for passing translations to the external tools classes
          */
         tools: {
            /**
             * Each subsection is the i18n dictionary that will be passed to the corresponded plugin
             * The name of a plugin should be equal the name you specify in the 'tool' section for that plugin
             */
            "warning": { // <-- 'Warning' tool will accept this dictionary section
               "Title": "Titel",
               "Message": "Message",
            },

            /**
             * Link is the internal Inline Tool
             */
            "link": {
               "Add a link": "Link"
            },
            /**
             * The "stub" is an internal block tool, used to fit blocks that does not have the corresponded plugin
             */
            "stub": {
               'The block can not be displayed correctly.': 'Dieser Block kann nicht angezeigt werden'
            }
         },

         /**
          * Section allows to translate Block Tunes
          */
         blockTunes: {
            /**
             * Each subsection is the i18n dictionary that will be passed to the corresponded Block Tune plugin
             * The name of a plugin should be equal the name you specify in the 'tunes' section for that plugin
             *
             * Also, there are few internal block tunes: "delete", "moveUp" and "moveDown"
             */
            "delete": {
               "Delete": "Löschen"
            },
            "moveUp": {
               "Move up": "Hoch"
            },
            "moveDown": {
               "Move down": "Runter"
            }
         },
      },
   },
   //data
   data: {
      blocks: [
         // {
         //    type: "header",
         //    data: {
         //       level: 1
         //    }
         // }
         {
            type: "header",
            data: {
               text: "🖐Erzähle eine Geschichte!",
               level: 1,
            }
         },
         {
            type: 'paragraph',
            data: {
               text: 'Strukturiere deinen Beitrag so, damit er für den Leser leicht verständlich ist. Verwende Fotos 🤑, Emojis 😍 und Gifs um den Lesern ein emotionsgeladenes und abwechslungsreiches Leseerlebnis zu bescheren. Im Menü findest du zahlreiche Features um die Größe der Schrift anzupassen und sie kursiv, fett oder unterstrichen zu gestalten. Darüber hinaus kannst du an geeigneten Stellen ausgehende Verlinkungen 🍽 hinzufügen. Ausgehende Links verbessern das Leseerlebnis und somit auch die Reichweite deines Beitrags. Lege gleich los! 😗',
            }
         },
      ]
   },
   onReady: function () {
      var wordCount = $('#editor').text().trim().replace(/[\s]+/g, " ").split(" ").length;
      console.log($('#editor').text());
      $('#wordCount').text("Wortanzahl:" + wordCount);
   },
   onChange: function () {
      var wordCount = $('#editor').text().trim().replace(/[\s]+/g, " ").split(" ").length;
      console.log($('#editor').text());
      $('#wordCount').text("Wortanzahl:" + wordCount);
   }
});
$('#publish').click(function () {
   editor.save().then((savedData) => {
      var data = JSON.stringify(savedData);
      // this is the sending data to the backend part.
      var category = $('#category').val();
      if (category == "none") {
         $('#post-err').modal({});
      } else {
         $('#data').val(data);
         $('#post-summary').modal({});
      }
   });
})
$('#publish-submit').click(function () {
   var words = $('#summary_modal').val().match(/\S+/g).length;

   if (words < 5) {
      $('.summary-error').show();
   } else {
      $('#summary').val($('#summary_modal').val());
      $('#article').submit();
   }
})

$("#summary_modal").on('keyup', function () {
   $('.summary-error').hide();
   var words = this.value.match(/\S+/g).length;

   if (words > 5) {
      //   // Split the string on first 200 words and rejoin on spaces
      //   var trimmed = $(this).val().split(/\s+/, 200).join(" ");
      //   // Add a space at the end to make sure more typing creates new words
      //   $(this).val(trimmed + " ");
      $('#word_left').hide();
   }
   else {
      $('#word_left').show();
      $('#summary_modal').text(words);
      $('#word_left').text(5 - words);
   }
});

$('#image-section').scroll(function (event) {
   var scrollTop = $('#image-section').scrollTop();
   var TotalHeight = $('#image-section').prop("scrollHeight");
   var scrollPercentage = ((scrollTop + $('#image-section').height()) / TotalHeight);
   if (scrollPercentage > 0.9) {
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

$('#searchImageKey').on("keypress", function(e){
   if(e.which == 13){
      $('#searchImage').click();
   }
})

$('#searchImage').click(function (e) {
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
var postenable = "<%= user.postenable%>";
if (!postenable) {
   $('#post-enable').modal({ backdrop: 'static', keyboard: false });
} else {
   $('#post-policy').modal({});
}
$('#darkmode').click(function () {
   if ($(this).prop('checked') == true) {
      //dark node
      $('#header-logo-image').attr('src', '/images/GOLDEN-PNG1.png');
      $('.custom-control-label').addClass('text-white');
      $('#publish').removeClass('btn-outline-dark').addClass('grey lighten-1');
      $('body').addClass('black-body');
      $('.sidenav').css('background-color', '#232323');
      $('.ce-conversion-tool').css('color', 'black');
   } else {
      //white mode
      $('#header-logo-image').attr('src', '/images/GOLDEN-PNG.png');
      $('.custom-control-label').removeClass('text-white');
      $('#publish').removeClass('grey lighten-1').addClass('btn-outline-dark');
      $('body').removeClass('black-body');
      $('.sidenav').css('background-color', '#fff');
   }
});
$('[data-toggle="tooltip"]').tooltip()
$('#slider').click(function () {
   $('.sidenav').toggle();
   if ($('.sidenav').css('display') == "none") {
      $('.editor-container').removeClass('col-lg-10').addClass('col-lg-12');
      $(this).css('right', '-2vw');
   } else {
      $('.editor-container').removeClass('col-lg-12').addClass('col-lg-10');
      $(this).css('right', '17.5vw');
   }
});
function uploadImages() {
   $('.upload-file').click();
}
$('.upload-file').on('change', function (event) {
   var file = $(this).prop('files');
   var reader = new FileReader();
   reader.readAsBinaryString(file[0]);
   var base64 = "";

   reader.onload = function () {
      base64 = btoa(reader.result);
      base64 = 'data:application/octet-stream;base64,' + base64;
      $('#imgBox').attr("src", base64);
      $('#article_header').val(base64);
   }
   reader.onerror = function () {
      console.log("there are some problems.")
   }
})

$('#save').click(function(){
   editor.save().then((savedData) => {
      var data = JSON.stringify(savedData);
      // this is the sending data to the backend part.
      var category = $('#category').val();
      if (category == "none") {
         $('#post-err').modal({});
      } else {
         $('#data').val(data);
         $('#saveflag').val(true);
         $('#article').submit();
      }
   });
})