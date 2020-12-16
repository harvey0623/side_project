Vue.component('news-sidebar', {
   props: {
      turnon: {
         type: Boolean,
         required: true
      },
      apiurl: {
         type: Object,
         required: true
      },
      multiplebrand: {
         type: Boolean,
         default: true
      },
      layoutid: {
         type: String,
         default: true
      },
      multiplebrand: {
         type: Boolean,
         required: true
      }
   },
   data: () => ({
      subId: '',
      brandList: [],
      categoryList: [],
      redeemType: {
         free: window.getSystemLang('couponactivitylist_free'),
         redeem_code: window.getSystemLang('couponactivitylist_redeemcode')
      },
      sureText: window.getSystemLang('g_ok'),
      cancelText: window.getSystemLang('g_cancel'),
      filterText: window.getSystemLang('couponactivitylist_b_filter'),
      chooseBrand: window.getSystemLang('couponactivitylist_searchbrand'),
      allBrand: window.getSystemLang('couponactivitylist_searchallbrand'),
      allExchange: window.getSystemLang('couponactivitylist_searchallredeemtype'),
      clearText: window.getSystemLang('g_deselectall'),
      browseText: window.getSystemLang('couponactivitylist_searchviewmode'),
      categoryPoint: window.getSystemLang('couponactivitylist_categorypoint')
   }),
   computed: {
      brandTotal() {
         return this.brandList.length;
      },
      brandCheckedNumber() { //品牌勾選數量
         return this.brandList.filter(item => item.checked).length;
      },
      fullBrand() { //品牌是否全選
         return this.brandTotal === this.brandCheckedNumber;
      },
      categoryTotal() {
         return this.categoryList.length;
      },
      categoryCheckedNumber() { //點數勾選數量
         return this.categoryList.filter(item => item.checked).length;
      },
      fullCategory() { //點數是否全選
         return this.categoryTotal === this.categoryCheckedNumber;
      }
   },
   methods: {
      async getAllBrand() {  //取得所有品牌id
         return await axios({
            url: this.apiurl.searchBrand,
            method: 'post',
            data: {}
         }).then(res => {
            return res.data.results.brand_ids;
         }).catch(err => null);
      },
      async getBrandInfo(brandIdArr) { //取得店家資料
         return await axios({
            url: this.apiurl.brandInfo,
            method: 'post',
            data: {
               brand_ids: brandIdArr,
               full_info: false
            }
         }).then(res => {
            return res.data.results.brand_information;
         }).catch(err => null);
      },
      async getCategoryList() { //取得分類資訊
         return axios({
            url: this.apiurl.categoryList,
            method: 'post',
            data: {
               type: ['news']
            }
         }).then(res => {
            return res.data.results.cms_list_category_information[0].cms_list_category;
         }).catch(err => [])
      },
      setLS(key, data) {
         localStorage.setItem(key, JSON.stringify(data));
      },
      getLS(key) {
         let data = localStorage.getItem(key);
         return JSON.parse(data);
      },
      showSubMenu(id) { //顯示次選單
         this.subId = id;
      },
      backHandler() { //返回上一頁 
         if (this.subId !== '') {
            this.showSubMenu('');
            return;
         }
         this.$emit('update:turnon', false);
         setTimeout(() => {
            this.brandList = this.getLS('newsBrandList');
            this.categoryList = this.getLS('newsCategoryList');
         }, 250);
      },
      brandChange(evt) { //改變品牌勾選狀態
         let el = evt.target;
         let brandId = parseInt(el.value);
         let checked = el.checked;
         let obj = this.brandList.find(item => item.id === brandId);
         obj.checked = checked;
      },
      selectBrand(status) {
         this.brandList.forEach(item => item.checked = status);
      },
      tidyBrand(data) { //整理品牌資料
         return data.reduce((prev, current) => {
            let { brand_id:id, title, feature_image_small } = current;
            prev.push({ id, title, url: feature_image_small.url, checked: true });
            return prev;
         }, []);
      },
      async getAboutBrand() { //取品牌選項列表
         let brandIdArr = await this.getAllBrand().then(res => res);
         let brandInfo = await this.getBrandInfo(brandIdArr).then(res => res);
         this.brandList = this.tidyBrand(brandInfo);
         return;
      },
      categoryChange(evt) { //改變點數勾選狀態
         let el = evt.target;
         let categoryId = parseInt(el.value);
         let checked = el.checked;
         let obj = this.categoryList.find(item => item.id === categoryId);
         obj.checked = checked;
      },
      selectCategory(status) {
         this.categoryList.forEach(item => item.checked = status);
      },
      tidyCategory(data) { //整理點數資料
         return data.reduce((prev, current) => {
            prev.push({ ...current, checked: true });
            return prev;
         }, []);
      },
      async getAboutCategory() { //取得分類選項列表
         let categoryData = await this.getCategoryList().then(res => res);
         this.categoryList = this.tidyCategory(categoryData);
      },
      createParams() {
         let brand_ids = this.brandList.reduce((prev, current) => {
            if (current.checked) prev.push(current.id);
            return prev;
         }, []);
         let cms_list_category_ids = this.categoryList.reduce((prev, current) => {
            if (current.checked) prev.push(current.id);
            return prev;
         }, []);
         return { brand_ids, cms_list_category_ids };
      },
      confirmHandler() { //搜尋確認
         let paramsData = this.createParams();
         this.setLS('newsBrandList', this.brandList);
         this.setLS('newsCategoryList', this.categoryList);
         this.$emit('search', paramsData);
      },
   },
   async mounted() {
      await this.getAboutBrand();
      await this.getAboutCategory();
      this.confirmHandler();
   },
   template: `
      <div id="sidebar" :class="{show:turnon}">
         <div class="sidebarPanel">
            <div class="sureText" @click="backHandler">{{ cancelText }}</div>
            <div class="seekText">{{ filterText }}</div>
            <div class="sureText" @click="confirmHandler">{{ sureText }}</div>
         </div>
         <ul class="sidebarFilter">
            <li v-show="multiplebrand">
               <div class="filterTitle">{{ chooseBrand }}</div>
               <div class="filterItem" @click="showSubMenu('sub1')">
                  <span v-show="fullBrand">{{ allBrand }}</span>
                  <span class="count" v-show="!fullBrand">{{ brandCheckedNumber }}</span>
                  <span class="arrowBox"></span>
               </div> 
            </li>
            <li>
               <div class="filterTitle">選擇分類</div>
               <div class="filterItem" @click="showSubMenu('sub2')">
                  <span v-show="fullCategory">{{ allExchange }}</span>
                  <span class="count" v-show="!fullCategory">{{ categoryCheckedNumber }}</span>
                  <span class="arrowBox"></span>
               </div> 
            </li>
            <li>
               <div class="filterTitle">{{ browseText }}</div>
               <div class="filterItem layoutItem">
                  <span 
                     class="layout layoutA" 
                     :class="{active:layoutid === 'a'}"
                     @click="$emit('switchlayout', 'a')"
                  ></span>
                  <span 
                     class="layout layoutB" 
                     :class="{active:layoutid === 'b'}"
                     @click="$emit('switchlayout', 'b')"
                  ></span>
               </div> 
            </li>
         </ul>
         <div class="subMenu brandMenu" :class="{show: subId === 'sub1'}">
            <div class="clearAll between">
               <span @click="selectBrand(false)">{{ clearText }}</span>
               <span @click="selectBrand(true)">全部勾選</span>
            </div>
            <ul class="criteriaList">
               <li v-for="brand in brandList" :key="brand.id">
                  <label>
                     <div class="criteriaTitle">
                        <img :src="brand.url" alt="">
                        <span>{{ brand.title }}</span>
                     </div>
                     <input 
                        type="checkbox" class="hookCheckbox" 
                        :value="brand.id" :checked="brand.checked"
                        @change="brandChange">
                  </label>
               </li>
            </ul>
         </div>
         <div class="subMenu pointMenu" :class="{show: subId === 'sub2'}">
            <div class="clearAll between">
               <span @click="selectCategory(false)">{{ clearText }}</span>
               <span @click="selectCategory(true)">全部勾選</span>
            </div>
            <ul class="criteriaList">
               <li v-for="category in categoryList" :key="category.id">
                  <label>
                     <div class="criteriaTitle">
                        <span>{{ category.title }}</span>
                     </div>
                     <input 
                        type="checkbox" class="hookCheckbox" 
                        :value="category.id" :checked="category.checked"
                        @change="categoryChange">
                  </label>
               </li>
            </ul>
         </div>
      </div>`
});