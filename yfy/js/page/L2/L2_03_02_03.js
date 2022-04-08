export default function ({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         tempHistory: [],
         pointHistory: [],
         transactionId: '',
         currentPage: 0,
         isLoading: false,
         pagLoading: false,
         criteria: {
            point_id: '',
            start: '',
            end: ''
         },
         apiUrl
      }),
      computed: {
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
         targetHistory() { //單獨點數歷史資料
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
         getQuery() { //取得網址參數
            let params = (new URL(document.location)).searchParams;
            let point_id = params.get('point_id') || 1;
            this.criteria = {
               pointId: parseInt(point_id),
               start: params.get('start') || '',
               end: params.get('end') || ''
            };
         },
         hideHistory() { //隱藏歷史資訊modal
            $('#historyModal').modal('hide');
         },
         showDetailHandler(id) { //顯示歷史詳情資訊
            this.transactionId = id;
            $('#historyModal').modal('show');
         },
         async getHistoryPoint() { //取得歷史點數
            let { pointId, start, end } = this.criteria;
            return await axios({
               url: this.apiUrl.pointHistory,
               method: 'post',
               data: {
                  point_id: pointId,
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
                  return dayjs(item.datetime).format('YYYY / MM') === current;
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
         async getPagination() { //取得分頁資料
            this.pagLoading = true;
            let historyResult = await this.getHistoryPoint().then(res => res);
            this.tempHistory = this.tempHistory.concat(historyResult);
            this.pointHistory = this.classifyPoint();
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
               await this.getPagination();
            }
         }
      },
      async mounted() {
         window.addEventListener('scroll', this.scrollHandler);
         this.getQuery();
         this.isLoading = true;
         await this.getPagination();
         this.isLoading = false;
      }
   });
}