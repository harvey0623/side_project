Vue.component('msg-box', {
   props: {
      msgType: {
         type: String,
         required: true
      },
      msgInfo: {
         type: Object,
         required: true
      }
   },
   computed: {
      dateText() {
         return this.msgInfo.datetime.split(' ')[0];
      },
      summary() {
         let { sub_title, summary } = this.msgInfo;
         return this.msgType !== 'member' ? sub_title : summary; 
      }
   },
   methods: {
      clickHandler() {
         this.$emit('popup', {
            title: '',
            links: this.msgInfo.link_block.links
         });
      }
   },
   template: `
      <div class="msgBox" @click="clickHandler">
         <div class="date">{{ dateText }}</div>
         <div class="title">{{ msgInfo.title }}</div>
         <div class="summary">{{ summary }}</div>
      </div>`
});