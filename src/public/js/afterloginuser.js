$(function () {
   jQuery('#owl-carousel').owlCarousel({
     loop: true,
     margin: 0,
     responsiveClass: true,
     responsive: {
       0: {
         items: 1,
         nav: true
       },
       600: {
         items: 2,
         nav: false
       },
       1000: {
         items: 3,
         nav: true,
         loop: false,

       }
     }
   })

   jQuery('#owl-carousel1').owlCarousel({
     loop: true,
     margin: 0,
     responsiveClass: true,
     responsive: {
       0: {
         items: 1,
         nav: true
       },
       600: {
         items: 2,
         nav: false
       },
       1000: {
         items: 3,
         nav: true,
         loop: false,

       }
     }
   })

   jQuery('#owl-carousel0').owlCarousel({
     loop: true,
     margin: 0,
     responsiveClass: true,
     responsive: {
       0: {
         items: 1,
         nav: true
       },
       600: {
         items: 2,
         nav: false
       },
       1000: {
         items: 3,
         nav: true,
         loop: false,

       }
     }
   })
   $('.top-div').click(function(){
     var url = $(this).attr('url');
     console.log(url);
     window.open(url);
   })
 })