export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         book: null,
         isLoading: false,
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
         getFaq() {
            return mmrmAxios({
               url: apiUrl.faqList,
               method: 'post',
               data: { type: 'faq' }
            }).then(res => {
               return res.data.results.search_cms_list_item_results;
            }).catch(err => [])
         },
         getBook(book_id) {
            return mmrmAxios({
               url: apiUrl.faqBook,
               method: 'post',
               data: { book_id }
            }).then(res => {
               return res.data.results.book;
            }).catch(err => null)
         }
      },
      async mounted() {
         this.isLoading = true;
         let faqResult = await this.getFaq();
         if (faqResult.length === 0) return this.isLoading = false; 
         let linkObj = faqResult[0].link_block.links[0];
         if (linkObj.type !== 'book') {
            this.isLoading = false;
            location.href = linkObj.hyperlink_url;
            return;
         }
         this.book = await this.getBook(linkObj.book_id);
         if (this.isRedirect) {
            let pageId = this.book.chapters[0].pages[0].page_id;
            return location.href = `${pageUrl.content}?page_id=${pageId}`;
         }
         this.isLoading = false;
      }
   });
}