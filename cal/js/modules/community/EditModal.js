export default class EditModal {
   constructor(props) {
      this.$rootEl = $(props.rootEl);
      this.titleEl = document.querySelector(props.titleEl);
      this.dateEl = document.querySelector(props.dateEl);
      this.startTimeEl = document.querySelector(props.startTimeEl);
      this.endTimeEl = document.querySelector(props.endTimeEl);
      this.remarkEl = document.querySelector(props.remarkEl);
      this.pushEl = document.querySelector(props.pushEl);
      this.inBoxEl = document.querySelector(props.inBoxEl);
      this.removeEl = document.querySelector(props.removeEl);
      this.modifyEl = document.querySelector(props.modifyEl);
      this.renderTime();
   }
   renderTime() {
      let template = '';
      for (let i = 0; i <= 23; i++) {
         let hourText = this.hasZero(i);
         let timeText = `${hourText}:00`;
         template += `<option value="${timeText}">${timeText}</option>`;
      }
      this.startTimeEl.innerHTML = template;
      this.endTimeEl.innerHTML = template;
   }
   hasZero(num) {
      return num >= 10 ? num : '0' + num; 
   }
   updateInfo(info) {  //更新活動資料
      console.log(info)
      let { event } = info;
      this.$rootEl.modal('show');
      this.titleEl.value = event.title;
      this.dateEl.value = event.extendedProps.beginDate;
      this.startTimeEl.value = event.extendedProps.beginTime;
      this.endTimeEl.value = event.extendedProps.finishTime;
      this.remarkEl.value = event.extendedProps.remark;
      this.updateEventId({ id: event.id });
   }
   updateEventId({ id }) {  //更新event id
      this.pushEl.dataset.id = id;
      this.inBoxEl.dataset.id = id;
      this.removeEl.dataset.id = id;
      this.modifyEl.dataset.id = id;
   }
}