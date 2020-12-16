Vue.component('trade-list', {
   props: {
      trade: {
         type: Object,
         required: true
      },
      api: {
         type: String,
         required: true
      },
      scrollhandler: {
         type: Function,
         required: true
      }
   },
   computed: {
      dateTitle() {
         return this.trade.dateText;
      },
      lists() {
         return this.trade.data;
      }
   },
   template: `
      <li>
         <p class="title">{{ dateTitle }}</p>
         <div class="tradeItemBox">
            <trade-item
               v-for="item in lists"
               :key="item.transaction_id"
               :itemInfo="item"
               :api="api"
               :scrollhandler="scrollhandler"
            ></trade-item>
         </div>
      </li>`
});