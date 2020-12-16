export default function({ openLink, apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      mixins: [openLink],
      data: () => ({
         bookId: 0,
         pageId: 0,
         bookData: null,
         pageData: null,
         searchLoading: false,
         hasControl: false,
         currentPage: 0,
         apiUrl,
         pageUrl
      }),
      computed: {
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
         addPadding(val) { //增加app padding
            this.hasControl = val;
         },
         backPrevPage() { //回到上一頁
            let isSwitch = this.getQuery('isSwitch') === 'true';
            let url = `${this.pageUrl.book}?book_id=${this.bookId}&currentPage=${this.currentPage}&isSwitch=${isSwitch}`;
            location.href = url;
         }
      },
      created() {
         this.bookId = parseInt(this.getQuery('book_id'));
         this.pageId = parseInt(this.getQuery('page_id'));
         this.currentPage = parseInt(this.getQuery('currentPage')) || 0;
      },
      async mounted() {
         this.searchLoading = true;
         this.bookData = await this.getBookData().then(res => res);
         this.pageData = await this.getPageInfo().then(res => res);
         this.searchLoading = false;
      }
   });
}