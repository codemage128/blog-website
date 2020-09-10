
class MyTool {
   constructor({ data, api }) {
      this.api = api;
   }
   openToolbar() {
      this.api.toolbar.open();
   }
   closeToolbar() {
      this.api.toolbar.close();

      // then do something else
   }
}

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
      /**
       * Or pass class directly without any configuration
       */
      image: {
         class: ImageTool,
         config: {
            buttonContent: "Upload the files from the upsplash.com",
            byUrl: 'https://unsplash.com/', // Your endpoint that provides uploading by Url
            
         },
      },
      // This is the simple image upload. Drag, Drop enable for the user from the local device and copy the image file from the clould.
      // image: SimpleImage,
      embed: {
         class: Embed,
         inlineToolbar: true
      },
      list: {
         class: List,
         inlineToolbar: true,
         shortcut: 'CMD+SHIFT+L'
      },
      checklist: {
         class: Checklist,
         inlineToolbar: true,
      },

      quote: {
         class: Quote,
         inlineToolbar: true,
         config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: 'Quote\'s author',
         },
         shortcut: 'CMD+SHIFT+O'
      },

      warning: Warning,

      marker: {
         class: Marker,
         shortcut: 'CMD+SHIFT+M'
      },

      code: {
         class: CodeTool,
         shortcut: 'CMD+SHIFT+C'
      },

      delimiter: Delimiter,

      inlineCode: {
         class: InlineCode,
         shortcut: 'CMD+SHIFT+C'
      },

      linkTool: LinkTool,
      paragraph: {
         class: Paragraph,
         inlineToolbar: true,
      },
      table: {
         class: Table,
         inlineToolbar: true,
         shortcut: 'CMD+ALT+T'
      },
   },
   //data
   data: {
      blocks: [
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
   },
   onChange: function () {
      console.log('something changed');
   }
});
$('#publish').click(function () {
   editor.save().then((savedData) => {
      console.log(savedData);
   });
})




$('#darkmode').click(function () {
   if ($(this).prop('checked') == true) {
      //dark node
      $('#header-logo-image').attr('src', '/images/GOLDEN-PNG1.png');
      $('#header').removeClass('white').addClass('elegant-color-dark');
      $('#category').addClass('grey darken-3 text-white');
      $('.custom-control-label').addClass('text-white');
      $('#publish').removeClass('btn-outline-dark').addClass('grey lighten-1');
      $('body').addClass('black-body');
   } else {
      //white mode
      $('#header-logo-image').attr('src', '/images/GOLDEN-PNG.png');
      $('#header').removeClass('elegant-color-dark').addClass('white');
      $('#category').removeClass('grey darken-3 text-white');
      $('.custom-control-label').removeClass('text-white');
      $('#publish').removeClass('grey lighten-1').addClass('btn-outline-dark');
      $('body').removeClass('black-body');
   }
});