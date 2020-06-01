export default class PeriodController {
   constructor(props) {
      this.periodRowEl = document.querySelector(props.periodRowEl);
      this.periodBoxEl = document.querySelector(props.periodBoxEl);
      this.periodData = props.periodData;
      this.changeEvent = props.changeEvent;
      this.init();
   }
   init() {
      if (this.periodData.length === 0) {
         this.periodRowEl.classList.add('hide');
      } else {
         this.createPeriodButton();
      }
   }
   createPeriodButton() {  //建立期數按鈕
      this.periodData.forEach((item, index) => {
         let div = document.createElement('DIV');
         div.classList.add('typeBox');
         div.textContent = item.iProductPeriod + '期';
         div.dataset.periodid = item.iId;
         div.addEventListener('click', this.changePeriod.bind(this));
         this.periodBoxEl.appendChild(div);
         if (index === 0) div.dispatchEvent(new Event('click'));
      });
   }
   changePeriod(evt) {
      let el = evt.target;
      if (el.classList.contains('active')) return;
      this.changeEvent(parseInt(el.dataset.periodid));
      this.removeAllActive();
      el.classList.add('active');
   }
   removeAllActive() {
      let arr = this.periodBoxEl.querySelectorAll('.typeBox');
      arr.forEach(el =>  el.classList.remove('active'));
   }
   setPeriodId(id) {  //設定檔期id
      id = typeof id === 'number' ? id.toString() : id;
      this.periodBoxEl.querySelectorAll('.typeBox').forEach(el => {
         if (el.dataset.periodid === id) {
            el.dispatchEvent(new Event('click'));
         }
      });
   }
}