import { storageObj } from '../src/storage.js';
export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         visible1: false,
         visible2: false,
         isLoading: false,
         tipMessage: '',
         tempStatus: false,
         user: {
            mobile: '',
            password: '',
            confirmedPw: '',
            name: '',
            gender: '',
            birthday: ''
         },
      }),
      methods: {
         see1Handler() {
            this.visible1 = !this.visible1;
         },
         see2Handler() {
            this.visible2 = !this.visible2;
         },
         setInputType({ status, el }) {
            el.type = status ? 'text' : 'password';
         },
         initInputType() {
            this.setInputType({ status: this.visible1, el: this.$refs.pwInput });
            this.setInputType({ status: this.visible2, el: this.$refs.confirmInput });
         },
         async checkMobile() {
            return axios({
               url: apiUrl.checkMobile,
               method: 'post',
               data: {
                  Q1: this.user.mobile
               }
            }).then(res => res.data);
         },
         async submitHandler() {
            let isValid = await this.$refs.form.validate();
            if (!isValid) return;
            this.isLoading = true;
            let checkResult = await this.checkMobile();
            this.tempStatus = checkResult.results.data.payload.Code === '0';
            this.tipMessage = checkResult.results.data.payload.Message || '成功';
            $('#signUpModal').modal('show');
            this.isLoading = false;
         },
         confirmHandler() {
            if (!this.tempStatus) return $('#signUpModal').modal('hide');
            let storageData = storageObj.getItem('signUpInfo');
            let hasStorageData = storageData !== null;
            let signUpInfo = {};
            if (hasStorageData) storageData.step1 = this.user;
            else signUpInfo.step1 = this.user;
            storageObj.setItem('signUpInfo', hasStorageData ? storageData : signUpInfo);
            location.href = pageUrl.register_step2;
         },
      },
      async mounted() {
         this.initInputType();
         let signUpInfo = storageObj.getItem('signUpInfo');
         if (signUpInfo !== null) this.user = signUpInfo.step1;
      },
      watch: {
         visible1(to) {
            this.setInputType({ status: to, el: this.$refs.pwInput });
         },
         visible2(to) {
            this.setInputType({ status: to, el: this.$refs.confirmInput });
         }
      }
   });
}