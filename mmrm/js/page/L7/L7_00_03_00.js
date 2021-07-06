export default function ({ apiUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         menuItemId: 0,
         menuItemInfo: null,
         isLoading: false,
         apiUrl
      }),
      computed: {
         hasMenuItemInfo() { //是否有選單詳情資料
            return this.menuItemInfo !== null;
         },
         slideImage() {
            if (!this.menuItemInfo) return [];
            else return this.menuItemInfo.images || [];
         },
         isThanOne() {
            return this.slideImage.length > 1;
         },
         metaList() {
            if (!this.menuItemInfo) return [];
            else return this.menuItemInfo.meta || [];
         },
         hasMeta() {
            return this.metaList.length > 0;
         },
         title() {
            if (!this.menuItemInfo) return '';
            else return this.menuItemInfo.title;
         },
         summary() {
            if (!this.menuItemInfo) return '';
            else return this.menuItemInfo.summary || '';
         },
         price() {
            if (!this.menuItemInfo) return '';
            else return `${this.menuItemInfo.price} 起` || '';
         },
         itemContent() {
            if (!this.menuItemInfo) return '';
            else return this.menuItemInfo.content || '';
         },
         hasContent() {
            return this.itemContent !== '';
         },
         hasLine() {
            return !this.hasMeta && this.hasContent;
         }
      },
      methods: {
         getQuery(key) {
            let params = (new URL(document.location)).searchParams;
            return params.get(key);
         },
         getMenuInfo() { //取得商品資訊
            return axios({
               url: this.apiUrl.menuInfo,
               method: 'post',
               data: {
                  menu_item_ids: [this.menuItemId],
                  full_info: true
               }
            }).then(res => {
               return res.data.results.menu_item_information[0];
            }).catch(err => null);
         },
         setSlideBg(url) {
            if (!url) return {};
            else return { backgroundImage: `url(${url})` };
         },
         initSwiper() {
            let option = {
               loop: this.isThanOne,
               allowTouchMove: this.isThanOne,
               pagination: {
                  el: '.swiper-pagination',
                  bulletActiveClass: 'swiper-pagination-bullet-bg'
               }
            };
            if (!this.isThanOne) delete option.pagination;
            new Swiper('.swiper-container', { ...option });
         }
      },
      async mounted() {
         this.isLoading = true;
         this.menuItemId = parseInt(this.getQuery('menu_item_id'));
         this.menuItemInfo = await this.getMenuInfo().then(res => res);
         await this.$nextTick();
         this.initSwiper();
         this.isLoading = false;
      }
   });
}