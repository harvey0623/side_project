export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         bookId: '',
         chapterData: [],
         isSwitch: false,
         isLoading: false,
         turnOn: false,
         currentPage: 0,
         apiUrl,
         pageUrl,
      }),
      computed: {
         catalogTitle() {
            return this.isSwitch ? '快速切頁' : '型錄內頁';
         },
         chapterList() { //章節律表
            return this.chapterData.reduce((prev, current, index, arr) => {
               prev.push({
                  ...current,
                  book_id: this.bookId,
                  startNumber: this.getStartNumber(index, arr),
               })
               return prev;
            }, []);
         },
         imageGallery() {
            return this.chapterData.reduce((prev, current) => {
               prev = prev.concat(current.pages);
               return prev;
            }, []);
         },
         totalPage() { //總頁數
            return this.chapterData.reduce((prev, current) => {
               prev += current.pages.length;
               return prev;
            }, 0);
         },
         isFirstPage() {
            return this.currentPage === 0;
         },
         isLastPage() {
            return this.currentPage === this.totalPage - 1;
         },
         pageCoverBg() { //頁面封面
            let obj = this.imageGallery[this.currentPage];
            if (obj === undefined) return {};
            let imgUrl = obj.feature_image.url;
            if (!imgUrl) return {};
            else return { backgroundImage: `url(${imgUrl})` };
         },
         pageDetailLink() { //頁面連結
            if (this.imageGallery[this.currentPage] === undefined) return '';
            let pageId = this.imageGallery[this.currentPage].page_id;
            let url = `${this.pageUrl.page}?book_id=${this.bookId}&page_id=${pageId}&currentPage=${this.currentPage}`;
            return url;
         }
      },
      methods: {
         switchHandler() {
            this.isSwitch = !this.isSwitch;
         },
         getQuery(key) { //取得網址參數
            let params = (new URL(document.location)).searchParams;
            let paramsValue = params.get(key);
            return paramsValue;
         },
         getBookData() { //取得書本資料
            return mmrmAxios({
               url: this.apiUrl.book,
               method: 'post',
               data: { book_id: this.bookId }
            }).then(res => {
               return res.data.results.book;
            }).catch(err => null);
         },
         async getChapterInfo() { //取得章節資訊
            let bookInfo = await this.getBookData();
            this.chapterData = bookInfo.chapters;
         },
         getStartNumber(index, arr) { //計算起始頁碼
            if (index === 0) return 0;
            let beforeData = arr.slice(0, index);
            return beforeData.reduce((prev, current) => {
               prev += current.pages.length;
               return prev;
            }, 0);
         },
         changeDir(num) { //頁碼切換
            let count = this.currentPage + num;
            if (count > this.totalPage - 1) {
               this.currentPage = this.totalPage - 1;
            } else if (count < 0) {
               this.currentPage = 0;
            } else {
               this.currentPage = count;
            }
         }
      },
      created() {
         // this.currentPage = parseInt(this.getQuery('currentPage')) || 0;
         // this.isSwitch = this.getQuery('isSwitch') === 'true';
      },
      async mounted() {
         this.isLoading = true;
         this.bookId = parseInt(this.getQuery('book_id'));
         await this.getChapterInfo();
         this.isLoading = false;
      }
   });
}