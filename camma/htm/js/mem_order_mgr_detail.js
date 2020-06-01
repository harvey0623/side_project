/*  =====================  init  ========================  */

$(document).ready(function () {
    $(".barcodeTarget").each(function (index, target) {
        var value = $(target).data('value');
        var btype = 'code128';

        var settings = {
            format: btype,
            background: '#FFFFFF',
            lineColor: '#000000',
            width:1.3,
            height:70,
            fontSize:16,
            margin:30
        };

        if (value) {
            $(target).JsBarcode(value,settings);
        }
    });
});

/*  =================  function  ================  */