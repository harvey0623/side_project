Vue.component('page', {
   props: {
      page: {
         type: Object,
         required: true
      },
      order: {
         type: Number,
         required: true
      },
      startNumber: {
         type: Number,
         required: true
      },
      bookId: {
         type: Number,
         required: true
      },
      pageurl: {
         type: String,
         required: true
      },
   },
   computed: {
      pageLink() {
         if (!this.page.page_has_detail) return 'javascript:;';
         else return `${this.pageurl}?book_id=${this.bookId}&page_id=${this.page.page_id}`;
      },
      pageBg() {
         let imgUrl = this.page.feature_image.url;
         if (!imgUrl) return {};
         else return { backgroundImage: `url(${imgUrl})` };
      },
      pageNumber() {
         return `P.${this.order + 1 + this.startNumber}`;
      }
   },
   template: `
      <a :href="pageLink" class="pageList">
         <div class="pageBg" :style="pageBg"></div>
         <div class="pageDesc">
            <p class="pageTitle">{{ page.title }}</p>
            <p class="pageNumber">{{ pageNumber }}</p>
         </div>
      </a>`
});