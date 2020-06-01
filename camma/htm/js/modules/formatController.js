export default class FormatController {
   constructor(props) {
      this.formatRowEl = document.querySelector(props.formatRowEl);
      this.formatBoxEl = document.querySelector(props.formatBoxEl);
      this.formatData = props.formatData;
      this.changeEvent = props.changeEvent;
      this.emptyEvent = props.emptyEvent;
      this.groupType = props.groupType;
   }
   init() {
      if (this.groupType === 1) {  // 1是任選 2是固定
         this.createFormatButton();
      } else {
         this.formatRowEl.classList.add('hide');
         this.emptyEvent();
      }
   }
   createFormatButton() {  //建立規格按鈕
      this.formatData.forEach((item, index) => {
         let div = document.createElement('DIV');
         div.classList.add('typeBox');
         div.textContent = item.title;
         div.dataset.formatid = item.id;
         div.dataset.stock = item.stock;
         div.addEventListener('click', this.changeFormat.bind(this));
         this.formatBoxEl.appendChild(div);
         if (index === 0) div.dispatchEvent(new Event('click'));
      });
   }
   changeFormat(evt) {
      let el = evt.target;
      if (el.classList.contains('active')) return;
      this.changeEvent(parseInt(el.dataset.formatid));
      this.checkHasStock(parseInt(el.dataset.stock));
      this.removeAllActive();
      el.classList.add('active');
   }
   checkHasStock(count) {  //檢查是否有庫存
      if (count <= 0) {
         $('.addItem').addClass('noStock');
         $('.soldOutBox').addClass('noStock');
         $('.calculateBox').addClass('noStock');
      } else {
         $('.addItem').removeClass('noStock');
         $('.soldOutBox').removeClass('noStock');
         $('.calculateBox').removeClass('noStock');
      }
   }
   removeAllActive() {
      let arr = this.formatBoxEl.querySelectorAll('.typeBox');
      arr.forEach(el =>  el.classList.remove('active'));
   }
   setFormatId({ id, type }) {  //設定規格id
      if (type === 2) return;
      id = typeof id === 'number' ? id.toString() : id; 
      this.formatBoxEl.querySelectorAll('.typeBox').forEach(el => {
         if (el.dataset.formatid === id) {
            el.dispatchEvent(new Event('click'));
         }
      });
   }
}