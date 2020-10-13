Vue.component('sticky-note', {
   props: {
      id: {
         type: Number,
         required: true
      },
      text: {
         type: String,
         required: true
      },
      color: {
         type: String,
         required:true
      },
      palettes: {
         type: Array,
         required: true
      }
   },
   data: () => ({
      isDown: false,
      currentPos: { x: 0, y: 0 },
      movePos: { x: 0, y: 0 },
   }),
   computed: {
      bgColor() {
         return { backgroundColor: this.color }
      },
      coordinate() {
         return {
            left: `${this.movePos.x}px`,
            top: `${this.movePos.y}px`
         }
      }
   },
   methods: {
      removeHandler() {
         this.$emit('delete', this.id);
      },
      setColorHandler(val) {
         this.$emit('updatecolor', {
            id: this.id,
            color: val
         });
      },
      mouseDown(evt) {
         this.isDown = true;
         this.currentPos = { x: evt.offsetX, y: evt.offsetY };
      },
      mousemove(evt) {
         evt.preventDefault();
         if (!this.isDown) return;
         let { pageX, pageY } = evt;
         this.movePos = {
            x: pageX - this.currentPos.x,
            y: pageY - this.currentPos.y
         }
      }
   }, 
   template: `
      <div 
         class="postit"
         :class="{active: isDown}"
         :style="[bgColor, coordinate]"
         @mousedown="mouseDown"
         @mousemove="mousemove"
         @mouseup="isDown = false"
         @mouseleave="isDown = false">
         <div class="text">{{ text }}</div>
         <div class="colorBar">
            <color-block
               v-for="palette in palettes"
               :key="palette.id"
               :color="palette.value"
               @setColor="setColorHandler"
            ></color-block> 
            <i class="fa fa-trash-o" @click="removeHandler"></i>
         </div>
      </div>`
});