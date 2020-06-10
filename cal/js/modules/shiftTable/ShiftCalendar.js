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
         editable: false,
         droppable: false,
         allDay: false,
         eventLimit: 3,
         showNonCurrentDates: false,
         events: [],
         eventLimitText(count) {
            return '+看更多';
         },
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
}