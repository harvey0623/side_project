Vue.component('image-slide', {
   props: {
      url: {
         type: String,
         required: true
      }
   },
   computed: {
      slideBg() {
         let imgUrl = this.url;
         if (!imgUrl) return {};
         else return { backgroundImage: `url(${this.url})` };
      }
   },
   template: `<div class="swiper-slide bg" :style="slideBg"></div>`
});