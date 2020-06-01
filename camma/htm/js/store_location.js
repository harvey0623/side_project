$(document).ready(function() {

    $(".title-region a").click(function(event) {
        
        var addressName = $(this).parents(".store-region").find(".addressBox").html();

        $(this).attr('href', 'https://www.google.com.tw/maps/place/' + addressName );

    });


    $(".select-style").select2({}); //select啟動
});

