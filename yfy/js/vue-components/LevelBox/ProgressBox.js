Vue.component('progress-box', {
   props: {
      amount: {
         type: String,
         required: true
      },
      requirement: {
         type: String,
         required: true
      },
      type: {
         type: String,
         required: true
      }
   },
   computed: {
      isAmount() {
         return this.type === 'amount';
      },
      progressTitle() {
         let mappingText = {
            amount: window.getSystemLang('levelinformation_amount'),
            frequency: window.getSystemLang('levelinformation_frequency'),
            single: '單筆消費滿額'
         };
         return mappingText[this.type];
      },
      currentAmount() {
         return this.amount;
      },
      requiredAmount() {
         return this.requirement;
      },
      fullText() {
         let mappingKey = {
            amount: 'levelinformation_amountformat',
            frequency: 'levelinformation_frequencyformat',
            single: 'levelinformation_amountformat'
         };
         let key = mappingKey[this.type];
         let template = window.getSystemLang(key);
         return vsprintf(template, [this.currentAmount, this.requiredAmount]);
      },
      percent() {
         let current = this.cammaToNumber(this.amount);
         let total = this.cammaToNumber(this.requirement);
         let percent =  Math.floor((current / total) * 100);
         percent = percent > 100 ? 100 : percent;
         return percent;
      },
      isReach() { //是否達標
         return this.percent >= 100;
      }
   },
   methods: {
      cammaToNumber(text) {
         let result = text.replace(/,/g, '');
         result = result !== '' ? result : '0';
         return parseInt(result);
      }
   },
   mounted() {
      let el = this.$refs.run;
      $(el).animate({ width: this.percent + '%' }, 200);
   },
   template: `
      <div class="progressBox">
         <div class="progressTop">
            <div class="title">{{ progressTitle }}</div>
            <div class="info">
               <span>{{ fullText }}</span>  
            </div>
         </div>
         <div class="progressBar">
            <div class="run" :class="{ complete: isReach }" ref="run"></div>
         </div>
      </div>`
});