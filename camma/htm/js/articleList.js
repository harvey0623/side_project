var $grid;
var itemsAllNum;
var currentAry;
var dataAry = [
        {kind:'new',imgURL:'news_1.jpg'},
        {kind:'new',imgURL:'news_2.jpg'},
        {kind:'sale',imgURL:'index_drinks.jpg'},
        {kind:'activity',imgURL:'index_drinks_2.jpg'},
        {kind:'store',imgURL:'index_product.jpg'},
        {kind:'store',imgURL:'index_product_2.jpg'},
        {kind:'sale',imgURL:'news_1.jpg'},
        {kind:'sale',imgURL:'news_2.jpg'},
        {kind:'activity',imgURL:'index_drinks.jpg'},
        {kind:'store',imgURL:'index_drinks_2.jpg'},
    ];

/*  =====================  init  ========================  */

$(document).ready(function(){
    $grid = $('.masonry').imagesLoaded( function() {
        $grid.masonry({
            animated:false,
            transitionDuration: false,
            horizontalOrder: false,
            gutter: 30,
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
        case "new":
        case "sale":
        case "activity":
        case "store":
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
                '<a href="articleDetail.html">' + 
                    '<img src="img/'+ ary[i].imgURL +'">'+
                    '<div class="descBox">' + 
                        '<div class="date">' + 
                            '2018 / 8 / 24' + 
                        '</div>' + 
                        '<div class="title ellipsis">' + 
                            '最新消息的標題文字區塊這邊建議最多二十四個中文字' + 
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

