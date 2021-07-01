export default function ({ apiUrl, pageUrl }) {
   dayjs.extend(window.dayjs_plugin_isSameOrAfter);
   dayjs.extend(window.dayjs_plugin_isSameOrBefore);
   dayjs.extend(window.dayjs_plugin_isBetween);
   let today = dayjs();
   new Vue({
      el: '#app',
      data: () => ({
         historyList: [],
         turnOn: false,
         isLoading: false,
         isPagLoading: false,
         tipMsg: '',
         nextPage: 0,
         dateRange: {
            start: today.subtract(6, 'month').format('YYYY-MM-DD'),
            end: today.format('YYYY-MM-DD')
         },
      }),
      computed: {
         hasHistory() { //是否有歷史資料
            return this.historyList.length > 0;
         },
         shwoEmptyBlock() {
            return !this.hasHistory && !this.isLoading;
         },
         hasNextPage() {
            return this.nextPage !== null;
         },
         dateFormat() { //日期格式轉換
            let start = this.dateRange.start.replace(/-/g, '/');
            let end = this.dateRange.end.replace(/-/g, '/');
            return { start, end };
         },
      },
      methods: {
         async getPagination(isPag) {
            
         },
         async searchHandler() {
            this.isLoading = true;
            this.nextPage = 0;
            await this.getPagination(false);
            this.turnOn = false;
            await this.$nextTick();
            window.scrollTo(0, 0);
            this.isLoading = false;
         },
         async scrollHandler() {
            if (this.isLoading || this.isPagLoading) return;
            let documentH = document.documentElement.scrollHeight;
            let windowH = window.innerHeight;
            let distance = documentH - windowH;
            let scrollPos = window.pageYOffset;
            if (scrollPos >= distance * 0.95 && this.hasNextPage) {
               this.isPagLoading = true;
               await this.getPagination(true);
               this.isPagLoading = false;
            }
         },
      },
      mounted() {
         window.addEventListener('scroll', this.scrollHandler);
         this.searchHandler();
      }
   });
}