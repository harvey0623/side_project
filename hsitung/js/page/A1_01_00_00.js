export default function({ apiUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         visible: false,
         isLoading: false,
         tipMessage: '',
         tempStatus: false,
         user: {
            account: '',
            password: ''
         },
         popupInfo: {
            isOpen: false,
            content: ''
         },
         accessToken: ''
      }),
      methods: {
         getQuery(key) { //取得網址參數
            let params = (new URL(document.location)).searchParams;
            return params.get(key);
         },
         seeHandler() {
            this.visible = !this.visible;
         },
         setInputType() {
            let inputType = this.visible ? 'text' : 'password';
            this.$refs.pwInput.type = inputType;
         },
         openPopup() {
            this.popupInfo.isOpen = true;
         },
         async getTerm() {
            return axios({
               url: apiUrl.term,
               method: 'post',
               data: {
                  request_parameter: {
                     type: ['register']
                  },
               }
            }).then(res => res.data.results.term_information[0].terms[0].content)
               .catch(err => '');
         },
         async login() {
            return axios({
               url: apiUrl.login,
               method: 'post',
               data: {
                  Q1: this.user.account,
                  Q2: this.user.password
               }
            }).then(res => res.data);
         },
         async loginWithExternalMember(data) {
            return axios({
               url: apiUrl.login_with_external_member,
               method: 'post',
               data: data
            }).then(res => res.data);
         },
         async submitHandler() {
            let isValid = await this.$refs.form.validate();
            if (!isValid) return;
            this.isLoading = true;
            let loginResult = await this.login();
            this.tempStatus = loginResult.results.data.payload.Code === '0';
            this.tipMessage = loginResult.results.data.payload.Message || '成功';
            if(this.tempStatus){
               let loginWithExternalMemberResult = await this.loginWithExternalMember({
                  Q1: loginResult.results.data.payload.Data.C_NO
               });
               this.tempStatus = loginWithExternalMemberResult.rcrm.RC === 'C01';
               this.tipMessage = loginWithExternalMemberResult.rcrm.RM || '成功';
					if (this.tempStatus === 1) this.accessToken = loginWithExternalMemberResult.results.member_access_token;
            }
            $('#failModal').modal('show');
            this.isLoading = false;
         },
         confirmHandler() {
            if (!this.tempStatus) return $('#failModal').modal('hide');
            let redirectUrl = this.getQuery('redirect_uri');
            location.href = `${redirectUrl}#access_token=${this.accessToken}`;
         }
      },
      async mounted() {
         this.isLoading = true;
         this.setInputType();
         this.popupInfo.content = await this.getTerm();
         this.isLoading = false;
      },
      watch: {
         visible() {
            this.setInputType();
         }
      }
   });
}