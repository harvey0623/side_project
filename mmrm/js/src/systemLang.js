window.getSystemLang = function(key) {
   return window.systemLang[key] || '';
}

window.systemLang = {
   //===base
   g_e_formincorrectpwdformat: '密碼長度或格式不符：英數字混合 6~12碼',
   g_e_formincorrectmobileformat: '手機長度不正確',
   term_b_agree: '我已閱讀完並同意條款',
   g_ok: '確定',
   g_cancel: '取消',
   g_deselectall: '全部清除',
   g_required: '必填',
   g_emailformaterror: '電子信箱格式有誤',
   memberformkit_e_inconsistpwd: '密碼與確認密碼不符',
   memberformkit_e_inconsistemail: '信箱帳號與確認信箱帳號不符',
   g_e_datemustfill: '請輸入日期',
   g_enddatethanstartdate: '結束日期需比開始日期晚',
   g_datebetween: '查詢日期需介在<br>%s~%s',
   g_search: '搜尋',
   g_birthday: '出生日期範圍錯誤，請重新輸入',

   //===privacy
   memberregisterprivacy_b_agree: '我已閱讀完並同意條款',

   //===member card
   membercard_b_1dbarcode: '切換一維條碼',
   membercard_b_2dbarcode: '切換二維條碼',
   membercard_vehicleno: '載具條碼',

   //===Security Question
   membersecurityquestion_sq01: '您畢業的國小',
   membersecurityquestion_sq02: '您最愛的寵物名字',
   membersecurityquestion_sq03: '您最愛的食物',
   membersecurityquestion_sq04: '您最好朋友的名字',
   membersecurityquestion_sq05: '您最愛的電影',

   //===Gender
   membergender_male: '男性',
   membergender_female: '女性',
   membergender_secret: '保密',

   //===level
   levelinformation_upgrade: '達成以下任一條件即可升等',
   levelinformation_renew: '達成以下任一條件即可續等',
   levelinformation_amount: '累計消費',
   levelinformation_frequency: '消費次數',
   levelinformation_amountformat: '$%s / $%s',
   levelinformation_frequencyformat: '%s 次 / %s 次',

   //===point
   point_unit: '點',
   point_txnid: '交易序號',
   point_txndatetime: '點數交易',
   mypointdetail_searchstartdatetime: '查詢開始日期',
   mypointdetail_searchenddatetime: '查詢結束日期',
   point_negativeamount: '%s 點',
   
   //===transaction
   txnrecord_entriestitle: '消費品項',
   txnrecord_total: '合計',
   txn_negativeamount: '%s 元',
   txnrecord_amount: '%s 元',
   txnhistory_searchstartdatetime: '紀錄開始日期',
   txnhistory_searchenddatetime: '紀錄結束日期',
   
   //===couponList
   mycouponlist_optionmycoupon: '我的票券',
   mycouponlist_optionhistory: '歷史票券',
   mycouponlist_optiontransferred: '轉贈紀錄',
   mycouponlist_unopened: '尚未開始',
   mycouponlist_expired: '已逾期',
   mycouponlist_invalid: '已失效',
   mycouponlist_used: '已用畢',
   mycouponlist_transferred: '已轉贈',
   mycouponlist_expiredtime: '逾期時間：%s',
   mycouponlist_invalidtime: '失效時間：%s',
   mycouponlist_transferredaccount: '受贈帳號：%s',
   mycouponlist_transferredtime: '轉贈時間：%s',
   mycouponlist_usedtime: '使用時間：%s',
   mycouponlist_usageinfoallbrands: '全門市適用 / 尚可用 %s 次',
   mycouponlist_usageinfo: '適用 %s 家門市 / 尚可用 %s 次',
   
   //===coupon detail
   mycoupondetail_transferable: '允許轉贈',
   mycoupondetail_nontransferable: '不可轉贈',
   mycoupondetail_b_unopened: '尚未開始',
   mycoupondetail_b_expired: '已逾期',
   mycoupondetail_b_invalid: '已失效',
   mycoupondetail_b_used: '已用畢',

   //===coupon card
   couponcode_b_1dbarcode: '切換一維條碼',
   couponcode_b_2dbarcode: '切換二維條碼',
   couponcode_couponnumber: '票券條碼',
   couponcode_vehiclenumber: '載具條碼',

   //===coupon activity list
   couponactivitylist_unopened: '尚未開始',
   couponactivitylist_closed: '已結束',
   couponactivitylist_free: '免費兌換',
   couponactivitylist_redeemcode: '兌換碼兌換',
   couponactivitylist_redeemdurationkey: '兌換期間',
   couponactivitylist_b_filter: '篩選',
   couponactivitylist_searchbrand: '選擇品牌',
   couponactivitylist_searchredeemtype: '兌換方式',
   couponactivitylist_searchallbrand: '全部',
   couponactivitylist_searchallredeemtype: '全部',
   couponactivitylist_searchviewmode: '瀏覽模式',
   couponactivitylist_categorypoint: '點數兌換 - %s',
   couponactivitylist_countdownText: '%s天%s時%s分',

   //===coupon activity detail
   couponactivitydetail_b_free: '免費兌換',
   couponactivitydetail_b_redeemcode: '兌換碼兌換',
   couponactivitydetail_b_point: '點數兌換',
   couponactivitydetail_b_unopened: '無法兌換，活動尚未開始',
   couponactivitydetail_b_closed: '無法兌換，活動已結束',
   couponactivityredeem_redeempointtitle: '選擇兌換幣別',
   couponactivityredeem_pointmsg: '確定要用 %1$s %2$s 點兌換「%3$s」 嗎？',
   couponactivitydetail_redeemcouponinfoallbrands: '全門市適用 / 可用 %s 次',
   couponactivitydetail_redeemcouponinfo: '適用 %s 家門市 / 可用 %s 次',
   couponactivitydetail_redeemcouponduration: '使用期間',

   //===point activity list
   pointactivitylist_b_filter: '篩選',
   pointactivitylist_searchbrand: '選擇品牌',
   pointactivitylist_searchredeemtype: '兌換方式',
   pointactivitylist_searchviewmode: '瀏覽模式',
   pointactivitylist_searchallbrand: '全部',
   pointactivitylist_searchallredeemtype: '全部',

   //===point activity detail
   pointactivitydetail_b_free: '免費兌換',
   pointactivitydetail_b_redeemcode: '兌換碼兌換',
   pointactivitydetail_b_unopened: '無法兌換，活動尚未開始',
   pointactivitydetail_b_closed: '無法兌換，活動已結束',
   pointactivitydetail_duration: '%s 到期',

   //===Message Inbox
   messagelist_public: '公眾訊息',
   messagelist_member: '個人訊息',
   messagelist_notification: '通知訊息',

   //===Mission
   missiontaskreward_couponusageduration: '使用期限：%s'

};