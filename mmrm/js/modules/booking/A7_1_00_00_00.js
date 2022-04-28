let allBrandId = [];
let allBrandInfo = [];
let dataUrl = "/line_portal_api/v1/booking/doBookingSearch";
let pageDetailUrl = "/line_portal/booking/detail";
let pageCancelDetailUrl = "/line_portal/booking/cancelDetail";
let pageQrCodeUrl = "/line_portal/booking/qrcode";

$(document).ready(function(){
    $("#n1-tab").click(function() {
        doAjaxToSearchBooking("current");
    })

    $("#n2-tab").click(function() {
        doAjaxToSearchBooking("record");
    })
})

function getList(){
    localStorage.removeItem('selectedBooking');
    localStorage.removeItem('allBandInfoForBooking');
    doAjaxToSearchBooking("current");
}

function showEmpty(type) {
    if (type == "current") {
        $("#n1").hide();
        $("#n1").empty();
    }
    else {
        $("#n2").hide();
        $("#n2").empty();
    }

    listBlock =
        '<div class="noItem text-center">' +
            '<div class="my-5"><img style="width:100px" src="/portal_assets/img/img_reservehistory_empty_n_n@2x.png" alt=""></div>' +
            '<h5 class="text-gray mb-5">你目前還沒有訂位紀錄哦！</h5>' +
        '</div>';

    if (type == "current") {
        $("#n1").append(listBlock);
        $("#n1").show();
    }
    else {
        $("#n2").append(listBlock);
        $("#n2").show();
    }
}

function showList(rsvnnumber, type) {
    if (type == "current") {
        $("#n1").hide();
        $("#n1").empty();
    }
    else {
        $("#n2").hide();
        $("#n2").empty();
    }

    list_block = "";
    for(i = 0 ; i < rsvnnumber.length ; i++) {
        str = rsvnnumber[i]["d_rvnm"];
        bookingDate = str.substring(0,4) + "/" + str.substring(4,6) + "/" + str.substring(6,8);

        str = rsvnnumber[i]["t_rvnm"];
        bookingTime = str.substring(0,2) + ":" + str.substring(2,4);

        bookingDay = getBookingDay(rsvnnumber[i]["d_rvnm"]);

        brndId = rsvnnumber[i]["brnd_id"];
        for(j = 0 ; j < allBrandInfo.length ; j++) {
            if (brndId == allBrandInfo[j].brand_code) {
                brandName = allBrandInfo[j].title;
                brandLogo = allBrandInfo[j].feature_image_small.url;
                break;
            }
        }

        bookingInfo = [
            "'" + rsvnnumber[i]["d_rvnm"] + "'",
            "'" + rsvnnumber[i]["rvnm_id"] + "'",
            "'" + rsvnnumber[i]["is_cancel"] + "'",
            "'" + rsvnnumber[i]["brnd_id"] + "'",
            "'" + rsvnnumber[i]["stor_id"] + "'",
            "'" + allBrandInfo[j].brand_id + "'"
        ];

        if (rsvnnumber[i]["is_cancel"] == "F") {
            bookingStatus = "訂位完成";
        }
        else {
            bookingStatus = "訂位取消";
        }

        list_block +=
            '<div class="card">' +
                '<div class="card-header">' +
                    '<div class="item">' +
                        '<div class="left">' +
                            '<img src="' + brandLogo + '" class="rounded-circle conpanyImg">' +
                            '<div class="largeText  ellipsis">' + brandName + '</div>' +
                        '</div>' +
                        '<div class="right">' +
                            '<div class="largeText ">' + rsvnnumber[i]["stor_name"] + '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="card-body py-4">' +
                    '<div class="item cart" onclick="bookingDetailInfo(' + bookingInfo + ');">' +
                        '<div class="left">' +
                            '<div class="text">' +
                                '<h6 class="text-secondary mb-2">用餐時間</h6>' +
                                '<div class="largeText  mb-3">' + bookingDate + ' ' + bookingDay + ' ' + bookingTime + '</div>' +
                            '</div>' +
                            '<div class="text">' +
                                '<h6 class="text-secondary mb-2">用餐人數</h6>';

        if (rsvnnumber[i]["rvnm_man2"] === 0) {
            list_block += '<div class="largeText ">' + rsvnnumber[i]["rvnm_man1"] + '位大人<br>' + rsvnnumber[i]["rvtb_name"] + '</div>';
        }
        else {
            list_block += '<div class="largeText ">' + rsvnnumber[i]["rvnm_man1"] + '位大人 ' + rsvnnumber[i]["rvnm_man2"] + '位小孩<br>' + rsvnnumber[i]["rvtb_name"] + '</div>';
        }

        list_block +=
                            '</div>' +
                        '</div>' +
                        '<div class="right">' +
                            '<div class="largeText  text-secondary">' + bookingStatus + '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';

        if (rsvnnumber[i]["is_cancel"] == "F") {
            list_block +=
                '<div class="card-addition text-center">' +
                    '<a href="#" onclick="bookingQrCode(' + bookingInfo + ');" class="btn btn-link text-danger p-0"><h5 class="">打開訂位條碼</h5></a>' +
                '</div>' +
                '</div>';
        }
        else {
            list_block += '</div>';
        }
    }

    if (type == "current") {
        $("#n1").append(list_block);
        $("#n1").show();
    }
    else {
        $("#n2").append(list_block);
        $("#n2").show();
    }
}

function bookingDetailInfo(d_rvnm, rvnm_id, is_cancel, brnd_id, stor_id, mmrm_brand_id) {
    let info = {
        d_rvnm: d_rvnm,
        rvnm_id: rvnm_id,
        brnd_id: brnd_id,
        stor_id: stor_id,
        mmrm_brand_id: mmrm_brand_id,
    };
    localStorage.setItem('selectedBooking', JSON.stringify(info));

    if (is_cancel == "F") {
        location.href = pageDetailUrl;
    }
    else {
        location.href = pageCancelDetailUrl;
    }
}

function bookingQrCode(d_rvnm, rvnm_id, is_cancel, brnd_id, stor_id, mmrm_brand_id) {
    let info = {
        d_rvnm: d_rvnm,
        rvnm_id: rvnm_id,
        brnd_id: brnd_id,
        stor_id: stor_id,
        mmrm_brand_id: mmrm_brand_id,
    };
    localStorage.setItem('selectedBooking', JSON.stringify(info));

    location.href = pageQrCodeUrl;
}

function doAjaxToGetAllBrandId() {
    allBandInfoForBooking = localStorage.getItem('allBandInfoForBooking');
    if (allBandInfoForBooking) {
        return;
    }

    let data = {
    };

    $.ajax({
        data : data,
        url : "/line_portal_api/v1/brand/doSearchBrand",
        type : "post",
        async : false ,
        success : function(rtndata) {
            allBrandId = [];
            if (rtndata["status"] === 1) {
                allBrandId = rtndata["results"]["brand_ids"];
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('doAjaxToGetAllBrandId error');
        }
    });
}

function doAjaxToGetAllBrandInfo() {
    allBandInfoForBooking = localStorage.getItem('allBandInfoForBooking');
    if (allBandInfoForBooking) {
        allBrandInfo = JSON.parse(allBandInfoForBooking);
        return;
    }

    let data = {
        brand_ids: allBrandId,
        full_info: 0
    };

    $.ajax({
        data : data,
        url : "/line_portal_api/v1/brand/doBrandInformation",
        type : "post",
        async : false ,
        success : function(rtndata) {
            allBrandInfo = [];
            if (rtndata["status"] === 1) {
                allBrandInfo = rtndata["results"]["brand_information"];
                localStorage.setItem('allBandInfoForBooking', JSON.stringify(allBrandInfo));
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('doAjaxToGetAllBrandInfo error');
        }
    });
}

function doAjaxToSearchBooking(type) {
    $("#loading").show();

    let d_rvnm_f;
    let d_rvnm_t;

    if (type == "current") {
        d_rvnm_f = dayjs().format('YYYYMMDD');
        d_rvnm_t = dayjs().add(60, 'day').format('YYYYMMDD');
    }
    else {
        d_rvnm_f = dayjs().subtract(180, 'day').format('YYYYMMDD');
        d_rvnm_t = dayjs().subtract(1, 'day').format('YYYYMMDD');
    }

    let payload = JSON.stringify({
        "stor_id":"",
        "brnd_id":"",
        "d_rvnm_f": d_rvnm_f,
        "d_rvnm_t": d_rvnm_t,
        "is_cancel":"",
        "is_confirm":"",
        "rvnm_id":""
    });

    let data = {
        api_name: '/bookingTable/search',
        payload: window.$wm_aes(payload)
    };

    $.ajax({
        data : data,
        url : dataUrl,
        type : "post",
        async : true ,
        success : function(rtndata) {
            //console.log("===", rtndata);

            if (rtndata["status"] === 1 && rtndata["results"]["send_payload"] && rtndata["results"]["send_payload"]["data"] && rtndata["results"]["send_payload"]["data"]["rsvnnumber"]) {
                let rsvnnumber = rtndata["results"]["send_payload"]["data"]["rsvnnumber"];

                doAjaxToGetAllBrandId();
                doAjaxToGetAllBrandInfo();

                if (rsvnnumber.length > 0) {
                    showList(rsvnnumber, type);
                }
                else {
                    showEmpty(type);
                }
            }

            $("#loading").hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('doAjaxToSearchBooking error');
            $("#loading").hide();
        }
    });
}
