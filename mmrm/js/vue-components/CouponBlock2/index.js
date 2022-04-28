Vue.component('coupon-block', {
   props: {
      coupon_type: {
         type: String,
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
   },
   data: () => ({
      redeemCouponInfoAll: window.getSystemLang('couponactivitydetail_redeemcouponinfoallbrands'),
      redeemcouponinfo: window.getSystemLang('couponactivitydetail_redeemcouponinfo'),
      durationText: window.getSystemLang('couponactivitydetail_redeemcouponduration')
   }),
   computed: {
      pageLink() {
         let key = this.coupon_type === 'coupon' ? 'coupon_id' : 'voucher_id';
         let couponId = this.info[key];
         return `${this.pageurl}?coupon_type=${this.coupon_type}&coupon_id=${couponId}`;
      },
      couponTitle() {
         return this.info.title;
      },
      couponTitleBg() {
         let bgUrl = this.info.feature_image.url || '';
         if (bgUrl !== '') return { backgroundImage: `url(${bgUrl})` };
         else return {};
      },
      isAllBrand() { //是否為全品牌
         return this.info.brand_ids.length === 0;
      },
      brandId() {
         return this.info.brand_ids[0];
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
      isAllStore() {
         if (this.storeList === null) return false;
         return this.storeList.all_brands_available;
      },
      availableStoreText() { //適用門市文字
         if (this.isAllStore) return vsprintf(this.redeemCouponInfoAll, [this.info.total]);
         else return vsprintf(this.redeemcouponinfo, [this.totalStore, this.info.total]);
      },
   },
   methods: {
      aTagClick(evt) {
         let couponBrandId = this.info.brand_ids[0];
         let targetBrand = this.brandlist.find(item => item.brand_id === couponBrandId);
         if (targetBrand !== undefined) {
            firebaseGa.logEvent(`event_voucher_${targetBrand.brand_code}_${this.info.third_party_promotion_code}`, {}, true);
         }
         location.href = evt.currentTarget.href;
      }
   },
   template: `
      <a 
         :href="pageLink" 
         class="couponBlock" :class="{reverse: reverse}" @click.prevent="aTagClick">
         <div class="couponBlockL">
            <div class="brandInfo" :class="{allBrand: isAllBrand}">
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