$(function () {
    var $envSlick = $('.envSlick')

    function slickInit() {
        $envSlick.slick({
            infinite: true,
            autoplay: true,
            arrows: false
        })

        $('.prevSlick').on('click',function(){
            $envSlick.slick('slickPrev')
        })

        $('.nextSlick').on('click',function(){
            $envSlick.slick('slickNext')
        })
    }

    slickInit()

})