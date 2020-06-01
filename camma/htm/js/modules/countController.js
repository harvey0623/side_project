export default class CountController {
   constructor(props) {
      this.flavorBoxEl = document.querySelector(props.flavorBoxEl);
      this.flavorRowEl = document.querySelector(props.flavorRowEl);
      this.$packageEl = $(props.packageEl);
      this.$basicTypeEl = $(props.basicTypeEl);
      this.$basicNumberEl = $(props.basicNumberEl);
      this.addItemEl = document.querySelector(props.addItemEl);
      this.packageNumberEvent = props.packageNumberEvent;
      this._flavorData = [];
      this._packageMaxNumber = 1;
      this._limit = 1;
      this.setPackageMaxNumber = props.packageMaxNumber;
      this.setLimit = this.getPackageNumber();
      this.bindEvent();
   }
   bindEvent() {
      this.addItemEl.addEventListener('click', this.addItemHandler.bind(this));
      this.$packageEl.on('select2:select', this.changeLimitHandler.bind(this));
   }
   getPackageNumber() {  //取得最大包數數量
      return parseInt(this.$packageEl.select2('data')[0].id);
   }
   checkHasSelect2(jqObj) {  //確認是否有select2
      return jqObj.hasClass('select2-hidden-accessible');
   }
   createMaxList(countArr) {  //重設數量限制清單
      this.$packageEl.select2({ 
         data: countArr.reduce((prev, current) => {
            prev.push({ id: current, text: current })
            return prev;
         }, [])
      });
   }
   createNumberList(count) {  //建立數量清單
      let arr = [];
      for (let i = 1; i <= count; i++) {
         arr.push({ id: i, text: i });
      }
      return arr;
   }
   countFlaovrStock(data) {  //計算所有風味的庫存總和
      return data.reduce((prev, current) => {
         prev += current.iSpecStock;
         return prev;
      }, 0);
   }
   createSelect2Source(data) {  //產生select2商品下拉
      let totalStock = this.countFlaovrStock(data); 
      let firstIndex = data.findIndex(item => item.iSpecStock !== 0);
      let orderIndex = totalStock !== 0 ? firstIndex : 0; //選到第一個不是庫存等於0的
      return data.reduce((prev, current, index) => {
         prev.push({
            id: current.iId,
            text: current.common.info.vProductName,
            disabled: current.iSpecStock === 0,
            selected: orderIndex === index
         });
         return prev;
      }, []);
   }
   createFlavorSelect2(el) {  //產生新的flavor select2
      let $el = $(el);
      $el.select2({ 
         data: this.createSelect2Source(this.getFlavorData)
      });
      return $el;
   }
   createNumberSelect2(el) { //產生新的number select2
      let $el = $(el);
      $el.select2({ 
         data: this.createNumberList(this.getLimit)
      });
      return $el;
   }
   resetFlavorList(data) {  //重設產品資料
      let hasSelect2 = this.checkHasSelect2(this.$basicTypeEl);
      if (hasSelect2) {
         this.$basicTypeEl.select2('destroy');
         this.$basicTypeEl.children('option').remove();
      }
      this.$basicTypeEl.select2({ 
         data: this.createSelect2Source(data)
      });
   }
   resetNumberList(count) {  //重設數量清單
      let hasSelect2 = this.checkHasSelect2(this.$basicNumberEl);
      if (hasSelect2) {
         this.$basicNumberEl.select2('destroy');
         this.$basicNumberEl.children('option').remove();
      }
      this.$basicNumberEl.select2({ 
         data: this.createNumberList(count)
      });
   }
   addItemHandler(obj) {  //增加商品
      if (this.getFlavorData.length === 0) return;
      let div = document.createElement('div');
      div.classList.add('flavorInner', 'otherInner');
      div.innerHTML = `
         <select class="flavorType"></select>
         <select class="flavorNumbr"></select>
         <div class="removeItem">
            <i class="fal fa-minus"></i>
         </div>`;
      this.flavorBoxEl.appendChild(div);
      let $el1 = this.createFlavorSelect2(div.querySelector('.flavorType'));
      let $el2 = this.createNumberSelect2(div.querySelector('.flavorNumbr'));
      div.querySelector('.removeItem')
         .addEventListener('click', this.removeItemHandler.bind(this));

      //判斷是否為event物件, 如果不是就顯示使用者選的資料
      if (!(obj instanceof Event)) {
         $el1.val(obj.id);
         $el2.val(obj.count.toString());
         $el1.trigger('change');
         $el2.trigger('change');
      }
   }
   removeItemHandler(evt) {  //移除商品列
      evt.currentTarget.parentElement.remove();
   }
   changeLimitHandler(evt) { //改變目前包數限制數量
      this.setLimit = this.getPackageNumber();
      this.packageNumberEvent(this.getLimit);
   }
   removeOtherInner() {  //移除新增的列表
      $('.otherInner').remove();
   }
   getUserData() {  //取得使用者選取的資料
      let itemInfo = [];
      $('.flavorInner').each(function() {
         let $this = $(this);
         itemInfo.push({
            id: $this.children('.flavorType').val(),
            count: parseInt($this.children('.flavorNumbr').val())
         });
      });
      return itemInfo.reduce((prev, current) => {  //將相同的id的值進行累加
         if (prev.length === 0) {
            prev.push(current);
         } else {
            let obj = prev.find(item => item.id === current.id);
            if (obj !== undefined) obj.count += current.count;
            else prev.push(current);
         }
         return prev;
      }, []);
   }
   setPackageNumber(count) {  //設定使用者選取的最大數量
      this.setLimit = count;
      if (typeof count === 'number') count = count.toString();
      this.$packageEl.val(count);
      this.$packageEl.trigger('change');
   }
   setBasicTypeAndNumber({ id, count }) {  //設置第一列的商品和數量
      if (typeof count === 'number') count = count.toString();
      this.$basicTypeEl.val(id);
      this.$basicNumberEl.val(count);
      this.$basicTypeEl.trigger('change');
      this.$basicNumberEl.trigger('change');
   }
   get getFlavorData() {
      return this._flavorData;
   }
   set setFlavorData(data) {  //重新設置商品
      if (data.length !== 0) {
         this.resetFlavorList(data);
         this.resetNumberList(this.getLimit);
         this.removeOtherInner();
      } else {
         this.flavorRowEl.classList.add('hide');
      }
      this._flavorData = data;
   }
   get getPackageMaxNumber() {
      return this._packageMaxNumber;
   }
   set setPackageMaxNumber(countArr) {  //設置總上限量
      this.createMaxList(countArr);
      this._packageMaxNumber = countArr;
   }
   get getLimit() {
      return this._limit;
   }
   set setLimit(count) {  //設定目前上限量
      if (this.getFlavorData.length !== 0) {
         this.resetNumberList(count);
         this.resetFlavorList(this.getFlavorData);
      }
      this.removeOtherInner();
      this._limit = count;
   }
}