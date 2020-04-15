$(function () {
    var option = {
        totalPages: 7,
        maxButtonsVisible: 4,
        currentPage: 1,
        nextLabel:"＞",
        prevLabel: "＜",
        clickCurrentPage: true,
        pageChange: function (page) {
            // $("#fullimage").remove()

            // var html=""

            // html+="<p>這邊一行三十級字可以十五個字</p>"
            // html+="<p>這邊一行三十級字可以十五個字</p>"
            // html+="<div class=\"imgBox\">"
            // html+="<figure>"
            // html+="<img src=\"./img/paper.jpg\">"
            // html+="</figure>"
            // html+="<div>"

            // $(".box").html(html)
            // $(".imgBox").flexgal()

        }
    }

    var pag1 = $('.mypag1').simplePaginator(option)
    var pag2 = $('.mypag2').simplePaginator(option)
    var pag3 = $('.mypag3').simplePaginator(option)
    var pag4 = $('.mypag4').simplePaginator(option)
    var pag5 = $('.mypag5').simplePaginator(option)
    var pag6 = $('.mypag6').simplePaginator(option)

})