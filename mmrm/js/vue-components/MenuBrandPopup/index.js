Vue.component('menu-brand-popup', {
   props: {
      is_open: {
         type: Boolean,
         required: true
      }
   },
   methods: {
      closeHandler() {
         this.$emit('update:is_open', false);
      }
   },
   template: `
      <div class="menu-brand-popup" v-show="is_open">
         <div class="popupHeader">
            <span>選擇品牌</span>
            <div class="popupClose" @click="closeHandler"></div>
         </div>
         <div class="popup-body">
            <slot></slot>
         </div>
      </div>`
});