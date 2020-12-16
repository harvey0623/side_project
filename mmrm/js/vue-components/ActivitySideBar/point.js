Vue.component('activity-point-sidebar', {
   props: {
      turnon: {
         type: Boolean,
         required: true
      },
      apiurl: {
         type: Object,
         required: true
      },
      layoutid: {
         type: String,
         default: true
      }
   },
   data: () => ({
      subId: '',
      brandList: [],
      pointList: [],
      redeemType: {
         free: window.getSystemLang('couponactivitylist_free'),
         redeem_code: window.getSystemLang('couponactivitylist_redeemcode')
      },
      sureText: window.getSystemLang('g_ok'),
      cancelText: window.getSystemLang('g_cancel'),
      filterText: window.getSystemLang('pointactivitylist_b_filter'),
      chooseBrand: window.getSystemLang('pointactivitylist_searchbrand'),
      exchangeMethod: window.getSystemLang('pointactivitylist_searchredeemtype'),
      allBrand: window.getSystemLang('pointactivitylist_searchallbrand'),
      allExchange: window.getSystemLang('pointactivitylist_searchallredeemtype'),
      clearText: window.getSystemLang('g_deselectall'),
      browseText: window.getSystemLang('pointactivitylist_searchviewmode'),
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
      pointTotal() {
         return this.pointList.length;
      },
      pointCheckedNumber() { //點數勾選數量
         return this.pointList.filter(item => item.checked).length;
      },
      fullPoint() { //點數是否全選
         return this.pointTotal === this.pointCheckedNumber;
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
      async getBrefPointType() { //取得點數類型
         return await axios({
            url: this.apiurl.brefPointType,
            method: 'post',
            data: {}
         }).then(res => {
            return res.data.results.redeem_types;
         }).catch(err => null);
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
            this.brandList = this.getLS('brandList');
            this.pointList = this.getLS('pointList');
         }, 250);
      },
      tidyBrand(data) { //整理品牌資料
         return data.reduce((prev, current) => {
            let { brand_id:id, title, feature_image_small } = current;
            prev.push({ id, title, url: feature_image_small.url, checked: true });
            return prev;
         }, []);
      },
      brandChange(evt) { //改變品牌勾選狀態
         let el = evt.target;
         let brandId = parseInt(el.value);
         let checked = el.checked;
         let obj = this.brandList.find(item => item.id === brandId);
         obj.checked = checked;
      },
      clearAllBrand() { //清除全部品牌
         this.brandList.forEach(item => item.checked = false);
      },
      async getAboutBrand() { //取品牌選項列表
         let brandIdArr = await this.getAllBrand().then(res => res);
         let brandInfo = await this.getBrandInfo(brandIdArr).then(res => res);
         this.brandList = this.tidyBrand(brandInfo);
         return;
      },
      async getAboutPoint() { //取得點數選項列表
         let brefPointResult = await this.getBrefPointType().then(res => res);
         this.pointList = this.tidyPoint(brefPointResult);
         return;
      },
      tidyPoint(data) { //整理點數資料
         return data.reduce((prev, current) => {
            let currentType = current.redeem_type;
            prev.push({
               id: currentType, 
               title: this.redeemType[currentType], 
               type: currentType,
               checked: true
            });
            return prev;
         }, []);
      },
      pointChange(evt) { //改變點數勾選狀態
         let el = evt.target;
         let pointId = el.value;
         let checked = el.checked;
         let obj = this.pointList.find(item => item.id === pointId);
         obj.checked = checked;
      },
      clearAllPoint() { //清除全部點數
         this.pointList.forEach(item => item.checked = false);
      },
      createParams() { //產生搜尋參數(如果都沒選就是全部選取得意思)
         let brandIds = this.brandList.filter(item => item.checked).map(item => item.id);
         brandIds = brandIds.length !== 0 ? brandIds : this.brandList.map(item => item.id);
         let typeGroup = this.pointList.filter(item => item.checked).map(item => item.type);
         let redeemTypes = typeGroup.length !== 0 ? typeGroup : this.pointList.map(item => item.type);
         return {
            brand_ids: brandIds,
            redeem_types: redeemTypes,
         }
      },
      confirmHandler() { //搜尋確認
         let paramsData = this.createParams();
         this.setLS('brandList', this.brandList);
         this.setLS('pointList', this.pointList);
         this.$emit('search', paramsData);
      }
   },
   async mounted() {
      await this.getAboutBrand();
      await this.getAboutPoint();
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
            <li>
               <div class="filterTitle">{{ chooseBrand }}</div>
               <div class="filterItem" @click="showSubMenu('sub1')">
                  <span v-show="fullBrand">{{ allBrand }}</span>
                  <span class="count" v-show="!fullBrand">{{ brandCheckedNumber }}</span>
                  <span class="arrowBox"></span>
               </div> 
            </li>
            <li>
               <div class="filterTitle">{{ exchangeMethod }}</div>
               <div class="filterItem" @click="showSubMenu('sub2')">
                  <span v-show="fullPoint">{{ allExchange }}</span>
                  <span class="count" v-show="!fullPoint">{{ pointCheckedNumber }}</span>
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
            <div class="clearAll">
               <span @click="clearAllBrand">{{ clearText }}</span>
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
            <div class="clearAll">
               <span @click="clearAllPoint">{{ clearText }}</span>
            </div>
            <ul class="criteriaList">
               <li v-for="point in pointList" :key="point.id">
                  <label>
                     <div class="criteriaTitle">
                        <span>{{ point.title }}</span>
                     </div>
                     <input 
                        type="checkbox" class="hookCheckbox" 
                        :value="point.id" :checked="point.checked"
                        @change="pointChange">
                  </label>
               </li>
            </ul>
         </div>
      </div>`
});