var conditionBoo = true;
var require = 0; 
var prodTotalNum = 0;
var requireRed = 2;
var requireGreen = 5;
var discountKind = 0;
var discountValue = 0;
var rTotal = 0,gTotal = 0;

var cartAry = [
	{
		pID:"n1",
		pName:"【預購優惠８８折】好咖咖啡豆禮盒(義式咖啡",
		pImg:"img/product_1.jpg",
		pLen:2,
		pAmount:600,
		pType:"red",
        pStock:10
	},
	{
		pID:"n4",
		pName:"耶加雪菲 - Yirgacheffe",
		pImg:"img/product_4.png",
		pLen:1,
		pAmount:654,
		pType:"green",
        pStock:8
	},
	{
		pID:"n2",
		pName:"【預購優惠８８折】好咖咖啡豆禮盒耶加雪菲 - Yirgacheffe",
		pImg:"img/product_3.png",
		pLen:2,
		pAmount:168,
		pType:"green",
        pStock:3
	}
];

/*  =====================  init  ========================  */

$(document).ready(function() {
    //後端調整新增
	// calculate(0,"n");

	$(".chooseBtn").on("click",addClick);
	//後端調整新增
	// $(".cartBtn").on("click",cartClick);
});

/*  ===================== click function  ========================  */

function addClick(e){
	var target = $(this).parents('.product-block');
	var index = target.index();
	var obj = {
			pID:target.data('number'),
			pName:target.find('.descBox').text().trim(),
			pImg:target.find('.imgBox>img').attr('src'),
			pLen:1,
			pAmount:target.find('.price-sub span').text(),
			pType:target.data('color'),
        	pStock:target.data('stock'),
		}

	calculate(1,target.data('color'),function(){
		if (conditionBoo){
			if(exist(obj.pID) == "no"){
				cartAry.push(obj);
			}else{
				cartAry[exist(obj.pID)].pLen += 1;
			}	
		}	
	});	
}

function delClick(e){
	var target = $(this).parents(".wrap-item");
	var index = target.index();
	var selectNum = target.find('.select-style')[0].selectedIndex+1;	

	calculate(-selectNum,target.data('color'),function(){
		if (conditionBoo) cartAry.splice(index,1);		
	});	

	mask(obj.pID);
}

function selectChange(e){
	var target = $(this).parents(".wrap-item");
	var index = target.index();
	var color = target.data('color');
	var currentChooseNum = cartAry[index].pLen;
	var lastChooseNum = $(this)[0].selectedIndex+1;

	calculate(lastChooseNum - currentChooseNum,color, function(){  //原數值和新數值的差值
		if (conditionBoo) {
			cartAry[index].pLen = lastChooseNum; //更新陣列參數
		}else{
			target.find('.select-style')[0].selectedIndex = currentChooseNum-1; //select回復原參數
		}		
	}); 	

	mask(target.data('number')); 
}

function cartClick(e){
	$.ajax({
		url: "xyz.php",
		method: "POST",
		data: { "dataArray" : cartAry },
		dataType: "html",
		success: function(){
    		alert('OK');
  		},
        error: function(){
        	alert('OMG');
        }
  	});

  	mask(target.data('number')); 
}

/*  =================  計算條件符合  ================  */

function calculate(num,color,callback){
	var cntTotalNum = 0;
	rTotal = 0;
	gTotal = 0;

	require = requireRed + requireGreen;

	/*  ========    確認紅綠標數量 & 總數    =========  */

	for (var i = 0; i < cartAry.length; i++) {		
		checkColor(cartAry[i].pType,cartAry[i].pLen);
	}
	checkColor(color,num);

	function checkColor(str,len){
		switch(str){
			case "red":rTotal += len;break;
			case "green":gTotal += len;break;
		}
		cntTotalNum += len;
	}	

	conditionBoo = !Boolean(rTotal > requireRed || gTotal > requireGreen);  // 加入預設值如果大於限制

	if (conditionBoo) {
		if(rTotal == requireRed && gTotal == requireGreen){
			$(".promotions-bar .orange-btn").attr('disabled', false);
		}else{
			$(".promotions-bar .orange-btn").attr('disabled', true);
		}
	}else{ 
		alert("紅綠標數量不正確");		
		checkColor(color,-num);
	}

	if( typeof callback === 'function' ) callback();

	loadCartData();
}



/*  =================  計算商品總額  ================  */

function priceCheckTotal(){
	var total = 0;
	var piecesTotal = 0;
	var priceTotal = 0;
	var requireText = $(".require").text();

	for (var i = 0; i < cartAry.length; i++) {
		var price = cartAry[i].pAmount; //商品單價
		var selectNum = cartAry[i].pLen; //select數量
		var multiplyPrice = price * selectNum;

		piecesTotal += selectNum; //總數量
		priceTotal += multiplyPrice; //總價

		$(".priceBox span").eq(i).html(multiplyPrice); //單項商品總價
	}

	$(".require-red").html(requireRed);
	$(".require-green").html(requireGreen);

	$(".result-red").html(rTotal);
	$(".result-green").html(gTotal);
	$(".total-box .price span").html(priceTotal);

	if (rTotal == requireRed && gTotal == requireGreen) {
		$(".tip").css({'display':'initial'});
		$(".price").css({'color':'#ff5151'});

        discountPrice(discountKind, discountValue, priceTotal);
	} else {
		$(".tip").css({'display':'none'});
		$(".price").css({'color':'#333333'});
	}	
}


function discountPrice(kind,saleNum,total){// 折扣方案
    switch(kind){
        case 1: //滿件打折(%數)
            var sale = 1 - (saleNum * 0.01);
            var text = " *已符合滿件" + ( sale * 100 ).toString().replace("0","") + "折優惠方案";

            piecesTotal = Math.round(total * sale);
            break;
        case 2: //滿件減折扣
            var text = " *已符合滿件折扣$" + saleNum + "優惠方案";

            piecesTotal = total - saleNum;
            break;
        case 3: //滿件直接價
            var text = " *已符合滿件$" + saleNum + "優惠方案";

            piecesTotal = saleNum;
            break;
    }

	$(".total-box .discount span").html(piecesTotal);
	$(".require-box .tip").html(text);
}

/*  ===================== 讀取紀錄資料  ========================  */

function loadCartData(){
	$(".promotions-item").empty();

	for (var i = 0; i < cartAry.length; i++) {
		addProdItem(cartAry[i],i)
	};
	
	$(".delectBtn").on("click",delClick);
	$(".wrap-item select").on("change",selectChange);

	priceCheckTotal();
}

/*  ===================== 增加商品項目  ========================  */

function addProdItem(obj,num){
    var html_options = "";
    for (i = 1; i <= obj.pStock; i++) {
        html_options += '<option value="' + i + '">' + i + '</option>';
    }
    var html_str =
		'<div class="wrap-item ' + obj.pType + '" data-number="' + obj.pID + '" data-color="' + obj.pType + '" data-stock="' + obj.pStock + '">' +
			'<div class="itemBox w8">' +
			    '<div class="iconBox delectBtn">' +
			        '<i class="fas fa-minus-circle"></i>' +
			    '</div>' +
			'</div>' +
			'<div class="itemBox w50 product-block">' +
			    '<div class="productImg">' +
			        '<a href="#">' +
			            '<img src="' + obj.pImg + '" alt="">' +
			        '</a>' +
			    '</div>' +
			    '<div class="product-item">' +
			        '<div class="product-title">' +
			            '<a href="#">' +
			                obj.pName +
			            '</a>' +
			        '</div>' +
			        '<div class="product-sub unitPrice">' +
			            'TWD <span>' + obj.pAmount + '</span>' +
			        '</div>' +
			    '</div>' +
			'</div>' +
			'<div class="itemBox w22">' +
			    '<div class="text-box">' +
			        '<select class="select-style">' +
        				html_options +
			        '</select>' +
			    '</div>' +
			'</div>' +
			'<div class="itemBox sub w20">' +
			    '<div class="text-box priceBox">' +
			        '$<span>' + obj.prodAmount + '</span>' +
			    '</div>' +
			'</div>' +
		'</div>';
    $(".promotions-item").append(html_str);

	var itemAry = ($(".promotions-item .wrap-item"));
	var target = $(itemAry[num]).find('.select-style');
	target[0].selectedIndex = obj.pLen-1;	
}

/*  ===================== 判斷商品是否已存在  ========================  */
function exist(pid){
	var exist = false;
	for(i=0 ; i<cartAry.length ; i++){
		if(cartAry[i].pID == pid){
			return i
		}
	}
	return 'no' ;
}

/*  ===================== 判斷商品是否能再選購  ========================  */
function mask(pid){
    var list = $(".wrap-item[data-number="+pid+"]").find('.select-style').val();
    if( $(".product-block[data-number="+pid+"]").attr("data-stock") == list){
        $(".product-block[data-number="+pid+"]").find("button").attr("disabled",true);
    }else{
        $(".product-block[data-number="+pid+"]").find("button").removeAttr("disabled");
    }
}