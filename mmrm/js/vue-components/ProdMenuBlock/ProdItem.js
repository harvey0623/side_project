Vue.component('prod-item', {
   props: {
      prod: {
         type: Object,
         required: true
      },
      pageurl: {
			type: String,
			required: true
		}
   },
   computed: {
      pageLink() {
         return `${this.pageurl}?menu_item_id=${this.prod.menu_item_id}`;
      },
      prodBg() {
         let imgUrl = this.prod.feature_image.url;
         if (!imgUrl) return {};
         else return { backgroundImage: `url(${imgUrl})` };
      },
      hasSummary() {
         return this.prod.summary !== null && this.prod.summary !== '';
      }
   },
   template: `
      <a :href="pageLink" class="prodItem">
         <div class="itemBg" :style="prodBg"></div>
         <div class="descBox">
            <div class="summary">{{ prod.summary || '' }}</div>
            <div class="title" :class="{mb:hasSummary}">{{ prod.title }}</div>
            <div class="price">{{ prod.price }} 起</div>
         </div>
      </a>`
});