Vue.component('page-control', {
   props: {
      book_info: {
         required: true
      },
      page_info: {
         required: true
      },
      pageurl: {
         type: String,
         required: true
      },
      book_id: {
         type: Number,
         required: true  
      },
      page_id: {
         type: Number,
         required: true  
      },
      currentPage: {
         type: Number,
         required: true
      }
   },
   data: () => ({
      isClick: false,
   }),
   computed: {
      hasBottomLink() { //有無置底連結
         if (this.page_info === null) return false;
         return this.page_info.bottom_link_block !== null;
      },
      isOnePage() { //是否只有一個頁面
         if (this.book_info === null) return true;
         let count = this.book_info.chapters.reduce((prev, current) => {
            prev += current.pages.length;
            return prev;
         }, 0);
         return count <= 1;
      },
      showControl() { //顯示控制面板
         return this.hasBottomLink || !this.isOnePage;
      },
      bottomLinkTitle() {
         if (this.hasBottomLink) return this.page_info.bottom_link_block.title;
         else return '';
      },
      pageNumber() { //頁碼
         if (this.book_info === null) return [];
         return this.book_info.chapters.reduce((prev, current) => {
            let arr = current.pages.map(page => page.page_id);
            prev = prev.concat(arr);
            return prev;
         }, []);
      },
      isFirstPage() {
         return this.getNumberIndex() === 0;
      },
      isLastPage() {
         return this.getNumberIndex() === this.pageNumber.length - 1;
      },
      paginationText() { //分頁文字
         let totalPage = this.pageNumber.length;
         let currentPage = this.getNumberIndex() + 1;
         return `${currentPage} / ${totalPage}`;
      }
   }, 
   methods: {
      getQuery(key) { //取得網址參數
         let params = (new URL(document.location)).searchParams;
         let paramsValue = params.get(key);
         return paramsValue;
      },
      getNumberIndex() { //取得頁碼的index
         return this.pageNumber.indexOf(this.page_id);
      },
      changePage(num) {
         if (this.isClick) return;
         this.isClick = true;
         let index = this.getNumberIndex();
         let nextPageId = this.pageNumber[index + num];
         let isSwitch = this.getQuery('isSwitch') === 'true';
         let url = `${this.pageurl}?book_id=${this.book_id}&page_id=${nextPageId}`;
         url = `${url}&currentPage=${this.currentPage}&isSwitch=${isSwitch}`;
         location.href = url;
      },
      showMenu() {
         this.$emit('popup', {
            title: this.page_info.bottom_link_block.title,
            links: this.page_info.bottom_link_block.links
         });
      }
   },
   watch: {
      showControl(val) {
         this.$emit('padding', val);
      }
   },
   template: `
      <div class="pageControl" v-show="showControl">
         <div class="dirBox left" :class="{hide:isFirstPage}" @click="changePage(-1)"></div>
         <div class="text" v-if="hasBottomLink" @click="showMenu">{{ bottomLinkTitle }}</div>
         <div class="text" v-else>{{ paginationText }}</div>
         <div class="dirBox right" :class="{hide:isLastPage}" @click="changePage(1)"></div>
      </div>`
});