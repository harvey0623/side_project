$(document).ready(function(){		
		// 底部按鍵 start
		$('.bot_indicator img').click(function(){
			$('.bot_indicator').hide();
			// $('.bot_btn').slideUp();
		});

		$(window).bind('scroll', function() { 
		    if ($(window).scrollTop() > 0) { 
		     	$('.bot_indicator').hide();
		     	// $('.bot_btn').slideUp();
		    } 
		    else { 
		    	// $('.bot_btn').slideDown('fast',function(){
		    	// 	$('.bot_indicator').show();
		    	// });
		    	$('.bot_indicator').show();
		    } 
		}); 
		// 底部按鍵 end

		// 相關連結版型3 start
		$('#bottom').on('click','.bot_btn_blk',function(){
			if($(this).attr('data-toggle') == "connectModal_3"){
				$('#connectModal_3').slideDown();

				$('#connectModal_3').css({'position':'absolution'});
				$('#app').hide();
			}
		});

		$('.con_title_img').click(function(){
			$('#connectModal_3').slideUp();
			$('#connectModal_3').css({'position':'fixed'});
			$('#app').show();
		});

		$('#connectModal_3').on('click','.con_body_blk',function(){
			let link = $(this).attr('link');
			if(link){
				window.location.href = link;
			}
		});
		// 相關連結版型3 end
});

function brand_all(){
	if(Object.keys(brand_paramenter.list).length > 1){
		brand(brand_paramenter);
	}else{
		$('#index').remove();
	}
}
var brand_parameter_temp = '' ;
function brand(parameter){
	let list = parameter.list
	let num = Object.keys(list).length;
	let html = '';
	let class_name = '' ;
	let show_index = 0 ;
	// console.log(num,parameter);
	brand_parameter_temp = parameter.show ;
	for(i=0 ; i < num ; i++){
		if(Object.keys(list)[i] == parameter.show){
			show_index = i;
			if(i == 0){
				brand_paramenter.pre = Object.keys(list)[num-1];
				brand_paramenter.next = Object.keys(list)[i+1];
			}else if(i == num - 1){
				brand_paramenter.pre = Object.keys(list)[i-1];
				brand_paramenter.next = Object.keys(list)[0];
			}else{
				brand_paramenter.pre = Object.keys(list)[i-1];
				brand_paramenter.next = Object.keys(list)[i+1];
			}
			break;
		}
	}

	for(i=-3 ; i<=3 ; i++){
		if(i == 0){
			class_name = 'index_img index_img_show' ;
		}else{
			class_name = 'index_img' ;
		}

		let k = index_got(show_index + i);

		html += '<div class="'+class_name+'" brand="'+Object.keys(list)[k]+'">';
		html += '<img src="'+Object.values(list)[k]+'">';
		html += '</div>';
	}

	$('.index_content_body').empty().append(html);

	$('.index_content').scrollLeft( $('#index').width() / 5);

	$('.index_content').bind('scroll', function() { 
		let block_width = $('#index').width() / 5 ;
	    if ($('.index_content').scrollLeft() > block_width+2 ) { 
	    	$('.index_content').unbind();
	    	$('#index_right').trigger('click');
	    }else if($('.index_content').scrollLeft() < block_width-2 ){
	    	$('.index_content').unbind();
	    	$('#index_left').trigger('click');
	    }
	}); 

	function index_got(index){
		let temp = 0 ;
		if(index < 0){
			temp = index + num ;
			temp = index_got(temp);
		}else if(index >= num){
			temp = index - num;
			temp = index_got(temp);
		}else{
			temp = index;
		}
		return temp;
	}

}

function right_function(){
	$('#index_right').unbind('click');
	$('#index_left').unbind('click');
	$('.index_content').css('overflow','hidden');
	let block_width = $('#index').width() / 5 * 2;
	$('.index_content').animate({scrollLeft:block_width},100,function(){
		brand_paramenter.show = brand_paramenter.next;
		brand(brand_paramenter);
		get_detail();
	});
	
}

function left_function(){
	$('#index_left').unbind('click');
	$('#index_right').unbind('click');
	$('.index_content').css('overflow','hidden');
	$('.index_content').animate({scrollLeft:0},100,function(){
		brand_paramenter.show = brand_paramenter.pre;
		brand(brand_paramenter);
		get_detail();
	});
}

function img(){
	let window_width = $(window).width();
	$('#pic').height(window_width * 0.64);
	$('#pic').css("background-image","url("+brand_img+")");
}

function summary(){
	$('#summary .brand_name b').text(brand_summary.name);
	$('#summary .content').html(brand_summary.content);
}

function store(){
	if(brand_store.display){
		let brand_store_content = "<p>最近的門市</p>" ;
		if(brand_store.gps){
			brand_store_content += 
			'<p>'+brand_store.addr+'</p>' +
			'<p>'+brand_store.tel+'</p>' ;
			$('#distance').text(brand_store.distance);
			$('#distance').click(function(){
				window.location.href = brand_store.url;
			});
			$('#store').find('img').click(function(){
				window.location.href = brand_store.url;
			});
			$('#store').show();
			$('#distance').show();
		}else{
			brand_store_content += 
			'<p>無法存取您目前的位置資訊，請先開啟設定功能</p>';
			$('#store .indicator').hide();
			$('#distance').hide();
		}
		$('#store').find('div').eq(0).html(brand_store_content);
	}else{
		$('#store').hide();
		$('#distance').hide();
	}
}

function html(){
	if(brand_html.display){
		// let brand_html_content = '';
		// for(i=0; i<brand_html.content.length ; i++){
		// 	brand_html_content += '<p>'+brand_html.content[i] + '</p>';

		// }
		$('#descript > div').html(brand_html.content)
	}else{
		$('#descript').remove();
	}
}

function news(){
	if(brand_news.display){
		block(brand_news,$('#news'));
		$("#news").show();
	}else{
		$("#news").hide();
	}
}

function ticket(){
	if(brand_ticket.display){
		block(brand_ticket,$('#ticket'));
		$("#ticket").show();
	}else{
		$("#ticket").hide();
	}
}

function point(){
	if(brand_point.display){
		block(brand_point,$('#point'));
		$("#point").show();
	}else{
		$("#point").hide();
	}
}	

function block(parameter,zone){
	if(parameter.list.length < 2){
		zone.find('a').remove();
	}else{
		zone.find('a').attr('href',parameter.url);
	}
	zone.find('.block_block').remove();
	for(i=0 ;  i<parameter.list.length && i<2 ;i++){
		let content = '' ;
		content += 
			'<div class="col-6 col_panding block_block">' +
				'<div class="white_back">' +
					'<div class="block_img_div">' +
						'<img src="'+parameter.list[i].img+'" width="100%">' +
					'</div>' +
					'<div class="padd-10 block_url" url="'+parameter.list[i].url+'">' +
						'<p class="one_line"><b>'+parameter.list[i].title+'</b></p>' +
						'<p>'+parameter.list[i].date+'</p>' +
					'</div>' +
				'</div>' +
			'</div>' ;
		zone.append(content);
	}
	zone.on('click','div.block_url',function(){
		window.location.href = $(this).attr('url');
	})
}

function contact(){
	if(brand_contact.display){
		let modal_content = '';
		if(brand_contact.content.tel){
			$('#tel').text(brand_contact.content.tel);
			modal_content += '<li class="tel_link">' +
						'<div class="" ><a href="tel:'+brand_contact.content.tel+'">撥打電話</a></div>' +
					'</li>';
		}else{
			$('.tel_link').remove();
		}
		if(brand_contact.content.mail){
			$('#email').text(brand_contact.content.mail);
			modal_content += '<li class="email_link">' +
						'<div class="" ><a href="mailto:'+brand_contact.content.mail+'">電子郵件</a></div>' +
					'</li>';
		}else{
			$('.email_link').remove();
		}
		if(brand_contact.content.addr){
			$('#address').text(brand_contact.content.addr);
			modal_content += '<li class="map_link">' +
						'<div class=""><a href="http://maps.google.com/maps?f=q&hl=zh-TW&geocode=&q='+brand_contact.content.addr+'">地圖指引</a></div>' +
					'</li>';
		}else{
			$('.map_link').remove();
		}
		modal_content += '<li class="cancel">' +
					'<div class="cancel" data-dismiss="modal">取消</div>' +
				'</li>';
		$('#infoModal .contactList').empty().append(modal_content);
	}else{
		$("#info").remove();
	}
}

function service(){
	for(i=0 ; i<brand_service.length ; i++){
		let brand_service_func = '' ;
		if(brand_service[i].trigger){
			if(brand_service[i].trigger.style == 1){
				brand_service_func = 'data-toggle="modal" data-target="#connectModal_1"' ;
				$('#connectModal_1 .contactList').empty();
				for(j=0 ; j<brand_service[i].trigger.list.length ; j++ ){
					let other_link = 
						'<li>' +
							'<a href="'+brand_service[i].trigger.list[j].link+'">' +
								'<div>'+brand_service[i].trigger.list[j].title+'</div>' +
							'</a>' +
						'</li>' ;
						
					$('#connectModal_1 .contactList').append(other_link);
				}
				let other_link = '<li><div class="cancel" data-dismiss="modal">取消</div></li>'
				$('#connectModal_1 .contactList').append(other_link);
			}else if(brand_service[i].trigger.style == 2){
				brand_service_func = 'data-toggle="modal" data-target="#connectModal_2"' ;
				$('#connectModal_2 .modal-body').empty();
				for(j=0 ; j<brand_service[i].trigger.list.length ; j++ ){
					let other_link = 
						'<div class="col-4 connect_block">' +
							'<a href="'+brand_service[i].trigger.list[j].link+'">' +
								'<div class="connect_img">' +
									'<img src="'+brand_service[i].trigger.list[j].img+'">' +
								'</div>' +
								'<div class="connect_text">' +
									brand_service[i].trigger.list[j].title +
								'</div>' +
							'</a>' +
						'</div>' ;
						
					$('#connectModal_2 .modal-body').append(other_link);
				}
			}else{
				// $('#connectModal_3 .con_body_blk').remove();
				brand_service_func = 'data-toggle="connectModal_3"' ;
				for(j=0 ; j<brand_service[i].trigger.list.length ; j++ ){
					let other_link = 
					'<div class="con_body_blk" link="'+brand_service[i].trigger.list[j].link+'">' +
			        	'<div class="con_body_blk_img">' +
			        		'<img src="'+brand_service[i].trigger.list[j].img+'">' +
			        	'</div>' +
			        	'<div class="con_body_blk_content">' +
			        		'<div class="con_body_blk_content_title">' +
			        			brand_service[i].trigger.list[j].title +
			        		'</div>' +
			        		'<div class="con_body_blk_content_text">' +
			        			brand_service[i].trigger.list[j].text +
			        		'</div>' +
			        	'</div>' +
			        	'<div class="con_link">' +
			        		'<img src="portal_assets/img/btn_listcore_indicatorright_std_n@3x.png">' +
			        	'</div>' +
			        '</div>';
						
					$('#connectModal_3 .fixedArea').append(other_link);
				}
			}
		}else if(brand_service[i].link){
			brand_service_func = 'link="'+brand_service[i].link+'"' ;
		}

		if(i<4){
			let brand_service_content = 
				'<div class="bot_block bot_btn_blk"'+brand_service_func+'>' +
					'<div class="bot_block_img">' +
						'<img src="'+brand_service[i].img+'">' +
					'</div>' +
					'<div class="bot_block_content">' +
						brand_service[i].name +
					'</div>' +
				'</div>';
			$('#bottom .bot_btn').append(brand_service_content);
		}else if(i == 4){
			let brand_service_content = '' ;
			if(brand_service.length > 5){
				brand_service_content = 
				'<div class="bot_block" data-toggle="modal" data-target="#moreModal">' +
					'<div class="bot_block_img">' +
						'<img src="/portal_assets/img/btn_brand_tabbar_more_n@3x.png">' +
					'</div>' +
					'<div class="bot_block_content">' +
						'更多服務' +
					'</div>' +
				'</div>' ;
				$('#bottom .bot_btn').append(brand_service_content);
				brand_service_content = 
					'<div class="col-4 connect_block bot_btn_blk" '+brand_service_func+'>' +
						'<div class="connect_img">' +
							'<img src="'+brand_service[i].img+'">' +
						'</div>' +
						'<div class="connect_text">' +
							brand_service[i].name+
						'</div>' +
					'</div>';
				$("#moreModal .modal-body").append(brand_service_content);

			}else{
				brand_service_content = 
				'<div class="bot_block bot_btn_blk" '+brand_service_func+'>' +
					'<div class="bot_block_img">' +
						'<img src="'+brand_service[i].img+'">' +
					'</div>' +
					'<div class="bot_block_content">' +
						brand_service[i].name+
					'</div>' +
				'</div>';
				$('#bottom .bot_btn').append(brand_service_content);
			}
		}else{
			let brand_service_content = 
				'<div class="col-4 connect_block bot_btn_blk" '+brand_service_func+'>' +
					'<div class="connect_img">' +
						'<img src="'+brand_service[i].img+'">' +
					'</div>' +
					'<div class="connect_text">' +
						brand_service[i].name+
					'</div>' +
				'</div>';
			$("#moreModal .modal-body").append(brand_service_content);
		}
	}
	let window_width = $('body').width();

	if(brand_service.length > 5){
		$('.bot_block').width((window_width)/5);
	}else{
		$('.bot_block').width((window_width)/brand_service.length);
	}

	$('#bottom').on('click','.bot_btn_blk',function(){
		let link = $(this).attr('link');
		if(link){
			window.location.href = link+brand_paramenter.show;
		}
		
	});

	$('#moreModal').on('click','.bot_btn_blk',function(){
		let link = $(this).attr('link');
		if(link){
			window.location.href = link;
		}
	});
}

var ajax_num = 0 ;
function get_detail(){
	if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(showPosition,errorPosition);
	} else { 
	    	console.log('location_error');
	    	latitude = null;
			longitude = null;
			brand_store.gps = false;
			do_ajax();
	}
}

function showPosition(position){//取精緯成功
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;
	console.log('location',position.coords.latitude,position.coords.longitude);
	do_ajax();
}
function errorPosition(error){//取精緯失敗
	console.log(error.message);
	do_ajax();
}

function do_ajax(){
	var data = {
		"id": brand_paramenter.show,
		"latitude": latitude,
		"longitude": longitude
	};
	console.log("data",data);
	$(".brand_conten").css('opacity',0);
	$("#bottom").css('opacity',0);
	$("#loading").show();
	$.ajax({
	    data : data,
	    url : data_url,
	    type : "get",
	    async : true ,
	    success : function(rtndata) {
	    	console.log("rtndata",rtndata);
	    	brand_img = rtndata.brand_img ;
	    	brand_summary = rtndata.brand_summary ;
	    	brand_store = rtndata.brand_store ;
	    	brand_html = rtndata.brand_html ;
	    	brand_news = rtndata.brand_news ;
	    	brand_ticket = rtndata.brand_ticket ;
	    	brand_point = rtndata.brand_point ;
	        brand_contact = rtndata.brand_contact ;
	        img();
	    	summary();
	    	store();
	    	html();
	    	news();
	    	ticket();
	    	point();
	        contact();
	        $('#index_right').click(function(){
				right_function();
			});
			$('#index_left').click(function(){
				left_function();
			});
			$('.index_content').css('overflow','auto');
			brand_parameter_temp = brand_paramenter.show;
			$(".brand_conten").css('opacity',1);
			$("#bottom").css('opacity',1);
			$("#bottom_empty").height($("#bottom .bot_btn").height());
			$("#loading").hide();
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
			console.log('error:'+ajax_num);
			if(ajax_num < 5){
				ajax_num += 1;
				get_detail();
			}else{
				brand_paramenter.show = brand_parameter_temp;
				brand(brand_paramenter);
				ajax_num = 0 ;
				$('#index_right').click(function(){
				right_function();
				});
				$('#index_left').click(function(){
					left_function();
				});
				$('.index_content').css('overflow','auto');
			}
			$(".brand_conten").attr('opacity',1);
	    }
	});
}

