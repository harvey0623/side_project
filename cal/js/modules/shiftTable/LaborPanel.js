export default class LaborPanel {
   constructor(props) {
      this.listEl = document.querySelector(props.listEl);
      this.dragClass = props.dragClass;
      this.dragInstance = null;
      this.searchPanel = props.searchPanel;
      this.init();
   }
   init() {
      this.dragInstance = new this.dragClass(this.listEl, {
         itemSelector: '.labor',
         eventData: (el) => {
            let user = JSON.parse(el.dataset.user);
            let { startTime, endTime } = this.searchPanel.getPeriodTime();
            return {
               userId: user.userId,
               title: user.title,
               unit: user.unit,
               startPeriod: startTime,
               endPeriod: endTime,
            };
         }
      });
   }
   renderLabor(data) {
      let template = '';
      this.listEl.innerHTML = '';
      data.forEach(item => {
         template +=`
            <div class="labor" data-user=${JSON.stringify(item)}>
               <div class="name">${item.title}</div>
               <div class="unit">${item.unit}</div>
            </div>`;
      });
      this.listEl.innerHTML = template;
   }
}