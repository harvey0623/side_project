$('.slickTop').slick({
   slidesToShow: 1,
   slidesToScroll: 1,
   arrows: false,
   fade: true,
   asNavFor: '.slick-nav'
});

$('.slick-nav').slick({
   slidesToShow: 3,
   slidesToScroll: 1,
   asNavFor: '.slickTop',
   centerMode: true,
   focusOnSelect: true,
   centerPadding: '15px',
   infinite: true
});

if ($('.recommend-slick').children('div').length <= 4) {
   $('.arrowL').hide();
   $('.arrowR').hide();
}

$('.recommend-slick').slick({
   infinite: true,
   slidesToShow: 4,
   slidesToScroll: 1,
   infinite: false
});

$('.arrowR').on('click', function() {
   $('.recommend-slick').slick('slickNext');
});

$('.arrowL').on('click', function() {
   $('.recommend-slick').slick('slickPrev');
});
