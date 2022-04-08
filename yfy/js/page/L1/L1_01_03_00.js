import { sessionStorageObj } from '../../src/storage.js';
import { checkHasForgotInfoMixin } from '../../src/vue-mixin/checkHasForgotInfo.js';
export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      mixins: [checkHasForgotInfoMixin],
      data: () => ({
         user: { new_password: '', confirm_password: '', temp_access_token: '' },
         visible1: false,
         visible2: false,
         isLoading: false,
         tipInfo: { status: false, message: '' },
         pageUrl
      }),
      methods: {
         resetPasswordApi(payload) {
            return mmrmAxios({
               url: apiUrl.resetPassword,
               method: 'post',
               data: payload
            }).then(res => {
               return res.data;
            }).catch(err => {
               return err.response.data
            })
         },
         async submitHandler() {
            let isValid = await this.$refs.form.validate();
            if (!isValid) return;
            this.isLoading = true;
            let response = await this.resetPasswordApi({
               temp_access_token: this.user.temp_access_token,
               new_password: window.wm_aes(this.user.new_password)
            });
            this.tipInfo.status = response.rcrm.RC === 'C01';
            this.tipInfo.message = response.rcrm.RM;
            $('#verifyModal').modal('show');
            this.isLoading = false;
         },
         successHandler() {
            sessionStorageObj.removeItem('forgotInfo');
            location.href = this.pageUrl.login;
         }
      },
      mounted() {
         this.checkHasForgetInfo();
      },
   });
}