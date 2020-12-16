Vue.component('chapter', {
   props: {
      title: {
         type: String,
         required: true
      },
      pages: {
         type: Array,
         required: true
      },
      pageurl: {
         type: String,
         required: true
      }
   },
   template: `
      <div class="chapter">
         <div class="chapterTitle">{{ title }}</div>
         <div class="pageBox">
            <page-list
               v-for="page in pages"
               :key="page.page_id"
               :detail="page"
               :pageurl="pageurl"
            ></page-list>
         </div>
      </div>`
});