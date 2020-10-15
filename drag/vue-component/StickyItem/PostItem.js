Vue.component('post-item', {
   props: {
      id: {
         type: Number,
         required: true
      },
      text: {
         type: String,
         required: true
      },
      order: {
         type: Number,
         required: true
      }
   },
   computed: {
      fullText() {
         return `${this.order + 1}.${this.text}`;
      },
      noteMessage: {
         get() {
            return this.text;
         },
         set(val) {
            this.$emit('update:text', val);
         }
      }
   },
   methods: {
      removeHandler() {
         this.$emit('delete', this.id);
      }
   },
   template: `
      <div class="post">
         <p>{{ fullText }}</p>
         <input type="text" class="ptext" v-model="noteMessage">
         <i class="fa fa-trash-o" @click="removeHandler"></i>
      </div>`
});