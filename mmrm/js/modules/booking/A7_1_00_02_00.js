let allBrandInfo;
let selectedBooking;
let rsvnnumber;
let memberCardNumber;
let dataUrl = "/line_portal_api/v1/booking/doBookingSearch";
let memberCardUrl = "/line_portal_api/v1/member/doGetMemberCard";

$(document).ready(function(){

})

function init(){
    selectedBooking = localStorage.getItem('selectedBooking');
    if (selectedBooking) {
        selectedBooking = JSON.parse(selectedBooking);

        doAjaxToGetMemberCard();
        doAjaxToSearchBooking(selectedBooking["d_rvnm"], selectedBooking["rvnm_id"]);
    }
}

function showInfo() {
    $("#info").hide();
    $("#info").empty();

    list_block =
        '<div class="card">' +
            '<div class="block text-center py-5">' +
                '<p class="largeText text-secondary my-5">會員卡號<br>' + memberCardNumber + '</p>' +
                '<p class="largeText text-secondary my-5">訂位編號<br>' + rsvnnumber[0]["rvnm_id"] + '</p>' +
            '</div>' +
            '<div class="btn btn-link" id="switchToQrCode">切換二維條碼</div>' +
        '</div>' +
        '<p class="largeText text-secondary text-center my-4">入場及結帳時請出示email / App 訂位條碼畫面<br> 給結帳人員核銷唷！</p>';

    $("#info").append(list_block);
    $("#info").show();

    $("#switchToQrCode").click(function() {
        showInfoWithQrCode();
    })
}

function showInfoWithQrCode() {
    $("#info").hide();
    $("#info").empty();

    allBrandInfo = localStorage.getItem('allBandInfoForBooking');
    allBrandInfo = JSON.parse(allBrandInfo);

    str = rsvnnumber[0]["d_rvnm"]
    bookingDate = str.substring(0,4) + "/" + str.substring(4,6) + "/" + str.substring(6,8);

    str = rsvnnumber[0]["t_rvnm"]
    bookingTime = str.substring(0,2) + ":" + str.substring(2,4);

    bookingDay = getBookingDay(rsvnnumber[0]["d_rvnm"]);

    brndId = rsvnnumber[0]["brnd_id"];
    brandName = "";
    brandLogo = "";
    for(j = 0 ; j < allBrandInfo.length ; j++) {
        if (brndId == allBrandInfo[j].brand_code) {
            brandName = allBrandInfo[j].title;
            brandLogo = allBrandInfo[j].feature_image_small.url;
            break;
        }
    }

    list_block =
        '<div class="card">' +
            '<div class="block text-center">' +
                '<div class="d-flex justify-content-center align-items-center my-4">' +
                    '<img src="' + brandLogo + '" class="rounded-circle conpanyImg">' +
                    '<div class="name">' + brandName + '</div>' +
                '</div>' +
                '<p class="largeText text-secondary my-2">' + rsvnnumber[0]["stor_name"] + '<br>' + bookingDate + ' ' + bookingDay + ' ' + bookingTime + '</p>' +
            '</div>' +
            '<div class="qrImg">' +
                '<div id="qrcodeBox"></div>' +
            '</div>' +
            '<div class="btn btn-link" id="switchToInfo">切換條碼資訊</div>' +
        '</div>' +
        '<p class="largeText text-secondary text-center my-4">入場及結帳時請出示email / App 訂位條碼畫面<br> 給結帳人員核銷唷！</p>';

    $("#info").append(list_block);
    $("#info").show();

    card_info = [
        {
            "key": "member card",
            "value": memberCardNumber,
        },
        {
            "key": "credit card",
            "value": "",
        },
    ];
    source = {
        "system":"MMRM",
        "app":"FMS",
        "type":"booking"
    };

    qrText = {
        "order_no": selectedBooking["rvnm_id"],
        "card_info":card_info,
        "source":source
    };
    //console.log("--->", JSON.stringify(qrText));

    new QRCode('qrcodeBox', {
        text: JSON.stringify(qrText),
        width: 180,
        height: 180,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    $("#switchToInfo").click(function() {
        showInfo();
    })
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
        url : dataUrl,
        type : "post",
        async : true ,
        success : function(rtndata) {
            if (rtndata["status"] === 1 && rtndata["results"]["send_payload"] && rtndata["results"]["send_payload"]["data"] && rtndata["results"]["send_payload"]["data"]["rsvnnumber"]) {
                rsvnnumber = rtndata["results"]["send_payload"]["data"]["rsvnnumber"];
                showInfoWithQrCode();
            }

            $("#loading").hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('doAjaxToSearchBooking error');
            $("#loading").hide();
        }
    });
}

function doAjaxToGetMemberCard() {
    memberCardNumber = "";

    let data = {
    };

    $.ajax({
        data : data,
        url : memberCardUrl,
        type : "post",
        async : false ,
        success : function(rtndata) {
            memberCardNumber = "";

            if (rtndata["status"] == 1 && rtndata["results"]["member_card"] && rtndata["results"]["member_card"]["code_info"] && rtndata["results"]["member_card"]["code_info"]["card_info"]) {
                let cardInfo = rtndata["results"]["member_card"]["code_info"]["card_info"];
                for (let i = 0; i < cardInfo.length; i++) {
                    if (cardInfo[i]["key"] === "member card") {
                        memberCardNumber = cardInfo[i]["value"];
                        break;
                    }
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('doAjaxToGetMemberCard error');
        }
    });
}
