Vue.component('link-item', {
   props: {
      detail: {
         type: Object,
         required: true
      },
      bookpage: {
         type: String,
         required: true
      }
   },
   computed: {
      linkBg() {
         let imgUrl = this.detail.feature_image.url;
         if (!imgUrl) return {};
         else return { backgroundImage: `url(${imgUrl})` };
      },
   },
   methods: {
      clickHandler() {
         this.$emit('popup', {
            title: '',
            links: [this.detail]
         });
      }
   },
   template: `
      <div class="linkItem" @click="clickHandler">
         <div class="linkBg" :style="linkBg"></div>
         <div class="linkDesc">
            <div class="title">{{ detail.title }}</div>
            <div class="content">{{ detail.sub_title }}</div>
            <div class="arrowBg"></div>
         </div>
      </div>`
})