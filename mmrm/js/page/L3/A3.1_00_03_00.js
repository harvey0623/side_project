export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      mixins: [localProfile],
      data: () => ({
         myCouponIds: [],
         voucherIds: [],
         metaList: [],
         couponIds: [],
         couponDetail: [],
         couponList: [],
         voucherList: [],
         isLoading: false,
         apiUrl,
         pageUrl
      }),
      methods: {
         getCouponDetail(id) { //取得票券詳情
            return mmrmAxios({
               url: this.apiUrl.couponDetail,
               method: 'post',
               data: {
                  my_coupon_id: id,
               }
            }).then(res => {
               return res.data.results.my_coupon_detail;
            }).catch(err => null);
         },
         getCouponInfo() { //取得票券資料
            return mmrmAxios({
               url: this.apiUrl.couponInfo,
               method: 'post',
               data: {
                  coupon_ids: this.couponIds,
                  full_info: false
               }
            }).then(res => {
               return res.data.results.coupon_information;
            }).catch(err => null);
         },
         getVoucherInfo(voucherIds) {
            return mmrmAxios({
               url: this.apiUrl.voucherInfo,
               method: 'post',
               data: {
                  voucher_ids: voucherIds,
                  full_info: false
               }
            }).then(res => {
               return res.data.results.voucher_information;
            }).catch(err => []);
         },
         getLS(key) { //取得localStorage資料
            let data = localStorage.getItem(key);
            return data !== null ? JSON.parse(data) : null;
         },
         assignData() { //資料寫入
            let storageData = this.getLS('exchange');
            if (storageData === null) return;
            this.myCouponIds = storageData.my_coupon_ids;
            this.voucherIds = storageData.voucher_ids;
            this.metaList = storageData.meta;
         },
         async getCouponIds() { //取得couponId
            for (let i = 0; i < this.myCouponIds.length; i++) {
               let id = this.myCouponIds[i];
               let result = await this.getCouponDetail(id);
               this.couponDetail.push(result);
               this.couponIds.push(result.coupon_id);
            }
         },
         mergeCouponData(couponInfo) { //合併票券相關資料
            return couponInfo.reduce((prev, current) => {
               let coupon_id = current.coupon_id;
               let obj = this.couponDetail.find(item => item.coupon_id === coupon_id);
               let my_coupon_id = obj !== undefined ? obj.my_coupon_id : '';
               prev.push({
                  type: 'coupon',
                  my_coupon_id, 
                  coupon_id,
                  title: current.title,
                  third_party_promotion_code: current.third_party_promotion_code,
                  href: `${this.pageUrl.couponInfo}?my_coupon_id=${my_coupon_id}`
               });
               return prev;
            },[]);
         },
         createVoucherList(lists) {
            return lists.reduce((prev, current) => {
               let { title, voucher_id } = current;
               prev.push({
                  type: 'voucher', 
                  voucher_id,
                  title,
                  href: `${this.pageUrl.voucherInfo}?voucher_id=${voucher_id}`
               });
               return prev;
            }, []);
         },
         seeCoupon() {
            let allList = this.couponList.concat(this.voucherList);
            if (allList.length > 1) {
               $('#optionModal').modal('show');
            } else {
               let item = allList[0];
               let isCouponType = item.type === 'coupon';
               let pageUrl = isCouponType ? this.pageUrl.couponInfo : this.pageUrl.voucherInfo;
               let searchKey = isCouponType ? 'my_coupon_id' : 'voucher_id';
               let id = isCouponType ? item.my_coupon_id : item.voucher_id;
               if (this.couponList.length > 0) { //暫不考慮voucher
                  this.useCoupon(this.couponList[0].third_party_promotion_code, false);
               }
               location.href = `${pageUrl}?${searchKey}=${id}`;
            }
         },
         goCouponBox(evt) { //暫不考慮voucher
            this.couponList.forEach(item => {
               firebaseGa.logEvent(`success_voucherbasket_${item.third_party_promotion_code}`);
            });
            location.href = evt.currentTarget.href;
         },
         continueExchange(evt) {
            firebaseGa.logEvent('backto_eventlist');
            location.href = evt.currentTarget.href;
         },
         useCoupon(promoteCode, isRedirect, evt) {
            firebaseGa.logEvent(`success_usenow_list_${promoteCode}`);
            if (!isRedirect || evt === undefined) return;
            location.href = evt.currentTarget.href;
         }
      },
      created() {
         this.assignData();
      },
      async mounted() {
         this.isLoading = true;
         if (this.myCouponIds.length !== 0) {
            await this.getCouponIds();
            let couponInfo = await this.getCouponInfo();
            this.couponList = this.mergeCouponData(couponInfo);
         }
         if (this.voucherIds.length !== 0) {
            let lists = await this.getVoucherInfo(this.voucherIds);
            this.voucherList = this.createVoucherList(lists);
         }

         this.isLoading = false;
      }
   });
}