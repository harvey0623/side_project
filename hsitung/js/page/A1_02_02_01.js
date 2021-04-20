import { storageObj } from '../src/storage.js';
export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         isLoading: false,
         tipMessage: '',
         tempStatus: false,
         sendMsg: '',
         sendStatus: false,
         user: {
            mobile: '',
         },
         pageUrl
      }),
      methods: {
         checkHasSignUpInfo() {
            let signUpInfo = storageObj.getItem('signUpInfo');
            let hasSignUpInfo = signUpInfo !== null;
            if (!hasSignUpInfo) $('#redirectModal').modal('show');
         },
         closePhone() {
            $('#phoneModal').modal('hide');
         },
         closeMsg() {
            if (this.sendStatus) location.href = pageUrl.register_step3;
            else $('#codeModal').modal('hide');
         },
         async checkMobile() {
            let checkResult = await axios({
               url: apiUrl.checkMobile,
               method: 'post',
               data: { Q1: this.user.mobile }
            }).then(res => res.data);
            this.tempStatus = checkResult.results.data.payload.Code === '0';
            this.tipMessage = checkResult.results.data.payload.Message;
         },
         async verifyMobile() {
            let verifyResult = await axios({
               url: apiUrl.verifyMobile,
               method:'post',
               data: { Q1: this.user.mobile }
            }).then(res => res.data);
            this.sendStatus = verifyResult.results.data.payload.Code === '0';
            this.sendMsg = this.sendStatus ? '驗證碼簡訊發送成功' : verifyResult.results.data.payload.Message;
         },
         fixStorageMobile() {
            let signUpInfo = storageObj.getItem('signUpInfo');
            signUpInfo.step1.mobile = this.user.mobile;
            storageObj.setItem('signUpInfo', signUpInfo);
         },
         async submitHandler() {
            let isValid = await this.$refs.form.validate();
            if (!isValid) return;
            this.isLoading = true;
            await this.checkMobile();
            if (this.tempStatus) {
               this.fixStorageMobile();
               await this.verifyMobile();
               $('#codeModal').modal('show');
            } else {
               $('#phoneModal').modal('show');
            }
            this.isLoading = false;
         },
      },
      mounted() {
         this.checkHasSignUpInfo();
      }
   });
}