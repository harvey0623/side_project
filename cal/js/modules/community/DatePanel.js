export default class DatePanel {
   constructor(props) {
      this.btnPrev = document.querySelector(props.btnPrev);
      this.btnNext = document.querySelector(props.btnNext);
      this.yearEl = document.querySelector(props.yearEl);
      this.monthEl = document.querySelector(props.monthEl);
      this.defaultDate = props.defaultDate;
      this.prevHandler = props.prevHandler;
      this.nextHandler = props.nextHandler;
      this.changeHandler = props.changeHandler;
      this.bindEvent();
      this.init();
   }
   bindEvent() {
      this.btnPrev.addEventListener('click', this.backward.bind(this));
      this.btnNext.addEventListener('click', this.forward.bind(this));
   }
   init() {
      this.updateYearMonth({
         date: this.defaultDate,
         isUpdate: false
      });
   }
   forward() {  //日曆往前
      let date = this.nextHandler();
      this.updateYearMonth({ date, isUpdate: true });
   }
   backward() { //日曆往後
      let date = this.prevHandler();
      this.updateYearMonth({ date, isUpdate: true });
   }
   updateYearMonth({ date, isUpdate }) { //更新日曆顯示
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      this.yearEl.textContent = year;
      this.monthEl.textContent = month;
      if (isUpdate) this.changeHandler({ year, month });
   }
} 