Vue.component('color-block', {
   props: {
      color: {
         type: String,
         required: true
      }
   },
   computed: {
      bgColor() {
         return {
            backgroundColor: this.color
         }
      }
   },
   methods: {
      clickHandler() {
         this.$emit('setColor', this.color);
      }
   },
   template: `
      <div
         class="colorBlock" 
         :style="bgColor"
         @click="clickHandler">
      </div>`
});