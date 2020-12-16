export default function ({ apiUrl }) {
   dayjs.extend(window.dayjs_plugin_isSameOrAfter);
   dayjs.extend(window.dayjs_plugin_isSameOrBefore);
   dayjs.extend(window.dayjs_plugin_isBetween);
   let today = dayjs();
   new Vue({
      el: '#app',
      data: () => ({
         historyData: [],
         brandInfo: [],
         tradeList: [],
         turnOn: false,
         isLoading: false,
         pagLoading: false,
         tipMsg: '',
         currentPage: 0,
         dateRange: {
            start: today.subtract(6, 'month').format('YYYY-MM-DD'),
            end: today.format('YYYY-MM-DD')
         },
         apiUrl
      }),
      computed: {
         hasHistoryData() { //是否有歷史資料
            return this.historyData.length > 0;
         },
         shwoEmptyBlock() {
            return !this.hasHistoryData && !this.isLoading;
         },
         dateFormat() { //日期格式轉換
            let start = this.dateRange.start.replace(/-/g, '/');
            let end = this.dateRange.end.replace(/-/g, '/');
            return { start, end };
         },
         dateGroup() { //資料分組
            if (!this.hasHistoryData) return [];
            let dateSet = new Set();
            this.historyData.forEach(item => {
               let dateFormat = dayjs(item.datetime).format('YYYY / MM');
               dateSet.add(dateFormat);
            });
            return Array.from(dateSet);
         },
         brandIdArr() { //取得店家id
            if (!this.hasHistoryData) return [];
            let brandIdSet = new Set();
            this.historyData.forEach(item => {
               brandIdSet.add(item.brand_id);
            });
            return Array.from(brandIdSet);
         },
         hasNextPage() { //是否有下一頁
            return this.currentPage !== null;
         }
      },
      methods: {
         async getTransactionHistory() { //取得歷史交易資料
            let { start, end } = this.dateFormat;
            return await axios({
               url: this.apiUrl.transaction_history,
               method: 'post',
               data: {
                  query_start_datetime: `${start} 00:00:00`,
                  query_end_datetime: `${end} 23:59:59`,
                  offset: this.currentPage
               }
            }).then(res => {
               this.currentPage = res.data.next;
               return res.data.results.transaction_history;
            }).catch(err => null);
         },
         async getBrandInfo() { //取得品牌資料
            return await axios({
               url: this.apiUrl.brandInfo,
               method: 'post',
               data: {
                  brand_ids: this.brandIdArr,
                  full_info: false
               }
            }).then(res => {
               return res.data.results.brand_information;
            }).catch(err => null);
         },
         addBrandToHistory() { //將品牌資料與交易紀錄合併
            let result = this.historyData.reduce((prev, current) => {
               let brandId = current.brand_id;
               let targetBrand = this.brandInfo.find(item => item.brand_id === brandId);
               let brandTitle = targetBrand !== undefined ? targetBrand.title : '';
               let brandLogo = targetBrand !== undefined ? targetBrand.feature_image_small.url : '';
               prev.push({ ...current, brandTitle, brandLogo });
               return prev;
            }, []);
            return result;
         },
         classifyTrade() { //分類交易資料
            let tradeData = this.addBrandToHistory();
            let result = this.dateGroup.reduce((prev, current, index) => {
               let arr = tradeData.filter(item => {
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
         async getPagination(isPag) {
            this.pagLoading = true;
            let historyResult = await this.getTransactionHistory().then(res => res);
            if (isPag) this.historyData = this.historyData.concat(historyResult);
            else this.historyData = historyResult;
            //如果brand_info是空陣列會報錯
            if (this.hasHistoryData) {
               this.brandInfo = await this.getBrandInfo().then(res => res);
               this.tradeList = this.classifyTrade();
            } else {
               this.tradeList = [];
            }
            this.pagLoading = false;
            return;
         },
         async updateHandler() {
            this.isLoading = true;
            this.currentPage = 0;
            await this.getPagination(false);
            this.isLoading = false;
            this.turnOn = false;
            await this.$nextTick();
            window.scrollTo(0, 0);
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
      },
      async mounted() {
         window.addEventListener('scroll', this.scrollHandler);
         await this.updateHandler();
      }
   });
}