/*  =====================  init  ========================  */
$(".select-style").select2({});

$(document).ready(function() {

    $(window).resize(onResize);

    //Collapse ICON變換(單一顯示)
    $(".panel-heading a").click(function() {
        collapseIcon(".panel-heading a",this);
    });

    //Collapse ICON變換(複數顯示)
    $(".toggle").click(function(event) {
        pluralCollapse(this);
    });

    //Collapse 底部變換(複數顯示)
    $(".collapseToggle").click(function(event) {
        pluralUp(this);
    });

    gotopDetect(); //回到頂部控制 


});

/*  =====================  event  ========================  */


/*  =================  function  ================  */

// 正方形圖
function onResize() {

    var ary = ($('.rImg'));
    for (var i = 0; i < ary.length; i++) {
        var num = $(ary[i]).width();
        $(ary[i]).css("height", num);
    }
}

// 添加active
function addActive(clip1,clip2) {
    $(clip1).removeClass('active');
    $(clip2).addClass('active');
}

//回到頂部控制 
function gotopDetect() {

    var gotop = $('.goTop');

    $(window).scroll(function() {

        var scrollVal = $(this).scrollTop();

        if (scrollVal > 200) {
            gotop.show();
        } else {
            gotop.hide();
        }

    });

    gotop.on('click', function() {

        $('html,body').animate({ scrollTop: 0 }, 1000);
        // document.body.scrollTop = 0; // For Chrome, Safari and Opera
        // document.documentElement.scrollTop = 0; // For IE and Firefox
    });
}

//Collapse ICON變換(單一顯示)
function collapseIcon(clip1,clip2) {

    $(clip1).not(clip2).find('.fa-angle-up').parents(".iconBox").hide();
    $(clip1).not(clip2).find('.fa-angle-down').parents(".iconBox").show();

    $(clip2).find('.iconBox').toggle();

}

//Collapse ICON變換(複數顯示)
function pluralCollapse(clip1) {

    var iconDown = $(clip1).find('.fa-angle-down').parent();
    var iconUp = $(clip1).find('.fa-angle-up').parent();

    if (iconDown.hasClass('none')) {

        $(clip1).children().removeClass('none');
        iconUp.addClass('none');        
    } else if (iconUp.hasClass('none')) {

        $(clip1).children().removeClass('none');
        iconDown.addClass('none');
    }

    $(clip1).next(".collapse-region").toggle();

}

//Collapse 底部變換(複數顯示)
function pluralUp(clip1) {

    $(clip1).parent().hide();
    $(clip1).parents(".collapseStyle").find(".toggle").children().removeClass('none');
    $(clip1).parents(".collapseStyle").find('.toggle .fa-angle-up').parent().addClass('none');

}