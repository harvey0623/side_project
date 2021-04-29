Vue.component('branch-item', {
   props: {
      title: {
         type: String,
         required: true
      },
      address: {
         type: String,
         required: true
      },
      code: {
         type: String,
         required: true
      },
      distance: {
         required: true
      },
      isChecked: {
         type: Boolean,
         required: true
      }
   },
   computed: {
      storeDistance() {
         if (this.distance === '--') return this.distance;
         else return this.distance.toFixed(1);
      }
   },
   methods: {
      changeHandler(evt) {
         this.$emit('change-branch-input', {
            code: this.code,
            isChecked: evt.currentTarget.checked
         });
      }
   },
   template: `
      <label class="branch-item">
         <div class="left">
            <p class="name">
               <span>{{ title }}</span> 
               <span class="distance">{{ storeDistance }}km</span>
            </p>
            <p class="address">{{ address }}</p>
         </div>
         <div class="right">
            <input type="checkbox" :checked="isChecked" @change="changeHandler">
         </div>
      </label>`
});