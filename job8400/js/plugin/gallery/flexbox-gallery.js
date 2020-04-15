(function($) {
  $.fn.flexgal = function(){
    $('body').prepend('<div id="fullimage" style="display: none"></div>')
    $(this).addClass('flex-gallery');
    $('img', this).parent().addClass('image-rate');

   $('.image-rate').click(function() {
     $('img', this).clone().prependTo('#fullimage');
     $( "#fullimage" ).fadeIn(350);
   });

   $('#fullimage').click(function() {
     $(this).fadeOut( 350, function() {
       $('img',this).remove();
     });
   });
 }
}(jQuery));
