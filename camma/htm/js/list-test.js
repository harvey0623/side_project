var productName = ['商品1號','商品2號','商品3號','商品4號','商品5號','商品6號','商品7號','商品8號','商品9號','商品10號','商品11號','商品12號']

var class1Str = '<div class="poductClass">' +
    '<div class="item-box icon deleteBtn">' +
    '<i class="fa fa-minus-circle" aria-hidden="true"></i>' +
    '</div>' +
    '<div class="item-box">' +
    '<select name="productName">' +
    '<option value="">AA</option>' +
    '<option value="">BB</option>' +
    '<option value="">CC</option>' +
    '<option value="">DD</option>' +
    '</select>' +
    '</div>' +
    '<div class="item-box">' +
    '<select name="name">' +
    '<option value="">AA</option>' +
    '<option value="">BB</option>' +
    '<option value="">CC</option>' +
    '<option value="">DD</option>' +
    '</select>' +
    '</div>' +
    '<div class="item-box">' +
    '<select name="name">' +
    '<option value="">AA</option>' +
    '<option value="">BB</option>' +
    '<option value="">CC</option>' +
    '<option value="">DD</option>' +
    '</select>' +
    '</div>' +
    '</div>';

var class2Str = '<div class="product-item">' +
    '<div class="poductClass">' +
    '<div class="item-box icon deleteBtn">' +
    '<i class="fa fa-minus-circle" aria-hidden="true"></i>' +
    '</div>' +
    '<div class="item-box name">' +
    '<div class="img-box">' +
    '<img src="img/A-009.jpg" alt="">' +
    '</div>' +
    '<div class="descBox">111111美式咖啡豆美式咖啡豆美式咖啡豆美式咖啡豆美式咖啡豆美式咖啡豆美式咖啡豆美式咖啡豆美式咖啡豆</div>' +
    '</div>' +
    '<div class="item-box icon addBtn">' +
    '<i class="fa fa-plus-circle" aria-hidden="true"></i>' +
    '</div>' +
    '</div>' +
    '<div class="poductClass">' +
    '<div class="item-box icon addBtn">' +
    '<i class="fa fa-plus-circle" aria-hidden="true"></i>' +
    '</div>' +
    '<div class="item-box">' +
    '<select name="productName">' +
    '<option value="">AA</option>' +
    '<option value="">BB</option>' +
    '<option value="">CC</option>' +
    '<option value="">DD</option>' +
    '</select>' +
    '</div>' +
    '<div class="item-box">' +
    '<select name="name">' +
    '<option value="">AA</option>' +
    '<option value="">BB</option>' +
    '<option value="">CC</option>' +
    '<option value="">DD</option>' +
    '</select>' +
    '</div>' +
    '<div class="item-box">' +
    '<select name="name">' +
    '<option value="">AA</option>' +
    '<option value="">BB</option>' +
    '<option value="">CC</option>' +
    '<option value="">DD</option>' +
    '</select>' +
    '</div>' +
    '</div>' +
    '</div>';

/*  =====================  init  ========================  */

$(document).ready(function() {


    // 增加項目
    $(document).on("click", ".addBtn", function() {
        var abtnClass = $(this).parent().index();

        if (abtnClass == 0) {

            $(".section.product.num-1").append(class2Str);

        } else {
            $(this).parents(".product-item").append(class1Str);
        }
        innerName();
    })

    // //刪除項目
    $(document).on("click", ".deleteBtn", function() {
        var dbtnClass = $(this).parent().index();

        if (dbtnClass == 0) {
            $(this).parents(".product-item").remove();
        } else {
            $(this).parent(".poductClass").remove();
        }
    })



    innerName();


});

/*  =====================  event  ========================  */



/*  =================  function  ================  */


    // 將商品陣列導入
    function innerName(){

        var optionInner = [];

        for (var i = 0; i < productName.length; i++) {

            optionInner = optionInner + '<option value=' + [i] + '>' + productName[i] + '</option>';

        }

        $("select[name='productName']").html(optionInner);

    }