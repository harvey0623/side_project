Vue.component('catalog-item', {
   props: {
      page: {
         type: Object,
         required: true
      },
      bookId: {
         type: Number,
         required: true
      },
      pageId: {
         type: Number,
         required: true
      },
      satrtNumber: {
         type: Number,
         required: true
      },
      order: {
         type: Number,
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
   computed: {
      href() {
         return `${this.pageurl}?book_id=${this.bookId}&page_id=${this.pageId}&currentPage=${this.currentPage}&isSwitch=true`;
      },
      pageNumber() {
         return this.order + 1 + this.satrtNumber;
      },
      catalogBg() {
         let imgUrl = this.page.feature_image.url;
         if (!imgUrl) return {};
         else return { backgroundImage: `url(${imgUrl})` };
      }
   },
   template: `
      <a :href="href" class="catalogItem">
         <div class="catalogBg" :style="catalogBg"></div>
         <p class="pageNumber">{{ pageNumber }}</p>
      </a>`
});
