export default class ShiftCalendar {
   constructor(props) {
      this.el = document.querySelector(props.el);
      this.option = props.option;
      this.calInstance = null;
      this.init();
   }
   init() {
      let basicOption = {
         header: false,
         defaultDate: new Date(),
         height: 650,
         firstDay: 1,
         plugins: ['dayGrid', 'interaction'],
         defaultView: 'dayGridMonth',
         displayEventTime: false,
         navLinks: false,
         editable: true,
         droppable: true,
         eventLimit: 3,
         allDay: false,
         eventLimitText(count) {
            return '+看更多';
         },
         showNonCurrentDates: false,
         columnHeaderText(date) {
            let dayTitleArr = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
            return dayTitleArr[date.getDay()];
         },
      };
      this.calInstance = new FullCalendar.Calendar(this.el, { 
         ...basicOption,
         ...this.option,
      });
      this.calInstance.render();
      // this.setValidRange({ code: 1 });
   }
   addEvent(data) {  //增加event
      if (!Array.isArray(data)) throw new TypeError('must be array type');
      this.removeAllEvent();
      data.forEach(item => this.calInstance.addEvent(item));
   }
   removeAllEvent() {  //移除所有event
      let eventArr = this.calInstance.getEvents();
      eventArr.forEach(item => item.remove());
   }
   prevMonth() { //上個月
      this.calInstance.prev();
   }
   nextMonth() { //下個月
      this.calInstance.next();
   }
   getDate() {  //取得日曆目前日期
      return this.calInstance.getDate();
   }
   gotoDate(date) { //移動日曆
      this.calInstance.gotoDate(date);
   }
   getEvents() {  //取得排程資料
      return this.calInstance.getEvents();
   }
   getDateRange() { //取得時間區間
      let date = this.getDate();
      let startYear = date.getFullYear();
      let startMonth = date.getMonth() + 1;
      let isNextYear = startMonth + 1 > 12;
      let endYear = isNextYear ? startYear + 1 : startYear;
      let endMonth = isNextYear ? 1 : startMonth + 1;
      startMonth = startMonth >= 10 ? startMonth : '0' + startMonth;
      endMonth = endMonth >= 10 ? endMonth : '0' + endMonth;
      return {
         start: `${startYear}-${startMonth}-01`,
         end: `${endYear}-${endMonth}-01`
      }
   }
   setValidRange({ code }) {  //設製日曆移動範圍(0:不設, 1:限制)
      let timeData = {};
      if (code === 1) timeData = this.getDateRange();
      else timeData = { start: '', end: '' };
      return this.calInstance.setOption('validRange', timeData);
   }
}