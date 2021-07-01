export default function ({ apiUrl, pageUrl }) {
   let isOpenTransfer = true; //是否開啟轉贈
   let statusArr = ['valid', 'invalid', 'transferred'];
   let couponType = statusArr.reduce((prev, current) => {
      prev[current] = {
         isFirst: true,
         currentPage: 0,
         scrollPos: 0,
         data: [],
         name: current
      };
      return prev;
   }, {});
   new Vue({
      el: '#app',
      mixins: [localProfile],
      data: () => ({
         statusArr,
         tabList: [
            {
               id: 'valid',
               title: window.getSystemLang('mycouponlist_optionmycoupon'),
               isOpenTransfer: true
            },
            {
               id: 'invalid',
               title: window.getSystemLang('mycouponlist_optionhistory'),
               isOpenTransfer: true
            },
            {
               id: 'transferred',
               title: window.getSystemLang('mycouponlist_optiontransferred'),
               isOpenTransfer
            }
         ],
         couponType: couponType,
         currentType: 'valid',
         brandList: [],
         isLoading: false,
         apiUrl,
         pageUrl
      }),
      computed: {
         validType() {
            return this.couponType['valid'];
         },
         invalidType() {
            return this.couponType['invalid'];
         },
         transferredType() {
            return this.couponType['transferred'];
         },
         targetType() {
            return this.couponType[this.currentType];
         },
         noValidCoupon() {
            return !this.isLoading && this.validType.data.length === 0;
         },
         noInvalidCoupon() {
            return !this.isLoading && this.invalidType.data.length === 0;
         },
         noTransferredCoupon() {
            return !this.isLoading && this.transferredType.data.length === 0;
         },
         validReach() {
            let { currentPage, data } = this.validType;
            return currentPage === null && data.length > 0;
         },
         invalidReach() {
            let { currentPage, data } = this.invalidType;
            return currentPage === null && data.length > 0;
         },
         transferredReach() {
            let { currentPage, data } = this.transferredType;
            return currentPage === null && data.length > 0;
         },
         showSeeMore() {
            return !this.isLoading && this.targetType.data.length === 0;
         }
      },
      methods: {
         getCouponList() { //取得票券列表
            this.isLoading = true;
            return mmrmAxios({
               url: this.apiUrl.couponList,
               method: 'post',
               data: {
                  type: this.currentType,
                  offset: this.targetType.currentPage
               }
            }).then(res => {
               return res.data;
            }).catch(err => {
               return null;
            }).finally(() => {
               this.isLoading = false;
            });
         },
         getCpouponInfo(couponIdArr) { //取得票券資訊
            this.isLoading = true;
            return mmrmAxios({
               url: this.apiUrl.couponInfo,
               method: 'post',
               data: {
                  coupon_ids: couponIdArr,
                  full_info: false
               }
            }).then(res => {
               return res.data.results.coupon_information;
            }).catch(err => {
               return null;
            }).finally(() => {
               this.isLoading = false;
            });
         },
         getBrandInfo(brandIdArr) { //取得品牌資訊
            this.isLoading = true;
            return mmrmAxios({
               url: this.apiUrl.brandInfo,
               method: 'post',
               data: {
                  brand_ids: brandIdArr,
                  full_info: false
               }
            }).then(res => {
               return res.data.results.brand_information;
            }).catch(err => {
               return null;
            }).finally(() => {
               this.isLoading = false;
            });
         },
         getStoreList(couponIdArr) { //取得門市列表
            this.isLoading = true;
            return mmrmAxios({
               url: this.apiUrl.storeList,
               method: 'post',
               data: {
                  coupon_ids: couponIdArr
               }
            }).then(res => {
               return res.data.results.search_coupon_available_store_results;
            }).catch(err => {
               return null;
            }).finally(() => {
               this.isLoading = false;
            });
         },
         getQuery(key) { //取得網址參數
            let params = (new URL(document.location)).searchParams;
            let value = params.get(key);
            return value;
         },
         async changeTab(id) { //改變tab id
            if (this.isLoading) return;
            if (this.currentType === id) return;
            this.targetType.scrollPos = window.pageYOffset;
            this.currentType = id;
            if (this.targetType.isFirst) await this.getPagination();
            await this.$nextTick();
            window.scrollTo(0, this.targetType.scrollPos);
         },
         getCouponIdArr(data) { //組成couponId陣列
            return data.results.my_coupon_list.map(item => item.coupon_id);
         },
         getBrandArr(data) { //組成brand id陣列
            let result = data.reduce((prev, current) => {
               prev = prev.concat(current.brand_ids);
               return prev;
            }, []);
            return Array.from(new Set(result));
         },
         removeRepeatBrand(data) { //移除重複的品牌
            let combineArr = this.brandList.concat(data);
            let idArr = combineArr.map(item => item.brand_id);
            idArr = Array.from(new Set(idArr));
            let result = idArr.reduce((prev, current) => {
               let filterArr = combineArr.filter(item => item.brand_id === current);
               if (filterArr.length !== 0) prev.push(filterArr[0]);
               return prev;
            }, []);
            return result;
         },
         mergeData(couponList, couponInfo, storeData) { //合併資料
            let lists = couponList.results.my_coupon_list;
            let result = lists.reduce((prev, current) => {
               let couponId = current.coupon_id;
               let targetInfo = couponInfo.find(item => item.coupon_id === couponId);
               let targetStore = storeData.find(item => item.coupon_id === couponId);
               prev.push({
                  ...current,
                  couponInfo: targetInfo || null,
                  storeList: targetStore || null
               });
               return prev;
            }, []);
            return result;
         },
         async getPagination() { //取得分頁資料
            let combinedData = [];
            let couponListData = await this.getCouponList().then(res => res);
            if (couponListData.results.my_coupon_list.length !== 0) {
               let brandResult = [];
               let couponIdArr = this.getCouponIdArr(couponListData);
               let couponInfoData = await this.getCpouponInfo(couponIdArr).then(res => res);
               let brandIdArr = this.getBrandArr(couponInfoData);
               if (brandIdArr.length !== 0) {
                  brandResult = await this.getBrandInfo(brandIdArr).then(res => res);
               }
               let storeData = await this.getStoreList(couponIdArr).then(res => res);
               this.brandList = this.removeRepeatBrand(brandResult);
               combinedData = this.mergeData(couponListData, couponInfoData, storeData);
            }
            this.targetType.data = this.targetType.data.concat(combinedData);
            this.targetType.currentPage = couponListData.next;
            this.targetType.isFirst = false;
            return;
         },
         async scrollHandler() {
            if (this.isLoading) return;
            let documentH = document.documentElement.scrollHeight;
            let windowH = window.innerHeight;
            let distance = documentH - windowH;
            let scrollPos = window.pageYOffset;
            let hasNextPage = this.targetType.currentPage !== null;
            if (scrollPos >= distance * 0.95 && hasNextPage) {
               await this.getPagination();
            }
         }
      },
      created() {
         let couponType = this.getQuery('couponType');
         let isInclude = this.statusArr.includes(couponType);
         this.currentType = isInclude ? couponType : 'valid';
      },
      async mounted() {
         this.getLocalProfile();
         window.addEventListener('scroll', this.scrollHandler);
         await this.getPagination();
      }
   });
}