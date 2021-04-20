import { storageObj } from '../src/storage.js';
export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         sendMsg: '',
         isLoading: false,
         pageUrl,
         tipMessage: '',
         tempStatus: false,
         user: {
            verify_code: '',
            mobile: ''
         },
      }),
      methods: {
         checkHasSignUpInfo() {
            let signUpInfo = storageObj.getItem('signUpInfo');
            let hasSignUpInfo = signUpInfo !== null;
            if (hasSignUpInfo) this.user.mobile = signUpInfo.step1.mobile;
            else $('#redirectModal').modal('show');
         },
         closeCode() {
            $('#codeModal').modal('hide');
         },
         verifyMobile() {
            return axios({
               url: apiUrl.verifyMobile,
               method:'post',
               data: { Q1: this.user.mobile }
            }).then(res => res.data);
         },
         async againHandler() { //重新發送驗證碼
            this.isLoading = true;
            let verifyResult = await this.verifyMobile();
            this.sendStatus = verifyResult.results.data.payload.Code === '0';
            this.sendMsg = this.sendStatus ? '驗證碼簡訊發送成功' : verifyResult.results.data.payload.Message;
            $('#codeModal').modal('show');
            this.isLoading = false;
         },
         async submitHandler() {
            let isValid = await this.$refs.form.validate();
            if (!isValid) return;
            this.isLoading = true;
            let registerResult = await this.registerHandler();
            this.tempStatus = registerResult.results.data.payload.Code === '0';
            this.tipMessage = registerResult.results.data.payload.Message || '成功';
            $('#failModal').modal('show');
            this.isLoading = false;
         },
         async registerHandler() {
            let signUpInfo = storageObj.getItem('signUpInfo');
            let { step1, step2 } = signUpInfo;
            let favor = step2.favorList.map(item => `${item.id}${item.status}`).join('');
            let reception = step2.receiveList.map(item => `${item.id}${item.status}`).join('');
            let payload = {
               "Name": step1.name,
               "Mobile": step1.mobile,
               "Mobile_CT": '',
               "Passwd": step1.password,
               "Birthday": step1.birthday.split('-').join(''),
               "Telephone": step2.user.Telephone,
               "Telephone_Sep": step2.user.Telephone_Sep,
               "Telephone_Area": step2.user.Telephone_Area,
               "Gender": step1.gender,
               "Country": '',
               "Area": '',
               "Location": step2.user.location,
               "District": step2.user.district,
               "ZipCode": '',
               "City": step2.user.city,
               "Email": step2.user.Email,
               "Educate": step2.user.Educate,
               "Profession": step2.user.Profession,
               "Define4": step2.user.Define4,
               "Define5": favor,
               "Define6": reception,
               "DEVICETOKEN": '',
               "NOTIFYTOKEN": '',
               "CEntryWay": '7',
               "S_NO": '1681',
               "VerifyCode": this.user.verify_code,
               "RES_S_NO": step2.user.RES_S_NO,
               "VEHICLE": ''
            };
            return axios({
               url: apiUrl.add,
               method: 'post',
               data: payload
            }).then(res => res.data);
         },
         confirmHandler() {
            if (this.tempStatus) {
               storageObj.removeItem('signUpInfo');
               location.href = pageUrl.login;
            } else {
               $('#failModal').modal('hide');
            }
         }
      },
      mounted() {
         this.checkHasSignUpInfo();
      }
   });
}