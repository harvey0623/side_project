Vue.component('enlarge-barcode-item', {
   props: {
      detail: { type: Object, required: true }
   },
   mounted() {
      let id = `#${this.detail.id}`;
      let value = this.detail.value;
      JsBarcode(id, value, {
         lineColor: "#000",
         width: 1.5,
         height: 50,
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