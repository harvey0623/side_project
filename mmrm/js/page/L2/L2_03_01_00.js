export default function ({ apiUrl, pageUrl }) {
   dayjs.extend(window.dayjs_plugin_isSameOrAfter);
   dayjs.extend(window.dayjs_plugin_isSameOrBefore);
   dayjs.extend(window.dayjs_plugin_isBetween);
   let today = dayjs();
   let vm = new Vue({
      el: '#app',
      data: () => ({
         pointId: '',
         pointInfo: [],
         currentPoint: null,
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
         apiUrl,
         pageUrl
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
         targetPoint() { //點數資料
            if (!this.hasPointInfo) return null;
            let obj = this.pointInfo.find(item => item.point_id = this.pointId);
            return {
               title: obj.title,
               startTime: this.splitDateTime(obj.point_circulate_start_datetime),
               endTime: this.splitDateTime(obj.point_circulate_end_datetime),
               hide_duration: obj.hide_duration
            };
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
         dateGroup() { //資料分組
            if (!this.hasPointHistory) return [];
            let dateSet = new Set();
            this.tempHistory.forEach(item => {
               dateSet.add(dayjs(item.datetime).format('YYYY / MM'));
            });
            return Array.from(dateSet);
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
         showEmptyBlock() {
            return !this.isLoading && !this.hasPointHistory && !this.hasNextPage;
         },
         reachBottom() {
            return !this.isLoading && this.hasPointHistory && !this.hasNextPage;
         }
      },
      methods: {
         hideExpire() { //隱藏過期點數modal
            $('#expireModal').modal('hide');
         },
         hideHistory() { //隱藏歷史資訊modal
            $('#historyModal').modal('hide');
         },
         showExpireDetail() {
            $('#expireModal').modal('show');
         },
         splitDateTime(text) { //分割日期和時間
            return text.split(' ')[0];
         },
         cammaToNumber(text) {
            let result = text.replace(/,/g, '');
            return parseInt(result);
         },
         getQuery(key) { //取得網址參數
            let params = (new URL(document.location)).searchParams;
            let value = params.get(key) || 1;
            return value;
         },
         async getMemberSummary() { //取得會員簡介
            return await axios({
               url: this.apiUrl.memberSummary,
               method: 'post',
               data: {}
            }).then(res => {
               return res.data.results.point_summary;
            }).catch(err => null);
         },
         async getPointInfo() { //取得點數資料
            return await axios({
               url: this.apiUrl.pointInfo,
               method: 'post',
               data: {
                  point_id: [this.pointId],
                  full_info: false
               }
            }).then(res => {
               return res.data.results.point_information;
            }).catch(err => null);
         },
         async getPointAmount() { //取得點數資訊
            let pointSummary = await this.getMemberSummary().then(res => res);
            let obj = pointSummary.current_point.find(item => item.point_id === this.pointId);
            if (obj !== undefined) return obj;
            else return null;
         },
         async getExpirePoint() { //取得過期點數
            return await axios({
               url: this.apiUrl.expiredPoint,
               method: 'post',
               data: {
                  point_id: this.pointId
               }
            }).then(res => {
               return res.data.results.point_due_to_expire
            }).catch(err => null);
         },
         async getHistoryPoint() { //取得歷史點數
            let { start, end } = this.dateFormat;
            return await axios({
               url: this.apiUrl.pointHistory,
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
         classifyPoint() { //分類點數資料
            let result = this.dateGroup.reduce((prev, current, index) => {
               let arr = this.tempHistory.filter(item => {
                  let dateFormat = dayjs(item.datetime).format('YYYY / MM');
                  return dateFormat === current;
               });
               prev.push({
                  timeStamp: index,
                  dateText: current,
                  data: arr
               });
               return prev;
            }, []);
            return result;
         },
         showDetailHandler(id) { //顯示歷史詳情資訊
            this.transactionId = id;
            $('#historyModal').modal('show');
         },
         descHandler() { //點數說明
            let url = `${this.pageUrl.pointDesc}?point_id=${this.pointId}`;
            location.href = url;
         },
         updateHandler() { //更新歷史資料
            let pointId = this.pointId;
            let { start, end } = this.dateFormat;
            let url = `${this.pageUrl.searchPage}?point_id=${pointId}&start=${start}&end=${end}`;
            location.href = url;
         },
         async initHandler() {
            this.pointId = parseInt(this.getQuery('point_id'));
            this.pointInfo = await this.getPointInfo().then(res => res);
            this.currentPoint = await this.getPointAmount().then(res => res);
            this.expireList = await this.getExpirePoint().then(res => res);
            return;
         },
         async getPagination() {
            this.pagLoading = true;
            let historyResult = await this.getHistoryPoint().then(res => res);
            this.tempHistory = this.tempHistory.concat(historyResult);
            this.pointHistory = this.classifyPoint();
            this.pagLoading = false;
         },
         async scrollHandler() {
            if (this.pagLoading) return;
            let documentH = document.documentElement.scrollHeight;
            let windowH = window.innerHeight;
            let distance = documentH - windowH;
            let scrollPos = window.pageYOffset;
            if (scrollPos >= distance * 0.95 && this.hasNextPage) {
               await this.getPagination();
            }
         },
      },
      async mounted() {
         window.addEventListener('scroll', this.scrollHandler);
         this.isLoading = true;
         await this.initHandler();
         await this.getPagination();
         this.isLoading = false;
      }
   });
}