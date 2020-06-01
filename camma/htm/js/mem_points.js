/*  =====================  init  ========================  */

$(document).ready(function() {

    // 開始時間
    var time_start = $("#datetimeStart").flatpickr({
        wrap: true,
        onClose: function(dateObj, dateStr, instance) {}
    });

    // 結束時間
    var time_end = $("#datetimeEnd").flatpickr({
        wrap: true,
        onClose: function(dateObj, dateStr, instance) {}
    });
    
    //時間限制
    time_start.config.onChange = function(dateObj) {
        time_end.set("minDate", dateObj.fp_incr(1));
    };
    time_end.config.onChange = function(dateObj) {
        time_start.set("maxDate", dateObj.fp_incr(-1));
    };


});