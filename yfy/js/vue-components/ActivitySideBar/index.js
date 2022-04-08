Vue.component('activity-sidebar', {
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
      filterText: window.getSystemLang('couponactivitylist_b_filter'),
      chooseBrand: window.getSystemLang('couponactivitylist_searchbrand'),
      exchangeMethod: window.getSystemLang('couponactivitylist_searchredeemtype'),
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
      async getBrefType() { //取得點數類型
         return await axios({
            url: this.apiurl.brefType,
            method: 'post',
            data: {}
         }).then(res => {
            return res.data.results.redeem_types;
         }).catch(err => null);
      },
      async getPointInfo(pointIdArr) { //取得一般點數詳情
         return await axios({
            url: this.apiurl.pointInfo,
            method: 'post',
            data: {
               point_id: pointIdArr,
               full_info: false
            }
         }).then(res => {
            return res.data.results.point_information;
         }).catch(err => null);
      },
      async getExternalPointInfo(pointIdArr) { //取得額外點數詳情
         return await axios({
            url: this.apiurl.externalPoint,
            method: 'post',
            data: {
               point_id: pointIdArr,
               full_info: false
            }
         }).then(res => {
            return res.data.results.point_information;
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
      pointChange(category, evt) { //改變點數勾選狀態
         let el = evt.target;
         let pointId = el.value;
         let checked = el.checked;
         let obj = this.pointList.find(item => {
            let id = item.id;
            id = typeof id === 'number' ? id.toString() : id;
            return id === pointId && item.category === category;
         });
         obj.checked = checked;
      },
      clearAllPoint() { //清除全部點數
         this.pointList.forEach(item => item.checked = false);
      },
      tidyPoint(brefResult, pointInfo) { //整理點數資料
         let existedPointArr = [];
         let exceptPoint = brefResult.filter(item => item.redeem_type !== 'point');
         let nonePointArr = exceptPoint.reduce((prev, current) => {
            let currentType = current.redeem_type;
            prev.push({
               id: currentType, 
               title: this.redeemType[currentType], 
               type: currentType,
               category: 'basic',
               checked: true
            });
            return prev;
         }, []);
         if (pointInfo !== null) {
            let includePoint = brefResult.filter(item => item.redeem_type === 'point')[0];
            let categoryPoint = {};
            for (let key in includePoint) {
               if (key !== 'redeem_type') categoryPoint[key] = includePoint[key];
            }
            existedPointArr = pointInfo.reduce((prev, current) => {
               let categoryName = '';
               for (let key in categoryPoint) {
                  let isIdInclude = categoryPoint[key].includes(current.point_id);
                  let isSameCategory = current.category === key;
                  if (isIdInclude && isSameCategory) {
                     categoryName = key;
                     break;
                  }
               }
               prev.push({
                  id: current.point_id,
                  title: vsprintf(this.categoryPoint, [current.title]),
                  type: 'point',
                  category: categoryName,
                  checked: true
               });
               return prev;
            }, []);
         }
         return nonePointArr.concat(existedPointArr);
      },
      async gatherBrefPoint(data) { //如果是內部點數直接取詳情,外部點數先收集id再取詳情
         let normalPointInfo = [];
         let externalPointInfo = [];
         let externalPointId = [];
         for (let key in data) {
            if (key === 'redeem_type') continue;
            if (key === 'point_ids') {
               let pointInfoData = await this.getPointInfo(data[key]);
               normalPointInfo = normalPointInfo.concat(pointInfoData);
               normalPointInfo.forEach(item => item.category = 'point_ids');
            } else {
               externalPointId = externalPointId.concat(data[key]);
            }
         }
         if (externalPointId.length !== 0) {
            externalPointInfo = await this.getExternalPointInfo(externalPointId);
            externalPointInfo.forEach(item => item.category = 'external_point_ids');
         }
         return normalPointInfo.concat(externalPointInfo);
      },
      async getAboutPoint() { //取得點數選項列表
         let brefResult = await this.getBrefType().then(res => res);
         let pointInfo = null;
         let obj = brefResult.find(item => item.redeem_type === 'point');
         if (obj !== undefined) {
            pointInfo = await this.gatherBrefPoint(obj);
         }
         this.pointList = this.tidyPoint(brefResult, pointInfo);
         return;
      },
      createParams() { //產生搜尋參數(如果兌換類型都沒選就是全部選得意思)
         let brandIds = this.brandList.filter(item => item.checked).map(item => item.id);
         let redeemTypes = this.pointList.filter(item => item.checked).map(item => item.type);
         redeemTypes = redeemTypes.length !== 0 ? redeemTypes : this.pointList.map(item => item.type);
         redeemTypes = Array.from(new Set(redeemTypes));
         let pointCategory = {};
         if (redeemTypes.includes('point')) {
            pointCategory = this.pointList.reduce((prev, current) => {
               if (current.checked && current.type === 'point') {
                  let categoryName = current.category;
                  let pointId = current.id;
                  if (prev[categoryName] === undefined) {
                     prev[categoryName] = [pointId];
                  } else {
                     prev[categoryName].push(pointId);
                  }
               }
               return prev;
            }, {});
         }
         return {
            brand_ids: brandIds,
            redeem_types: redeemTypes,
            ...pointCategory
         };
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
               <li v-for="(point,index) in pointList" :key="index">
                  <label>
                     <div class="criteriaTitle">
                        <span>{{ point.title }}</span>
                     </div>
                     <input 
                        type="checkbox" class="hookCheckbox" 
                        :value="point.id" :checked="point.checked"
                        @change="pointChange(point.category, $event)">
                  </label>
               </li>
            </ul>
         </div>
      </div>`
});