import { gpsTool } from '../../src/gpsTool.js';
export default function({ apiUrl }) {
   new Vue({
      el: '#app',
      mixins: [localProfile],
      data: {
         isLoading: false,
         brandList: [],
         storeList: [],
         turnOn: false,
         isFirstPickup: false,
         gpsInfo: {
            isOpen: false,
            latitude: '',
            longitude: ''
         },
      },
      computed: {
         totalStore() {
            return this.storeList.length;
         },
         hasStorePoint() {
            return this.storeList.length > 0;
         },
         showEmptyBlock() {
            return !this.isLoading && !this.hasStorePoint;
         },
         isShowStoreCount() {
            return this.isFirstPickup && this.hasStorePoint;
         }
      },
      methods: {
         getQuery(key) {
            let params = (new URL(document.location)).searchParams;
            let value = params.get(key);
            return value;
         },
         searchBrand() {
            return mmrmAxios({
               url: apiUrl.searchBrand,
               method: 'post',
               data: {}
            }).then(res => res.data.results.brand_ids).catch(err => []);
         },
         getBrandInfo(brandIds) {
            return mmrmAxios({
               url: apiUrl.brandInfo,
               method: 'post',
               data: {
                  "brand_ids": brandIds,
                  "full_info": false
               }
            }).then(res => res.data.results.brand_information).catch(err => []);
         },
         async getUserLocation() {
            let { status, latitude, longitude } = await gpsTool.getLocation();
            if (!status) return;
            this.gpsInfo.isOpen = status;
            this.gpsInfo.latitude = latitude;
            this.gpsInfo.longitude = longitude;
         },
         searchStore(payload) { //使用地區貨品牌搜尋門市
            return mmrmAxios({
               url: apiUrl.searchStore,
               method: 'post',
               data: payload
            }).then(res => {
               return res.data.results.store_ids;
            }).catch(err => []);
         },
         searchStoreByCoupoon(couponId) { //使用票券搜尋門市id
            return mmrmAxios({
               url: apiUrl.searchStoreByCoupon,
               method: 'post',
               data: { coupon_ids: [couponId] }
            }).then(res => {
               return res.data.results.search_coupon_available_store_results[0].store_ids;
            }).catch(err => []);
         },
         getStoreInfo(storeIds) { //取得門市詳情
            return mmrmAxios({
               url: apiUrl.storeInfo,
               method: 'post',
               data: {
                  "store_ids": storeIds,
                  "query_info": "summary"
               }
            }).then(res => {
               return res.data.results.store_information;
            }).catch(err => []);
         },
         createStoreList(storeInfo) { //產生門市列表
            if (storeInfo.length === 0) return [];
            let lists = storeInfo.reduce((prev, current) => {
               let { location } = current;
               let targetBrand = this.brandList.find(brand => brand.brand_id === current.brand_id);
               let distance = this.gpsInfo.isOpen ? gpsTool.getDistance(
                  { lat1: this.gpsInfo.latitude, lon1: this.gpsInfo.longitude },
                  { lat2: parseFloat(location.latitude), lon2: parseFloat(location.longitude) }, 'K'
               ) : '';
               prev.push({
                  ...current,
                  brandLogo: targetBrand ? targetBrand.feature_image_small.url : '',
                  distance,
                  googleMapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(current.address)}`
               });
               return prev;
            }, []);
            lists.sort((a, b) => a.distance - b.distance);
            return lists;
         },
         async searchHandler(payload) { //查詢門市
            this.isLoading = true;
            this.isFirstPickup = true;
            let params = JSON.parse(JSON.stringify(payload));
            if (payload.city === '') params = {};
            let storeIds = await this.searchStore(params);
            let hasStoreId = storeIds.length > 0;
            let storeInfo = [];
            if (hasStoreId) storeInfo = await this.getStoreInfo(storeIds);
            this.storeList = this.createStoreList(storeInfo);   
            this.turnOn = false;
            this.isLoading = false;
         }
      },
      async mounted() {
         this.isLoading = true;
         await this.getUserLocation();
         this.getLocalProfile();
         let brandIds = await this.searchBrand();
         this.brandList = await this.getBrandInfo(brandIds);
         let couponId = this.getQuery('coupon_id');
         let storeIds = await this.searchStoreByCoupoon(parseInt(couponId));
         let hasStoreId = storeIds.length > 0;
         let storeInfo = [];
         if (hasStoreId) storeInfo = await this.getStoreInfo(storeIds);
         this.storeList = this.createStoreList(storeInfo);
         this.isLoading = false;
      }
   });
}