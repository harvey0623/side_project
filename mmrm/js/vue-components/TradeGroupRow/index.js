Vue.component('trade-group-row', {
   props: {
      group_type: {
         type: String,
         required: true
      },
      column_value_1: {
         type: String,
         required: true
      },
      column_value_2: {
         type: String,
         required: true
      },
      taxid: {
         type: String,
         default: ''
      },
      column_name_1: {
         type: String,
         default: ''
      },
      column_name_2: {
         type: String,
         default: ''
      },
      column_name_3: {
         type: String,
         default: ''
      },
   },
   data: () => ({
      mappingColumn: {
         sale_invno: '發票號碼',
         sale_invamt: '發票金額',
         sale_taxid: '統一編號',
         payd_type_name: '付款方式',
         sale_payamt: '付款金額'
      }
   }),
   computed: {
      isShow() {
         return this.group_type === 'invoice' && this.taxid !== '';
      }
   },
   template: `
      <div class="group-row">
         <div class="group-content">
            <p class="title">{{ mappingColumn[column_name_1] }}</p>
            <span class="colon">:</span>
            <p class="content">{{ column_value_1 }}</p>
         </div>
         <div class="group-content">
            <p class="title">{{ mappingColumn[column_name_2] }}</p>
            <span class="colon">:</span>
            <p class="content">{{ parseInt(column_value_2) | currency }}</p>
         </div>
         <div class="group-content" v-if="isShow">
            <p class="title">{{ mappingColumn[column_name_3] }}</p>
            <span class="colon">:</span>
            <p class="content">{{ taxid }}</p>
         </div>
      </div>`
});