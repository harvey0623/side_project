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
               :order="index"
               :startNumber="chapter.startNumber"
               :bookId="chapter.book_id"
               :pageurl="pageurl"
            ></page>
         </div>
      </li>`
});