Vue.component('term-popup', {
   props: {
      id: {
         type: Number,
         required: true
      },
      showpopup: {
         type: Boolean,
         required: true
      },
      checked: {
         type: Boolean,
         required: true
      },
      title: {
         type: String,
         required: true
      },
      content: {
         type: String,
         required: true
      },
   },
   data() {
      return {
         // isReach: this.checked,
         isReach: true,
         agreeText: window.getSystemLang('memberregisterprivacy_b_agree')
      }
   },
   methods: {
      closeHandler() {
         this.$emit('update:showpopup', false);
      },
      agreeHandler() {
         if (!this.isReach) return;
         this.$emit('changechecked', {
            id: this.id,
         });
      },
      getDistance() {
         let $termBody = $(this.$refs.termBody);
         let paddingT = parseInt($termBody.css('paddingTop'));
			let paddingB = parseInt($termBody.css('paddingBottom'));
         let totalPadding = paddingT + paddingB;
         let termBodyH = this.$refs.termBody.clientHeight - totalPadding;
			let termContentH = this.$refs.termContent.scrollHeight;
         return termContentH - termBodyH;
      },
      scrollHandler(evt) {
         let diff = this.getDistance();
         let scrollY = evt.target.scrollTop;
         if (scrollY >= diff) this.isReach = true;
      }
   },
   mounted() {
      this.$refs.termBody.addEventListener('scroll', this.scrollHandler);
   },
   watch: {
      showpopup() {
         if (this.isReach) return;
         let diff = this.getDistance();
         this.isReach = diff <= 0 ? true : false;
      }
   },
   template: `
      <div class="termPopup" :class="{ show: showpopup }">
         <div class="popupHeader">
            <div class="popupClose" @click="closeHandler"></div>
            <span>{{ title }}</span>
         </div>
         <div class="termBody" ref="termBody">
            <div class="termContent" ref="termContent" v-html="content"></div>
         </div>
         <div
            class="termFooter" 
            :class="{termActiveButton: isReach}"
            @click="agreeHandler"
            >{{ agreeText }}
         </div>
      </div>`
});