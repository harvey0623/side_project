export default class ShiftAjax {
   constructor(props) {
      this.axios = null;
      this.toastr = props.toastr;
      this.companyApi = props.companyApi || '';
      this.shiftApi = props.shiftApi || '';
      this.communityApi = props.communityApi || '';
      this.reserveApi = props.reserveApi || '';
      this.init();
   }
   init() {
      this.axios = axios.create({});
      this.axios.interceptors.response.use(response => {
         return response;
      }, error => {
         this.errorHandler(error.response.status);
         return Promise.reject(error);
      });
   }
   errorHandler(code) { //錯誤處理
      if (code >= 500 && code <= 511) {
         this.toastr.setError({ text: '系統發生錯誤' });
      }
   }
   async getCompanyInfo() { //公司資料
      let result = await this.axios.get(this.companyApi)
         .then(res => res.data);
      return result;
   }
   async getShift(data) { //取得班表
      let result = await this.axios({
         url: this.shiftApi,
         method: 'post',
         data
      }).then(res => {
         return res.data;
      }).catch(err => {
         return [];
      });
      return result;
   }
   async updateShift(data) { //更新班表
      let result = await this.axios({
         url: this.updateShiftApi,
         method: 'post',
         data
      }).then(res => {
         return { status: true };
      }).catch(err => {
         return { status: false };
      })
      return result;
   }
   async getCommunity(data) {  //取得預約資料
      let result = await this.axios({
         url: this.communityApi,
         method: 'post',
         data
      }).then(res => {
         return res.data;
      }).catch(err => {
         return [];
      });
      return result;
   }
   async getReserve(data) {  //取得預約資料
      let result = await this.axios({
         url: this.reserveApi,
         method: 'post',
         data
      }).then(res => {
         return res.data;
      }).catch(err => {
         return [];
      });
      return result;
   }
}