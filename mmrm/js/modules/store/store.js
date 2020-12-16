$(document).ready(function(){

        //沒圖片
        if($('#pic img').length === 0){
            $("#pic").height(0.64*$("#pic").width());
        }

		$("#pic").slick({
			arrows : false,
			dots:true
		});

		//
		$("#logo").height($("#logo").width());
		$("#logo").css({top:-$("#logo").height()/2}) ;

		// 底部按鍵 start
		$('.bot_indicator img').click(function(){
			$('.bot_indicator').hide();
			$('#distance').hide();
			$('.bot_btn').slideUp();
		});

		$(window).bind('scroll', function() {
		    if ($(window).scrollTop() > 0) {
		     	$('.bot_indicator').hide();
		     	$('#distance').hide();
		     	$('.bot_btn').slideUp();
		    }
		    else {
		    	$('.bot_btn').slideDown('fast',function(){
		    		$('.bot_indicator').show();
		    		$('#distance').show();
		    	});
		    }
		});
		// 底部按鍵 end

		// phone(modal) start
		$("#phone").on("show.bs.modal",function(e){
		  	$("#connectModal_1").modal('hide');
		});
		$("#phone .btn_ok").click(function(){
			setTimeout(function(){
				$("#phone").modal('hide');
			},200);
		});
		// phone(modal) end
});



function contact(){
	if(brand_contact.display){
		let modal_content = '';
		if(brand_contact.content.tel){
			modal_content += '<li class="tel_link">' +
						'<div class="" ><a href="tel:'+brand_contact.content.tel+'">撥打電話</a></div>' +
					'</li>';
		}
		if(brand_contact.content.mail){
			modal_content += '<li class="email_link">' +
						'<div class="" ><a href="mailto:'+brand_contact.content.mail+'">電子郵件</a></div>' +
					'</li>';
		}
		if(brand_contact.content.addr){
			modal_content += '<li class="map_link">' +
						'<div class=""><a href="http://maps.google.com/maps?f=q&hl=zh-TW&geocode=&q='+brand_contact.content.addr+'">地圖指引</a></div>' +
					'</li>';
		}
		modal_content += '<li class="cancel">' +
					'<div class="cancel" data-dismiss="modal">取消</div>' +
				'</li>';
		$('#infoModal .contactList').empty().append(modal_content);
	}
}

function service(){
	for(i=0 ; i<brand_service.length ; i++){
		let brand_service_func = '' ;
		if(brand_service[i].trigger){
			brand_service_func = 'data-toggle="modal" data-target="#connectModal_1"' ;
            $('#connectModal_1 .contactList').empty();
			for(j=0 ; j<brand_service[i].trigger.list.length ; j++ ){
				if(brand_service[i].trigger.list[j].phone){
                    let other_link = '<li>';
                    $("#phone .btn_ok a").attr('href','tel:'+brand_service[i].trigger.list[j].phone);
                    other_link +=	'<div data-toggle="modal" data-target="#phone">'+brand_service[i].trigger.list[j].title+'</div>' ;
                    other_link += '</li>' ;
				    $('#connectModal_1 .contactList').append(other_link);
				}else if(brand_service[i].trigger.list[j].email){
                    let other_link = '<li>';
					other_link +=	'<a href="mailto:'+brand_service[i].trigger.list[j].email+'">' +
                                            '<div>'+brand_service[i].trigger.list[j].title+'</div>' +
                                        '</a>' ;
                    other_link += '</li>' ;
				    $('#connectModal_1 .contactList').append(other_link);
				}

			}
			let other_link = '<li><div class="cancel" data-dismiss="modal">取消</div></li>'
			$('#connectModal_1 .contactList').append(other_link);

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
						'<img src="img/btn_brand_tabbar_more_n@3x.png">' +
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

	$('#bottom').on('click','.bot_btn_blk',function(){
		let link = $(this).attr('link');
		if(link && link !=''){
			window.location.href = link;
		}

	});

	$('#moreModal').on('click','.bot_btn_blk',function(){
		let link = $(this).attr('link');
		if(link){
			window.location.href = link;
		}
	});
}
