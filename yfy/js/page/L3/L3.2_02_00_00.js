export default function ({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         activityId: 0,
         activityInfo: null,
         pointList: [],
         brandInfo: null,
         isLoading: false,
         user: { code: '' },
         errMsg: '',
         redeemType: {
            free: window.getSystemLang('pointactivitydetail_b_free'),
            redeem_code: window.getSystemLang('pointactivitydetail_b_redeemcode'),
         },
         activityStatus: {
            opening: '已開啟',
            unopened: window.getSystemLang('pointactivitydetail_b_unopened'),
            closed: window.getSystemLang('pointactivitydetail_b_closed')
         },
         sureText: window.getSystemLang('g_ok'),
         cancelText: window.getSystemLang('g_deselectall'),
         pointMsg: window.getSystemLang('couponactivityredeem_pointmsg'),
         obtainPoint: [],
         apiUrl,
         pageUrl,
      }),
      computed: {
         couponImg() { //活動票券背景圖
            if (this.activityInfo === null) return '';
            else return this.activityInfo.feature_image.url;
         },
         hasCouponImg() { //是否有活動票券背景圖
            return this.couponImg !== '';
         },
         activityTitle() {
            if (this.activityInfo === null) return '';
            return this.activityInfo.title;
         },
         exchangeTime() { //兌換時間
            if (this.activityInfo === null) return '';
            let { start_datetime, end_datetime } = this.activityInfo;
            let startTime = start_datetime.split(' ')[0];
            let endTime = end_datetime.split(' ')[0];
            return `${startTime} ~ ${endTime}`;
         },
         metaList() {
            if (this.activityInfo === null) return [];
            if (this.activityInfo.meta === undefined) return [];
            return this.activityInfo.meta;
         },
         activityDesc() {
            if (this.activityInfo === null) return '';
            return this.activityInfo.content;
         },
         activityStatusText() {
            if (this.activityInfo === null) return '';
            return this.activityStatus[this.activityInfo.status];
         },
         isOpening() { //票券是否已開啟
            if (this.activityInfo === null) return false;
            return this.activityInfo.status === 'opening';
         },
         redeemTypeText() { //兌換活動狀態
            if (this.activityInfo === null) return '';
            return this.redeemType[this.activityInfo.redeem_type];
         },
         brandLogo() { //品牌logo
            if (this.brandInfo === null) return {};
            let imgUrl = this.brandInfo.feature_image_small.url;
            if (!imgUrl) return {};
            else return { backgroundImage: `url(${imgUrl})` };
         },
      },
      methods: {
         bindModalEvent() {
            $('#redeemModal').on('shown.bs.modal', function () {
               $(this).find('input').focus();
            });
            $('#redeemModal').on('hidden.bs.modal', () => {
               this.$refs.form.reset();
               this.user.code = '';
            });
         },
         getQuery(key) { //取得網址參數
            let params = (new URL(document.location)).searchParams;
            let paramsValue = params.get(key) || 0;
            return paramsValue;
         },
         gatherPointId(data) { //蒐集點數id
            return data.map(item => item.point_id);
         },
         reWriteHandler() { //重新填寫代碼
            $('#redeemModal').modal('show');
            $('#redeemFailModal').modal('hide');
         },
         mergeAboutPoint(condition, pointData) { //合併點數相關資料
            return condition.reduce((prev, current) => {
               let pointId = current.point_id;
               let obj = pointData.find(item => item.point_id === pointId);
               prev.push({
                  id: pointId,
                  title: obj.title,
                  point: current.amount,
                  imgUrl: obj.feature_image.url,
                  expireTime: obj.point_circulate_end_datetime
               });
               return prev;
            }, []);
         },
         exchangeHandler() { //兌換處理
            let type = this.activityInfo.redeem_type;
            let obj = { free: '#freeModal', redeem_code: '#redeemModal' };
            $(obj[type]).modal('show');
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
         async getActivityInfo() { //取得點數活動列表
            return await axios({
               url: this.apiUrl.activityInfo,
               method: 'post',
               data: {
                  point_activity_ids: [this.activityId],
                  full_info: true
               }
            }).then(res => {
               return res.data.results.point_activity_information;
            }).catch(err => null);
         },
         async getPointInfo(idArr) { //取得點數詳情
            return await axios({
               url: this.apiUrl.pointInfo,
               method: 'post',
               data: {
                  point_id: idArr,
                  full_info: false
               }
            }).then(res => {
               return res.data.results.point_information;
            }).catch(err => null);
         },
         async getBrandInfo(idArr) { //取得品牌資訊
            return await axios({
               url: this.apiUrl.brandInfo,
               method: 'post',
               data: {
                  brand_ids: idArr,
                  full_info: false
               }
            }).then(res => {
               return res.data.results.brand_information;
            }).catch(err => null);
         },
         async freeExchange() { //免費兌換
            $('#freeModal').modal('hide');
            let result = await this.confirmExchange({}).then(res => res);
            if (!result.status) $('#errorModal').modal('show');
         },
         async redeemExchange() { //代碼兌換
            let isValid = await this.$refs.form.validate().then(res => res);
            if (!isValid) return;
            $('#redeemModal').modal('hide');
            let payload = { redeem_code: this.user.code };
            let result = await this.confirmExchange(payload).then(res => res);
            if (!result.status) $('#redeemFailModal').modal('show');
         },
         async confirmExchange(payload) { //確認兌換
            this.isLoading = true;
            let data = { point_activity_id: this.activityId, ...payload };
            return axios({
               url: this.apiUrl.redeemPointActivity,
               method: 'post',
               data,
            }).then(res => {
               let resData = res.data.results.point_redeem_result;
               localStorage.setItem('exchangePoint', JSON.stringify(resData));
               localStorage.setItem('obtainPoint', JSON.stringify(this.obtainPoint));
               location.href = this.pageUrl.exchangeOk;
               return { status: true };
            }).catch(err => {
               this.errMsg = err.response.data.rcrm.RM;
               return { status: false };
            }).finally(() => {
               this.isLoading = false;
            });
         },
         async autoExchange() { //自動兌換(這裡指有免費兌換)
            let autoResult = await this.confirmExchange({}).then(res => res);
            if (!autoResult.status) $('#errorModal').modal('show');
         }
      },
      async mounted() {
         this.bindModalEvent();
         this.isLoading = true;

         this.activityId = parseInt(this.getQuery('point_activity_id'));
         this.activityInfo = await this.getActivityInfo().then(res => res[0]);
         let { brand_id, obtain_points } = this.activityInfo;
         let pointIdArr = this.gatherPointId(obtain_points);
         let pointResult = await this.getPointInfo(pointIdArr).then(res => res);
         this.brandInfo = await this.getBrandInfo([brand_id]).then(res => res[0]);
         this.pointList = this.mergeAboutPoint(obtain_points, pointResult);
         this.obtainPoint = obtain_points;

         this.isLoading = false;

         // //===兌換碼自動兌換 ?point_activity_id=8&codeAuto=true
         if (this.getQuery('codeAuto') === 'true') {
            if (this.isOpening) $('#redeemModal').modal('show');
         }

         // //===自動兌換?point_activity_id=7&auto=true&type=free
         if (this.getQuery('auto') === 'true') {
            if (this.isOpening) await this.autoExchange();
         }
         
      }
   });
}