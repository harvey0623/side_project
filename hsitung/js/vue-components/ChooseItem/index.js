Vue.component('choose-item', {
   props: {
      receiveId: {
         type: String,
         required: true
      },
      receiveTitle: {
         type: String,
         required: true
      },
      receiveStatus: {
         type: String,
         required: true
      },
      type: {
         type: String,
         required: true
      }
   },
   computed: {
      isActive() {
         return this.receiveStatus === '1';
      }
   },
   methods: {
      changeHandler(evt) {
         let isChecked = evt.currentTarget.checked;
         this.$emit('update-choose', {
            id: this.receiveId,
            status: isChecked ? '1' : '0',
            type: this.type
         });
      }
   },
   template: `
      <label class="chooesItem" :class="{active:isActive}">
         <input type="checkbox" @change="changeHandler" :checked="isActive" hidden>
         <span>{{ receiveTitle }}</span>
      </label>`
});