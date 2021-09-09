export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      mixins: [localProfile],
      data: () => ({
         myCouponIds: [],
         metaList: [],
         couponIds: [],
         couponDetail: [],
         couponList: [],
         isLoading: false,
         apiUrl,
         pageUrl
      }),
      computed: {
         isMoreOne() { //是否超過一筆資料
            return this.myCouponIds.length > 1;
         },
      },
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
         getLS(key) { //取得localStorage資料
            let data = localStorage.getItem(key);
            return data !== null ? JSON.parse(data) : null;
         },
         assignData() { //資料寫入
            let storageData = this.getLS('exchange');
            if (storageData === null) return;
            this.myCouponIds = storageData.my_coupon_ids;
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
                  my_coupon_id, 
                  coupon_id,
                  title: current.title,
                  href: `${this.pageUrl.couponInfo}?my_coupon_id=${my_coupon_id}`
               });
               return prev;
            },[]);
         },
         seeCoupon() {
            if (this.isMoreOne) {
               $('#optionModal').modal('show');
            } else {
               if (this.myCouponIds.length === 0) return;
               let id = this.myCouponIds[0];
               location.href = `${this.pageUrl.couponInfo}?my_coupon_id=${id}`;
            }
         }
      },
      created() {
         this.assignData();
      },
      async mounted() {
         this.getLocalProfile();
         if (this.myCouponIds.length === 0) return;
         this.isLoading = true;
         await this.getCouponIds();
         let couponInfo = await this.getCouponInfo();
         this.couponList = this.mergeCouponData(couponInfo);
         this.isLoading = false;
      }
   });
}