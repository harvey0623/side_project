Vue.component('einvoice-modal', {
   props: {
      barcode: { type: String, default: '' },
      unbinedPage: { type: String, default: '' },
      backSite: { type: String, default: '' },
      myCouponId: { type: Number, default: 0 }
   },
   data: () => ({
      isFirst: true
   }),
   computed: {
      hasBarcode() {
         return this.barcode !== '';
      },
      pageLink() {
         if (this.unbinedPage === '' || this.backSite === '') return 'javascript:;';
         let params = `?backSite=${this.backSite}`;
         if (this.backSite === 'couponCard') params = `${params}&my_coupon_id=${this.myCouponId}`;
         return `${this.unbinedPage}${params}`;
      }
   },
   methods: {
      open() {
         $('#einvoiceModal').modal('show');
      },
      close() {
         $('#einvoiceModal').modal('hide');
      },
      createBarcode() {
         JsBarcode('#einvoice', this.barcode, {
            width: 1.5,
            height: 50,
            fontSize: 16,
            textMargin: 5
         });
      },
   },
   mounted() {
      if (this.barcode !== '') {
         this.isFirst = false;
         this.createBarcode();
      }
   },
   watch: {
      barcode() {
         if (!this.isFirst) return;
         this.isFirst = false;
         this.createBarcode();
      }
   },
   template: `
      <div class="modal einvoiceModal" id="einvoiceModal" data-backdrop="static">
         <div class="closeBg" data-dismiss="modal"></div>
         <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
               <div class="modal-header">手機條碼載具</div>
               <div class="modal-body">
                  <div class="barcode-block" v-show="hasBarcode">
                     <svg id="einvoice"></svg>
                     <p class="remove" @click="$emit('check-remove')">刪除條碼載具</p>
                  </div>
                  <div class="add-block" v-show="!hasBarcode">
                     <a :href="pageLink"></a>
                     <p>您尚未設定手機條碼載具喔!</p>
                     <p>請點擊上方加號進行設定。</p>
                  </div>
               </div>
            </div>
         </div>
      </div>`
})