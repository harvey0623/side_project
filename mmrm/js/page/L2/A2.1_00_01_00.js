export default function ({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      mixins: [localProfile],
      data: () => ({
         myCouponId: 0,
         couponDetail: null,
         couponInfo: null,
         brandInfo: null,
         storeData: null,
         termsList: [],
         isLoading: false,
         errMsg: '',
         usageStatus: {
            available: '可使用',
            transferred: '已轉贈',
            notyet: window.getSystemLang('mycoupondetail_b_unopened'),
            expired: window.getSystemLang('mycoupondetail_b_expired'),
            obsolete: window.getSystemLang('mycoupondetail_b_invalid'),
            redeemed: window.getSystemLang('mycoupondetail_b_used'),
         },
         user: { account: '' },
         apiUrl,
         pageUrl
      }),
      computed: {
         isAllBrand() { //是否為全部品牌
            if (this.couponInfo === null) return true;
            return this.couponInfo.brand_ids.length === 0;
         },
         couponImg() { //背景圖
            if (this.couponInfo === null) return '';
            return this.couponInfo.feature_image.url || '';
         },
         hasCouponImg() { //是否有背景圖
            return this.couponImg !== '';
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
         allAvailable() { //門市是否全不適用
            if (this.storeData === null) return false;
            return this.storeData.all_brands_available;
         },
         availableCount() { //適用門市數量
            if (this.storeData === null) return 0;
            return this.storeData.store_ids.length;
         },
         hideFixBlock() { //決定操作按鈕透明度
            if (this.couponDetail === null) return true;
            if (this.couponInfo === null) return true;
            return false;
         },
         couponStatusText() { //票券狀態用字
            if (this.couponDetail === null) return '';
            return this.usageStatus[this.couponDetail.status];
         },
         couponIsAvailable() { //票券是否可使用
            if (this.couponDetail === null) return false;
            return this.couponDetail.status === 'available';
         },
         canTransfer() { //是否可轉贈
            if (this.couponInfo === null) return false;
            return this.couponInfo.can_transfer;
         },
         checkCouponStatus() { //目前票券使用狀態
            if (this.couponDetail === null) return false;
            if (this.couponInfo === null) return false;
            if (this.canTransfer) {
               let status1 = ['expired', 'obsolete', 'redeemed', 'transferred'];
               let isInclude = status1.includes(this.couponDetail.status);
               if (isInclude) return false;
               return true;
            } else {
               let status2 = ['notyet', 'expired', 'obsolete', 'redeemed', 'transferred'];
               let isInclude = status2.includes(this.couponDetail.status);
               if (isInclude) return false;
               return true;
            }
         }
      },
      methods: {
         getQuery(key) { //取得網址參數
            let params = (new URL(document.location)).searchParams;
            let value = params.get(key);
            return value;
         },
         bindModalEvent() {
            $('#transferModal').on('shown.bs.modal', function () {
               $(this).find('input').focus();
            });
         },
         openTermPopup() { //打開條款popup
            let termData = this.termsList[0];
            if (termData.checked) $('#transferModal').modal('show');
            else termData.show = true;
         },
         cancelHandler() {
            $('#transferModal').modal('hide');
            this.user.account = '';
            this.$refs.form.reset();
         },
         convertTerms(data) { //條款資料轉換
            if (data.length === 0) return [];
            return data.reduce((prev, current, index) => {
               prev.push({ ...current, show: false, checked: false });
               return prev;
            }, []);
         },
         updateChecked({ id }) { //更新條款確認狀態
            let obj = this.termsList.find(item => item.id === id);
            obj.checked = true;
            obj.show = false;
            $('#transferModal').modal('show');
         },
         getTerms() { //取得條款資料
            return mmrmAxios({
               url: this.apiUrl.briefTerm,
               method: 'post',
               data: {
                  type: ['coupon_transfer']
               }
            }).then(res => {
               let { term_information } = res.data.results;
                if (term_information.length === 0) return [];
               return term_information[0].terms;
            }).catch(err => null);
         },
         getCouponDetail() { //取得票券詳情
            return mmrmAxios({
               url: this.apiUrl.couponDetail,
               method: 'post',
               data: {
                  my_coupon_id: this.myCouponId
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
                  coupon_ids: [this.couponDetail.coupon_id],
                  full_info: true
               }
            }).then(res => {
               return res.data.results.coupon_information;
            }).catch(err => null);
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
               return res.data.results.brand_information;
            }).catch(err => null);
         },
         getAvailableStore() { //取得門市列表
            return mmrmAxios({
               url: this.apiUrl.storeList,
               method: 'post',
               data: {
                  coupon_ids: [this.couponDetail.coupon_id],
               }
            }).then(res => {
               return res.data.results.search_coupon_available_store_results;
            }).catch(err => null);
         },
         doTransfer() { //票券轉移
            this.isLoading = true;
            return mmrmAxios({
               url: this.apiUrl.transfer,
               method: 'post',
               data: {
                  my_coupon_id: this.couponDetail.my_coupon_id,
                  account: this.user.account
               }
            }).then(res => {
               return { status: true };
            }).catch(err => {
               this.errMsg = err.response.data.rcrm.RM;
               return { status: false };
            }).finally(() => {
               this.isLoading = false;
            });
         },
         async submitHandler() {
            let isValid = await this.$refs.form.validate().then(res => res);
            if (!isValid) return;
            $('#transferModal').modal('hide');
            let transferResult = await this.doTransfer().then(res => res);
            let modalId = transferResult.status ? '#okModal' : '#failModal';
            $(modalId).modal('show');
         },
         useHandler() {
            let url = this.pageUrl.couponBarCode;
            location.href = `${url}?my_coupon_id=${this.myCouponId}`;
         },
         autoTransfer() { //自動轉贈
            let isAuto = this.getQuery('auto') === 'true';
            if (isAuto && this.canTransfer && this.checkCouponStatus) {
               $('#transferModal').modal('show');
            }
         },
         redirectToStoreMap() { //導到店家地圖頁面
            let couponId = this.couponDetail.coupon_id;
            console.log(couponId)
         }
      },
      async mounted() {
         this.bindModalEvent();
         this.isLoading = true;
         this.getLocalProfile();
         this.myCouponId = parseInt(this.getQuery('my_coupon_id'));
         let termsData = await this.getTerms();
         this.termsList = this.convertTerms(termsData);
         this.couponDetail = await this.getCouponDetail().then(res => res);
         this.couponInfo = await this.getCouponInfo().then(res => res[0]);
         if (!this.isAllBrand) {
            this.brandInfo = await this.getBrandInfo().then(res => res[0]);
         }
         this.storeData = await this.getAvailableStore().then(res => res[0]);
         this.isLoading = false;
         this.autoTransfer();
      }
   });
}