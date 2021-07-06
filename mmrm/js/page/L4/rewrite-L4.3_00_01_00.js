export default function({ openLink, apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      mixins: [openLink],
      data: () => ({
         layoutId: 'a',
         turnOn: false,
         searchLoading: false,
         filterParams: null,
         newsInfo: [],
         brandList: [],
         newsOrder: -1,
         isMultipleBrand: true,
         layoutList: [
            { id: 'a', class: 'layoutA' },
            { id: 'b', class: 'layoutB' }
         ],
         apiUrl,
         pageUrl
      }),
      computed: {
         changeLayout() { //板型切換
            return this.layoutId !== 'a';
         },
         hasNews() {
            return this.newsInfo.length > 0;
         },
         newsList() { //最新消息列表
            if (!this.hasNews) return [];
            if (this.brandList.length === 0) return [];
            return this.newsInfo.reduce((prev, current) => {
               let targetBrand = this.brandList.find(brand => brand.brand_id === current.brand_id);
               prev.push({ ...current, brandInfo: targetBrand });
               return prev;
            }, []);
         },
         hasEmpty() {
            return !this.searchLoading && !this.hasNews;
         },
         reachBottom() {
            return !this.searchLoading && this.hasNews;
         }
      },
      methods: {
         changeCategory(id) { //切換分類
            this.categoryId = id;
         },
         layoutHandler(id) { //板型切換
            this.layoutId = id;
         },
         openHandler() { //打開選單
            this.turnOn = true;
         },
         layoutHandler(id) { //板型切換
            this.layoutId = id;
         },
         getQuery(key) { //取得網址參數
            let params = (new URL(document.location)).searchParams;
            let paramsValue = params.get(key);
            return paramsValue;
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
         async getNewsList() { //取得最新消息列表
            return axios({
               url: this.apiUrl.searchList,
               method: 'post',
               data: this.filterParams
            }).then(res => {
               return res.data.results.search_cms_list_item_results;
            }).catch(err => []);
         },
         async getBrandInfo(brandIds) { //取得品牌資訊
            return axios({
               url: this.apiUrl.brandInfo,
               method: 'post',
               data: {
                  brand_ids: brandIds,
                  full_info: false
               }
            }).then(res => {
               return res.data.results.brand_information
            }).catch(err => []);
         },
         createFilterParams(payload) { //產生篩選參數
            let result = { type: 'news' };
            let { brand_ids, cms_list_category_ids } = payload;
            if (brand_ids.length !== 0) result.brand_ids = brand_ids;
            if (cms_list_category_ids.length !== 0) result.cms_list_category_ids = cms_list_category_ids;
            return result;
         },
         gatherBrandId() { //取得品牌id
            let idArr = this.newsInfo.map(item => item.brand_id);
            return Array.from(new Set(idArr));
         },
         async searchHandler(payload) {
            this.searchLoading = true;
            this.filterParams = this.createFilterParams(payload);
            this.newsInfo = await this.getNewsList().then(res => res);
            if (this.hasNews) {
               let brandIds = this.gatherBrandId();
               this.brandList = await this.getBrandInfo(brandIds).then(res => res);
            }
            this.turnOn = false;
            this.$refs.sidebar.backHandler('');
            this.searchLoading = false;
         },
         setNewsOrder() {
            let order = this.getQuery('order');
            if (order === null) return;
            this.newsOrder = parseInt(order);
         }
      },
      async mounted() {
         this.searchLoading = true;
         this.bindModalEvent();
         this.setNewsOrder();
         this.isMultipleBrand = await this.getMultipleBrand().then(res => res);
      }
   });
}