Vue.component('level-box', {
   props: {
      info: {
         type: Object,
         required: true
      }
   },
   computed: {
      levelId() {
         return this.info.source.level_id;
      },
      levelTitle() {
         return this.info.title;
      },
      levelList() {
         return this.info.source.progress;
      }
   },
   template: `
      <div class="levelBox">
         <div class="levelTitle">{{ levelTitle }}</div>
         <div class="levelBody">
            <progress-box
               v-for="(item,index) in levelList"
               :key="levelId + '-' + index"
               :amount="item.amount"
               :requirement="item.requirement"
               :type="item.type"
            ></progress-box>
         </div>
      </div>`
});