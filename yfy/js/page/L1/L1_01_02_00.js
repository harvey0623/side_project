import { checkHasForgotInfoMixin } from '../../src/vue-mixin/checkHasForgotInfo.js';
export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      mixins: [checkHasForgotInfoMixin],
      data: () => ({
         user: { mobile: '', verify_code: '', temp_access_token: '' },
         isLoading: false,
         tipInfo: { status: false, message: '' },
         pageUrl,
      }),
      methods: {
         sendVerifyApi(payload) {
            return mmrmAxios({
               url: apiUrl.resendForgetVerify,
               method: 'post',
               data: payload
            }).then(res => {
               return res.data;
            }).catch(err => {
               return err.response.data;
            })
         },
         forgotVerifyApi(payload) {
            return mmrmAxios({
               url: apiUrl.forgetPasswordVerify,
               method: 'post',
               data: payload
            }).then(res => {
               return res.data;
            }).catch(err => {
               return err.response.data;
            })
         },
         async sendHandler() {
            this.isLoading = true;
            let response = await this.sendVerifyApi({ temp_access_token: this.user.temp_access_token });
            if (response.rcrm.RC !== 'C01') $('#refillModal').modal('show');
            this.isLoading = false;
         },
         async submitHandler() {
            let isValid = await this.$refs.form.validate();
            if (!isValid) return;
            this.isLoading = true;
            let response = await this.forgotVerifyApi({
               temp_access_token: this.user.temp_access_token,
               verify_code: this.user.verify_code
            });
            this.tipInfo.status = response.rcrm.RC === 'C01';
            this.tipInfo.message = response.rcrm.RM;
            $('#verifyModal').modal('show');
            this.isLoading = false;
         },
      },
      mounted() {
         let hasForgotInfo = this.checkHasForgetInfo();
         if (hasForgotInfo) this.sendHandler();
      }
   });
}