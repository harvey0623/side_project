$(function () {
    adjTitle()

    $(".fa-angle-down").on("click", function () {
        var $this = $(this)
        var $block = $this.parents(".block")
        var $li = $this.parents("li")

        if (!$this.hasClass("rotate")) {
            $this.addClass("rotate")
            $block.next("p").show()
        } else {
            $this.removeClass("rotate")
            $block.next("p").hide()
        }

        $li.siblings().find(".fa-angle-down").removeClass("rotate")
        $li.siblings().children("p").hide()

    })

    //調整title
    function adjTitle() {
        if ($(window).width() < 380 && ($('.maginify').css("display") == "block" || $('.totalMail').css('display') == 'block')) {
            $(".pageTitle").css("transform", "translate(-20%)")
        }

        if ($(window).width() < 380 && ($('.maginify').css("display") == "block" && $('.totalMail').css('display') == 'block')) {
            $(".pageTitle").css("transform", "translate(-40%)")
        }
    }

})