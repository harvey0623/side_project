export default function ({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         bookId: '',
         chapterData: [],
         isLoading: false,
         turnOn: false,
         showContainer: true,
         apiUrl,
         pageUrl
      }),
      computed: {
         chapterList() { //章節律表
            return this.chapterData.reduce((prev, current, index, arr) => {
               prev.push({
                  ...current,
                  book_id: this.bookId,
                  startNumber: this.getStartNumber(index, arr),
               })
               return prev;
            }, []);
         }
      },
      methods: {
         getStartNumber(index, arr) { //計算起始頁碼
            if (index === 0) return 0;
            let beforeData = arr.slice(0, index);
            return beforeData.reduce((prev, current) => {
               prev += current.pages.length;
               return prev;
            }, 0);
         },
         getQuery(key) { //取得網址參數
            let params = (new URL(document.location)).searchParams;
            let paramsValue = params.get(key);
            return paramsValue;
         },
         openSidebar() {
            this.turnOn = true;
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
         async checkOneChapter() { //檢查是否指有一個章節和一個頁面
            let bookInfo = await this.getBookData().then(res => res);
            let chapterNumber = bookInfo.chapters.length;
            if (chapterNumber === 1) {
               if (bookInfo.chapters[0].pages.length === 1) {
                  let pageId = bookInfo.chapters[0].pages[0].page_id;
                  let url = `${this.pageUrl.bookPage}?book_id=${this.bookId}&page_id=${pageId}`;
                  this.showContainer = false;
                  location.href = url;
               } else if (bookInfo.chapters[0].pages.length > 1) {
                  this.chapterData = bookInfo.chapters;
               }
            } else if (chapterNumber > 1) {
               this.chapterData = bookInfo.chapters;
            }
         }
      },
      async mounted() {
         this.isLoading = true;
         this.bookId = parseInt(this.getQuery('book_id'));
         await this.checkOneChapter();
         this.isLoading = false;
      }
   });
}