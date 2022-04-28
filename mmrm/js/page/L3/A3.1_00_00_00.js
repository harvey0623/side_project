export default function ({ projectTime, apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      mixins: [localProfile],
      data: () => ({
         layoutList: [
            { id: 'a', class: 'layoutA'},
            { id: 'b', class: 'layoutB' }
         ],
         layoutId: 'a',
         currentPage: 0,
         totalCoupon: 0,
         couponActivityId: [],
         pointList: [],
         activityList: [],
         brandList: [],
         pagLoading: false,
         searchLoading: false,
         turnOn: false,
         systemTime: '',
         projectTime,
         activityParams: null,
         redeemPointTitle: window.getSystemLang('couponactivityredeem_redeempointtitle'),
         sureText: window.getSystemLang('g_ok'),
         cancelText: window.getSystemLang('g_cancel'),
         user: { code: '' },
         mobileSelect: null,
         modalTitle: { free: '', point: '', errMsg: '' },
         tempParams: { activityId: '', type: '', pointId: '', pointCategory: '' },
         apiUrl,
         pageUrl,
      }),
      computed: {
         changeLayout() { //板型切換
            return this.layoutId !== 'a';
         },
         isThanOne() { //輪播點數是否大於1
            return this.pointList.length > 1;
         },
         hasActivity() { //是否有票券id資料
            return this.couponActivityId.length > 0;
         },
         hasNextPage() {  //是否有下一頁
            return this.currentPage !== null;
         },
         reachBottom() { //沒有下一頁資料
            return !this.pagLoading && !this.hasNextPage && this.hasActivity;
         },
         noActivity() { //沒活動資料
            return !this.pagLoading && !this.hasNextPage && !this.hasActivity;
         },
         hasSeeMore() {
            return !this.searchLoading && !this.hasActivity;
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
         reWriteHandler() { //重新填寫代碼
            $('#redeemModal').modal('show');
            $('#redeemFailModal').modal('hide');
         },
         showPointDetail() { //顯示點數詳情
            firebaseGa.logEvent('eventlist_points');
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
            firebaseGa.logEvent(this.changeLayout ? 'eventlist_style02' : 'eventlist_style01');
         },
         openHandler() { //打開選單
            if (this.pagLoading) return;
            this.turnOn = true;
            firebaseGa.logEvent('eventlist_search');
         },
         cammaToNumber(text) { //千分位轉數字
            let result = text.replace(/,/g, '');
            return parseInt(result);
         },
         mergeAboutPoint(summary, info) { //合併點數資料
            return summary.reduce((prev, current) => {
               let targetObj = info.find(item => item.point_id === current.point_id);
               prev.push({ ...current, pointInfo: targetObj || null });
               return prev;
            }, []);
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
         getMemberSummary() { //取得會員摘要
            return mmrmAxios({
               url: this.apiUrl.memberSymmary,
               method: 'post',
               data: {}
            }).then(res => {
               this.totalCoupon = res.data.results.coupon_summary.valid_coupon_amount;
               return res.data.results.point_summary.current_point;
            }).catch(err => null);
         },
         getPointInfo(pointIdArr) { //取得內部數詳情
            return mmrmAxios({
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
         getExternalPointInfo(pointIdArr) { //取得額外點數詳情
            return mmrmAxios({
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
         getBrandInfo(brandIdArr) { //取得品牌資料
            return mmrmAxios({
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
         getActivityList() { //取得票券活動列表id
            return mmrmAxios({
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
         getActivityInfo() { //取得票券活動列表
            return mmrmAxios({
               url: this.apiUrl.activityInfo,
               method: 'post',
               data: {
                  coupon_activity_ids: this.couponActivityId,
                  full_info: false
               }
            }).then(res => {
               return res.data.results.coupon_activity_information;
            }).catch(err => null);
         },
         async doPointSlider() { //產生點數輪播
            let pointSummary = await this.getMemberSummary().then(res => res);
            let pointIdArr = this.gatherPointId(pointSummary);
            let pointInfo = await this.getPointInfo(pointIdArr).then(res => res);
            this.pointList = this.mergeAboutPoint(pointSummary, pointInfo);
            await this.$nextTick();
            new Swiper('.swiper-container', {
               direction: 'vertical',
               loop: this.isThanOne,
               allowTouchMove: false,
               autoplay: this.isThanOne ? { delay: 3000 } : false,
               speed: 1000,
            });
         },
         gatherPointId(data) { //取得點數id
            return data.map(item => item.point_id);
         },
         async getPointCategoryInfo({ data, key }) { //取得點數分類資訊
            if (data[key] === undefined) return [];
            let pointIdArr = this.gatherPointId(data[key]);
            let method = key === 'point_condition' ? 'getPointInfo' : 'getExternalPointInfo';
            let result = await this[method](pointIdArr);
            result.forEach(item => item.category = key);
            return result;
         },
         async mergeActivityAndPoint(data) { //合併活動和點數資訊
            let result = [];
            for (let i = 0; i < data.length; i++) {
               let obj = data[i];
               if (obj.redeem_type === 'point') {
                  let normalCategory = await this.getPointCategoryInfo({
                     data: obj, key: 'point_condition' 
                  });
                  let externalCategory = await this.getPointCategoryInfo({
                     data: obj, key: 'external_point_condition' 
                  });
                  result.push({ ...obj, pointInfo: [...normalCategory, ...externalCategory] });
               } else {
                  result.push({ ...obj, pointInfo: null });
               }
            }
            return result;
         },
         addPoint(data) { //點數加總
            return data.reduce((prev, current) => {
               prev += this.cammaToNumber(current.amount);
               return prev;
            }, 0);
         },
         async getPagination(isPag) { //拿分頁資料
            this.pagLoading = true;

            let activityResult = await this.getActivityList().then(res => res);
            this.currentPage = activityResult.next;
            this.systemTime = activityResult.results.system_datetime || '';
            let couponActivityIds = activityResult.results.coupon_activity_ids;
            this.couponActivityId = couponActivityIds !== undefined ? couponActivityIds : [];
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
         createPickList(data) { //產生點數下拉清單
            let categoryArr = ['point_condition', 'external_point_condition'];
            let result = [];
            categoryArr.forEach(category => {
               if (data[category] === undefined) return false;
               let conditionArr = data[category].reduce((prev, current) => {
                  let pointId = current.point_id;
                  let obj = data.pointInfo.find(item => {
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
            return result;
         },
         readyExchange(payload) { //準備兌換
            let { id:activityId, type, status } = payload;
            if (status !== 'opening') return;
            let targetObj = this.activityList.find(item => item.coupon_activity_id === activityId);
            this.tempParams.activityId = activityId;
            this.tempParams.type = type;
            if (type === 'free') {
               this.modalTitle[type] = targetObj.title;
               $('#freeModal').modal('show');
            } else if (type === 'redeem_code') {
               $('#redeemModal').modal('show');
            } else if (type === 'point') {
               let pickList = this.createPickList(targetObj);
               if (pickList.length === 1) {
                  let { id: pointId, title, amount, category } = pickList[0];
                  let templateText = window.getSystemLang('couponactivityredeem_pointmsg');
                  let parseText = vsprintf(templateText, [title, amount, targetObj.title]);
                  this.modalTitle.point = parseText;
                  this.tempParams.pointId = pointId;
                  this.tempParams.pointCategory = category;
                  $('#pointModal').modal('show');
               } else {
                  this.mobileSelect.updateWheel(0, pickList);
                  this.mobileSelect.locatePosition(0, 0);
                  this.mobileSelect.show();
               }
            }
         },
         async gatherParams() { //蒐集參數
            let params = {};
            let exchangeType = this.tempParams.type;
            params.coupon_activity_id = this.tempParams.activityId;
            if (exchangeType === 'free') {
               $('#freeModal').modal('hide');
            } else if (exchangeType === 'redeem_code') {
               let isValid = await this.$refs.form.validate().then(res => res);
               if (!isValid) return;
               params.redeem_code = this.user.code;
               $('#redeemModal').modal('hide');
            } else if (exchangeType === 'point') {
               let { pointCategory } = this.tempParams;
               let key = pointCategory === 'point_condition' ? 'point_id' : 'external_point_id';
               params[key] = this.tempParams.pointId;
               $('#pointModal').modal('hide');
            }
            let result = await this.confirmExchange(params).then(res => res);
            if (result.status) return;
            if (exchangeType === 'free' || exchangeType === 'point') {
               $('#errorModal').modal('show');
            } else {
               $('#redeemFailModal').modal('show');
            }
         },
         async confirmExchange(payload) { //確認兌換
            this.searchLoading = true;
            return mmrmAxios({
               url: this.apiUrl.redeemCouponActivity,
               method: 'post',
               data: payload
            }).then(res => {
               let resData = res.data.results.coupon_redeem_result;
               localStorage.setItem('exchange', JSON.stringify(resData));
               location.href = this.pageUrl.exchangeOk;
               return { status: true };
            }).catch(err => {
               this.modalTitle.errMsg = err.response.data.rcrm.RM;
               return { status: false };
            }).finally(() => {
               this.searchLoading = false;
            });
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
               wheels: [{
                  data: [{ id: '', value: '' }]
               }],
               callback: (index, data) => {
                  this.tempParams.pointId = data[0].id;
                  this.tempParams.pointCategory = data[0].category;
                  this.gatherParams();
               }
            });
         },
         backGaClick(evt) {
            let linkObj = evt.currentTarget;
            firebaseGa.logEvent(linkObj.dataset.event);
            location.href = linkObj.href;
         }
      },
      async mounted() {
         this.bindModalEvent();
         this.initIosPicker();
         this.searchLoading = true;
         await this.doPointSlider();
      },
   });
}