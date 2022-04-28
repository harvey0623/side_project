let bookingSearchUrl = "/line_portal_api/v1/booking/doBookingSearch";
let invitationCardUrl = "/line_portal_api/v1/booking/invitationCardUrl";
let allStoreUrl = "/line_portal_api/v1/store/doSearchStore";
let allStoreInfoUrl = "/line_portal_api/v1/store/doStoreInformation";
let qrCodePageUrl = "/line_portal/booking/qrcode";
let rsvnDateTimeStr;
let rsvnnumber;
let rsvnBrandName;
let rsvnBrandLogo;
let allStoreId;
let allStoreInfo;
let selectedBooking;

$(document).ready(function(){
    $("#addToCalendar").click(function() {
        let url = "/line_portal/icsDownload" +
            "?brand=" + rsvnBrandName +
            "&store=" + rsvnnumber[0]["stor_name"] +
            "&start=" + rsvnDateTimeStr +
            "&addr=" + $("#sharedStoreAddr").text() +
            "&tel=" + $("#sharedStoreTel").text() +
            "&service1=" + rsvnnumber[0]["rvnm_service1"] +
            "&man1=" + rsvnnumber[0]["rvnm_man1"] +
            "&man2=" + rsvnnumber[0]["rvnm_man2"] +
            "&link=" + rsvnnumber[0]["reserv_link"] +
            '&openExternalBrowser=1';
        window.open(url, '_blank');
    })

    $("#navigation").click(function() {
        googleMapUrl = getGoogleMapUrl();
        window.open(googleMapUrl, '_blank');
    })

    $("#changeBooking").click(function() {
        window.open(rsvnnumber[0]["reserv_link"] + '?openExternalBrowser=1', '_blank');
    })
})

function init(){
    selectedBooking = localStorage.getItem('selectedBooking');
    if (selectedBooking) {
        selectedBooking = JSON.parse(selectedBooking);

        doAjaxToSearchAllStore(selectedBooking["mmrm_brand_id"])
        doAjaxToGetAllStoreInfo();
        doAjaxToSearchBooking(selectedBooking["d_rvnm"], selectedBooking["rvnm_id"]);
    }
}

function showDetail(rsvnnumber) {
    $("#detailContent").hide();
    $("#detailContent").empty();

    let allBrandInfo = localStorage.getItem('allBandInfoForBooking');
    allBrandInfo = JSON.parse(allBrandInfo);

    let rsvnData = rsvnnumber[0];

    let str = rsvnData["d_rvnm"];
    bookingDate = str.substring(0,4) + "/" + str.substring(4,6) + "/" + str.substring(6,8);

    str = rsvnData["t_rvnm"];
    bookingTime = str.substring(0,2) + ":" + str.substring(2,4);

    rsvnDateTimeStr = bookingDate + " " + bookingTime;

    bookingDay = getBookingDay(rsvnData["d_rvnm"]);

    bookingInfo = [rsvnData["d_rvnm"], "'" + rsvnData["rvnm_id"] + "'"];

    brndId = rsvnData["brnd_id"];
    rsvnBrandName = "";
    rsvnBrandLogo = "";
    for(j = 0 ; j < allBrandInfo.length ; j++) {
        if (brndId === allBrandInfo[j].brand_code) {
            rsvnBrandName = allBrandInfo[j].title;
            rsvnBrandLogo = allBrandInfo[j].feature_image_small.url;
            break;
        }
    }

    for (let i = 0; i < allStoreInfo.length; i++) {
        if (allStoreInfo[i]["code"] === selectedBooking["stor_id"]) {
            $("#sharedStoreAddr").text(allStoreInfo[i]["address"]);
            $("#sharedStoreTel").text(allStoreInfo[i]["tel"]);
            break;
        }
    }

    detail = '';
    if (rsvnData["is_cancel"] === "F") {
        bookingStatus = "訂位完成";
        detail +=
            '<div class="block mb-3">' +
                '<div class="item">' +
                    '<div class="d-flex align-items-center">' +
                        '<img src="/portal_assets/img/img_reservehistory_code_n_n.png" class="conpanyImg">' +
                        '<div class="name">開啟訂位條碼</div>' +
                    '</div>' +
                    '<div class="blockAngle" id="openQrCode"></div>' +
                '</div>' +
            '</div>';
    }
    else {
        bookingStatus = "訂位取消";
    }

    detail +=
        '<div class="title">訂單資訊</div>' +
        '<div class="card">' +
            '<div class="card-header">' +
                '<div class="item">' +
                    '<div class="left">' +
                        '<img src="' + rsvnBrandLogo + '" class="rounded-circle conpanyImg">' +
                        '<div class="largeText  ellipsis">' + rsvnBrandName + '</div>' +
                    '</div>' +
                    '<div class="right">' +
                        '<div class="largeText ">' + rsvnData["stor_name"] + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="card-body py-4">' +
                '<div class="item cart">' +
                    '<div class="left">' +
                        '<div class="text">' +
                            '<h6 class="text-secondary mb-2">用餐時間</h6>' +
                            '<div class="largeText mb-3" id="rsvnDateTime" rsvnDateTime="' + rsvnDateTimeStr + '">' + bookingDate + ' ' + bookingDay + ' ' + bookingTime + '</div>' +
                        '</div>' +
                        '<div class="text">' +
                            '<h6 class="text-secondary mb-2">用餐人數</h6>';

    if (rsvnData["rvnm_man2"] === 0) {
        detail +=           '<div class="largeText mb-3">' + rsvnData["rvnm_man1"] + '位大人 ' + rsvnData["rvtb_name"] + '</div>';
    }
    else {
        detail +=           '<div class="largeText mb-3">' + rsvnData["rvnm_man1"] + '位大人 ' + rsvnData["rvnm_man2"] + '位小孩 / ' + rsvnData["rvtb_name"] + '</div>';
    }

    detail +=
                        '</div>' +
                        '<div class="text">' +
                            '<h6 class="text-secondary mb-2">訂位人</h6>' +
                            '<div class="largeText mb-2">' + rsvnData["rvnm_name"] + '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="right">' +
                        '<div class="largeText  text-secondary">' + bookingStatus + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="card-addition">' +
                '<h6 class="text-secondary" id="rvnmId" rvnmId="' + rsvnData["rvnm_id"] + '">訂位編號' + ' ' + rsvnData["rvnm_id"] + '</h6>' +
            '</div>' +
        '</div>';

if (rsvnData["rvnm_service1"] || rsvnData["rvnm_note"]) {
    detail +=
        '<div class="title">附註資訊</div>' +
        '<div class="card">' +
            '<div class="card-header">' +
            '</div>' +
            '<div class="card-body">';
    if (rsvnData["rvnm_service1"]) {
        detail +=
                '<div class="item cart">'+
                    '<div class="text">' +
                        '<h6 class="text-secondary mb-2">用餐目的</h6>' +
                        '<div class="largeText mb-3">' + rsvnData["rvnm_service1"] + '</div>' +
                    '</div>' +
                '</div>';
    }

    if (rsvnData["rvnm_note"]) {
        detail +=
                '<div class="item cart">'+
                    '<div class="text">' +
                        '<h6 class="text-secondary mb-2">特殊需求</h6>' +
                        '<div class="largeText mb-2">' + rsvnData["rvnm_note"] + '</div>' +
                    '</div>' +
                '</div>';
    }

    detail +=
            '</div>' +
        '</div>';
}
    /*
    detail +=
        '<div class="title">方案選擇</div>' +
        '<div class="card">' +
            '<div class="card-header">' +
                '<div class="item">' +
                    '<div class="left">' +
                        '<div class="largeText  ellipsis">' + rsvnData["rvnm_service1"] + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="card-body">' +
                '<div class="item">' +
                    '<div class="text-secondary">' +
                        '爸爸您辛苦了，父親節來西堤用餐大人7折、小孩免費，再贈西堤主廚父親節蛋糕一份！<br><br>大人單價 $400 / 小孩單價 $0' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +

        '<div class="title">用餐選擇</div>' +
        '<div class="card">' +
            '<div class="card-header">' +
                '<div class="item">' +
                    '<div class="left">' +
                        '<div class="largeText  ellipsis">烤鴨半隻 (約14片)</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    */

    /*
    if (rsvnData["rvnm_note"]) {
        detail +=
            '<div class="title">附註資訊</div>' +
            '<div class="card">' +
                '<div class="card-header">' +
                '<div class="item">' +
                    '<div class="left">' +
                        '<div class="largeText  ellipsis">兒童餐具數量</div>' +
                    '</div>' +
                    '<div class="right">' +
                        '<div class="largeText  text-secondary">3</div>' +
                    '</div>' +
                '</div>' +
                '<div class="item">' +
                    '<div class="left">' +
                        '<div class="largeText  ellipsis">需要電梯</div>' +
                    '</div>' +
                    '<div class="right">' +
                        '<div class="largeText  text-secondary">是</div>' +
                    '</div>' +
                '</div>' +
                '<div class="item">' +
                    '<div class="left">' +
                        '<div class="largeText  ellipsis">特殊需求</div>' +
                    '</div>' +
                    '<div class="right">' +
                        '<div class="largeText "></div>' +
                    '</div>' +
                '</div>' +
                '</div>' +
                '<div class="card-body">' +
                    '<div class="item">' +
                        '<div class="text-secondary">' +
                            rsvnData["rvnm_note"] +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
    }
    */

    $("#detailContent").append(detail);
    $("#detailContent").show();

    $("#openQrCode").click(function() {
        location.href = qrCodePageUrl;
    })
}

function sharingCanvas() {
    //console.log(rsvnBrandLogo);
    //console.log(selectedBooking);

    let data = {
        logoUrl: rsvnBrandLogo,
        brnd_id: selectedBooking["brnd_id"],
        mmrm_brand_id: selectedBooking["mmrm_brand_id"]
    };

    $.ajax({
        data : data,
        url : invitationCardUrl,
        type : "post",
        async : true ,
        success : function(rtndata) {
            //console.log(rtndata["results"]["rtnurlCardLogo"]);
            //console.log(rtndata["results"]["rtnurlCardBg"]);

            $("#cardBg").attr("src", rtndata["results"]["rtnurlCardBg"]);
            $("#sharedBrandLogo").attr("src", rtndata["results"]["rtnurlCardLogo"]);
            $("#shareBrandName").text(rsvnBrandName);
            $("#sharedDate").text(bookingDate + ' ' + bookingDay + ' ' + bookingTime);
            if (rsvnnumber[0]["rvnm_man2"] === 0) {
                $("#sharedPeople").text(rsvnnumber[0]["rvnm_man1"] + '位大人');
            }
            else {
                $("#sharedPeople").text(rsvnnumber[0]["rvnm_man1"] + '位大人 ' + rsvnnumber[0]["rvnm_man2"] + '位小孩');
            }
            $("#sharedStoreName").text(rsvnnumber[0]["stor_name"]);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('doAjaxToSearchBooking error');
        }
    });
}

function doAjaxToSearchBooking(date, rvnmId) {
	$("#loading").show();

    let payload = JSON.stringify({
        "stor_id":"",
        "brnd_id":"",
        "d_rvnm_f": date,
        "d_rvnm_t": date,
        "is_cancel":"",
        "is_confirm":"",
        "rvnm_id":rvnmId
    });

    let data = {
        api_name: '/bookingTable/search',
        payload: window.$wm_aes(payload)
    };

	$.ajax({
	    data : data,
	    url : bookingSearchUrl,
	    type : "post",
	    async : true ,
	    success : function(rtndata) {
            if (rtndata["status"] === 1 && rtndata["results"]["send_payload"] && rtndata["results"]["send_payload"]["data"] && rtndata["results"]["send_payload"]["data"]["rsvnnumber"]) {
                rsvnnumber = rtndata["results"]["send_payload"]["data"]["rsvnnumber"];
                if (rsvnnumber.length > 0) {
                    showDetail(rsvnnumber);
                    sharingCanvas();
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

function doAjaxToSearchAllStore(brandId) {
    let data = {
        brand_ids: [brandId]
    };

    $.ajax({
        data : data,
        url : allStoreUrl,
        type : "post",
        async : false ,
        success : function(rtndata) {
            allStoreId = [];
            if (rtndata["status"] === 1) {
                allStoreId = rtndata["results"]["store_ids"];
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('doAjaxToSearchAllStore error');
        }
    });
}

function doAjaxToGetAllStoreInfo() {
    let data = {
        store_ids: allStoreId,
        query_info: "summary"
    };

    $.ajax({
        data : data,
        url : allStoreInfoUrl,
        type : "post",
        async : true ,
        success : function(rtndata) {
            if (rtndata["status"] === 1) {
                allStoreInfo = rtndata["results"]["store_information"];
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('doAjaxToGetAllStoreInfo error');
        }
    });
}

function getGoogleMapUrl() {
    let url = "";

    for (let i = 0; i < allStoreInfo.length; i++) {

        if (allStoreInfo[i]["code"] === selectedBooking["stor_id"]) {
            externalMeta = allStoreInfo[i]["external_meta"];
            for (let j = 0; j < externalMeta.length; j++) {
                if (externalMeta[j]["key"] === "inline_branchid") {
                    //console.log("=== inline_branchid ===:", externalMeta[j]["value"]);
                    break;
                }
            }

            let latitude = allStoreInfo[i]["location"]["latitude"];
            let longitude = allStoreInfo[i]["location"]["longitude"];

            url = "http://maps.google.com/?q=" + latitude + "," + longitude;
            break;
        }
    }

    return url;
}

/*
const toTimestamp = (strDate) => {
    const dt = Date.parse(strDate);
    return dt / 1000;
}

function doAddToGoogleCalendar() {
    let storeName = rsvnnumber[0]["stor_name"];
    let bookingTimestamp = toTimestamp(rsvnDateTimeStr);
    let endTimestamp = bookingTimestamp + (2 * 60 * 60);

    let endDateObj = new Date(endTimestamp * 1000);
    let date = ("0" + endDateObj.getDate()).slice(-2);
    let month = ("0" + (endDateObj.getMonth() + 1)).slice(-2);
    let year = endDateObj.getFullYear();
    let hours = endDateObj.getHours();
    let minutes = endDateObj.getMinutes();
    //let seconds = endDateObj.getSeconds();

    let event = {
        start: rsvnDateTimeStr,
        end: year + "-" + month + "-" + date + " " + hours + ":" + minutes,
        //duration: [1, "day"],
        title: rsvnBrandName + " " + storeName + " 訂位",
        description: "",
        busy: false,
    };

    return calendarLink.google(event);
}
*/
