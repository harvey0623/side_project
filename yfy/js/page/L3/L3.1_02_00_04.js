export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
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
            let paramsValue = params.get(key) || 0;
            return parseInt(paramsValue);
         },
         async getCouponInfo() { //取得票券資料
            return await axios({
               url: this.apiUrl.couponInfo,
               method: 'post',
               data: {
                  coupon_ids: [this.couponId],
                  full_info: true
               }
            }).then(res => {
               return res.data.results.coupon_information;
            }).catch(err => null);
         },
         async getBrandInfo() { //取得品牌資訊
            return await axios({
               url: this.apiUrl.brandInfo,
               method: 'post',
               data: {
                  brand_ids: [this.couponInfo.brand_ids[0]],
                  full_info: false
               }
            }).then(res => {
               return res.data.results.brand_information;
            }).catch(err => null);
         },
         async getAvailableStore() { //取得門市列表
            return await axios({
               url: this.apiUrl.storeList,
               method: 'post',
               data: {
                  coupon_ids: [this.couponId],
               }
            }).then(res => {
               return res.data.results.search_coupon_available_store_results;
            }).catch(err => null);
         },
         redirectToStoreMap() { //導到店家地圖頁面
            console.log(this.couponId);
         }
       },
      async mounted() {
         this.couponId = this.getQuery('coupon_id');
         this.isLoading = true;
         this.couponInfo = await this.getCouponInfo().then(res => res[0]);
         if (!this.isAllBrand) {
            this.brandInfo = await this.getBrandInfo().then(res => res[0]);
         }
         this.storeData = await this.getAvailableStore().then(res => res[0]);
         this.isLoading = false;
      }
   });
}