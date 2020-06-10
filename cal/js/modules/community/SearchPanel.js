export default class DatePanel {
   constructor(props) {
      this.companyEl = document.querySelector(props.companyEl);
      this.keywordEl = document.querySelector(props.keywordEl);
      this.searchEvent = props.searchEvent;
      this._companyId = '';
      this.companyData = [];
      this.bindEvent();
   }
   bindEvent() {
      if (this.companyEl !== null) {
         this.companyEl.addEventListener('change', this.companyChange.bind(this));
      }
      if (this.keywordEl !== null) {
         this.keywordEl.addEventListener('input', this.keywordChange.bind(this));
      }
   }
   companyChange(evt) {
      let value = evt.target.value;
      this.setCompanyId = { id: value };
      this.searchEvent({ key: 'company', value });
   }
   keywordChange(evt) {
      let value = evt.target.value;
      this.searchEvent({ key: 'keyword', value });
   }
   renderCompany(data) {  //公司清單呈現
      if (!Array.isArray(data)) throw new Error('must be array type'); 
      this.companyData = data;
      let template = '';
      data.forEach(item => {
         template += `<option value="${item.id}">${item.name}</option>`;
      });
      this.companyEl.innerHTML = template;
      this.companyEl.dispatchEvent(new Event('change'));
   }
   get getCompanyId() {
      return this._companyId;
   }
   set setCompanyId({ id }) {
      this._companyId = id;
   }
}