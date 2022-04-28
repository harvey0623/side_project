Vue.component('barcode-item', {
   props: {
      detail: { type: Object, required: true }
   },
   mounted() {
      let id = `#${this.detail.id}`;
      let value = this.detail.value;
      JsBarcode(id, value, {
         lineColor: "#000",
         width: 1,
         height: 45,
         background: 'transparent',
         fontSize: 14,
         textMargin: 8
      })
   },
   template: `
      <div class="barcode-item">
         <p>{{ detail.key }}</p>
         <svg :id="detail.id"></svg>
      </div>` 
})