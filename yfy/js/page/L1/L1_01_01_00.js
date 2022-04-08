import { sessionStorageObj } from '../../src/storage.js';
export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         user: { mobile: '' },
         isLoading: false,
         tipInfo: { status: false, message: '' },
         pageUrl: ''
      }),
      methods: {
         forgetPasswordApi(payload) {
            return mmrmAxios({
               url: apiUrl.forgetPassword,
               method: 'post',
               data: payload
            }).then(res => {
               return res.data;
            }).catch(err => err.response.data)
         },
         async submitHandler() {
            let isValid = await this.$refs.form.validate();
            if (!isValid) return;
            this.isLoading = true;
            let response = await this.forgetPasswordApi({ mobile: window.wm_aes(this.user.mobile) });
            this.tipInfo.status = response.rcrm.RC === 'C01';
            this.tipInfo.message = response.rcrm.RM;
            if (this.tipInfo.status) {
               sessionStorageObj.setItem('forgotInfo', { 
                  mobile: this.user.mobile,
                  temp_access_token: response.results.temp_access_token 
               });
            }
            $('#forgotModal').modal('show');
            this.isLoading = false;
         },
      },
   });
}