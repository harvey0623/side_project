window.app = function({ openLink ,apiUrl, pageUrl }) {
   let mySwiper = null;
   new Vue({
      el: '#app',
      mixins: [openLink],
      data: () => ({
         bookId: 0,
         pageId: 0,
         bookData: null,
         pageData: null,
         brandInfo: null,
         searchLoading: false,
         playerList: [],
         isMultipleBrand: true,
         hasControl: false,
         apiUrl,
         pageUrl
      }),
      computed: {
         slideList() { //輪播列表
            if (this.pageData === null) return [];
            return this.pageData.images.reduce((prev, current) => {
               prev.push({
                  url: current.url,
                  componentName: current.type === 'image' ? 'image-slide' : 'youtube-slide'
               });
               return prev;
            }, []);
         },
         hasSlide() {
            return this.slideList.length > 0;
         },
         pageTitle() {
            if (this.pageData === null) return '';
            else return this.pageData.title;
         },
         metaList() {
            if (this.pageData === null) return [];
            if (!this.pageData.meta) return [];
            return this.pageData.meta;
         },
         hasMetaList() { //是否有meta資料
            return this.metaList.length !== 0;
         },
         pageContent() { //頁面內容
            if (this.pageData === null) return '';
            else return this.pageData.content;
         },
         hasPageContent() { //是否有頁面內容
            return this.pageContent !== '';
         },
         brandBg() {
            if (this.brandInfo === null) return {};
            let imgUrl = this.brandInfo.feature_image_small.url;
            if (!imgUrl) return {};
            else return { backgroundImage: `url(${imgUrl})` };
         },
         linkBlocks() {
            if (this.pageData === null) return [];
            if (this.pageData.link_blocks === null) [];
            return this.pageData.link_blocks;
         }
      },
      methods: {
         getQuery(key) { //取得網址參數
            let params = (new URL(document.location)).searchParams;
            let paramsValue = params.get(key);
            return paramsValue;
         },
         async getBookData() { //取得書本資料
            return axios({
               url: this.apiUrl.book,
               method: 'post',
               data: { book_id: this.bookId }
            }).then(res => {
               return res.data.results.book;
            }).catch(err => null);
         },
         async getPageInfo() { //取得頁面資訊
            return axios({
               url: this.apiUrl.pageInfo,
               method: 'post',
               data: { page_id: this.pageId }
            }).then(res => {
               return res.data.results.page;
            }).catch(err => null)
         },
         async getBrandInfo() {
            return axios({
               url: this.apiUrl.barndInfo,
               method: 'post',
               data: { 
                  brand_ids: [this.pageData.brand_id],
                  full_info: false
               }
            }).then(res => {
               return res.data.results.brand_information[0];
            }).catch(err => null)
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
         addPlayer(player) {
            this.playerList.push(player);
         },
         stopPlayer() {
            this.playerList.forEach(player => player.pauseVideo());
         },
         initSwiper() {
            let isThanOne = this.slideList.length > 1;
            let option = {
               autoplay: false,
               allowTouchMove: isThanOne,
               pagination: {
                  el: '.swiper-pagination',
                  bulletActiveClass: 'active'
               },
               on: {
                  slideChange: this.stopPlayer
               }
            }
            if (!isThanOne) delete option.pagination;
            mySwiper = new Swiper('.swiper-container', option);
         },
         addPadding(val) { //增加app padding
            this.hasControl = val;
         }
      },
      created() {
         this.bookId = parseInt(this.getQuery('book_id'));
         this.pageId = parseInt(this.getQuery('page_id'));
      },
      async mounted() {
         this.searchLoading = true;
         this.bookData = await this.getBookData().then(res => res);
         this.pageData = await this.getPageInfo().then(res => res);
         this.isMultipleBrand = await this.getMultipleBrand(res => res);
         if (this.pageData !== null) {
            this.brandInfo = await this.getBrandInfo().then(res => res);
         }
         await this.$nextTick();
         if (this.hasSlide) this.initSwiper();
         this.searchLoading = false;
      }
   });
}