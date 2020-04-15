$(function () {
    $('[type=date]').on('change', age)
    $('.clearData').on('click', reset)


    //算年齡
    function age() {
        var nowYear = new Date().getFullYear()
        var birthYear = $(this).val().substr(0, 4)
        $('[name=age]').val(nowYear - birthYear)
    }

    //重新設定
    function reset() {
        $('input').val("")
        $('select').each(function () {
            $(this).children('option').eq(0).prop('selected', true)
        })
        $('[type=checkbox]').prop('checked', false)
    }

})