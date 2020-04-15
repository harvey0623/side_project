$(function () {
    //顯示modal
    $('.personList').on('click', 'li', function () {
        $("#myModal").modal("show")
    })

    //隱藏modal
    $('.mysure').on('click', function () {
        $("#myModal").modal("hide");
    })
})