Vue.component('drag-list', {
   props: {
      title: {
         type: String,
         required: true
      },
      content: {
         type: String,
         required: true
      },
      orderindex: {
         type: Number,
         required: true
      },
      dragindex: {
         type: Number,
         required: true
      }
   },
   data: () => ({
      isDrag: false
   }),
   computed: {
      dragClass() {
         return {
            dragging: this.isDrag && this.dragindex === this.orderindex
         }
      }
   },
   methods: {
      dragstart() {
         this.isDrag = true;
         this.$emit('update:dragindex', this.orderindex);
         this.$emit('record');
      },
      dragenter(evt) {
         this.cancelDefault(evt);
         this.$emit('enter', this.orderindex);
      },
      dragover(evt) {
         this.cancelDefault(evt);
      },
      drop(evt) {
         this.cancelDefault(evt);
         this.isDrag = false;
         this.$emit('updatelist');
      },
      cancelDefault(evt) {
         evt.preventDefault();
      }
   },
   template: `
      <li
         draggable="true"
         :class="dragClass"
         @dragstart="dragstart"
         @dragover="dragover"
         @dragenter="dragenter"
         @drop="drop">
         <h3>{{ title }}</h3>
         <p>{{ content }}</p>
      </li>`
});