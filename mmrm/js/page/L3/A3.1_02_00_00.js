export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      mixins: [localProfile],
      data: () => ({
         couponId: 0,
         couponInfo: null,
         brandInfo: null,
         storeData: null,
         isLoading: false,
         apiUrl,
         pageUrl
      }),
      computed: {
         couponImg() { //背景圖
            if (this.couponInfo === null) return '';
            else return this.couponInfo.feature_image.url || '';
         },
         hasCouponImg() { //是否有背景圖
            return this.couponImg !== '';
         },
         couponDesc() { //票券說明
            if (this.couponInfo === null) return '';
            return this.couponInfo.content;
         },
         transferStatus() { //轉讓狀態
            if (this.couponInfo === null) return '';
            let canText = window.getSystemLang('mycoupondetail_transferable');
            let noneText = window.getSystemLang('mycoupondetail_nontransferable');
            return this.couponInfo.can_transfer ? canText : noneText;
         },
         isAllBrand() { //是否為全品牌
            if (this.couponInfo === null) return true;
            return this.couponInfo.brand_ids.length === 0;
         },
         brandTitle() { //品牌名稱
            if (this.brandInfo === null) return '';
            return this.brandInfo.title;
         },
         brandLogo() {  //品牌logo
            if (this.brandInfo === null) return {};
            let imgUrl = this.brandInfo.feature_image_small.url;
            if (!imgUrl) return {};
            else return { backgroundImage: `url(${imgUrl})` };
         },
         allAvailable() { //門市是否全不適用
            if (this.storeData === null) return false;
            return this.storeData.all_brands_available;
         },
         availableCount() { //適用門市數量
            if (this.storeData === null) return 0;
            return this.storeData.store_ids.length;
         }
      },
      methods: {
         getQuery(key) { //取得網址參數
            let params = (new URL(document.location)).searchParams;
            let paramsValue = params.get(key);
            return paramsValue;
         },
         getCouponInfo() { //取得票券資料
            return mmrmAxios({
               url: this.apiUrl.couponInfo,
               method: 'post',
               data: {
                  coupon_ids: [this.couponId],
                  full_info: true
               }
            }).then(res => {
               return res.data.results.coupon_information[0];
            }).catch(err => []);
         },
         getBrandInfo() { //取得品牌資訊
            return mmrmAxios({
               url: this.apiUrl.brandInfo,
               method: 'post',
               data: {
                  brand_ids: [this.couponInfo.brand_ids[0]],
                  full_info: false
               }
            }).then(res => {
               return res.data.results.brand_information[0];
            }).catch(err => null);
         },
         getAvailableStore() { //取得門市列表
            return mmrmAxios({
               url: this.apiUrl.storeList,
               method: 'post',
               data: {
                  coupon_ids: [this.couponId],
               }
            }).then(res => {
               return res.data.results.search_coupon_available_store_results[0];
            }).catch(err => null);
         },
         getVoucherInfo() {
            return mmrmAxios({
               url: this.apiUrl.voucherInfo,
               method: 'post',
               data: {
                  voucher_ids: [this.couponId],
                  full_info: false
               }
            }).then(res => {
               return res.data.results.voucher_information[0];
            }).catch(err => null);
         },
         getVoucherStore() {
            return mmrmAxios({
               url: this.apiUrl.voucherStore,
               method: 'post',
               data: { voucher_id: this.couponId }
            }).then(res => {
               return res.data.results;
            }).catch(err => null);
         },
         redirectToStoreMap() { //導到店家地圖頁面
            // location.href = `${this.pageUrl.storePoint}?coupon_id=${this.couponId}`;
            let brandCode = this.brandInfo !== null ? this.brandInfo.brand_code : '';
            let promotionCode = this.couponInfo.third_party_promotion_code;
            firebaseGa.logEvent(`event_voucher_usestore_${brandCode}_${promotionCode}`);
            location.href = `${this.pageUrl.storePoint}?ids=${this.couponInfo.brand_ids[0]}`;
         }
       },
      async mounted() {
         this.isLoading = true;
         this.couponId = parseInt(this.getQuery('coupon_id'));
         let couponType = this.getQuery('coupon_type');
         let couponInfoMethod = couponType === 'coupon' ? 'getCouponInfo' : 'getVoucherInfo';
         let storeInfoMethod = couponType === 'coupon' ? 'getAvailableStore' : 'getVoucherStore';
         this.couponInfo = await this[couponInfoMethod]();
         if (!this.isAllBrand) this.brandInfo = await this.getBrandInfo();
         this.storeData = await this[storeInfoMethod]();
         this.isLoading = false;
      }
   });
}