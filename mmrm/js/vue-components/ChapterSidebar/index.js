Vue.component('chapter-sidebar', {
   props: {
      turnon: {
         type: Boolean,
         required: true
      },
      chapterlist: {
         type: Array,
         required: true
      },
      pageurl: {
         type: String,
         required: true
      },
      currentPage: {
         type: Number,
         default: 0
      },
      isSwitch: {
         type: Boolean,
         default: false
      }
   },
   computed: {
      introList() {
         return this.chapterlist.reduce((prev, current) => {
            let { pages, startNumber } = current;
            prev.push({
               chapterTitle: current.title,
               book_id: current.book_id,
               page_id: current.pages[0].page_id,
               pageNumberText: this.getNumberText({ totalPage: pages.length, startNumber }),
            });
            return prev;
         }, []);
      }
   },
   methods: {
      getNumberText({ totalPage, startNumber }) { //取得頁碼字串
         if (totalPage === 1) {
            return `P.${startNumber + totalPage}`;
         } else if (totalPage > 1) {
            let beginNumber = startNumber + 1;
            let endNumber = startNumber + totalPage;
            return `P.${beginNumber}~${endNumber}`;
         }
      },
      closeSidebar() {
         this.$emit('update:turnon', false);
      },
      openPage({ book_id, page_id }) { //開啟章節頁面
         let url = `${this.pageurl}?book_id=${book_id}&page_id=${page_id}`;
         url = `${url}&currentPage=${this.currentPage}&isSwitch=${this.isSwitch}`;
         this.$emit('showloading');
         setTimeout(() => {
            location.href = url;
         }, 1000);
      },
   },
   template: `
      <div id="sidebar" :class="{show:turnon}">
         <div class="sidebarPanel">
            <div class="sureText" @click="closeSidebar">取消</div>
            <div class="seekText">章節列表</div>
            <div class="sureText" style="opacity:0;">確認</div>   
         </div>
         <ul class="sidebarFilter">
            <li
               v-for="(intro,index) in introList"
               :key="index"
               @click="openPage(intro)">
               <div class="filterTitle">{{ intro.chapterTitle }}</div>
               <div class="filterItem">
                  <span class="numberText">{{ intro.pageNumberText }}</span>
                  <span class="arrowBg"></span>
               </div>
            </li>
         </ul>
      </div>`
});