export default function ({ apiUrl, pageUrl }) {
   dayjs.extend(window.dayjs_plugin_isSameOrAfter);
   dayjs.extend(window.dayjs_plugin_isSameOrBefore);
   dayjs.extend(window.dayjs_plugin_isBetween);
   let today = dayjs();
   new Vue({
      el: '#app',
      data: () => ({
         brandList: [],
         historyList: [],
         turnOn: false,
         isLoading: false,
         pagLoading: false,
         tipMsg: '',
         nextPage: 1,
         totalPage: 0,
         memberCard: '',
         dateRange: {
            start: today.subtract(6, 'month').format('YYYY-MM-DD'),
            end: today.format('YYYY-MM-DD')
         },
      }),
      computed: {
         hasHistory() {
            return this.historyList.length > 0;
         },
         hasNextPage() {
            return this.nextPage <= this.totalPage;
         },
         shwoEmptyBlock() {
            return !this.hasHistory && !this.isLoading;
         },
      },
      methods: {
         getMemberCard() {
            return mmrmAxios({
               url: apiUrl.memberCard,
               method: 'post',
               data: {}
            }).then(res => {
               return res.data.results.member_card.code_info.card_info[0].value;
            }).catch(err => '')
         },
         getBrandList() {
            return mmrmAxios({
               url: apiUrl.searchBrand,
               method: 'post',
               data: {}
            }).then(res => res.data.results.brand_ids).catch(err => []);
         },
         getBrandInfo(brandIds) {
            return mmrmAxios({
               url: apiUrl.brandInfo,
               method: 'post',
               data: {
                  "brand_ids": brandIds,
                  "full_info": false
               }
            }).then(res => res.data.results.brand_information).catch(err => []);
         },
         getTradeList() {
            return mmrmAxios({
               url: apiUrl.tradeList,
               method: 'post',
               data: {
                  url: "/cct/cctws/wowapp/salelist/receive",
                  payload: {
                     "request_body_type": "x-www-form-urlencoded",
                     "header": null,
                     "merchant": "wowprime_cct",
                     "http_method": "POST",
                     "body": {
                        "jrsyring": "", //授權金鑰
                        "d_rvnm_f": dayjs(this.dateRange.start).format('YYYYMMDD'), //開始日
                        "d_rvnm_t": dayjs(this.dateRange.end).format('YYYYMMDD'), //結束日
                        "pageat": this.nextPage.toString(), //頁碼
                        "memb_fmscard": this.memberCard, //卡號
                        "version": "00001" //api版本
                     },
                  }
               }
            }).then(res => res.data.results.data.payload)
         },
         createHistoryList(saleArr) {
            if (saleArr.length === 0) return [];
            return saleArr.reduce((prev, current) => {
               let targetBrand = this.brandList.find(brand => brand.brand_code === current.brnd_id);
               prev.push({
                  ...current,
                  brandLogo: targetBrand ? targetBrand.feature_image_small.url : '',
                  pageUrl: `${pageUrl.detail}?sale_id=${current.sale_id}`
               });
               return prev;
            }, []);
         },
         async getPagination(isPag) {
            let response = await this.getTradeList();
            let saleArr = response.data.sale;
            let createdList = this.createHistoryList(saleArr);
            if (isPag) this.historyList = this.historyList.concat(createdList);
            else this.historyList = createdList;
            this.totalPage = parseInt(response.data.lastpage);
            this.nextPage++;
         },
         async searchHandler() {
            this.isLoading = true;
            this.nextPage = 1;
            await this.getPagination(false);
            this.turnOn = false;
            await this.$nextTick();
            window.scrollTo(0, 0);
            this.isLoading = false;
         },
         async scrollHandler() {
            if (this.isLoading || this.pagLoading) return;
            let documentH = document.documentElement.scrollHeight;
            let windowH = window.innerHeight;
            let distance = documentH - windowH;
            let scrollPos = window.pageYOffset;
            if (scrollPos >= distance * 0.95 && this.hasNextPage) {
               this.pagLoading = true;
               await this.getPagination(true);
               this.pagLoading = false;
            }
         },
      },
      async mounted() {
         this.isLoading = true;
         window.addEventListener('scroll', this.scrollHandler);
         this.memberCard = await this.getMemberCard();
         let brandIds = await this.getBrandList();
         this.brandList = await this.getBrandInfo(brandIds);
         this.searchHandler();
      }
   });
}