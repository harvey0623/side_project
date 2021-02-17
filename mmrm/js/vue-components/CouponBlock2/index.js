Vue.component('coupon-block', {
   props: {
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
      multiplebrand: {
         type: Boolean,
         default: true
      }
   },
   data: () => ({
      redeemCouponInfoAll: window.getSystemLang('couponactivitydetail_redeemcouponinfoallbrands'),
      redeemcouponinfo: window.getSystemLang('couponactivitydetail_redeemcouponinfo'),
      durationText: window.getSystemLang('couponactivitydetail_redeemcouponduration')
   }),
   computed: {
      pageLink() {
         return `${this.pageurl}?coupon_id=${this.info.coupon_id}`;
      },
      couponTitle() {
         return this.info.title;
      },
      couponTitleBg() {
         let bgUrl = this.info.feature_image.url || '';
         if (bgUrl !== '') return { backgroundImage: `url(${bgUrl})` };
         else return {};
      },
      brandId() {
         return this.info.brand_ids[0];
      },
      brandDetail() {
         let obj = this.brandlist.find(item => item.brand_id === this.brandId);
         return obj || null;
      },
      brandImage() {
         if (this.brandDetail === null) return '';
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
      isAllStore() {
         if (this.storeList === null) return false;
         return this.storeList.all_brands_available;
      },
      availableStoreText() { //適用門市文字
         if (this.isAllStore) return vsprintf(this.redeemCouponInfoAll, [this.info.total]);
         else return vsprintf(this.redeemcouponinfo, [this.totalStore, this.info.total]);
      },
   },
   template: `
      <a 
         :href="pageLink" 
         class="couponBlock" :class="{reverse: reverse}">
         <div class="couponBlockL">
            <div class="brandInfo" :class="{multiple:!multiplebrand}">
               <div class="brandLogo" :style="brandImage"></div>
               <span>{{ brandTitle }}</span>
            </div>
            <div class="couponTitle">{{ couponTitle }}</div>
            <div class="detail">
               <p>{{ durationText }} : {{ info.duration }}</p>
               <p>{{ availableStoreText }}</p>
            </div>
         </div>
         <div class="couponBlockR" :class="{reverse: reverse}" :style="couponTitleBg"></div>
      </a>`
});