Vue.component('menu-brand-item', {
   props: {
      brand_id: {
         type: Number,
         required: true
      },
      title: {
         type: String,
         required: true
      },
      brand_img: {
         required: true
      }
   },
   computed: {
      brandBg() {
         if (!this.brand_img) return {};
         else return { backgroundImage: `url(${this.brand_img})` };
      }
   },
   methods: {
      clickHandler() {
         this.$emit('brand_event', { brandIds: [this.brand_id] });
      }
   },
   template: `
      <div class="menu-brand-item" @click="clickHandler">
         <div class="logo" :style="brandBg"></div>
         <p class="name">{{ title }}</p>
      </div>`
});