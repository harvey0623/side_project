var $grid;
var itemsAllNum;
var currentAry;
var dataAry = [
        {kind:'expert',imgURL:'talk_1.jpg'},
        {kind:'knowledge',imgURL:'talk_2.jpg'},
        {kind:'expert',imgURL:'talk_3.jpg'},
        {kind:'skill',imgURL:'talk_4.jpg'},
        {kind:'story',imgURL:'talk_5.jpg'},
        {kind:'expert',imgURL:'talk_5.jpg'},
        {kind:'story',imgURL:'talk_1.jpg'},
        {kind:'skill',imgURL:'talk_2.jpg'},
        {kind:'story',imgURL:'talk_3.jpg'},
        {kind:'knowledge',imgURL:'talk_4.jpg'},
        {kind:'expert',imgURL:'talk_1.jpg'},
        {kind:'knowledge',imgURL:'talk_2.jpg'},
        {kind:'expert',imgURL:'talk_3.jpg'},
        {kind:'expert',imgURL:'talk_4.jpg'},
        {kind:'story',imgURL:'talk_5.jpg'},
        {kind:'expert',imgURL:'talk_5.jpg'},
        {kind:'story',imgURL:'talk_1.jpg'},
        {kind:'skill',imgURL:'talk_2.jpg'},
        {kind:'knowledge',imgURL:'talk_3.jpg'},
        {kind:'knowledge',imgURL:'talk_4.jpg'},
    ];

/*  =====================  init  ========================  */

$(document).ready(function(){
    $grid = $('.masonry').imagesLoaded( function() {
        $grid.masonry({
            animated:false,
            transitionDuration: false,
            horizontalOrder: false,
            gutter: 24,
        });

        findKeyWordItems('all');
    });    

    $grid.on( 'layoutComplete', layoutComplete );

    $('.sort-region a').on( 'click', btnClick );   
    $('.sort-region li').click(activeChange);
});   

/*  =====================  event  ========================  */

function layoutComplete(event, items){
    // itemsAllNum = items.length;
    //console.log('layoutComplete');   
}

function btnClick(event){
    var str = $(this).data('key');    

    findKeyWordItems(str);    
}

function activeChange(){
    $(".sort-region li").removeClass('active');
    $(this).addClass('active');
}

/*  =====================  function  ========================  */

function findKeyWordItems(str){
    currentAry = new Array();

    switch (str){
        case "expert":
        case "knowledge":
        case "skill":
        case "story":
            for (var i = 0; i < dataAry.length; i++) {
                var iSize = dataAry[i].kind;
                if(str == iSize){
                    currentAry.push(dataAry[i]);
                }
                $grid.masonry('remove', $('.item'))
            }
            break;
        case "all":
            $grid.masonry('remove', ($('.item')));
            currentAry = dataAry;
            break;
    }
    prependItems(currentAry);
    // addClass(currentAry);
}

function prependItems(ary){
    for (var i = 0; i < ary.length; i++) {
        var str = 
            '<div class="item" data-kind="'+ ary[i].kind +'">'+
                '<a href="coffeeDetail.html">' + 
                    '<img src="img/'+ ary[i].imgURL +'">'+
                    '<div class="descBox">' + 
                        '<div class="title ellipsis">' + 
                            '這邊中文建議最多十字' + 
                        '</div>' + 
                        '<div class="title ellipsis">' + 
                            '可以分成兩行描述標題' + 
                        '</div>' + 
                    '</div>' + 
                '</a>' + 
            '</div>';

        var $items = $(str);

        // $items.hover(function(){   
        //     TweenMax.to($(this), 0.5, {scale:1.05, ease:Back.easeOut});
        // },function(){
        //     TweenMax.to($(this), 0.5, {scale:1, ease:Back.easeOut});
        // });

        $grid.append( $items )
        $grid.masonry( 'appended', $items );
    }    

    setTimeout(function(){
        $grid.masonry('layout');
        

        TweenMax.staggerFromTo(($('.item')), 0.8, {
            opacity:0,
            scale:0,
            ease:Back.easeOut
        },
        {
            opacity:1,
            scale:1,
            ease:Back.easeOut
        },0.08);

    },100);
}

