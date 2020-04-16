class AreaMenu {
   constructor(props) {
      this.areaMenuEl = document.querySelector(props.areaMenuEl);
      this.rootEl = document.querySelector(props.rootEl);
      this.limitEl = document.querySelector(props.limitEl);
      this.countEl = document.querySelector(props.countEl);
      this.confirmEl = document.querySelector(props.confirmEl);
      this.removeEl = document.querySelector(props.removeEl);
      this.saveIdEl = document.querySelector(props.saveIdEl);
      this.showTextEl = document.querySelector(props.showTextEl);
      this.cancelEl = document.querySelector(props.cancelEl);
      this.areaList = props.areaList;
      this.limit = props.limit;
      this.selectedArr = Array.isArray(props.selectedArr) ? props.selectedArr: []; //已選的地區id
      this.openIdArr = Array.isArray(props.openIdArr) ? props.openIdArr: []; //記錄menu開合紀錄
      this.allRegionId = this.areaList.map(item => this.numberToString(item.id)); //全區id
      this.allIdArr = []; //已選的全區id(作為包含是全區地區的依據)
      this.transitionFunc = this.transitionendHandler.bind(this);
      this.confrimFunc = this.confirmHandler.bind(this);
      this.removeFunc = this.removeHandler.bind(this);
      this.cancelFunc = this.cancelHandler.bind(this);  //為了要移除事件必須先紀錄回傳的function
      this.renderHtml();
      this.init();
      this.bindEvent();
   }
   init() {  //讀取之前選取的資料
      this.limitEl.textContent = this.limit;
      this.allIdArr = this.selectedArr.reduce((prev, current) => {
         if (this.allRegionId.includes(current)) prev.push(current);
         return prev;
      }, []);
      this.setCount = this.selectedArr.length;
      this.selectedArr.forEach(id => this.setSingleCehcked({ id, checked: true }));
      this.allIdArr.forEach(id => this.setRegionChecked({ id, checked: true }));
   }
   bindEvent() {
      this.areaMenuEl.addEventListener('transitionend', this.transitionFunc);
      this.confirmEl.addEventListener('click', this.confrimFunc);
      this.removeEl.addEventListener('click', this.removeFunc);
      this.cancelEl.addEventListener('click', this.cancelFunc);
   }
   numberToString(num) {  //數字轉文字
      return num.toString();
   }
   removeHandler() { //清除所有已選的資料
      this.selectedArr = [];
      this.allIdArr = [];
      this.setCount = 0;
      this.clearAllChecked();
   }
   confirmHandler() { //儲存已選的資料
      let districtArr = this.getAllData().reduce((prev, current) => {
         let id = this.numberToString(current.id);
         if (this.selectedArr.includes(id)) prev.push(current.name);
         return prev;
      }, []);
      let districtText = districtArr.length !== 0 ? districtArr.join(',') : '請選擇';
      let result = {
         id: this.selectedArr.join(','),
         districtText
      };
      this.saveIdEl.dataset.result = result.id;
      this.showTextEl.textContent = result.districtText;
      this.cancelHandler();
      return result;
   }
   cancelHandler() {
      this.areaMenuEl.classList.remove('show');
   }
   transitionendHandler() {
      if (this.areaMenuEl.classList.contains('show')) {
         document.body.classList.add('fixScroll');
      } else {
         document.body.classList.remove('fixScroll');
         this.areaMenuEl.removeEventListener('transitionend', this.transitionFunc);
         this.confirmEl.removeEventListener('click', this.confrimFunc);
         this.removeEl.removeEventListener('click', this.cancelFunc);
         this.cancelEl.removeEventListener('click', this.cancelFunc);
      }
   }
   titleClickHandler(evt) {
      let currentTarget = evt.currentTarget;
      let nextEl = currentTarget.nextElementSibling;
      let iconEl = currentTarget.querySelector('.fa-chevron-down');
      let hasClass = nextEl.classList.contains('open');
      let method = hasClass ? 'remove' : 'add';
      let openId = currentTarget.dataset.openid;
      let openIdIndex = this.openIdArr.indexOf(openId);
      nextEl.classList[method]('open');
      iconEl.classList[method]('open');
      if (hasClass) {  //紀錄和移除打開or收合的選單id
         this.openIdArr.splice(openIdIndex, 1);
      } else {
         if (openIdIndex === -1) this.openIdArr.push(openId);
      }
      this.saveIdEl.dataset.opentitle = JSON.stringify(this.openIdArr);
   }
   getAllData() {  //取得所有資料
      return this.areaList.reduce((prev, current) => {
         prev = prev.concat(current.region);
         return prev;
      }, []);
   }
   setTotal(count) {  //設置已選數量
      this.countEl.textContent = count;
   }
   renderHtml() {
      this.rootEl.innerHTML = '';
      this.areaList.forEach(({ id, name, region }) => {
         let liArr = [];
         let selectBox = this.createSelectBox();
         let regionTitle = this.createRegionTitle({ id, name });
         let regionList = this.createRegionList();
         for (let r of region) {
            let liDom = this.createLi(r);
            liArr.push(liDom);
         }
         liArr.forEach(el => { regionList.appendChild(el) });
         selectBox.appendChild(regionTitle);
         selectBox.appendChild(regionList);
         this.rootEl.appendChild(selectBox);
         if (this.openIdArr.indexOf(this.numberToString(id)) !== -1) { //如果選單之前有被選取就打開
            regionTitle.dispatchEvent(new Event('click'));
         }
      });
   }
   createSelectBox() {
      let selectBox = document.createElement('div');
      selectBox.classList.add('selectBox');
      return selectBox;
   }
   createRegionTitle({ id, name }) {
      let regionTitle = document.createElement('div');
      regionTitle.innerHTML = `
         <div class="titleInner">
            <span>${name}</span>
            <i class="fa fa-chevron-down" aria-hidden="true"></i>
         </div>`;
      regionTitle.dataset.openid = this.numberToString(id);
      regionTitle.classList.add('regionTitle');
      regionTitle.addEventListener('click', this.titleClickHandler.bind(this));
      return regionTitle;
   }
   createRegionList() {
      let regionList = document.createElement('ul');
      regionList.classList.add('regionList');
      return regionList;
   }
   createLi(region) {
      let li = document.createElement('li');
      let template = `
         <div class="listInner">
            <p>${region.name}</p>
            <label>
               <input type="checkbox" class="areaCheckbox" data-id="${region.id}" hidden>
               <i class="fa fa-check" aria-hidden="true"></i>
            </label>
         </div>`;
      li.classList.add('list');
      li.innerHTML = template;
      li.querySelector('.areaCheckbox')
         .addEventListener('change', this.changeHandler.bind(this));
      return li;
   }
   changeHandler(evt) {
      let isChecked = evt.target.checked;
      let targetId = evt.target.dataset.id;
      if (isChecked) {
         this.addId({ id: targetId });
      } else {
         this.removeId({ id: targetId });
      }
      this.setCount = this.selectedArr.length;
   }
   addId({ id }) {  //增加id
      this.selectedArr.push(id);
      let isInAllRegion = this.isAllRegion(id);
      if (!isInAllRegion) return;  //如果選到的是全區id就必須把包含在全區裡的地區id移掉
      this.allIdArr.push(id);
      let regionIdArr = this.getRegionIdArr(id);
      this.selectedArr = this.selectedArr.filter(item => {
         return regionIdArr.includes(item) === false;
      });
      this.setRegionChecked({ id, checked: true });
   }
   removeId({ id }) { //移除id
      let index = this.selectedArr.indexOf(id);
      if (index === -1) return;
      this.selectedArr.splice(index, 1);
      let allIndex = this.allIdArr.indexOf(id);
      if (allIndex === -1) return;
      this.allIdArr.splice(allIndex, 1);
      this.setRegionChecked({ id, checked: false });
   }
   isAllRegion(id) {  //檢查是否為全區
      return this.allRegionId.includes(id);
   } 
   getRegionIdArr(id) { //取得目標區域id(不包括全區id)
      let obj = this.areaList.find(item => this.numberToString(item.id) === id)['region'];
      return obj.reduce((prev, current) => {
         let currentId = this.numberToString(current.id);
         if (currentId !== id) prev.push(currentId);
         return prev;
      }, []);
   }
   setRegionChecked({ id, checked }) { //設定點選全區checkbox狀態和class
      let listArr = this.rootEl.querySelectorAll('.list');
      let regionIdArr = this.getRegionIdArr(id);
      listArr.forEach(list => {
         let checkbox = list.querySelector('.areaCheckbox');
         let dataId = checkbox.dataset.id;
         if (regionIdArr.includes(dataId)) {
            checkbox.checked = checked;
            list.classList[checked ? 'add' : 'remove']('all');
         }
      });
   }
   setSingleCehcked({ id, checked }) { //設置單獨checkbox狀態
      let listArr = this.rootEl.querySelectorAll('.list');
      listArr.forEach(list => {
         let checkbox = list.querySelector('.areaCheckbox');
         let dataId = checkbox.dataset.id;
         if (id === dataId) checkbox.checked = checked;
      });
   }
   clearAllChecked() { //清除所有checked狀態
      let listArr = this.rootEl.querySelectorAll('.list');
      listArr.forEach(list => {
         list.querySelector('.areaCheckbox').checked = false;
         list.classList.remove('all');
      });
   }
   setDisabled(value) { //設定chckbox disabled 狀態
      let listArr = this.rootEl.querySelectorAll('.list');
      let group = this.allIdArr.reduce((prev, current) => {  //取得所有全區裡的地區id
         let regionIdArr = this.getRegionIdArr(current);
         prev = prev.concat(regionIdArr);
         return prev;
      }, []);
      listArr.forEach(list => {
         let checkbox = list.querySelector('.areaCheckbox');
         let dataId = checkbox.dataset.id;
         if (!this.selectedArr.includes(dataId)) checkbox.disabled = value;
      });
      if (group.length !== 0) {
         listArr.forEach(list => {
            let checkbox = list.querySelector('.areaCheckbox');
            let dataId = checkbox.dataset.id;
            if (group.includes(dataId)) checkbox.disabled = true;
         });
      }
   }
   get getCount() {
      return this._count;
   }
   set setCount(value) {  //設定count數量
      if (value === this.limit) {
         this.setDisabled(true);
      } else {
         this.setDisabled(false);
      }
      this.setTotal(value);
      this._count = value;
   }
}