Vue.component('trade-item', {
   props: {
      itemInfo: {
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
   data: () => ({
      isLoading: false,
      isOpen: false,
      detailData: null,
      tradeTitle: window.getSystemLang('txnrecord_entriestitle'),
      tradeTotal: window.getSystemLang('txnrecord_total'),
      dollarUnit: vsprintf(window.getSystemLang('txn_negativeamount'), ['']),
      recordUnit: vsprintf(window.getSystemLang('txnrecord_amount'), ['']),
   }),
   computed: {
      brandLogo() {
         return this.itemInfo.brandLogo;
      },
      brandTitle() {
         return this.itemInfo.brandTitle;
      },
      metaList() {
         return this.itemInfo.meta;
      },
      amountText() {
         let amount = this.itemInfo.amount;
         if (amount.includes('-')) return amount;
         else return '+' + amount; 
      },
      detailList() {
         if (this.detailData === null) return [];
         return this.detailData.transaction_entries;
      },
      subtotal() {
         if (this.detailData === null) return 0;
         return this.detailData.amount;
      }
   },
   methods: {
      async getDetail() {
         this.isLoading = true;
         return await axios({
            url: this.api,
            method: 'post',
            data: {
               transaction_id: this.itemInfo.transaction_id
            }
         }).then(res => {
            return res.data.results.transaction_detail;
         }).catch(err => {
            return null;
         }).finally(() => {
            this.isLoading = false;
         });
      },
      async openHandler() {
         if (this.isLoading) return;
         if (this.detailData === null) {
            this.detailData = await this.getDetail().then(res => res);
         }
         this.isOpen = !this.isOpen;
         await this.$nextTick();
         if (this.isOpen) { //將點到的資料置頂
            let offsetTop = this.$refs.typeBox.offsetTop;
            window.scrollTo(0, offsetTop - 20);
         } else {
            window.removeEventListener('scroll', this.scrollhandler);
            setTimeout(() => {
               window.addEventListener('scroll', this.scrollhandler); 
            }, 50);
         }
      }
   },
   template: `
      <div class="tradeItem">   
         <div class="typeBox" ref="typeBox" @click="openHandler">
            <div class="content">
               <div class="storeInfo">
                  <div class="logoBox">
                     <img :src="brandLogo" alt="">
                     <span>{{ brandTitle }}</span>
                  </div>
                  <div class="payment">{{ amountText }}{{ dollarUnit }}</div>
               </div>
               <ul class="invoiceInfo" :class="{hasMargin: isLoading}">
                  <li 
                     class="invoiceRow"
                     v-for="meta in metaList"
                     :key="meta.value">
                     <div class="name">{{ meta.key }}</div>
                     <div class="colon">:</div>
                     <div class="value">{{ meta.value }}</div>
                  </li>
               </ul>
               <div class="getDetail" v-show="isLoading">載入交易詳情中...</div>
            </div>
         </div>
         <div class="infoBox" v-show="isOpen">
            <p class="title">{{ tradeTitle }}</p>
            <div class="content">
               <ul class="itemList">
                  <li 
                     v-for="(item, index) in detailList"
                     :key="index">
                     <p class="itemName">{{ item.title }}</p>
                     <div class="itemInfo">
                        <div>{{ item.price }} x {{ item.quantity }}</div>
                        <div>{{ item.total }}{{ recordUnit }}</div>
                     </div>
                  </li>
               </ul>
               <ul class="summaryList">
                  <li style="display:none">
                     <div>小計 :</div>
                     <div>0 元</div>
                  </li>
                  <li style="display:none">
                     <div>折扣：</div>
                     <div>0 元</div>
                  </li>
                  <li class="total">
                     <div>合計:</div>
                     <div>{{ subtotal }} {{ tradeTotal }}</div>
                  </li>
               </ul>
            </div>
         </div>
      </div>`
});