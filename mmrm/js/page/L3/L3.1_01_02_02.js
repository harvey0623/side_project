export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         myCouponIds: [],
         metaList: [],
         couponIds: [],
         couponDetail: [],
         couponInfo: [],
         aboutCoupon: [],
         isLoading: false,
         apiUrl,
         pageUrl
      }),
      computed: {
         isMoreOne() { //是否超過一筆資料
            return this.myCouponIds.length > 1;
         },
         couponList() { //票券列表
            if (this.aboutCoupon.length === 0) return [];
            return this.aboutCoupon.reduce((prev, current) => {
               prev.push({
                  coupon_id: current.coupon_id,
                  href: `${this.pageUrl.couponInfo}?my_coupon_id=${current.my_coupon_id}`,
                  text: current.title
               });
               return prev;
            }, []);
         }
      },
      methods: {
         async getCouponDetail(id) { //取得票券詳情
            return await axios({
               url: this.apiUrl.couponDetail,
               method: 'post',
               data: {
                  my_coupon_id: id,
               }
            }).then(res => {
               return res.data.results.my_coupon_detail;
            }).catch(err => null);
         },
         async getCouponInfo() { //取得票券資料
            return await axios({
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
         async getCouponIds() { //取得couponId
            for (let i = 0; i < this.myCouponIds.length; i++) {
               let id = this.myCouponIds[i];
               let result = await this.getCouponDetail(id).then(res => res);
               this.couponDetail.push(result);
               this.couponIds.push(result.coupon_id);
            }
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
         mergeCouponData() { //合併票券相關資料
            return this.couponInfo.reduce((prev, current) => {
               let couponId = current.coupon_id;
               let obj = this.couponDetail.find(item => item.coupon_id === couponId);
               let my_coupon_id = obj !== undefined ? obj.my_coupon_id : '';
               prev.push({ ...current, my_coupon_id });
               return prev;
            },[]);
         },
         seeCoupon() {
            if (this.isMoreOne) {
               $('#optionModal').modal('show');
            } else {
               let id = this.myCouponIds[0];
               location.href = `${this.pageUrl.couponInfo}?my_coupon_id=${id}`;
            }
         }
      },
      created() {
         this.assignData();
      },
      async mounted() {
         if (this.myCouponIds.length === 0) return;
         this.isLoading = true;
         await this.getCouponIds();
         this.couponInfo = await this.getCouponInfo().then(res => res);
         this.aboutCoupon = this.mergeCouponData();
         this.isLoading = false;
      }
   });
}