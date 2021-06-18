export default function ({ projectTime, apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         layoutList: [
            { id: 'a', class: 'layoutA' },
            { id: 'b', class: 'layoutB' }
         ],
         layoutId: 'a',
         currentPage: 0,
         pointActivityId: [],
         pointList: [],
         activityList: [],
         brandList: [],
         pagLoading: false,
         searchLoading: false,
         turnOn: false,
         systemTime: '',
         projectTime,
         activityParams: null,
         user: { code: '' },
			modalTitle: { free: '', point: '', errMsg: '' },
         tempParams: { id: '', type: '', pointId: '' },
         obtainPoint: [],
         apiUrl,
         pageUrl
      }),
      computed: {
         changeLayout() { //板型切換
            return this.layoutId !== 'a';
         },
         hasActivity() { //是否有票券id資料
            return this.pointActivityId.length > 0;
         },
         hasNextPage() {  //是否有下一頁
            return this.currentPage !== null;
         },
         reachBottom() { //沒有下一頁資料
            return !this.pagLoading && !this.hasNextPage && this.hasActivity;
         },
         noActivity() { //沒活動資料
            return !this.pagLoading && !this.hasNextPage && !this.hasActivity;
         }
      },
      methods: {
         bindModalEvent() {
            $('#redeemModal').on('shown.bs.modal', function() {
               $(this).find('input').focus();
            });
            $('#redeemModal').on('hidden.bs.modal', () => {
               this.$refs.form.reset();
               this.user.code = '';
            });
         },
         reWriteHandler() { //重新填寫代碼
            $('#redeemModal').modal('show');
            $('#redeemFailModal').modal('hide');
         },
         showPointDetail() { //顯示點數詳情
            $('#ownPointModal').modal('show');
         },
         hideOwn() { //隱藏點數詳情
            $('#ownPointModal').modal('hide');
         },
         gatherBrandId(data) { //取得牌數id
            return data.map(item => item.brand_id);
         },
         layoutHandler(id) { //板型切換
            if (this.pagLoading) return;
            window.removeEventListener('scroll', this.scrollHandler);
            this.layoutId = id;
            setTimeout(() => {
               window.addEventListener('scroll', this.scrollHandler);
            }, 50);
         },
         openHandler() { //打開選單
            if (this.pagLoading) return;
            this.turnOn = true;
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
         async getMultipleBrand() { //取多品牌資訊
            return axios({
               url: this.apiUrl.multipleBrand,
               method: 'post',
               data: {}
            }).then(res => {
               return parseInt(res.data.multiple_brand) === 1;
            }).catch(err => true);
         },
         async getBrandInfo(brandIdArr) { //取得品牌資料
            return await axios({
               url: this.apiUrl.brandInfo,
               method: 'post',
               data: {
                  brand_ids: brandIdArr,
                  full_info: false
               }
            }).then(res => {
               return res.data.results.brand_information;
            }).catch(err => null);
         },
         async getActivityList() { //取得票券活動列表id
            return await axios({
               url: this.apiUrl.searchActivity,
               method: 'post',
               data: {
                  ...this.activityParams,
                  offset: this.currentPage
               }
            }).then(res => {
               return res.data;
            }).catch(err => {
               return err.response.data;
            });
         },
         async getActivityInfo() { //取得票券活動列表
            return await axios({
               url: this.apiUrl.activityInfo,
               method: 'post',
               data: {
                  point_activity_ids: this.pointActivityId,
                  full_info: true
               }
            }).then(res => {
               return res.data.results.point_activity_information;
            }).catch(err => null);
         },
         async mergeActivityAndPoint(data) { //合併活動和點數資訊
            return data.reduce((prev, current) => {
               prev.push({ ...current, pointInfo: null });
               return prev;
            }, []);
         },
         async getPagination(isPag) { //拿分頁資料
            this.pagLoading = true;

            let activityResult = await this.getActivityList().then(res => res);
            this.currentPage = activityResult.next;
            this.systemTime = activityResult.results.system_datetime || '';
            let pointActivityIds = activityResult.results.point_activity_ids;
            this.pointActivityId = pointActivityIds !== undefined ? pointActivityIds : [];
            if (!this.hasActivity) {
               this.pagLoading = false;
               this.activityList = [];
               return;
            }
            let activityInfo = await this.getActivityInfo().then(res => res);
            let brandIdArr = this.gatherBrandId(activityInfo);
            let brandResult = await this.getBrandInfo(brandIdArr).then(res => res);
            let mergeResult = await this.mergeActivityAndPoint(activityInfo).then(res => res);
            this.brandList = this.removeRepeatBrand(brandResult);
            if (isPag) this.activityList = this.activityList.concat(mergeResult);
            else this.activityList = mergeResult;

            this.pagLoading = false;
            return;
         },
         async scrollHandler() {
            if (this.pagLoading) return;
            let documentH = document.documentElement.scrollHeight;
            let windowH = window.innerHeight;
            let distance = documentH - windowH;
            let scrollPos = window.pageYOffset;
            if (scrollPos >= distance * 0.95 && this.hasNextPage) {
               await this.getPagination(true);
            }
         },
         async searchHandler(criteria) { //搜尋條件處理
            this.searchLoading = true;
            this.activityParams = criteria;
            this.currentPage = 0;
            window.removeEventListener('scroll', this.scrollHandler);
            await this.getPagination(false);
            window.scrollTo(0, 0);
            setTimeout(() => {
               this.turnOn = false;
               this.$refs.sidebar.backHandler('');
               window.addEventListener('scroll', this.scrollHandler);
               this.searchLoading = false;
            }, 50);
         },
         readyExchange(payload) { //準備兌換
            let { id, type, status } = payload;
            if (status !== 'opening') return;
            let targetObj = this.activityList.find(item => item.point_activity_id === id);
            this.obtainPoint = targetObj.obtain_points;
            this.tempParams.id = id;
            this.tempParams.type = type;
            if (type === 'free') {
               this.modalTitle[type] = targetObj.title;
               $('#freeModal').modal('show');
            } else if (type === 'redeem_code') {
               $('#redeemModal').modal('show');
            }
         },
         async gatherParams() { //蒐集參數
            let params = {};
            let exchangeType = this.tempParams.type;
            params.point_activity_id = this.tempParams.id;
            if (exchangeType === 'free') {
               $('#freeModal').modal('hide');
            } else if (exchangeType === 'redeem_code') {
               let isValid = await this.$refs.form.validate().then(res => res);
               if (!isValid) return;
               params.redeem_code = this.user.code;
               $('#redeemModal').modal('hide');
            }
            let result = await this.confirmExchange(params).then(res => res);
            if (result.status) return;
            if (exchangeType === 'free') $('#errorModal').modal('show');
            if (exchangeType === 'redeem_code') $('#redeemFailModal').modal('show');
         },
         async confirmExchange(payload) { //確認兌換
            this.searchLoading = true;
            return axios({
               url: this.apiUrl.redeemPointActivity,
               method: 'post',
               data: payload
            }).then(res => {
               let resData = res.data.results.point_redeem_result;
               localStorage.setItem('exchangePoint', JSON.stringify(resData));
               localStorage.setItem('obtainPoint', JSON.stringify(this.obtainPoint));
               location.href = this.pageUrl.exchangeOk;
               return { status: true };
            }).catch(err => {
               this.modalTitle.errMsg = err.response.data.rcrm.RM;
               return { status: false };
            }).finally(() => {
               this.searchLoading = false;
            });
         },
      },
      async mounted() {
         this.searchLoading = true;
         this.bindModalEvent();
      }
   });
}