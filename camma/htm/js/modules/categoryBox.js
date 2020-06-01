export default class CategoryBox {
   constructor(props) {
      this.rootEl = document.querySelector(props.rootEl);
      this.categoryList = props.categoryList;
      this.categoryAjax = props.categoryAjax;
      this.clickEvent = props.clickEvent;
      this.isFirst = false;  //判斷是不是第一次點擊
      this._clickId = '';
      this._hoverId = '',
      this._styleData = [];
      this.render();
   }
   render() {
      this.categoryList.forEach(item => {
         let li = document.createElement('li');
         li.dataset.id = item.id;
         li.style.color = item.color;
         li.style.borderColor = item.color;
         li.textContent = item.title;
         li.addEventListener('click', this.clickHandler.bind(this));
         li.addEventListener('mouseenter', this.enterHandler.bind(this));
         li.addEventListener('mouseleave', this.leaveHandler.bind(this));
         this.rootEl.appendChild(li);
      });
   }
   async clickHandler(evt) {
      let id = evt.currentTarget.dataset.id;
      if (id === this.getClickId) return;
      this.setClickId = id;
      let result = await this.categoryAjax.getData({
         categoryId: parseInt(id),
         limit: 8
      }).then(res => res);
      this.clickEvent(result, this.isFirst);
      this.isFirst = false;
   }
   displayRootEl(isShow) {
      let method = isShow ? 'remove' : 'add';
      this.rootEl.classList[method]('hidden');
   }
   enterHandler(evt) {
      this.setHoverId = evt.currentTarget.dataset.id;
   }
   leaveHandler() {
      this.setHoverId = '';
   }
   changeStyle() {
      let list = this.rootEl.querySelectorAll('li');
      list.forEach((li, index) => {
         let { color, backgroundColor } = this.getStyleData[index];
         li.style.color = color;
         li.style.backgroundColor = backgroundColor;
      });
   }
   setItemClick(index) {
      this.isFirst = true;
      this.rootEl.querySelectorAll('li')[index].dispatchEvent(new Event('click'));
   }
   get getClickId() {
      return this._clickId;
   }
   set setClickId(val) {
      this._clickId = val;
      this.setStyleData = '';
      this.changeStyle();
   }
   get getHoverId() {
      return this._hoverId;
   }
   set setHoverId(val) {
      this._hoverId = val;
      this.setStyleData = '';
      this.changeStyle();
   }
   get getStyleData() {
      return this._styleData;
   }
   set setStyleData(val) {
      this._styleData = this.categoryList.reduce((prev, current) => {
         let { id, color } = current;
         let isSame = id === parseInt(this.getClickId) || id === parseInt(this.getHoverId);
         prev.push({
            color: isSame ? '#fff' : color,
            backgroundColor: isSame ? color : '#fff'
         });   
         return prev;
      }, []);
   }
}