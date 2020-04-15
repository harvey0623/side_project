$(function () {
    $('filterMenu').children('li').on('click', filter)
    $('#all').on('change', selectAll)
    $('.filterMenu a').on('click', cancelSelect)


    //篩選
    function filter() {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active')
        } else {
            $(this).addClass('active')
        }
    }

    //全選
    function selectAll() {
        if ($(this).prop('checked')) {
            $('.tab-content>div').each(function () {
                if ($(this).css('display') == 'block') {
                    $(this).find('[type=checkbox]').prop('checked', true)
                }
            })
        } else {
            $('.tab-content>div').each(function () {
                if ($(this).css('display') == 'block') {
                    $(this).find('[type=checkbox]').prop('checked', false)
                }
            })
        }
    }

    //換tab取消全選
    function cancelSelect() {
        $('#all').prop('checked', false)
        $('.tab-content>div').find('[type=checkbox]').prop('checked', false)
    }

})