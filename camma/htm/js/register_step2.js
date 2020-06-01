/*  =====================  init  ========================  */

$(document).ready(function() {

	// iCheck
    $('input').iCheck({
        checkboxClass: 'icheckbox_minimal',
        radioClass: 'iradio_minimal',
        increaseArea: '20%' // optional
    });

    // 地址外掛
    $('#twzipcode').twzipcode();

});