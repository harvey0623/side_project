Vue.component('term-popup', {
   props: {
      isOpen: {
         type: Boolean,
         required: true
      },
      content: {
         type: String,
         default: ''
      },
   },
   methods: {
      closeHandler() {
         this.$emit('update:isOpen', false);
      },
   },
   template: `
      <div class="termPopup" :class="{ show: isOpen }">
         <div class="popupHeader">
            <div class="popupClose" @click="closeHandler"></div>
            <span>會員登入說明</span>
         </div>
         <div class="termBody">
            <div class="termContent" v-html="content"></div>
         </div>
      </div>`
});