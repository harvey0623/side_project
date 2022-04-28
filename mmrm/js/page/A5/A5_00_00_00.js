export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      mixins: [localProfile],
      data: {
         isLoading: false,
         currentCategory: 'brand',
         brandList: [],
         filteredList: [],
         backUpCategory: '',
         backUpCriteria: [],
         pageUrl,
         categoryList: [
            { id: 'category', title: '類別', pos: 0 },
            { id: 'situation', title: '情境', pos: 0 },
            { id: 'brand', title: '品牌', pos: 0 }
         ],
         popupInfo: { 
            isOpen: true 
         },
         config: {
            category: [],
            situation: []
         }
      },
      computed: {
         isShowBtnCategory() {
            return this.currentCategory === 'category' && this.popupInfo.isOpen;
         },
         isShowBtnSituation() {
            return this.currentCategory === 'situation' && this.popupInfo.isOpen;
         },
         hasBrand() {
            return this.filteredList.length > 0;
         }
      },
      methods: {
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
                  "full_info": true
               }
            }).then(res => res.data.results.brand_information);
         },
         getConfig() {
            return mmrmAxios({
               url: apiUrl.brefConfig,
               method: 'post',
               data: { keys: ['brand_setting'] }
            }).then(res => {
               let { category, situation } = JSON.parse(res.data.results.config_info[0].value);
               return { category, situation };
            })
         },
         openBrandPage({ brandIds, brandCode }) {
            firebaseGa.logEvent(`brandlist_return_${brandCode}`);
            location.href = `${this.pageUrl.brandDetail}?id=${brandIds[0]}&brandCode=${brandCode}`;
         },
         openPopup() { //威許機車印要把做好的功能拿掉
            this.currentCategory = this.backUpCategory || 'brand';
            // if (this.backUpCategory !== '') {
            //    this.config[this.currentCategory] = JSON.parse(JSON.stringify(this.backUpCriteria));
            // } else {
            //    this.config[this.currentCategory].forEach(item => item.isClick = false);
            // }
            document.body.style.overflow = 'hidden';
            this.popupInfo.isOpen = true;
         },
         async processConfig() {
            let configInfo = await this.getConfig();
            this.config.category = this.createCriteriaSchema({ data: configInfo.category });
            this.config.situation = this.createCriteriaSchema({ data: configInfo.situation });
         },
         createCriteriaSchema({ data }) { //產生條件結構
            return data.reduce((prev, current) => {
               prev.push({ ...current, isClick: false });
               return prev;
            }, []);
         },
         createBrandList(brandInfo) {
            return brandInfo.filter(brand => {
               let metaObj = brand.external_meta.find(item => item.key === 'display_enable');
               if (metaObj === undefined) return true;
               if (metaObj.value === 'false') return false;
               return true;
            });
         },
         confirmHandler(configKey) {
            this.backUpCategory = this.currentCategory;
            let targetList = this.config[configKey];
            let tag_ids = targetList.filter(item => item.isClick).map(item => item.tag_id);
            this.filteredList = this.createFilteredList({ tag_ids, configKey });
            this.backUpCriteria = JSON.parse(JSON.stringify(targetList));
            document.body.style.overflow = '';
            window.scrollTo(0, 0);
            this.popupInfo.isOpen = false;
         },
         createFilteredList({ tag_ids, configKey }) {
            let mappingKey = { category: 'category_id', situation: 'situation_id' };
            let result = this.brandList.filter(brand => {
               if (brand.external_meta.length === 0) return false;
               let targetObj = brand.external_meta.find(item => item.key === mappingKey[configKey]);
               if (targetObj === undefined) return false;
               if (tag_ids.length === 0) return true;
               let valueList = targetObj.value.split(',');
               let arr = tag_ids.reduce((prev, current) => {
                  let isInclude = valueList.includes(current.toString());
                  if (isInclude) prev.push(current);
                  return prev;
               }, []);
               return arr.length > 0; 
            }); 
            return result;
         }
      },
      async mounted() {
         this.isLoading = true;
         await this.processConfig();
         let brandIds = await this.searchBrand();
         let brandInfo = await this.getBrandInfo(brandIds);
         this.brandList = this.createBrandList(brandInfo);
         this.isLoading = false;
      }
   })
}