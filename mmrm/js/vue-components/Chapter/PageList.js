Vue.component('page-list', {
   props: {
      detail: {
         type: Object,
         required: true
      },
      pageurl: {
         type: String,
         required: true
      }
   },
   computed: {
      pageTitle() {
         return this.detail.title;
      },
      link() {
         let pageId = this.detail.page_id;
         return `${this.pageurl}?page_id=${pageId}`;
      }
   },
   template: `
      <a :href="link" class="pageList">
         <div class="title">{{ pageTitle }}</div>
            <div class="arrowBox"></div>
         </div>
      </a>`
});