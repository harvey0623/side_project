Vue.component('point-item', {
   props: {
      detail: {
         type: Object,
         required: true
      }
   },
   data: () => ({
      transactionNumber: window.getSystemLang('point_txnid'),
      pointTrading: window.getSystemLang('point_txndatetime')
   }),
   computed: {
      amountText() {
         let amount = this.detail.amount;
         if (amount.includes('-')) return amount;
         else return '+' + amount;
      }
   },
   methods: {
      clickHandler() {
         this.$emit('callHandler', this.detail.transaction_id);
      }
   },
   template: `
      <div class="pointContent" @click="clickHandler">
         <div class="summaryBox">
            <div class="typeText">{{ detail.transaction_type }}</div>
            <div class="payment">{{ amountText }} 元</div>
         </div>
         <ul class="invoiceInfo">
            <li class="invoiceRow">
               <div class="name">{{ transactionNumber }}</div>
               <div class="colon">:</div>
               <div class="value">{{ detail.transaction_id }}</div>
            </li>
            <li class="invoiceRow">
               <div class="name">{{ pointTrading }}</div>
               <div class="colon">:</div>
               <div class="value">{{ detail.datetime }}</div>
            </li>
         </ul>
      </div>`
});