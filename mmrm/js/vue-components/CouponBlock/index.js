Vue.component('coupon-block', {
   props: {
      index: {
         type: Number,
         required: true
      },
      info: {
         type: Object,
         required: true
      },
      pageurl: {
         type: String,
         required: true
      },
      brandlist: {
         type: Array,
         required: true
      },
      reverse: {
         type: Boolean,
         default: false
      },
      currentType: {
         type: String,
         default: ''
      },
   },
   data() {
      return {
         usageStatus: {
            available: '可使用',
            notyet: window.getSystemLang('mycouponlist_unopened'),
            expired: window.getSystemLang('mycouponlist_expired'),
            obsolete: window.getSystemLang('mycouponlist_invalid'),
            redeemed: window.getSystemLang('mycouponlist_used'),
            transferred: window.getSystemLang('mycouponlist_transferred')
         },
         historyStatus: {
            expired: vsprintf(window.getSystemLang('mycouponlist_expiredtime'), ['']),
            obsolete: vsprintf(window.getSystemLang('mycouponlist_invalidtime'), ['']),
            redeemed: vsprintf(window.getSystemLang('mycouponlist_usedtime'), ['']),
         },
         transferredaccount: vsprintf(window.getSystemLang('mycouponlist_transferredaccount'), ['']),
         transferredtime: vsprintf(window.getSystemLang('mycouponlist_transferredtime'), ['']),
         usedtime: vsprintf(window.getSystemLang('mycouponlist_usedtime'), ['']),
         usageinfoallbrands: window.getSystemLang('mycouponlist_usageinfoallbrands'),
         usageinfo: window.getSystemLang('mycouponlist_usageinfo'),
      }
   },
   computed: {
      statusText() {
         let key = this.info.status;
         return this.usageStatus[key];
      },
      isAvailable() {
         return this.info.status === 'available';
      },
      pageLink() {
         if (this.info.status !== 'notyet') return `${this.pageurl}?my_coupon_id=${this.info.my_coupon_id}`;
         else return 'javascript:;';
      },
      couponInfo() {
         return this.info.couponInfo;
      },
      couponTitle() {
         if (this.couponInfo === null) return '';
         return this.couponInfo.title;
      },
      couponTitleBg() { //票券背景圖
         if (this.couponInfo === null) return {};
         let bgUrl = this.couponInfo.feature_image.url || '';
         if (bgUrl !== '' ) return { backgroundImage: `url(${bgUrl})` }; 
         else return {};
      },
      brandId() {
         if (this.couponInfo === null) return '';
         return this.couponInfo.brand_ids[0];
      },
      isAllBrand() { //是否為全品牌
         if (this.couponInfo === null) return true;
         return this.couponInfo.brand_ids.length === 0;
      },
      brandDetail() {
         let obj = this.brandlist.find(item => item.brand_id === this.brandId);
         return obj || null;
      },
      brandImage() {
         if (this.brandDetail === null) return {};
         let imgUrl = this.brandDetail.feature_image_small.url;
         if (imgUrl !== null) return { backgroundImage: `url(${imgUrl})` };
         else return {};
      },
      brandTitle() {
         if (this.brandDetail === null) return '';
         return this.brandDetail.title;
      },
      storeList() {
         return this.info.storeList;
      },
      totalStore() {
         if (this.storeList === null) return 0;
         else return this.storeList.store_ids.length;
      },
      isAllStore() { //是否為全門市
         if (this.storeList === null) return false;
         return this.storeList.all_brands_available;
      },
      availableStoreText() { //適用門市文字
         if (this.isAllStore) return vsprintf(this.usageinfoallbrands, [this.info.amount]);
         else return vsprintf(this.usageinfo, [this.totalStore, this.info.amount]);
      },
      isNormal() { //一般狀態
         let { status } = this.info;
         let arr = ['available', 'notyet'];
         return arr.includes(status);
      },
      isHistory() { //歷史狀態
         let { status } = this.info;
         let arr = ['expired', 'obsolete', 'redeemed'];
         return arr.includes(status);
      },
      deadlineTitle() { //到期標題
         return this.historyStatus[this.info.status];
      },
      deadlineContent() { //到期內容
         let key = `${this.info.status}_datetime`;
         return this.info[key];
      },
      isTransfer() { //轉贈狀態
         return this.info.status === 'transferred';
      },
      showGiftIcon() { //是否顯示轉贈icon
         return this.info.coupon_transferred && this.currentType === 'valid';
      },
      couponIndex() { //票券流水編號
         let index = this.index + 1;
         return index >= 10 ? `${index}` : `0${index}`;
      }
   },
   methods: {
      couponClick(evt) {
         let mapping = { 
            valid: 'voucherbasket_wcoupon_usable_',
            invalid: 'voucherbasket_wcoupon_history_',
            transferred: 'voucherbasket_wcoupon_transfer_'
         };
         let eventName = mapping[this.currentType];
         let promoteCode = this.info.couponInfo.third_party_promotion_code;
         firebaseGa.logEvent(`${eventName}${promoteCode}`, {}, true);
         location.href = evt.currentTarget.href;
      }
   },
   template: `
      <a :href="pageLink" class="couponBlock" :class="{reverse: reverse}" @click.prevent="couponClick">
         <div class="couponBlockL">
            <div class="brandInfo" :class="{allBrand:isAllBrand}">
               <div class="brandLogo" :style="brandImage"></div>
               <span>{{ brandTitle }}</span>
            </div>
            <div class="couponTitle">{{ couponTitle }}</div>
            <div class="detail">
               <template v-if="isNormal">
                  <p>{{ usedtime }}{{ info.duration }}</p>
                  <p>{{ availableStoreText }}</p>
               </template>
               <template v-if="isHistory">
                  <p>{{ deadlineTitle }}{{ deadlineContent }}</p>
               </template>
               <template v-if="isTransfer">
                  <p>{{ transferredaccount }}{{ info.transfer_account }}</p>
                  <p>{{ transferredtime }}{{ info.transferred_datetime }}</p>
               </template>
            </div>
         </div>
         <div class="couponBlockR" :class="{reverse: reverse}" :style="couponTitleBg">
            <div class="usageCover" v-show="!isAvailable">{{ statusText }}</div>
            <div class="giftIcon" v-if="showGiftIcon"></div>
            <div class="index">{{ couponIndex }}</div>
         </div>
      </a>`
});