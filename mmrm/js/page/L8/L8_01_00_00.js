export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         book: null,
         isLoading: false,
         apiUrl,
         pageUrl
      }),
      computed: {
         chapterList() { //章節列表
            if (this.book === null) return [];
            else return this.book.chapters;
         },
         isRedirect() { //是否轉址
            if (this.book === null) return false;
            let totalChapter = this.book.chapters.length;
            let totalPage = totalChapter !== 0 ? this.book.chapters[0].pages.length : 0;
            return totalChapter === 1 && totalPage === 1;
         }
      },
      methods: {
         async getFaq() {
            return await axios({
               url: this.apiUrl.faqList,
               method: 'post',
               data: { type: 'faq' }
            }).then(res => {
               return res.data.results.search_cms_list_item_results;
            }).catch(err => [])
         },
         async getBook(book_id) {
            return await axios({
               url: this.apiUrl.faqBook,
               method: 'post',
               data: { book_id }
            }).then(res => {
               return res.data.results.book;
            }).catch(err => null)
         },
         checkIsHttps(url) { //檢查是否為https
            let rule = /https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/;
            return rule.test(url);
         }
      },
      async mounted() {
         this.isLoading = true;
         let faqResult = await this.getFaq().then(res => res);
         if (faqResult.length === 0) return this.isLoading = false; 
         let linkObj = faqResult[0].link_block.links[0];
         if (linkObj.type !== 'book') {
            this.isLoading = false;
            location.href = linkObj.hyperlink_url;
            return;
         }
         this.book = await this.getBook(linkObj.book_id).then(res => res);
         if (this.isRedirect) {
            let pageId = this.book.chapters[0].pages[0].page_id;
            this.isLoading = false;
            location.href = `${this.pageUrl.content}?page_id=${pageId}`;
            return;
         }
         this.isLoading = false;
      }
   });
}