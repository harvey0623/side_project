export default class EditModal {
   constructor(props) {
      this.$rootEl = $(props.rootEl);
      this.communityEl = document.querySelector(props.communityEl);
      this.laborEl = document.querySelector(props.laborEl);
      this.startEl = document.querySelector(props.startEl);
      this.endEl = document.querySelector(props.endEl);
      this.periodEl = document.querySelector(props.periodEl);
      this.init();
   }
   init() {
      this.$rootEl.on('hidden.bs.modal', this.resetHandler.bind(this));
   }
   show() {
      this.$rootEl.modal('show');
   }
   renderLabor({ data, laborId }) { //員工選單
      let template = '';
      data.forEach(item => {
         template += `<option value="${item.userId}">${item.title}</option>`
      });
      this.laborEl.innerHTML = template;
      if (laborId !== '') this.laborEl.value = laborId;
   }
   renderPeriod({ data, periodId }) { //班別選單
      let template = '';
      data.forEach(item => {
         template += `<option value="${item.id}">${item.title}</option>`;
      });
      this.periodEl.innerHTML = template;
      if (periodId !== '') this.periodEl.value = periodId;
   }
   updateInfo(data) {  //type 1.新增 2.修改
      console.log(data);
      let { type, incData, periodId, laborId } = data;
      this.communityEl.value = incData.name;
      this.communityEl.dataset.id = incData.id;
      this.renderLabor({ data: incData.labor, laborId });
      this.renderPeriod({ data: incData.period, periodId });
      $('.modal-footer')[type === 1 ? 'addClass' : 'removeClass']('add');

      

      this.show();
   }
   resetHandler() {
      this.communityEl.value = '';
      this.communityEl.removeAttribute('data-id');
      this.laborEl.innerHTML = '';
      this.startEl.value = '';
      this.endEl.value = '';
      this.periodEl.innerHTML = '';
   }
}