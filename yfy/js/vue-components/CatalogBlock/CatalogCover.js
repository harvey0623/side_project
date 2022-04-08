Vue.component('catalog-cover', {
   props: {
      coverBg: {
         type: Object,
         required: true
      },
      currentPage: {
         type: Number,
         required: true
      }
   },
   data: () => ({
      startPos: 0
   }),
   methods: {
      touchstartHandler(evt) {
         this.startPos = evt.touches[0].pageX;
      },
      touchendHandler(evt) {
         let endPos = evt.changedTouches[0].pageX;
         let diff = endPos - this.startPos;
         if (diff >= 100) this.$emit('dir', -1);
         if (diff <= -100) this.$emit('dir', 1);
      }
   },
   template: `
      <div
         class="pageCoverBox"
         :style="coverBg"
         @touchstart="touchstartHandler"
         @touchend="touchendHandler">
      </div>`
});