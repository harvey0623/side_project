export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         user: {
            mobile: '',
         },
         tipMessage: '',
         tempStatus: false,
         isLoading: false,
      }),
      methods: {
         forgetPw() {
            return axios({
               url: apiUrl.forget,
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
            let forgetResult = await this.forgetPw();
            this.tempStatus = forgetResult.results.data.payload.Code === '0';
            this.tipMessage = this.tempStatus ? '新密碼已用簡訊發送至手機' : forgetResult.results.data.payload.Message;
            $('#failModal').modal('show');
            this.isLoading = false;
         },
         confirmHandler() {
            $('#failModal').modal('hide');
            if (this.tempStatus) {
               location.href = pageUrl.login;
            }
         }
      },
   });
}