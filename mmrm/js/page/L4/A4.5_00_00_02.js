export default function({ apiUrl, pageUrl }) {
   let mySwiper = null;
   new Vue({
      el: '#app',
      mixins: [localProfile],
      data: {
         isLoading: false,
         brandList: [],
         edmList: [],
         pageUrl,
         popupInfo: {
            isOpen: true
         },
         currentBrandCode: ''
      },
      computed: {
         hasMenu() {
            return this.edmList.length > 0;
         },
         allBrandIds() {
            return this.brandList.map(brand => brand.brand_id);
         }
      },
      methods: {
         getQuery(key) { //取得網址參數
            let params = (new URL(document.location)).searchParams;
            return params.get(key);
         },
         splitBlank(text) {
            return text.split(' ')[0];
         },
         searchBrand() {
            return mmrmAxios({
               url: apiUrl.searchBrand,
               method: 'post',
               data: {}
            }).then(res => res.data.results.brand_ids);
         },
         getBrandInfo(brandIds) {
            return mmrmAxios({
               url: apiUrl.brandInfo,
               method: 'post',
               data: {
                  "brand_ids": brandIds,
                  "full_info": false
               }
            }).then(res => res.data.results.brand_information);
         },
         searchEdm(brandIds) {
            return mmrmAxios({
               url: apiUrl.searchListItem,
               method: 'post',
               data: { type: 'edm', brand_ids: brandIds }
            }).then(res => res.data.results.search_cms_list_item_results)
         },
         initSwiper() {
            mySwiper = new Swiper('.swiper-container', {
               slidesPerView: 'auto',
               spaceBetween: 15,
               // centeredSlides: true,
               on: {
                  // slideChange() {
                  //    if (mySwiper.realIndex === 0) mySwiper.setTranslate(0);
                  // },
                  click: () => {
                     let index = mySwiper.clickedIndex;
                     if (index === undefined) return;
                     let slide = mySwiper.slides[index];
                     this.redirect({ ...slide.dataset });
                  }
               },
               pagination: {
                  el: '.swiper-pagination',
               },
            });
            // mySwiper.setTranslate(0);
            this.displaySwiperPagination();
         },
         async getEdm({ brandIds, brandCode }) {
            this.isLoading = true;
            this.currentBrandCode = brandCode;
            firebaseGa.logEvent(`menu_brand_${brandCode}`, {}, true);
            this.edmList = await this.searchEdm(brandIds);
            this.updateSwiperSlide();
            this.popupInfo.isOpen = false;
            this.isLoading = false;
         },
         updateSwiperSlide() {
            mySwiper.removeAllSlides();
            this.displaySwiperPagination();
            if (!this.hasMenu) return;
            this.edmList.forEach(edm => {
               let startDate = this.splitBlank(edm.release_starts_at);
               let endDate = this.splitBlank(edm.release_ends_at);
               let brandObj = this.brandList.find(brand => brand.brand_id === edm.brand_id);
               let logoBg = brandObj.feature_image_small.url;
               let coverBg = edm.feature_image.url;
               let linkInfo = edm.link_block.links[0];
               let swiperSlide = document.createElement('div');
               swiperSlide.classList.add('swiper-slide');
               swiperSlide.innerHTML = `
                  <div class="swiper-content">
                     <h2>${edm.title}</h2>
                     <p class="duration">${startDate} ~ ${endDate}</p>
                     <div class="brandInfo">
                        <span class="logo"></span>
                        <p class="name">${brandObj.title}</p>
                     </div>
                     <div class="menuCover"></div>
                  </div>`
               if (logoBg) swiperSlide.querySelector('.logo').style = `background-image:url(${logoBg})`;
               if (coverBg) swiperSlide.querySelector('.menuCover').style = `background-image:url(${coverBg})`;
               swiperSlide.dataset.type = linkInfo.type;
               swiperSlide.dataset.book_id = linkInfo.book_id;
               swiperSlide.dataset.hyperlink = linkInfo.hyperlink_url;
               mySwiper.appendSlide(swiperSlide);
            });
            mySwiper.slideTo(0);
            // mySwiper.setTranslate(0);
            mySwiper.allowTouchMove = this.edmList.length > 1;
         },
         displaySwiperPagination() {
            let totalSlides = this.edmList.length;
            let mehtod = totalSlides <= 1 ? 'add' : 'remove';
            mySwiper.pagination.el.classList[mehtod]('hide');
         },
         redirect(payload) {
            let { type, book_id, hyperlink } = payload;
            if (type === 'book') {
               firebaseGa.logEvent(`menu_${book_id}_${this.currentBrandCode}`, {}, true);
               location.href = `${this.pageUrl.book}?book_id=${book_id}`;
               return;
            }
            location.href = hyperlink;
         },
         aTagClick(evt) {
            firebaseGa.logEvent(`menu_home_${this.currentBrandCode}`);
            location.href = evt.currentTarget.href;
         }
      },
      async mounted() {
         this.isLoading = true;
         this.getLocalProfile();
         this.initSwiper();
         let brandIds = await this.searchBrand();
         this.brandList = await this.getBrandInfo(brandIds);
         
         //===如果網址有帶參數就直接拿品牌edm
         let queryId = this.getQuery('brand_id');
         if (queryId !== null) {
            let brandId = parseInt(queryId);
            let targetBrand = this.brandList.find(item => item.brand_id === brandId);
            this.currentBrandCode = targetBrand !== undefined ? targetBrand.brand_code : '';
            await this.getEdm({ brandIds: [brandId], brandCode: this.currentBrandCode });
         }
         
         this.isLoading = false;
      }
   })
}

/* <div class="swiper-slide">
   <div class="swiper-content">
      <h2>王品牛排菜單1</h2>
      <p class="duration">2021/10/01 ~ 2021/11/10</p>
      <div class="brandInfo">
         <span class="logo"></span>
         <p class="name">王品牛排</p>
      </div>
      <div class="menuCover"></div>
   </div>
</div> */