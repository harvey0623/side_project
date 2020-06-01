/*  =====================  init  ========================  */

$(document).ready(function() {

    prodSlick();

	$(".sort-region .labelBox").click(function(event) {
		addActive(".sort-region .labelBox",this);
	});

    $(".select-style").select2({}); //select啟動
    
});


/*  =================  function  ================  */

function prodSlick() {
    // 商品大圖 =======================

    $(".slider-nav").on('init', function() {onResize();})

    $('.slider-for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3500,
        arrows: false,
        fade: true,
        asNavFor: '.slider-nav'
    });

    $('.slider-nav').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: '.slider-for',
        autoplay: true,
        autoplaySpeed: 3500,
        arrows: false,
        dots: true,
        centerMode: true,
        focusOnSelect: true,
        dots: 0,
        customPaging: false,
        initialSlide:1,
    });

    // 別人也買過 =======================

    $('.prodSlider').slick({
        slidesToShow: 4,
        slidesToScroll: 4,
        autoplay: true,
        arrows: true,
        autoplaySpeed: 9000,
        dots: false
    });
}