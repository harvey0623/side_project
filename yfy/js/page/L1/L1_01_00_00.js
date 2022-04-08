export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         user: { account: '', password: '' },
         visible: false,
         tipInfo: { status: 0, message: '' },
         isLoading: false,
         pageUrl
      }),
      methods: {
         loginApi(payload) {
            return mmrmAxios({
               url: apiUrl.login,
               method: 'post',
               data: payload
            }).then(res => res.data)
         },
         async submitHandler() {
            let isValid = await this.$refs.form.validate();
            if (!isValid) return;
            this.isLoading = true;
            await liff.init({ liffId: document.querySelector('[name="liff_id"]').content });
            if (!liff.isLoggedIn()) return liff.login();
            let response = await this.loginApi({
               account: window.wm_aes(this.user.mobile),
               password: window.wm_aes(this.user.password),
               idToken: liff.getAccessToken()
            });
            this.tipInfo.status = response.status;
            this.tipInfo.message = response.message;
            if (this.tipInfo.status) {
               location.href = this.pageUrl.loginSuccess;
            } else {
               $('#loginModal').modal('show');
               this.isLoading = false;
            }
         },
      }
   });
}