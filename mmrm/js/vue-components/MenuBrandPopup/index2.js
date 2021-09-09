Vue.component('menu-brand-popup', { //想吃什麼專用
   props: {
      is_open: {
         type: Boolean,
         required: true
      },
      category_list: {
         type: Array,
         required: true
      },
      current_category: {
         type: String,
         required: true
      }
   },
   methods: {
      closeHandler() {
         document.body.style.overflow = '';
         this.$emit('update:is_open', false);
      },
      clickTab(id) {
         this.$emit('update:current_category', id);
      }
   },
   template: `
      <div class="menu-brand-popup" v-show="is_open">
         <div class="popupHeader">
            <span>查找品牌</span>
            <div class="popupClose" @click="closeHandler"></div>
         </div>
         <ul class="tabList">
            <li v-for="list in category_list" :key="list.id" @click="clickTab(list.id)">
               <span class="line" :class="{variationMain:current_category === list.id}"></span>  
               <P>{{ list.title }}</p>
            </li>
         </ul>
         <div class="popup-body">
            <slot></slot>
         </div>
      </div>`
});