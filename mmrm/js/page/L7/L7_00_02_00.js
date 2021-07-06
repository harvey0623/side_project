export default function({ apiUrl, pageUrl }) {
   let isFirst = true;
   new Vue({
      el: '#app',
      data: () => ({
         layoutList: [
            { id: 'a', class: 'layoutA' },
            { id: 'b', class: 'layoutB' }
         ],
         layoutId: 'a',
         menuTreeList: [],
         menuIds: { brand: 0, menu: 0 },
         menuName: { brand: '', menu: '' },
         categoryTreeList: [],
         categoryIds: { main: -1, sub: -1 },
         categoryName: { main: '', sub: '' },
         menuItemList: [],
         memoryMenu: { brand: 0, menu: 0 }, //紀錄之前的品牌id
         memoryCategory: { main: -1, sub: -1 }, //紀錄之前的種類id
         isMultipleBrand: true,
         isLoading: false,
         apiUrl,
         pageUrl
      }),
      computed: {
         isOtherLayout() { //是否為其他板型
            return this.layoutId !== 'a';
         },
         setCategoryId: { //設定categoryId
            get() {
               return this.categoryIds;
            },
            set({ key, value }) {
               this.categoryIds[key] = value;
            }
         },
         brandSelect() { //品牌選項
            return this.menuTreeList.reduce((prev, current) => {
               let { brand_id, brandTitle } = current;
               prev.push({ brand_id, brandTitle });
               return prev;
            }, []);
         },
         menuSelect() { //菜單選項
            if (this.menuTreeList.length === 0) return [];
            let obj = this.menuTreeList.find(menu => menu.brand_id === this.menuIds.brand);
            if (!isFirst) this.menuIds.menu = obj.menuList[0].menu_id;
            isFirst = false;
            if (obj !== undefined) return obj.menuList;
            else return [];
         },
         mainCategoryList() { //主分類
            return this.categoryTreeList.reduce((prev, current) => {
               let { category_id, title } = current;
               prev.push({ category_id, title });
               return prev;
            }, []);
         },
         subCategoryList() { //次分類
            this.setCategoryId = { key: 'sub', value: -1 };
            let obj = this.categoryTreeList.find(item => item.category_id === this.categoryIds.main);
            if (obj !== undefined) return obj.children;
            else return [];
         },
         menuDesc() { //菜單描述
            let { brand, menu } = this.menuName;
            if (brand === '' && menu === '') return '';
            else return `${brand} / ${menu}`;
         },
         filterDesc() { //篩選描述
            let { main, sub } = this.categoryName;
            if (main === '' && sub === '') return '';
            else return `${main} / ${sub}`;
         }
      },
      methods: {
         layoutHandler(id) {
            this.layoutId = id;
         },
         chooseBrand() {
            $('#menuModal').modal('show');
         },
         chooseCategory() {
            $('#categoryModal').modal('show');
         },
         getQuery(key) {
            let params = (new URL(document.location)).searchParams;
            return params.get(key);
         },
         searchBrand() {
            return axios({
               url: this.apiUrl.searchBrand,
               method: 'post',
               data: {}
            }).then(res => {
               return res.data.results.brand_ids;
            }).catch(err => []);
         },
         getBrandInfo(brandIdArr) {
            return axios({
               url: this.apiUrl.brandInfo,
               method: 'post',
               data: {
                  brand_ids: brandIdArr,
                  full_info: false
               }
            }).then(res => {
               return res.data.results.brand_information;
            }).catch(err => []);
         },
         getMultipleBrand() {
            return axios({
               url: this.apiUrl.multipleBrand,
               method: 'post',
               data: {}
            }).then(res => {
               return parseInt(res.data.multiple_brand) === 1;
            }).catch(err => true);
         },
         getMenuList(brandIdArr) {
            return axios({
               url: this.apiUrl.menuList,
               method: 'post',
               data: { brand_ids: brandIdArr }
            }).then(res => {
               return res.data.results.menu_list;
            }).catch(err => []);
         },
         getMenuCategory() { //取得菜單分類
            return axios({
               url: this.apiUrl.menuCategory,
               method: 'post',
               data: { menu_id: this.menuIds.menu }
            }).then(res => {
               return res.data.results.menu_item_categorys;
            }).catch(err => []);
         },
         getMenuInfo(itemIdArr) { //取得商品資訊
            return axios({
               url: this.apiUrl.menuInfo,
               method: 'post',
               data: {
                  menu_item_ids: itemIdArr,
                  full_info: true
               }
            }).then(res => {
               return res.data.results.menu_item_information;
            }).catch(err => []);
         },
         mergeBrandMenu(brandInfo, menuInfo) { //整合品牌和菜單
            return brandInfo.reduce((prev, current) => {
               let { brand_id, title } = current;
               let menuList = menuInfo.filter(menu => menu.brand_id === brand_id);
               if (menuList.length !== 0) {
                  prev.push({ brand_id, brandTitle: title, menuList });
               }
               return prev;
            }, []);
         },
         gatherMenuItemId(data) { //收集menuItemIds
            return data.reduce((prev, current) => {
               if (current.menu_item_ids !== null) {
                  prev = prev.concat(current.menu_item_ids);
               }
               return prev;
            }, []);
         },
         mergeMenuItems(menuCategory, menuInfo) { //將總類和詳情合併
            return menuCategory.reduce((prev, current) => {
               let arr = menuInfo.filter(item => item.category_id === current.category_id);
               if (arr.length === 0) prev.push({ ...current });
               else prev.push({ ...current, menuInfo: arr });
               return prev;
            }, []);
         },
         createTreeStructure(data) { //產生數狀資料
            let copyData = JSON.parse(JSON.stringify(data));
            let root = [];
            copyData.forEach(node => {
               if (node.previous_id === 0) return root.push(node);
               let parentIndex = copyData.findIndex(el => el.category_id === node.previous_id);
               if (!copyData[parentIndex].children) {
                  return copyData[parentIndex].children = [node];
               }
               copyData[parentIndex].children.push(node);
            });
            return root[0].children;
         },
         async changeMenu() { //改變菜單
            this.isLoading = true;
            $('#menuModal').modal('hide');
            this.setMenuIdRecord();
            this.setCategoryId = { key: 'main', value: -1 };
            this.setCategoryId = { key: 'sub', value: -1 };
            let menuCategory = await this.getMenuCategory().then(res => res);
            let menuItemIds = this.gatherMenuItemId(menuCategory);
            let menuInfo = await this.getMenuInfo(menuItemIds).then(res => res);
            let treeList = this.mergeMenuItems(menuCategory, menuInfo);
            this.categoryTreeList = this.createTreeStructure(treeList);
            this.setMenuName();
            this.changeCategory();
            this.isLoading = false;
         },
         changeCategory() { //改變類別
            $('#categoryModal').modal('hide');
            let orderCategory = this.getOrderCategory();
            this.setCategoryRecord();
            this.menuItemList = orderCategory;
            this.setCategoryName();
            window.scrollTo(0, 0);
         },
         getOrderCategory() { //取得指定類別
            let copyData = JSON.parse(JSON.stringify(this.categoryTreeList));
            let { main:mainId, sub:subId } = this.categoryIds;
            copyData = copyData.filter(item => {
               if (mainId === -1) return true;
               else return item.category_id === mainId;
            });
            if (subId !== -1) {
               let child = copyData[0].children.filter(item => item.category_id === subId);
               copyData[0].children = child;
            }
            //將父層的title給子層並取出子層
            let result = copyData.reduce((prev, current) => {
               current.children.forEach(child => child.parentTitle = current.title);
               prev = prev.concat(current.children);
               return prev;
            }, []);
            //篩選掉沒有menu_item的資料
            result = result.filter(item => item.menu_item_ids !== null);
            return result;
         },
         async categoryModalClick() {
            this.isLoading = true;
            await this.changeCategory();
            this.isLoading = false;
         },
         setMenuName() { //菜單品牌名稱顯示
            let brandObj = this.brandSelect.find(item => item.brand_id === this.menuIds.brand);
            let menuObj = this.menuSelect.find(item => item.menu_id === this.menuIds.menu);
            this.menuName = {
               brand: brandObj !== undefined ? brandObj.brandTitle : '',
               menu: menuObj !== undefined ? menuObj.title : ''
            };
         },
         setCategoryName() { //種類文字顯示
            let mainObj = this.mainCategoryList.find(item => item.category_id === this.categoryIds.main);
            let subObj = this.subCategoryList.find(item => item.category_id === this.categoryIds.sub);
            this.categoryName = {
               main: mainObj !== undefined ? mainObj.title : '全部',
               sub: subObj !== undefined ? subObj.title : '全部',
            };
         },
         setMenuIdRecord() { //紀錄菜單id
            this.memoryMenu.brand = this.menuIds.brand;
            this.memoryMenu.menu = this.menuIds.menu;
         },
         setCategoryRecord() { //紀錄總類id
            this.memoryCategory.main = this.categoryIds.main;
            this.memoryCategory.sub = this.categoryIds.sub;
         },
         readMenuRecord() { //讀取菜單紀錄id
            this.menuIds.brand = this.memoryMenu.brand;
            this.menuIds.menu = this.memoryMenu.menu; 
         },
         readCategoryRecord() { //讀取總類紀錄id
            this.categoryIds.main = this.memoryCategory.main;
            this.categoryIds.sub = this.memoryCategory.sub;
         },
         closeMenuModal() {
            $('#menuModal').modal('hide');
            this.readMenuRecord();
         },
         closeCategoryModal() {
            $('#categoryModal').modal('hide');
            this.readCategoryRecord();
         }
      },
      created() {
         this.menuIds.brand = parseInt(this.getQuery('brand_id'));
         this.menuIds.menu = parseInt(this.getQuery('menu_id'));
      },
      async mounted() {
         this.isLoading = true;
         this.isMultipleBrand = await this.getMultipleBrand().then(res => res);
         let brandIds = await this.searchBrand().then(res => res);
         let brandInfo = await this.getBrandInfo(brandIds).then(res => res);
         let menuInfo = await this.getMenuList(brandIds).then(res => res);
         this.menuTreeList = this.mergeBrandMenu(brandInfo, menuInfo);
         await this.changeMenu();
         this.isLoading = false;
      }
   });
}