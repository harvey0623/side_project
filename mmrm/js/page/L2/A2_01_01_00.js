export default function ({ apiUrl, pageUrl }) {
   dayjs.extend(window.dayjs_plugin_isSameOrAfter);
   dayjs.extend(window.dayjs_plugin_isSameOrBefore);
   dayjs.extend(window.dayjs_plugin_isBetween);
   let today = dayjs();
   new Vue({
      el: '#app',
      mixins: [localProfile],
      data: () => ({
         pointId: '',
         pointInfo: [],
         currentPoint: null,
         currentPointType: 'accumulate',
         tabInfo: {
            accumulate: { title: '累點', pos: 0 },
            discount: { title: '扣點', pos: 0 }
         },
         expireList: [],
         tempHistory: [],
         pointHistory: [],
         turnOn: false,
         tipMsg: '',
         transactionId: '',
         isLoading: false,
         pagLoading: false,
         currentPage: 0,
         dateRange: {
            start: today.subtract(6, 'month').format('YYYY-MM-DD'),
            end: today.format('YYYY-MM-DD')
         },
      }),
      computed: {
         dateFormat() { //日期格式轉換
            let start = this.dateRange.start.replace(/-/g, '/');
            let end = this.dateRange.end.replace(/-/g, '/');
            return { start, end };
         },
         hasPointInfo() { //是否有點數資訊
            return this.pointInfo.length > 0;
         },
         hasExpire() { //是否有過期點數
            return this.expireList.length > 0;
         },
         expireTotal() { //即將到期筆數
            return this.expireList.length;
         },
         expireAmount() { //即將過期總點數
            if (!this.hasExpire) return 0;
            return this.expireList.reduce((prev, current) => {
               let amount = this.cammaToNumber(current.amount);
               prev += amount;
               return prev;
            }, 0);
         },
         hasPointHistory() { //是否有點數歷史資料
            return this.tempHistory.length > 0;
         },
         targetHistory() { //單筆點數交易資料
            if (!this.hasPointHistory) return null;
            let obj = this.tempHistory.find(item => item.transaction_id === this.transactionId);
            if (obj !== undefined) return obj;
            else return null;
         },
         amountText() {
            if (this.targetHistory === null) return 0;
            let amount = this.targetHistory.amount;
            if (amount.includes('-')) return amount;
            else return '+' + amount;
         },
         metaList() {
            if (this.targetHistory === null) return [];
            if (this.targetHistory.meta === null) return [];
            return this.targetHistory.meta;
         },
         hasNextPage() { //是否有下一頁
            return this.currentPage !== null;
         },
         isNoAccmulate() { //是否有累點
            return !this.isLoading && this.pointHistory.length === 0 && this.currentPointType === 'accumulate';
         },
         isNoDiscount() { //是否有扣點
            return !this.isLoading && this.pointHistory.length === 0 && this.currentPointType === 'discount';
         },
         reachBottom() {
            return !this.isLoading && this.hasPointHistory && !this.hasNextPage;
         }
      },
      methods: {
         getQuery(key) { //取得網址參數
            let params = (new URL(document.location)).searchParams;
            let value = params.get(key);
            return value;
         },
         showExpireDetail() {
            if (!this.hasExpire) return;
            $('#expireModal').modal('show');
         },
         splitDateTime(text) { //分割日期和時間
            return text.split(' ')[0];
         },
         cammaToNumber(text) {
            let result = text.replace(/,/g, '');
            return parseInt(result);
         },
         getMemberSummary() { //取得會員簡介
            return mmrmAxios({
               url: apiUrl.memberSummary,
               method: 'post',
               data: {}
            }).then(res => {
               return res.data.results.point_summary;
            }).catch(err => null);
         },
         getPointInfo() { //取得點數資料
            return mmrmAxios({
               url: apiUrl.pointInfo,
               method: 'post',
               data: {
                  point_id: [this.pointId],
                  full_info: false
               }
            }).then(res => {
               return res.data.results.point_information;
            }).catch(err => null);
         },
         getExpirePoint() { //取得過期點數
            return mmrmAxios({
               url: apiUrl.expiredPoint,
               method: 'post',
               data: {
                  point_id: this.pointId
               }
            }).then(res => {
               return res.data.results.point_due_to_expire
            }).catch(err => null);
         },
         getHistoryPoint() { //取得歷史點數
            let { start, end } = this.dateFormat;
            return mmrmAxios({
               url: apiUrl.pointHistory,
               method: 'post',
               data: {
                  point_id: this.pointId,
                  query_start_datetime: `${start} 00:00:00`,
                  query_end_datetime: `${end} 23:59:59`,
                  offset: this.currentPage
               }
            }).then(res => {
               this.currentPage = res.data.next;
               return res.data.results.point_history;
            }).catch(err => null);
         },
         async getPointAmount() { //取得點數資訊
            let pointSummary = await this.getMemberSummary();
            let obj = pointSummary.current_point.find(item => item.point_id === this.pointId);
            if (obj !== undefined) return obj;
            else return null;
         },
         showDetailHandler(id) { //顯示歷史詳情資訊
            this.transactionId = id;
            $('#historyModal').modal('show');
         },
         async changePointType(type) { //切換點數分類
            if (this.pagLoading) return;
            window.removeEventListener('scroll', this.scrollHandler);
            this.tabInfo[this.currentPointType].pos = window.pageYOffset;
            this.currentPointType = type;
            let categoryArr = this.createFilterList();
            this.pointHistory = categoryArr.length > 0 ? this.classifyPoint(categoryArr) : [];
            await this.$nextTick();
            window.scrollTo(0, this.tabInfo[this.currentPointType].pos);
            setTimeout(() => {
               window.addEventListener('scroll', this.scrollHandler);
            }, 50);
         },
         createFilterList() { //篩選歷史分類資料
            if (!this.hasPointHistory) return [];
            return this.tempHistory.filter(item => {
               let isAccumulate = this.currentPointType === 'accumulate';
               let criteria = item.amount.includes('-');
               return isAccumulate ? !criteria : criteria;
            });
         },
         createDateGroup(arr) { //產生日期群組
            if (arr.length === 0) return [];
            let dateSet = new Set();
            arr.forEach(item => {
               dateSet.add(dayjs(item.datetime).format('YYYY / MM'));
            });
            return Array.from(dateSet);
         },
         classifyPoint(categoryArr) { //分類點數資料
            let dateGroup = this.createDateGroup(categoryArr);
            let result = dateGroup.reduce((prev, current, index) => {
               let arr = categoryArr.filter(item => {
                  let dateFormat = dayjs(item.datetime).format('YYYY / MM');
                  return dateFormat === current;
               });
               prev.push({ timeStamp: index, dateText: current, data: arr });
               return prev;
            }, []);
            return result;
         },
         async initHandler() {
            this.pointId = parseInt(this.getQuery('point_id'));
            this.pointInfo = await this.getPointInfo();
            this.currentPoint = await this.getPointAmount();
            this.expireList = await this.getExpirePoint();
         },
         async getPagination() {
            let historyResult = await this.getHistoryPoint();
            this.tempHistory = this.tempHistory.concat(historyResult);
            let categoryArr = this.createFilterList();
            this.pointHistory = categoryArr.length > 0 ? this.classifyPoint(categoryArr) : [];
         },
         async scrollHandler() {
            if (this.isLoading || this.pagLoading) return;
            let documentH = document.documentElement.scrollHeight;
            let windowH = window.innerHeight;
            let distance = documentH - windowH;
            let scrollPos = window.pageYOffset;
            if (scrollPos >= distance * 0.95 && this.hasNextPage) {
               this.pagLoading = true;
               await this.getPagination();
               this.pagLoading = false;
            }
         },
         updateHandler() { //更新歷史資料
            let pointId = this.pointId;
            let { start, end } = this.dateFormat;
            let url = `${pageUrl.searchPage}?point_id=${pointId}&start=${start}&end=${end}`;
            location.href = url;
         },
         descHandler() {
            let url = `${pageUrl.pointDesc}?point_id=${this.pointId}`;
            location.href = url;
         }
      },
      async mounted() {
         window.addEventListener('scroll', this.scrollHandler);
         this.isLoading = true;
         this.getLocalProfile();
         await Promise.all([this.initHandler(), this.getPagination()]);
         this.isLoading = false;
      }
   });
}