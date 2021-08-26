Vue.component('criteria-item', {
   props: {
      images: {
         type: Object,
         required: true
      },
      is_click: {
         type: Boolean,
         required: true
      },
      tag_id: {
         type: Number,
         required: true
      },
      title: {
         type: String,
         required: true
      }
   },
   methods: {
      selectedHandler() {
         this.$emit('update:is_click', !this.is_click);
      }
   },
   template: `
      <div class="criteria-item" @click="selectedHandler">
         <img :src="images.normal" :class="{show:!is_click}">
         <img :src="images.selected" :class="{show:is_click}">
         <p class="text">{{ title }}</p>
      </div>`
});