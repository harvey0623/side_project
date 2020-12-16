Vue.component('link-block', {
   props: {
      menutitle: {
         type: String,
         required: true
      },
      links: {
         type: Array,
         required: true
      },
      bookpage: {
         type: String,
         required: true
      }
   },
   template: `
      <li class="linkBlock">
         <p class="linkTitle">{{ menutitle }}</p>
         <div class="linkOuter">
            <link-item
               v-for="(item,index) in links"
               :key="index"
               :detail="item"
               :bookpage="bookpage"
               @popup="$emit('popup', $event)"
            ></link-item>
         </div>
      </li>`
});