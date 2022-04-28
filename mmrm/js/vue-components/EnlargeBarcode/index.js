Vue.component('enlarge-barcode', {
   props: {
      cardList: { type: Array, required: true }
   },
   data: () => ({
      swiper: null
   }),
   computed: {
      isMultipleSlides() {
         return this.cardList.length > 1;
      }
   },
   methods: {
      initSwiper() {
         let options = {
            loop: this.isMultipleSlides,
            allowTouchMove: this.isMultipleSlides,
         }
         if (this.isMultipleSlides) options.pagination = { el: this.$refs.pagination };
         this.swiper = new Swiper(this.$refs.container, options);
      },
      moveSlide(index) {
         this.swiper.slideTo(index, 0, false);
      },
      getSwiperRealIndex() {
         return this.swiper.realIndex;
      }
   },
   mounted() {
      this.initSwiper();
   },
   template: `
      <div class="swiper-container enlarge-swiper-container" ref="container">
         <div class="swiper-wrapper">
            <enlarge-barcode-slide v-for="(card,index) in cardList" :key="index" :card="card"></enlarge-barcode-slide>
         </div>
         <div class="swiper-pagination" ref="pagination"></div>
      </div>`
}); 