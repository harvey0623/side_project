$(document).ready(function() {

    settingSlick();

});



/*  =================  function  ================  */

function settingSlick() {

    // 大圖輪播 ==============================
    $('.sliderNum-1').slick({

        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: false,
        /*高度適應*/
        autoplay: true,
        /*自動播放*/
        arrows: true,
        /*箭頭*/
        autoplaySpeed: 4000,
        /*播放速度*/
        dots: false,
        /*導航圈*/
        centerMode: false,
        /*置中功能*/
        infinite: true,
        /*是否重複輪播*/
        initialSlide: 1,
        /*設定從哪一張圖片開始輪播(index值)*/
        fade: false,
        /*是否淡入淡出*/
        draggable: true,
    });

    // banner slick ==============================
    $('.bannerNum-1').slick({

        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: false,
        /*高度適應*/
        autoplay: false,
        /*自動播放*/
        arrows: true,
        /*箭頭*/
        autoplaySpeed: 4000,
        /*播放速度*/
        dots: false,
        /*導航圈*/
        centerMode: false,
        /*置中功能*/
        infinite: true,
        /*是否重複輪播*/
        initialSlide: 0,
        /*設定從哪一張圖片開始輪播(index值)*/
        fade: false,
        /*是否淡入淡出*/
        draggable: true,
    });
}
