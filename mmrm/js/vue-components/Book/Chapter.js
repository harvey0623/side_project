Vue.component('chapter', {
   props: {
      chapter: {
         type: Object,
         required: true
      },
      pageurl: {
         type: String,
         required: true
      }
   },
   template: `
      <li class="chapterList">
         <p class="chapterTitle">{{ chapter.title }}</p>
         <div class="pageBlock">
            <page
               v-for="(page,index) in chapter.pages"
               :key="page.page_id"
               :page="page"
               :pageurl="pageurl"
               :order="index"
               :startNumber="chapter.startNumber"
               :bookId="chapter.book_id"
            ></page>
         </div>
      </li>`
});