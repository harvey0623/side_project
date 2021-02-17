export default function ({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         activityId: '',
         activityInfo: null,
         pointList: [],
         brandInfo: null,
         brandList: [],
         couponBlock: [],
         storeData: null,
         isLoading: false,
         mobileSelect: null,
         usePoint: null,
         isMultipleBrand: true,
         user: { code: '' },
         errMsg: '',
         apiUrl,
         pageUrl,
         redeemType: {
            free: window.getSystemLang('couponactivitydetail_b_free'),
            redeem_code: window.getSystemLang('couponactivitydetail_b_redeemcode'),
            point: window.getSystemLang('couponactivitydetail_b_point')
         },
         activityStatus: {
            opening: '已開啟',
            unopened: window.getSystemLang('couponactivitydetail_b_unopened'),
            closed: window.getSystemLang('couponactivitydetail_b_closed')
         },
         redeemPointTitle: window.getSystemLang('couponactivityredeem_redeempointtitle'),
         sureText: window.getSystemLang('g_ok'),
         cancelText: window.getSystemLang('g_cancel'),
         pointMsg: window.getSystemLang('couponactivityredeem_pointmsg')
      }),
      computed: {
         bgImg() { //背景圖
            if (this.activityInfo === null) return {};
            let bgUrl = this.activityInfo.feature_image.url || '';
            if (bgUrl !== '') return { backgroundImage: `url(${bgUrl})` };
            else return {};
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
         showPointIntro() { //使否顯示點數區塊
            if (this.activityInfo === null) return false;
            return this.activityInfo.redeem_type === 'point';
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
         brandLogo() {
            if (this.brandInfo === null) return '';
            let imgUrl = this.brandInfo.feature_image_small.url;
            if (imgUrl !== null) return { backgroundImage: `url(${imgUrl})` };
            else return {};
         },
         pointListThanOne() { //點數選單數量是否大於1
            return this.pointList.length > 1;
         },
         pointTipText() { //點數使用提示
            if (this.pointList.length === 1) {
               let { title, amount } = this.pointList[0];
               return vsprintf(this.pointMsg, [title, amount, this.activityTitle]);
            }
            if (this.usePoint === null) return '';
            let { title, amount } = this.usePoint;
            return vsprintf(this.pointMsg, [title, amount, this.activityTitle]);
         }
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
         scrollHandler() {
            let el = this.$refs.inner;
            let scrollPos = window.pageYOffset * 0.5;
            el.style.transform = `translateY(${scrollPos}px)`;
         },
         getQuery(key) { //取得網址參數
            let params = (new URL(document.location)).searchParams;
            let paramsValue = params.get(key) || 0;
            return paramsValue;
         },
         getBrandArr(data) { //組成brand id陣列
            let result = data.reduce((prev, current) => {
               prev = prev.concat(current.brand_ids);
               return prev;
            }, []);
            return Array.from(new Set(result));
         },
         mergeCouponAndStore(couponInfo, storeData) { //合併票券和商店資料資料
            return couponInfo.reduce((prev, current) => {
               let couponId = current.coupon_id;
               let obj = storeData.find(item => item.coupon_id === couponId);
               prev.push({ ...current, storeList: obj || null });
               return prev;
            }, []);
         },
         reWriteHandler() { //重新填寫代碼
            $('#redeemModal').modal('show');
            $('#redeemFailModal').modal('hide');
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
         async getActivityInfo() { //取得票券活動列表
            return await axios({
               url: this.apiUrl.activityInfo,
               method: 'post',
               data: {
                  coupon_activity_ids: [this.activityId],
                  full_info: true
               }
            }).then(res => {
               return res.data.results.coupon_activity_information;
            }).catch(err => null);
         },
         async getPointInfo(pointIdArr) { //取得一般點數詳情
            return await axios({
               url: this.apiUrl.pointInfo,
               method: 'post',
               data: {
                  point_id: pointIdArr,
                  full_info: false
               }
            }).then(res => {
               return res.data.results.point_information;
            }).catch(err => null);
         },
         async getExternalPointInfo(pointIdArr) { //取得額外點數詳情
            return await axios({
               url: this.apiUrl.externalPoint,
               method: 'post',
               data: {
                  point_id: pointIdArr,
                  full_info: false
               }
            }).then(res => {
               return res.data.results.point_information;
            }).catch(err => null);
         },
         async getCouponInfo(idArr) { //取得票券資料
            return await axios({
               url: this.apiUrl.couponInfo,
               method: 'post',
               data: {
                  coupon_ids: idArr,
                  full_info: true
               }
            }).then(res => {
               return res.data.results.coupon_information;
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
         async getAvailableStore(idArr) { //取得門市列表
            return await axios({
               url: this.apiUrl.storeList,
               method: 'post',
               data: {
                  coupon_ids: idArr,
               }
            }).then(res => {
               return res.data.results.search_coupon_available_store_results;
            }).catch(err => null);
         },
         gatherPointId(data) { //蒐集點數id
            return data.map(item => item.point_id);
         },
         async getPointCategoryInfo(key) { //取得點數分類資訊
            if (this.activityInfo[key] === undefined) return [];
            let pointIdArr = this.gatherPointId(this.activityInfo[key]);
            let method = key === 'point_condition' ? 'getPointInfo' : 'getExternalPointInfo';
            let result = await this[method](pointIdArr);
            result.forEach(item => item.category = key);
            return result;
         },
         createPickList(pointInfo) { //產生點數下拉清單
            let categoryArr = ['point_condition', 'external_point_condition'];
            let result = [];
            categoryArr.forEach(category => {
               if (this.activityInfo[category] === undefined) return false;
               let conditionArr = this.activityInfo[category].reduce((prev, current) => {
                  let pointId = current.point_id;
                  let obj = pointInfo.find(item => {
                     return item.point_id === pointId && item.category === category;
                  });
                  prev.push({
                     id: pointId,
                     title: obj.title,
                     value: `${obj.title} : ${current.amount}點`,
                     amount: current.amount,
                     category
                  });
                  return prev;
               }, []);
               result = result.concat(conditionArr);
            });
            // result.push({
            //    id: 999,
            //    title: '外部點數',
            //    value: '外部點數3點',
            //    amount: 3,
            //    category: 'external_point_condition'
            // });
            return result;
         },
         initIosPicker() { //初使iso picker
            this.mobileSelect = new MobileSelect({
               trigger: '#iosPicker',
               title: this.redeemPointTitle,
               ensureBtnText: this.sureText,
               cancelBtnText: this.cancelText,
               ensureBtnColor: '#288efb',
               titleColor: '#292929',
               textColor: '#292929',
               triggerDisplayData: false,
               wheels: [{ data: this.pointList }],
               callback: (index, data) => {
                  this.usePoint = data[0];
                  $('#pointModal').modal('show');
               }
            });
         },
         exchangeHandler() {  //兌換處理
            let type = this.activityInfo.redeem_type;
            if (type !== 'point') {
               let obj = { free: '#freeModal', redeem_code: '#redeemModal' };
               $(obj[type]).modal('show');
            } else if (type === 'point' && this.pointListThanOne) {
               this.mobileSelect.show();
            } else if (type === 'point' && !this.pointListThanOne) {
               $('#pointModal').modal('show');
            }
         },
         async freeExchange() { //免費兌換
            $('#freeModal').modal('hide');
            let result = await this.confirmExchange({}).then(res => res);
            if (!result.status) $('#errorModal').modal('show');
         },
         async redeemExchange() { //代碼兌換
            let isValid = await this.$refs.form.validate().then(res => res);
            if (!isValid) return;
            let payload = { redeem_code: this.user.code };
            $('#redeemModal').modal('hide');
            let result = await this.confirmExchange(payload).then(res => res);
            if (!result.status) $('#redeemFailModal').modal('show');
         },
         async pointExchange() { //點數兌換
            let targetObj = this.pointListThanOne ? this.usePoint : this.pointList[0];
            let key = targetObj.category === 'point_condition' ? 'point_id' : 'external_point_id';
            $('#pointModal').modal('hide');
            let result = await this.confirmExchange({ [key]: targetObj.id }).then(res => res);
            if (!result.status) $('#errorModal').modal('show');
         },
         async confirmExchange(payload) { //確認兌換
            this.isLoading = true;
            let data = { coupon_activity_id: this.activityId, ...payload };
            return await axios({
               url: this.apiUrl.redeemCouponActivity,
               method: 'post',
               data,
            }).then(res => {
               let resData = res.data.results.coupon_redeem_result;
               localStorage.setItem('exchange', JSON.stringify(resData));
               location.href = this.pageUrl.exchangeOk;
               return { status: true };
            }).catch(err => {
               this.errMsg = err.response.data.rcrm.RM;
               return { status: false };
            }).finally(() => {
               this.isLoading = false;
            });
         },
         async autoExchange() { //自動兌換
            let payload = {};
            let type = this.getQuery('type');
            if (type === 'point') {
               let category = this.getQuery('category');
               let queryArr = ['point_id', 'external_point_id'];
               let isInclude = queryArr.includes(category);
               if (!isInclude) return;
               payload[category] = parseInt(this.getQuery('point_id'));
            }
            let autoResult = await this.confirmExchange(payload).then(res => res);
            if (!autoResult.status) $('#errorModal').modal('show');
         },
      },
      async mounted() {
         this.bindModalEvent();
         window.addEventListener('scroll', this.scrollHandler);
         this.isLoading = true;

         this.isMultipleBrand = await this.getMultipleBrand().then(res => res);
         this.activityId = parseInt(this.getQuery('coupon_activity_id'));
         this.activityInfo = await this.getActivityInfo().then(res => res[0]);
         let { brand_id, coupon_ids } = this.activityInfo;
         this.brandInfo = await this.getBrandInfo([brand_id]).then(res => res[0]);
         let couponInfoData = await this.getCouponInfo(coupon_ids).then(res => res);
         let brandIdArr = this.getBrandArr(couponInfoData);
         this.brandList = await this.getBrandInfo(brandIdArr).then(res => res);
         let storeData = await this.getAvailableStore(coupon_ids).then(res => res);
         this.couponBlock = this.mergeCouponAndStore(couponInfoData, storeData);

         if (this.showPointIntro) {
            let normalPoint = await this.getPointCategoryInfo('point_condition');
            let externalPoint = await this.getPointCategoryInfo('external_point_condition');
            let pointInfo = normalPoint.concat(externalPoint);
            this.pointList = this.createPickList(pointInfo);
            if (this.pointListThanOne) this.initIosPicker();
         }

         this.isLoading = false;

         //===兌換碼自動兌換 ?coupon_activity_id=1&codeAuto=true
         if (this.getQuery('codeAuto') === 'true') {
            if (this.isOpening) $('#redeemModal').modal('show');
         }
         
         //===自動兌換 ?coupon_activity_id=1&auto=true&type=point&point_id=1&category=point_id
         if (this.getQuery('auto') === 'true') {
            if (this.isOpening) await this.autoExchange();
         }
         
      }
   });
}