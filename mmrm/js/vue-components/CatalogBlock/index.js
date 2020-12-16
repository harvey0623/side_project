Vue.component('catalog-block', {
   props: {
      chapter: {
         type: Object,
         required: true
      },
      pageurl: {
         type: String,
         required: true
      },
      currentPage: {
         type: Number,
         required: true
      }
   },
   template: `
      <div class="catalogBlock">
         <div class="catalogTitle">{{ chapter.title }}</div>
         <div class="catalogOuter">
            <catalog-item
               v-for="(page,index) in chapter.pages"
               :key="page.page_id"
               :page="page"
               :bookId="chapter.book_id"
               :pageId="page.page_id"
               :satrtNumber="chapter.startNumber"
               :order="index"
               :pageurl="pageurl"
               :currentPage="currentPage"
            ></catalog-item>
         </div>
      </div>`
});