/*  =====================  init  ========================  */

$(document).ready(function() {

	// iCheck
    $('input').iCheck({
        checkboxClass: 'icheckbox_minimal',
        radioClass: 'iradio_minimal',
        increaseArea: '20%' // optional
    });

    // 日曆
    $(".dateBox").flatpickr({});

    $(".select-style").select2({}); //select啟動
    
});