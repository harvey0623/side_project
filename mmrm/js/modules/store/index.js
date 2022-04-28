$(document).ready(function(){
	type_map();

	$("#location_sel").click(function(){
		$("#location").slideToggle();
	});
	$("#twzipcode").twzipcode({
		"zipcodeIntoDistrict": false,
		'css': ['county', 'district', 'zipcode']
	});

	$("#twzipcode").find('select').change(function(){
		var area = $("#twzipcode .county").val();
		if($("#twzipcode .district").val() != '不限'){
			area += $("#twzipcode .district").val()
		}
		// console.log(area);
		$("#location_sel .li_right span").text(area);
	});

	// 

	var brand_status = [];
	brand_sel_status_save();
	
	$("#brand").click(function(){
		$(this).attr('only',true);
		$("#filter_menu_brand").css({left:"0px"}).attr('direct','true');
		filter_show();
	});
	$("#filter").click(function(){
		filter_show();
		firebaseGa.logEvent('nearby_sift');
	})
	$("#filter_menu_all .sure").click(function(){
		filter_hide();
		get_detail();
	});
	$(".brand_sel").click(function(){
		$("#filter_menu_brand").animate({left:"0px"},"fast");
	});
	$("#filter_menu_brand .sure").click(function(){
		brand_sel_status_save();
		$("#filter_menu_brand .cancel").trigger('click');
		
		if($("#brand").attr('only')){
			$("#brand").removeAttr('only');
			get_detail();
		}	
	});
	$("#filter_menu_brand .cancel").click(function(){
		brand_sel_status();
		if($("#filter_menu_brand").attr('direct')){
			filter_hide()
			$("#filter_menu_brand").css({left:"100%"}).removeAttr('direct');
		}else{
			$("#filter_menu_brand").animate({left:"100%"},"fast");
		}
	});

	//

	$("#filter_menu_brand .check_img").click(function(){
		var brand = $(this).closest(".brand_li") ;
		if(brand.attr('select')){
			$(this).attr('src','/portal_assets/img/btn_filter_check_n_n@3x.png');
			brand.removeAttr('select');
		}else{
			$(this).attr('src','/portal_assets/img/btn_filter_check_n_h@3x.png');
			brand.attr('select',true);
			firebaseGa.logEvent(`nearby_navbar_${brand.attr('brand_code')}`);
		}
	});
	$("#filter_menu_brand .cancel_all span").click(function(){
		$("#filter_menu_brand .check_img").attr('src','/portal_assets/img/btn_filter_check_n_n@3x.png');
		$("#filter_menu_brand .brand_li").removeAttr('select');
	});
	$("#filter_menu_brand .sel_all span").click(function(){
		$("#filter_menu_brand .check_img").attr('src','/portal_assets/img/btn_filter_check_n_h@3x.png');
		$("#filter_menu_brand .brand_li").attr('select',true);
	});

	//

	$("#list").on('click','.list_block',function(){
			var id =  $(this).attr('store_id');
			var obj = store_list.find(item => item.store_id === parseInt(id));
			firebaseGa.logEvent(`nearby_store_${obj.store_code}`);
			window.location.href = '/line_portal/store?store_id='+id;
			// window.open("{{url('store')}}/"+id);
		})

	function brand_sel_status(){
		for(i=0 ; i < $(".brand_li").length ; i++){
			if(brand_status[i]){
				$("#filter_menu_brand .brand_li").eq(i).find(".check_img").attr('src','/portal_assets/img/btn_filter_check_n_h@3x.png');
				$("#filter_menu_brand .brand_li").eq(i).attr('select',true);
			}else{
				$("#filter_menu_brand .brand_li").eq(i).find(".check_img").attr('src','/portal_assets/img/btn_filter_check_n_n@3x.png');
				$("#filter_menu_brand .brand_li").eq(i).removeAttr('select');
			}
		}
	}

	function brand_sel_status_save(){
		brand_list = "" ;
		brand_status = [];
		var num = 0 ;
		for(i=0 ; i < $("#filter_menu_brand .brand_li").length ; i++){
			if($("#filter_menu_brand .brand_li").eq(i).attr("select")){
				brand_status.push(true);
				num += 1;
				if(brand_list == ""){
					brand_list = $("#filter_menu_brand .brand_li").eq(i).attr("brand_id");
				}else{
					brand_list = brand_list+","+$("#filter_menu_brand .brand_li").eq(i).attr("brand_id");
				}
			}else{
				brand_status.push(false);
			}
		}
		if(num == $("#filter_menu_brand .brand_li").length){
			$(".brand_sel span").text("全部").removeClass('brand_sel_num');
			$("#brand").text("全部品牌");
		}else{
			$(".brand_sel span").text(num).addClass('brand_sel_num');
			$("#brand").text("指定品牌");
		}
		if(num == 1){
			$("#brand").text("");
		}
	}

})
function type_list(){
	$('#type_list').click(function(){
		$(this).unbind();
		$('#type_list img').attr('src','/portal_assets/img/btn_filter_view_list_h@3x.png');
		$('#type_map img').attr('src','/portal_assets/img/btn_filter_view_map_n@3x.png');
		$('#map').hide();
		$('#list').show();
		type_map();
	});
}
function type_map(){
	$('#type_map').click(function(){
		$(this).unbind();
		$('#type_list img').attr('src','/portal_assets/img/btn_filter_view_list_n@3x.png');
		$('#type_map img').attr('src','/portal_assets/img/btn_filter_view_map_h@3x.png');
		$('#list').hide();
		$('#map').show();
		type_list();
	});
}
function filter_show(){
	var dist = $(window).width() - $("#filter_menu").width() ;
	$("#filter_menu").animate({left:dist},"fast",function(){
		$("#filter_menu_background").show();
	});
}
function filter_hide(){
	$("#filter_menu").animate({left:"100vw"},"fast",function(){
		$("#filter_menu_background").hide();
	});
}

function store_data(){
	var list_block = '' ;
	$("#list").empty();
	if(store_list.length > 0){
		$("#empty").hide();
		for(i=0 ; i<store_list.length ; i++){
			list_block = 
			'<div class="list_block" store_id='+store_list[i].store_id+'>'+
				'<div class="list_img">'+
					'<img src="'+store_list[i].img+'">'+
				'</div>'+
				'<div class="list_content">'+
					'<p class="list_content_store">'+store_list[i].name+'</p>'+
					'<p class="list_content_addr">'+store_list[i].addr+'</p>'+
					'<p class="list_content_other"><span class="list_content_tel">'+store_list[i].tel+'</span>&nbsp;<span class="list_content_distance">'+(store_list[i].distance !== null ? store_list[i].distance+' Km' : '--m')+'</span></p>'+
				'</div>'+
			'</div>' ;
			$("#list").append(list_block);
		}
		$("#list").show();
	}else{
		$("#list").hide();
		$("#empty").show();
	}
	$("#filter_num").text(store_list.length);		
}
		
function getLocation() {
	 if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(showPosition,errorPosition);
	} else { 
	    	console.log('location_error');
	    	latitude = null;
			longitude = null;
	}
}

function showPosition(position){
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;
	console.log('location',position.coords.latitude,position.coords.longitude);
	do_ajax();
}

function errorPosition(error){//取精緯失敗
	console.log(error.message);
	do_ajax();
}

function get_detail(){
	getLocation();
	// $("#list").hide();
	// $("#loading").show();
	
	// if(brand_list == ""){//確認有品牌篩選
	// 	store_list = "" ;
	// 	store_data();
	// 	$("#list").show();
	// 	$("#loading").hide();
	// 	return
	// }

	// var data = {
	// 	"ids": brand_list,
	// 	"latitude": latitude,
	// 	"longitude": longitude
	// };
	// if($("#twzipcode .county").val() != "全部"){
	// 	data.city = $("#twzipcode .county").val();
	// }
	// if($("#twzipcode .district").val() != "不限"){
	// 	data.district = $("#twzipcode .district").val();
	// }
	// console.log("data",data);
	// $("#loading").show();
	// $.ajax({
	//     data : data,
	//     url : data_url,
	//     type : "get",
	//     async : true ,
	//     success : function(rtndata) {
	//     	console.log("rtndata:",rtndata);
	//     	store_list = rtndata.store_information;
	//     	store_data();
	// 		$("#loading").hide();
	// 		$("#list").show();
	//     },
	//     error: function (jqXHR, textStatus, errorThrown) {
	// 		console.log('error');
	// 		if(ajax_num < 5){
	// 			ajax_num += 1;
	// 			get_detail();
	// 		}else{
	// 			store_list = "" ;
	// 			store_data();
	// 			$("#loading").hide();
	// 			$("#list").show();
	// 		}
			
	//     }
	// });
		
}

function do_ajax(){
	$("#list").hide();
	$("#loading").show();
	
	if(brand_list == ""){//確認有品牌篩選
		store_list = "" ;
		store_data();
		$("#list").show();
		$("#loading").hide();
		return
	}

	var data = {
		"ids": brand_list,
		"latitude": latitude,
		"longitude": longitude
	};
	if($("#twzipcode .county").val() != "全部"){
		data.city = $("#twzipcode .county").val();
	}
	if($("#twzipcode .district").val() != "不限"){
		data.district = $("#twzipcode .district").val();
	}
	console.log("data",data);
	$("#loading").show();
	$.ajax({
	    data : data,
	    url : data_url,
	    type : "get",
	    async : true ,
	    success : function(rtndata) {
	    	console.log("rtndata:",rtndata);
	    	store_list = rtndata.store_information;
	    	store_data();
			$("#loading").hide();
			$("#list").show();
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
			console.log('error');
			if(ajax_num < 5){
				ajax_num += 1;
				get_detail();
			}else{
				store_list = "" ;
				store_data();
				$("#loading").hide();
				$("#list").show();
			}
			
	    }
	});
}

function getMultipleBrand() { //取得多品牌資料
	$.ajax({
		url: '/line_portal_api/v1/doConfig',
		method: 'post',
		data: {},
		success(res) {
			let isMultiple = res.multiple_brand === '1';
			let method = isMultiple ? 'removeClass' : 'addClass';
			$('#brand')[method]('multiple');
			$('.chooseBrand')[method]('multiple');
		}
	})
}

getMultipleBrand();

// 2022/03/08 ga設置
$('.backHome').on('click', function(evt) {
	evt.preventDefault();
	firebaseGa.logEvent('nearby_storelist_home');
	location.href = this.href;
});