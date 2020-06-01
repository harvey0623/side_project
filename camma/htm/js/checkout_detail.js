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


	// 刪除產品項
	$(".product-region").on("click",".delectBtn",function(event) {		
		$(this).parentsUntil(".product-region").remove(".wrap-item");
	});


	// 複製商品組合
	$(".product-region").on("click",".copyBtn",function(event) {

		var addProd = $(this).parents(".promotions_product").prop("outerHTML");

		$(this).parents(".promotions_product").after(addProd);
		
	});

	$(".select-style").select2({}); //select啟動


});


/*  =================  function  ================  */
