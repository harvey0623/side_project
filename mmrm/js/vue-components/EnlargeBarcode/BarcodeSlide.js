Vue.component('enlarge-barcode-slide', {
   props: {
      card: { type: Object, required: true }
   },
   template: `
      <div class="swiper-slide">
         <div class="group rotate">
            <enlarge-barcode-item v-for="item in card.data" :key="item.value" :detail="item"></enlarge-barcode-item>
         </div>
      </div>`
})