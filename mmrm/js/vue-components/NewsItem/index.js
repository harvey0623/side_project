Vue.component('news-item', {
   props: {
      news: {
         type: Object,
         required: true
      },
      changelayout: {
         type: Boolean,
         required: true
      },
      newsorder: {
         type: Number,
         required: true
      },
      index: {
         type: Number,
         required: true
      },
      multiplebrand: {
         type: Boolean,
         required: true
      }
   },
   computed: {
      newsBg() {
         let imgUrl = this.news.feature_image.url;
         if (!imgUrl) return {};
         else return { backgroundImage: `url(${imgUrl})` };
      },
      brandTitle() {
         return this.news.brandInfo.title;
      },
      brandBg() {
         let imgUrl = this.news.brandInfo.feature_image_small.url;
         if (!imgUrl) return {};
         else return { backgroundImage: `url(${imgUrl})` };
      },
      newsTime() {
         return this.news.release_starts_at.split(' ')[0];
      }
   },
   methods: {
      clickHandler() {
         this.$emit('popup', {
            title: this.news.link_block.title,
            links: this.news.link_block.links
         });
      },
      checkMatchOrder() { //檢查是否有對應的消息
         if (this.index !== this.newsorder) return; 
         let posY = this.$refs.newsItem.offsetTop;
         window.scrollTo(0, posY - 60);
         this.clickHandler();
      }
   },
   mounted() {
      this.checkMatchOrder();
   },
   template: `
      <li class="newsItem" :class="{other:changelayout}" ref="newsItem">
         <div class="imgBox">
            <div class="newsBg" :style="newsBg"></div>
            <div class="shadowBox">{{ brandTitle }}</div>   
         </div>
         <div class="descBox" @click="clickHandler">
            <div class="brandInfo" :class="{multiple: !multiplebrand}">
               <div class="brandBg" :style="brandBg"></div>
               <p class="brandTitle">{{ brandTitle }}</p>
            </div>
            <div class="newsTime">{{ newsTime }}</div>
            <div class="newTitle">{{ news.title }}</div>
         </div>
      </li>`
});