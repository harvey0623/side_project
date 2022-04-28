Vue.component('barcode-swiper', {
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
         let vm = this;
         let options = {
            loop: this.isMultipleSlides,
            allowTouchMove: this.isMultipleSlides,
            on: {
               click() {
                  vm.$emit('enlarge', { index: this.realIndex });
               }
            }
         }
         if (this.isMultipleSlides) options.pagination = { el: this.$refs.pagination };
         this.swiper = new Swiper(this.$refs.container, options);
      },
      moveSlide(index) {
         this.swiper.slideTo(index, 0, false);
      }
   },
   mounted() {
      this.initSwiper();
   },
   template: `
      <div class="swiper-container normal-swiper-container" ref="container">
         <div class="swiper-wrapper">
            <barcode-slide v-for="(card,index) in cardList" :key="index" :card="card"></barcode-slide>
         </div>
         <div class="swiper-pagination" ref="pagination"></div>
      </div>`
}); 