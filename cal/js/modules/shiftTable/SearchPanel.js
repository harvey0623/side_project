export default class DatePanel {
   constructor(props) {
      this.companyEl = document.querySelector(props.companyEl);
      this.periodEl = document.querySelector(props.periodEl);
      this.keywordEl = document.querySelector(props.keywordEl);
      this.searchEvent = props.searchEvent;
      this._companyId = '';
      this._periodId = '';
      this._companyData = [];
      this._inc = null;
      this.bindEvent();
   }
   bindEvent() {
      this.companyEl.addEventListener('change', this.companyChange.bind(this));
      this.periodEl.addEventListener('change', this.periodChange.bind(this));
      this.keywordEl.addEventListener('input', this.keywordChange.bind(this));
   }
   companyChange(evt) {
      let value = evt.target.value;
      this.setCompanyId = { id: value };
      this.searchEvent({ key: 'company', value });
   }
   periodChange(evt) {
      let value = evt.target.value;
      this.setPeriodId = { id: value };
      this.searchEvent({ key: 'period', value });
   }
   keywordChange(evt) {
      let value = evt.target.value;
      this.searchEvent({ key: 'keyword', value });
   }
   renderCompany(data) {  //公司清單呈現
      this.setCompanyData = data;
      let template = '';
      data.forEach(item => {
         template += `<option value="${item.id}">${item.name}</option>`;
      });
      this.companyEl.innerHTML = template;
      this.companyEl.dispatchEvent(new Event('change'));
   }
   rednerPeriod(data) {  //班別清單呈現
      let template = '<option value="">請選擇班別</option>';
      this.periodEl.innerHTML = '';
      data.forEach(item => {
         template += `<option value="${item.id}">${item.title}</option>`;
      });
      this.periodEl.innerHTML = template;
   }
   get getCompanyData() {  //取得公司資料
      return this._companyData;
   }
   set setCompanyData(data) { //設定公司資料
      return this._companyData = data;
   }
   get getCompanyId() {
      return this._companyId;
   }
   set setCompanyId({ id }) {
      let obj = this.getCompanyData.find(item => item.id === id);
      if (obj !== undefined) {
         this.setPeriodId = { id: '' };
         this.rednerPeriod(obj.period);
         this.setInc = obj;
      } 
      this.keywordEl.value = '';
      this._companyId = id;
   }
   get getInc() {  //取得目前選擇公司資料
      return this._inc;
   }
   set setInc(data) {
      this._inc = data;
   }
   get getPeriodId() {
      return this._periodId;
   }
   set setPeriodId({ id }) {
      this._periodId = id;
   }
}