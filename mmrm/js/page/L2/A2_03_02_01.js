export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         tipMsg: '',
         tempStatus: false,
         isLoading: false,
         user: {
            mobile: '',
            verify_code: '',
         },
      }),
      methods: {
         getUserMobile() {
            let storage = sessionStorage.getItem('user_new_mobile');
            this.user.mobile = storage !== null ? JSON.parse(storage)['value'] : '';
         },
         resendHandler() {
            this.isLoading = true;
            return mmrmAxios({
               url: apiUrl.resendVerify,
               method: 'post',
               data: {}
            }).then(res => {
               this.tempStatus = false;
               this.tipMsg = '驗證碼已寄送';
               $('#failModal').modal('show');
            }).finally(() => {
               this.isLoading = false;
            })
         },
         memberVerify() {
            return mmrmAxios({
               url: apiUrl.memberVerify,
               method: 'post',
               data: { verify_code: this.user.verify_code }
            }).then(res => res.data).catch(err => err.response.data)
         },
         async submitHandler() {
            let isValid = await this.$refs.form.validate();
            if (!isValid) return;
            this.isLoading = true;
            let verifyResult = await this.memberVerify();
            this.tempStatus = verifyResult.rcrm.RC === 'C01';
            this.tipMsg = verifyResult.rcrm.RM;
            $('#failModal').modal('show');
            this.isLoading = false;
         },
         confirmHandler() {
            if (this.tempStatus) location.href = pageUrl.maintain;
            else $('#failModal').modal('hide');
         }
      },
      mounted() {
         this.getUserMobile();
      }
   });
}