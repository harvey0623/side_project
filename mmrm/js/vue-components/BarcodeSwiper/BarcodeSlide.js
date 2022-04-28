Vue.component('barcode-slide', {
   props: {
      card: { type: Object, required: true }
   },
   template: `
      <div class="swiper-slide">
         <div class="group">
            <barcode-item v-for="item in card.data" :key="item.value" :detail="item"></barcode-item>
         </div>
      </div>`
})