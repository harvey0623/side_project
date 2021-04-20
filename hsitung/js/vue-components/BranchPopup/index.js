Vue.component('branch-popup', {
   props: {
      isOpen: {
         type: Boolean,
         required: true
      },
      hasBranch: {
         type: Boolean,
         required: true
      },
      city: {
         type: String,
         required: true
      },
      area: {
         type: String,
         required: true
      }
   },
   computed: {
      isEmptyAddress() {
         if (this.city === '' || this.area === '') return true;
      }
   },
   methods: {
      closePopup() {
         this.$emit('close-popup');
      },
      removeStore() {
         this.$emit('remove-branch');
      },
      chooseStore() {
         this.$emit('choose-store');
      },
      openAddress() {
         this.$emit('open-address');
      }
   },
   template: `
      <div class="branchPopup" :class="{active:isOpen}">
         <div class="popupHeader">
            <div class="popupClose" @click="closePopup"></div>
            <span>推薦門市</span>
         </div>
         <div class="siteTrigger">
            <div @click="openAddress">
               <span v-if="isEmptyAddress">縣市區域</span>
               <span v-else>{{ city }} / {{ area }}</span>
               <span class="downIcon"></span>
            </div>
         </div>
         <div class="popupBody" :class="{none:!hasBranch}">
            <slot name="default"></slot>
         </div>
         <div class="popupFooter" v-show="hasBranch">
            <div @click="removeStore">刪除選店</div>
            <div @click="chooseStore">選擇此店</div>
         </div>
      </div>`
});