Vue.component('point-list', {
   props: {
      point: {
         type: Object,
         required: true
      }
   },
   computed: {
      dateTitle() {
         return this.point.dateText;
      },
      lists() {
         return this.point.data;
      }
   },
   methods: {
      call2Handler(id) {
         this.$emit('showdetail', id);
      }
   },
   template: `
      <li>
         <p class="title">{{ dateTitle }}</p>
         <div class="inner">
            <point-item
               v-for="item in lists"
               :key="item.transaction_id"
               :detail="item"
               @callHandler="call2Handler"
            ></point-item>
         </div>
      </li>`
});